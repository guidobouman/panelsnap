// Utility for creating objects in older browsers
if ( typeof Object.create !== 'function' )
{
  Object.create = function( obj )
  {
    function F() {}
    F.prototype = obj;
    return new F();
  };
}

/*!
 * jQuery panelSnap
 * Version 0.8.2
 *
 * Requires:
 * - jQuery 1.7.1 or higher (no jQuery.migrate needed)
 * - jQuery scrollEvents.js (included in the package)
 *
 * https://github.com/guidobouman/jquery-panelsnap
 *
 * Copyright 2013, Guido Bouman
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * Date: Wed Feb 13 16:05:00 2013 +0100
 */
(function($, window, document, undefined)
{
  var pluginName = 'panelSnap';
  var storageName = 'plugin_' + pluginName;

  var pluginObject = {
    isMouseDown: false,
    isSnapping: false,
    scrollInterval: 0,
    scrollOffset: 0,

    init: function(options, container)
    {
      var self = this;

      self.$window = $(window);
      self.$document = $(document);

      self.container = container;
      self.$container = $(container);

      self.$eventContainer = self.$container;
      self.$snapContainer = self.$container;
      if(self.$container.is('body'))
      {
        self.$eventContainer = self.$document;
        var ua = navigator.userAgent;
        if(!~ua.indexOf("WebKit")) {
          self.$snapContainer = $('html');
        }
      }

      self.options = $.extend(true, {}, $.fn.panelSnap.options, options);

      self.panelCount = self.getPanel().length;

      self.bind();

      if(self.options.$menu !== false && $('.active', self.options.$menu).length > 0)
      {
        $('.active', self.options.$menu).click();
      }
      else
      {
        var $target = self.getPanel(':first');

        self.activatePanel($target);
      }

      return self;
    },

    bind: function()
    {
      var self = this;

      self.bindProxied(self.$eventContainer, 'scrollstart', self.scrollStart);
      self.bindProxied(self.$eventContainer, 'scrollstop', self.scrollStop);
      self.bindProxied(self.$eventContainer, 'mousewheel', self.mouseWheel);
      self.bindProxied(self.$eventContainer, 'mousedown', self.mouseDown);
      self.bindProxied(self.$eventContainer, 'mouseup', self.mouseUp);

      self.bindProxied(self.$window, 'resize', self.resize);

      if(self.options.$menu !== false)
      {
        self.bindProxied($(self.options.$menu), 'click', self.captureMenuClick, self.options.menuSelector);
      }
    },

    bindProxied: function($element, event, method, selector)
    {
      var self = this;

      selector = typeof selector === 'string' ? selector : null;

      $element.on(event + self.options.namespace, selector, $.proxy(function(e)
      {
        return method.call(self, e);
      }, self));
    },

    destroy: function()
    {
      var self = this;

      // Gotta love namespaced events!
      self.$eventContainer.off(self.options.namespace);

      self.$window.off(self.options.namespace);

      if(self.options.$menu !== false)
      {
        $(self.options.menuSelector, self.options.$menu).off(self.options.namespace);
      }

      self.$container.removeData(storageName);
    },

    scrollStart: function(e)
    {
      var self = this;

      // Deprecated, moved storage of scrollOffset to callback of panelSnap
      // self.scrollOffset = self.$container.scrollTop();
    },

    scrollStop: function(e)
    {
      var self = this;

      e.stopPropagation();

      if(self.isMouseDown)
      {
        self.$eventContainer.one('mouseup' + self.options.namespace, self.processScroll);
        return;
      }

      if(self.isSnapping)
      {
        return;
      }

      var interval = self.$container.height();
      var intervalDifference = interval - self.scrollInterval;
      var offset = self.$eventContainer.scrollTop();
      var scrollDifference = offset - self.scrollOffset;
      var maxOffset = self.$container[0].scrollHeight - interval;

      self.scrollInterval = interval;

      if((scrollDifference === 0) ||
        (scrollDifference < 100 && (offset < 0 || offset > maxOffset)))
      {
        return;
      }

      var child_number;
      if(scrollDifference < -self.options.directionThreshold && scrollDifference > -interval)
      {
        child_number = Math.floor(offset / interval);
      }
      else if(scrollDifference > self.options.directionThreshold && scrollDifference < interval)
      {
        child_number = Math.ceil(offset / interval);
      }
      else
      {
        child_number = Math.round(offset / interval);
      }

      child_number = child_number < 0 ? 0 : child_number;

      child_number = child_number > self.panelCount ? self.panelCount : child_number;

      var $target = self.getPanel(':eq(' + child_number + ')');

      self.snapToPanel($target);
    },

    mouseWheel: function(e)
    {
      var self = this;

      // This event only fires when the user actually scrolls with their input device.
      // Be it a trackpad, legacy mouse or anything else.

      self.$container.stop(true);
      self.isSnapping = false;
    },

    mouseDown: function(e)
    {
      var self = this;

      self.isMouseDown = true;
    },

    mouseUp: function(e)
    {
      var self = this;

      self.isMouseDown = false;
    },

    resize: function(e) {

      var self = this;

      var $target = self.getPanel('.active');

      self.snapToPanel($target);

    },

    captureMenuClick: function(e)
    {
      var self = this;

      var panel = $(e.currentTarget).data('panel');
      var $target = self.getPanel('[data-panel=' + panel + ']');

      self.snapToPanel($target);

      return false;
    },

    snapToPanel: function($target)
    {
      var self = this;

      self.isSnapping = true;

      self.options.onSnapStart.call(self, $target);
      self.$container.trigger('panelsnap:start', [$target]);

      var scrollTarget = 0;
      if(self.$container.is('body'))
      {
        scrollTarget = $target.offset().top;
      }
      else
      {
        scrollTarget = self.$eventContainer.scrollTop() + $target.position().top;
      }

      self.$snapContainer.stop(true).animate(
      {
        scrollTop: scrollTarget
      }, self.options.slideSpeed, function()
      {
        self.scrollOffset = scrollTarget;
        self.isSnapping = false;

        // Call callback
        self.options.onSnapFinish.call(self, $target);
        self.$container.trigger('panelsnap:finish', [$target]);
      });

      self.activatePanel($target);
    },

    activatePanel: function($target)
    {
      var self = this;

      $('> ' + self.options.panelSelector + '.active', self.container).removeClass('active');
      $target.addClass('active');

      if(self.options.$menu !== false)
      {
        $(self.options.menuSelector + '.active', self.options.$menu).removeClass('active');
        var itemSelector = self.options.menuSelector + '[data-panel=' + $target.data('panel') + ']';
        var $activeItem = $(itemSelector, self.options.$menu);
        $activeItem.addClass('active');
      }
    },

    getPanel: function(selector)
    {
      var self = this;

      if(typeof selector === 'undefined') {
        selector = '';
      }

      var panel_selector = '> ' + self.options.panelSelector + selector;
      return $(panel_selector, self.$container);
    },

    snapTo: function(target, wrap)
    {
      var self = this;

      if(typeof wrap !== 'boolean')
      {
        wrap = true;
      }

      var $target;

      switch(target) {
        case 'prev':
          $target = self.getPanel('.active').prev(self.options.panelSelector);
          if($target.length < 1 && wrap)
          {
            $target = self.getPanel(':last');
          }
          break;
        case 'next':
          $target = self.getPanel('.active').next(self.options.panelSelector);
          if($target.length < 1 && wrap)
          {
            $target = self.getPanel(':first');
          }
          break;
        case 'first':
          $target = self.getPanel(':first');
          break;
        case 'last':
          $target = self.getPanel(':last');
          break;
      }

      if($target.length > 0)
      {
        self.snapToPanel($target);
      }

    }
  };

  $.fn[pluginName] = function(options)
  {
    var args = Array.prototype.slice.call(arguments);

    return this.each(function()
    {
      var pluginInstance = $.data(this, storageName);
      if(typeof options === 'object' || options === 'init' || ! options)
      {
        if(!pluginInstance)
        {
          if(options === 'init')
          {
            options = args[1] || {};
          }

          pluginInstance = Object.create(pluginObject).init(options, this);
          $.data(this, storageName, pluginInstance);
        }
        else
        {
          $.error('Plugin is already initialized for this object.');
          return;
        }
      }
      else if(!pluginInstance)
      {
        $.error('Plugin is not initialized for this object yet.');
        return;
      }
      else if(pluginInstance[options])
      {
        var method = options;
        options = args.slice(1);
        pluginInstance[method].apply(pluginInstance, options);
      }
      else
      {
        $.error('Method ' +  options + ' does not exist on jQuery.panelSnap.');
        return;
      }
    });
  };

  $.fn.panelSnap.options = {
    $menu: false,
    menuSelector: 'a',
    panelSelector: 'section',
    namespace: '.panelSnap',
    onSnapStart: function(){},
    onSnapFinish: function(){},
    directionThreshold: 50,
    slideSpeed: 200
  };

})(jQuery, window, document);

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
 * Version 0.7.3
 *
 * Requires:
 * - jQuery 1.7.1 or higher (Works with the API changes from 1.9.1 too)
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
      if(self.$container.is('body'))
      {
        self.$eventContainer = self.$document;
      }

      self.options = $.extend(true, {}, $.fn.panelSnap.options, options);

      self.bind();

      if(self.options.$menu !== false && $('.active', self.options.$menu).length > 0)
      {
        $('.active', self.options.$menu).click();
      }
      else
      {
        self.activatePanel(self.$container.children(':first'));
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

      self.bindProxied(self.$window, 'resize', self.scrollStop);

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

    captureMenuClick: function(e)
    {
      var self = this;
      var panel = $(e.currentTarget).data('panel');
      var selector = self.options.panelSelector + '[data-panel=' + panel + ']';
      var $target = $(selector, self.$container);

      self.snapToPanel($target);

      return false;
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
      var offset = self.$container.scrollTop();
      var scrollDifference = offset - self.scrollOffset;
      var maxOffset = self.$container[0].scrollHeight - interval;

      self.scrollInterval = interval;

      if(
        scrollDifference === 0  && intervalDifference === 0 ||
        offset < 0 ||
        offset > maxOffset
      )
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

      var selector = '> ' + self.options.panelSelector + ':eq(' + child_number + ')';
      var $target = $(selector, self.$container);

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
        scrollTarget = self.$container.scrollTop() + $target.position().top;
      }

      self.$container.animate(
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
    }
  };

  $.fn[pluginName] = function(options)
  {
    return this.each(function()
    {
      var pluginInstance = $.data(this, storageName);
      if(typeof options === 'object' || options === 'init' || ! options)
      {
        if(!pluginInstance)
        {
          if(options === 'init')
          {
            options = Array.prototype.slice.call(arguments, 1);
          }

          pluginInstance = $.data(this, storageName, Object.create(pluginObject).init(options, this));
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
        method = options;
        options = Array.prototype.slice.call(arguments, 1);
        pluginInstance[method](options);
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

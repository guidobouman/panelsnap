// Utility for creating objects in older browsers
if ( typeof Object.create !== 'function' ) {
  Object.create = function( obj ) {

    function F() {}
    F.prototype = obj;
    return new F();

  };
}

/*!
 * jQuery panelSnap
 * Version 0.15.1
 *
 * Requires:
 * - jQuery 1.7 or higher (no jQuery.migrate needed)
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
(function($, window, document, undefined) {
  'use strict';

  var pluginName = 'panelSnap';
  var storageName = 'plugin_' + pluginName;

  var pluginObject = {

    isMouseDown: false,
    isSnapping: false,
    enabled: true,
    scrollOffset: 0,

    init: function(options, container) {

      var self = this;

      self.container = container;
      self.$container = $(container);

      self.$eventContainer = self.$container;
      self.$snapContainer = self.$container;

      if(self.$container.is('body')) {
        self.$eventContainer = $(document);
        self.$snapContainer = $(document.documentElement);

        var ua = navigator.userAgent;
        if(~ua.indexOf('WebKit')) {
          self.$snapContainer = $('body');
        }
      }

      self.options = $.extend(true, {}, $.fn.panelSnap.options, options);

      self.bind();

      if(self.options.$menu !== false && $('.active', self.options.$menu).length > 0) {
        $('.active', self.options.$menu).click();
      } else {
        var $target = self.getPanel(':first');
        self.activatePanel($target);
      }

      return self;

    },

    bind: function() {

      var self = this;

      self.bindProxied(self.$eventContainer, 'scrollstop', self.scrollStop);
      self.bindProxied(self.$eventContainer, 'mousewheel', self.mouseWheel);
      self.bindProxied(self.$eventContainer, 'mousedown', self.mouseDown);
      self.bindProxied(self.$eventContainer, 'mouseup', self.mouseUp);

      self.bindProxied($(window), 'resizestop', self.resize);

      if(self.options.$menu) {
        self.bindProxied(self.options.$menu, 'click', self.captureMenuClick, self.options.menuSelector);
      }

      if(self.options.navigation.keys.nextKey || self.options.navigation.keys.prevKey) {
        self.bindProxied($(window), 'keydown', self.keyDown);
      }

      if (self.options.navigation.buttons.$nextButton) {
        self.bindProxied(self.options.navigation.buttons.$nextButton, 'click', self.captureNextClick);
      }

      if (self.options.navigation.buttons.$prevButton) {
        self.bindProxied(self.options.navigation.buttons.$prevButton, 'click', self.capturePrevClick);
      }

    },

    bindProxied: function($element, event, method, selector) {

      var self = this;

      selector = typeof selector === 'string' ? selector : null;

      $element.on(event + self.options.namespace, selector, $.proxy(function(e) {

        return method.call(self, e);

      }, self));

    },

    destroy: function() {

      var self = this;

      // Gotta love namespaced events!
      self.$eventContainer.off(self.options.namespace);

      $(window).off(self.options.namespace);

      if(self.options.$menu !== false) {
        $(self.options.menuSelector, self.options.$menu).off(self.options.namespace);
      }

      self.$container.removeData(storageName);

    },

    scrollStop: function(e) {

      var self = this;

      e.stopPropagation();

      if(self.isMouseDown) {
        return;
      }

      if(self.isSnapping) {
        return;
      }

      // Check if enabled or just 1 panel in viewport
      var panelsInViewPort = self.getPanelsInViewport();
      if (!self.enabled || panelsInViewPort.length < 2) {
        $target = panelsInViewPort.eq(0);
        if(!$target.is(self.getPanel('.active'))) {
          self.activatePanel($target);
        }

        return;
      }

      var offset = self.$snapContainer.scrollTop();
      var scrollDifference = offset - self.scrollOffset;
      var overThreshold = Math.abs(scrollDifference) > self.options.directionThreshold;

      var panelNumber;
      if(scrollDifference > 0) {
        panelNumber = overThreshold ? 1 : 0;
      } else if(scrollDifference < 0) {
        panelNumber = overThreshold ? 0 : 1;
      } else {
        // Nothing to scroll, get out.
        return;
      }

      var $target = panelsInViewPort.eq(panelNumber);
      var maxOffset = self.$container[0].scrollHeight - self.scrollInterval;

      if (offset <= 0 || offset >= maxOffset) {
        // Only activate, prevent stuttering
        self.activatePanel($target);
        // Set scrollOffset to a sane number for next scroll
        self.scrollOffset = offset <= 0 ? 0 : maxOffset;
      } else {
        self.snapToPanel($target);
      }

    },

    getPanelsInViewport: function() {

      var self = this;

      var viewport = { top: self.$snapContainer.scrollTop() };
      viewport.bottom = viewport.top + self.$snapContainer.height();

      var panels = self.getPanel().filter(function (_, el) {
        var $el = $(el);
        var bounds;

        if(self.$container.is('body')) {
          bounds = $el.offset();
        } else {
          bounds = $el.position();
          bounds.top += self.$snapContainer.scrollTop();
        }

        bounds.bottom = bounds.top + $el.outerHeight();

        return !(viewport.bottom < bounds.top || viewport.top > bounds.bottom);
      });

      return panels;
    },

    mouseWheel: function(e) {

      var self = this;

      // This event only fires when the user actually scrolls with their input device.
      // Be it a trackpad, legacy mouse or anything else.

      if(self.isSnapping) {
        self.scrollOffset = self.$snapContainer.scrollTop();
        self.$snapContainer.stop(true);
        self.isSnapping = false;
      }

    },

    mouseDown: function(e) {

      var self = this;

      self.isMouseDown = true;

    },

    mouseUp: function(e) {

      var self = this;

      self.isMouseDown = false;

      if(self.scrollOffset !== self.$snapContainer.scrollTop()) {
        self.scrollStop(e);
      }

    },

    keyDown: function(e) {

      var self = this;

      var nav = self.options.navigation;

      if(!self.enabled) {
        return;
      }

      switch(e.which) {
        case nav.keys.prevKey:
        case nav.keys.nextKey:
          e.preventDefault();
      }

      if (self.isSnapping) {
        return;
      }

      switch(e.which) {
        case nav.keys.prevKey:
          self.snapTo('prev', nav.wrapAround);
          break;
        case nav.keys.nextKey:
          self.snapTo('next', nav.wrapAround);
          break;
      }

    },

    captureNextClick: function(e) {

      var self = this;

      e.preventDefault();

      if (self.isSnapping) {
        return;
      }

      self.snapTo('next', self.options.navigation.wrapAround);

    },

    capturePrevClick: function(e) {

      var self = this;

      e.preventDefault();

      if (self.isSnapping) {
        return;
      }

      self.snapTo('prev', self.options.navigation.wrapAround);

    },

    resize: function(e) {

      var self = this;

      if(!self.enabled) {
        return;
      }

      var $target = self.getPanel('.active');

      self.snapToPanel($target);

    },

    captureMenuClick: function(e) {

      var self = this;

      var panel = $(e.currentTarget).data('panel');
      var $target = self.getPanel('[data-panel="' + panel + '"]');

      self.snapToPanel($target);

      return false;

    },

    snapToPanel: function($target) {

      var self = this;

      if (!$target.jquery) {
        return;
      }

      self.isSnapping = true;

      self.options.onSnapStart.call(self, $target);
      self.$container.trigger('panelsnap:start', [$target]);

      var scrollTarget = 0;
      if(self.$container.is('body')) {
        scrollTarget = $target.offset().top;
      } else {
        scrollTarget = self.$snapContainer.scrollTop() + $target.position().top;
      }

      scrollTarget -=  self.options.offset;

      self.$snapContainer.stop(true).delay(self.options.delay).animate({
        scrollTop: scrollTarget
      }, self.options.slideSpeed, self.options.easing, function() {

        // Set scrollOffset to scrollTop
        // (not to scrollTarget since on iPad those sometimes differ)
        self.scrollOffset = self.$snapContainer.scrollTop();
        self.isSnapping = false;

        // Call callback
        self.options.onSnapFinish.call(self, $target);
        self.$container.trigger('panelsnap:finish', [$target]);

        self.activatePanel($target);
      });

    },

    activatePanel: function($target) {

      var self = this;

      self.getPanel('.active').removeClass('active');
      $target.addClass('active');

      if(self.options.$menu !== false) {
        var activeItemSelector = self.options.menuSelector + '.active';
        $(activeItemSelector, self.options.$menu).removeClass('active');

        var attribute = '[data-panel="' + $target.data('panel') + '"]';
        var itemSelector = self.options.menuSelector + attribute;
        var $itemToActivate = $(itemSelector, self.options.$menu);
        $itemToActivate.addClass('active');
      }

      var nav = self.options.navigation;

      if(!nav.wrapAround) {
        var $panels = self.getPanel();
        var index = $panels.index(self.getPanel('.active'));

        if (nav.buttons.$nextButton !== false ) {
          $target = $panels.eq(index + 1);
          if($target.length < 1) {
            $(nav.buttons.$nextButton).attr('aria-disabled', 'true');
            $(nav.buttons.$nextButton).addClass('disabled');
          } else {
            $(nav.buttons.$nextButton).attr('aria-disabled', 'false');
            $(nav.buttons.$nextButton).removeClass('disabled');
          }
        }

        if (nav.buttons.$prevButton !== false ) {
          if(index < 1) {
            $(nav.buttons.$prevButton).attr('aria-disabled', 'true');
            $(nav.buttons.$prevButton).addClass('disabled');
          } else {
            $(nav.buttons.$prevButton).attr('aria-disabled', 'false');
            $(nav.buttons.$prevButton).removeClass('disabled');
          }
        }
      }

      self.options.onActivate.call(self, $target);
      self.$container.trigger('panelsnap:activate', [$target]);

    },

    getPanel: function(selector) {

      var self = this;

      if(typeof selector === 'undefined') {
        selector = '';
      }

      return $(self.options.panelSelector + selector, self.$container);

    },

    snapTo: function(target, wrap) {

      var self = this;

      if(typeof wrap !== 'boolean') {
        wrap = true;
      }

      var $panels = self.getPanel();
      var index = $panels.index(self.getPanel('.active'));
      var $target;

      switch(target) {
        case 'prev':

          $target = $panels.eq(index - 1);
          if(index < 1 && !wrap)
          {
            $target = []; // Clear target, because negative indexes wrap automatically
          }
          break;

        case 'next':

          $target = $panels.eq(index + 1);
          if($target.length < 1 && wrap)
          {
            $target = $panels.filter(':first');
          }
          break;

        case 'first':

          $target = $panels.filter(':first');
          break;

        case 'last':

          $target = $panels.filter(':last');
          break;
      }

      if($target.length > 0) {
        self.snapToPanel($target);
      }

    },

    enable: function() {

      var self = this;

      // Gather scrollOffset for next scroll
      self.scrollOffset = self.$snapContainer.scrollTop();

      self.enabled = true;

    },

    disable: function() {

      var self = this;

      self.enabled = false;

    },

    toggle: function() {

      var self = this;

      if(self.enabled) {
        self.disable();
      } else {
        self.enable();
      }

    }

  };

  $.fn[pluginName] = function(options) {

    var args = Array.prototype.slice.call(arguments);

    return this.each(function() {

      var pluginInstance = $.data(this, storageName);
      if(typeof options === 'object' || options === 'init' || ! options) {
        if(!pluginInstance) {
          if(options === 'init') {
            options = args[1] || {};
          }

          pluginInstance = Object.create(pluginObject).init(options, this);
          $.data(this, storageName, pluginInstance);
        } else {
          $.error('Plugin is already initialized for this object.');
          return;
        }
      } else if(!pluginInstance) {
        $.error('Plugin is not initialized for this object yet.');
        return;
      } else if(pluginInstance[options]) {
        var method = options;
        options = args.slice(1);
        pluginInstance[method].apply(pluginInstance, options);
      } else {
        $.error('Method ' +  options + ' does not exist on jQuery.panelSnap.');
        return;
      }

    });

  };

  $.fn[pluginName].options = {
    $menu: false,
    menuSelector: 'a',
    panelSelector: '> section',
    namespace: '.panelSnap',
    onSnapStart: function(){},
    onSnapFinish: function(){},
    onActivate: function(){},
    directionThreshold: 50,
    slideSpeed: 200,
    delay: 0,
    easing: 'linear',
    offset: 0,
    navigation: {
      keys: {
        nextKey: false,
        prevKey: false
      },
      buttons: {
        $nextButton: false,
        $prevButton: false
      },
      wrapAround: false
    }
  };

})(jQuery, window, document);

/*!
 * Special flavoured jQuery Mobile scrollstart & scrollstop events.
 * Version 0.1.3
 *
 * Requires:
 * - jQuery 1.7.1 or higher (no jQuery.migrate needed)
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
(function($) {

  // Also handles the scrollstop event
  $.event.special.scrollstart = {

    enabled: true,

    setup: function() {

      var thisObject = this;
      var $this = $(thisObject);
      var scrolling;
      var timer;
      var isTouching;

      $this.data('scrollwatch', true);

      function trigger(event, scrolling) {

        event.type = scrolling ? 'scrollstart' : 'scrollstop';
        $this.trigger(event);

      }

      $this.on('touchstart', function(event) {
        isTouching = true;
      });

      $this.on('touchleave touchcancel touchend', function(event) {
        isTouching = false;
        setTimeout(function () {
          clearTimeout(timer);
        }, 50);
      });

      $this.on('touchmove scroll', function(event) {

        if (isTouching) {
          return;
        }

        if(!$.event.special.scrollstart.enabled) {
          return;
        }

        if(!$.event.special.scrollstart.scrolling) {
          $.event.special.scrollstart.scrolling = true;
          trigger(event, true);
        }

        clearTimeout(timer);
        timer = setTimeout(function() {
          $.event.special.scrollstart.scrolling = false;
          trigger(event, false);
        }, 50);

      });

    }

  };

  // Proxies scrollstart when needed
  $.event.special.scrollstop = {

    setup: function() {

      var thisObject = this;
      var $this = $(thisObject);

      if(!$this.data('scrollwatch')) {
        $(this).on('scrollstart', function(){});
      }

    }

  };

})(jQuery);

/*!
 * Resizestart and resizestop events.
 * Version 0.0.1
 *
 * Requires:
 * - jQuery 1.7.1 or higher (no jQuery.migrate needed)
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
 * Date: Fri Oct 25 15:05:00 2013 +0100
 */
(function($) {

  // Also handles the resizestop event
  $.event.special.resizestart = {

    enabled: true,

    setup: function() {

      var thisObject = this;
      var $this = $(thisObject);
      var resizing;
      var timer;

      $this.data('resizewatch', true);

      function trigger(event, resizing) {

        event.type = resizing ? 'resizestart' : 'resizestop';
        $this.trigger(event);

      }

      $this.on('resize', function(event) {

        if(!$.event.special.resizestart.enabled) {
          return;
        }

        if(!$.event.special.resizestart.resizing) {
          $.event.special.resizestart.resizing = true;
          trigger(event, true);
        }

        clearTimeout(timer);
        timer = setTimeout(function() {
          $.event.special.resizestart.resizing = false;
          trigger(event, false);
        }, 200);

      });

    }

  };

  // Proxies resizestart when needed
  $.event.special.resizestop = {

    setup: function() {

      var thisObject = this;
      var $this = $(thisObject);

      if(!$this.data('resizewatch')) {
        $(this).on('resizestart', function(){});
      }

    }

  };

})(jQuery);

/*! Copyright (c) 2011 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 * Thanks to: Seamus Leahy for adding deltaX and deltaY
 *
 * Version: 3.0.6
 *
 * Requires: 1.2.2+
 */
(function($) {

  var types = ['DOMMouseScroll', 'mousewheel'];

  if ($.event.fixHooks) {
    for ( var i=types.length; i; ) {
      $.event.fixHooks[ types[--i] ] = $.event.mouseHooks;
    }
  }

  $.event.special.mousewheel = {
    setup: function() {
      if ( this.addEventListener ) {
        for ( var i=types.length; i; ) {
          this.addEventListener( types[--i], handler, false );
        }
      } else {
        this.onmousewheel = handler;
      }
    },

    teardown: function() {
      if ( this.removeEventListener ) {
        for ( var i=types.length; i; ) {
          this.removeEventListener( types[--i], handler, false );
        }
      } else {
        this.onmousewheel = null;
      }
    }
  };

  $.fn.extend({
    mousewheel: function(fn) {
      return fn ? this.bind('mousewheel', fn) : this.trigger('mousewheel');
    },

    unmousewheel: function(fn) {
      return this.unbind('mousewheel', fn);
    }
  });

  function handler(event) {
    var orgEvent = event || window.event,
        args = [].slice.call( arguments, 1 ),
        delta = 0,
        returnValue = true,
        deltaX = 0,
        deltaY = 0;

    event = $.event.fix(orgEvent);
    event.type = 'mousewheel';

    // Old school scrollwheel delta
    if ( orgEvent.wheelDelta ) { delta = orgEvent.wheelDelta/120; }
    if ( orgEvent.detail     ) { delta = -orgEvent.detail/3; }

    // New school multidimensional scroll (touchpads) deltas
    deltaY = delta;

    // Gecko
    if ( orgEvent.axis !== undefined && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
      deltaY = 0;
      deltaX = -1*delta;
    }

    // Webkit
    if ( orgEvent.wheelDeltaY !== undefined ) { deltaY = orgEvent.wheelDeltaY/120; }
    if ( orgEvent.wheelDeltaX !== undefined ) { deltaX = -1*orgEvent.wheelDeltaX/120; }

    // Add event and delta to the front of the arguments
    args.unshift(event, delta, deltaX, deltaY);

    return ($.event.dispatch || $.event.handle).apply(this, args);
  }

})(jQuery);

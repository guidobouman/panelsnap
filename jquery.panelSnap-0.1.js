// Utility for creating objects in older browsers
if ( typeof Object.create !== 'function' )
{
  Object.create = function( obj )
  {
    function F() {}
    F.prototype = obj;
    return new F();
  }
}

(function($, window, document, undefined)
{
  var pluginName = 'panelSnap';

  var pluginObject = {
    isMouseDown: false,
    scrollOffset: 0,

    init: function(options, container)
    {
      var self = this;

      self.container = container;
      self.$container = $(container);
      self.$document = $(document);

      self.options = $.extend(true, {}, $.fn.panelSnap.options, options);

      self.bind();

      return self;
    },

    bind: function()
    {
      var self = this;

      self.$document.on('scrollstop' + self.options.nameSpace, $.proxy(function()
      {
        self.processScroll();
      }, self));
      self.$document.on('scrollstart' + self.options.nameSpace, $.proxy(function()
      {
        self.initScroll();
      }, self));
      self.$document.on('mousewheel' + self.options.nameSpace, $.proxy(function()
      {
        self.holdScroll();
      }, self));
      self.$document.on('mousedown' + self.options.nameSpace, $.proxy(function()
      {
        self.mouseDown();
      }, self));
      self.$document.on('mouseup' + self.options.nameSpace, $.proxy(function()
      {
        self.mouseUp();
      }, self));
      self.$document.on('resize' + self.options.nameSpace, $.proxy(function()
      {
        self.processScroll();
      }, self));

      if(self.options.$menu !== false)
      {
        $(a, self.options.$menu).on('click' + self.options.nameSpace, $.proxy(function()
        {
          self.captureMenuClick();
        }, self));
      }
    },

    destroy: function()
    {
      var self = this;

      // Gotta love namespaced events!
      self.options.$document.off(self.options.nameSpace);

      if(self.options.$menu !== false)
      {
        $(a, self.options.$menu).off(self.options.nameSpace);
      }
    },

    captureMenuClick: function(e)
    {
      var self = this;

      var $target = $(panelSelector + '.' + $(self).data('panel'), self.settings.$container);
      snapToPanel($target);
    },

    holdScroll: function(e)
    {
      var self = this;

      self.$container.stop(true);
    },

    initScroll: function(e)
    {
      var self = this;

      self.scrollOffset = self.$container.scrollTop();
    },

    processScroll: function(e)
    {
      var self = this;

      if(self.isMouseDown)
      {
        console.log(self.isMouseDown);
        self.$container.one('mouseup', self.processScroll);
        return false;
      }

      var interval = self.$container.height();
      var offset = self.$container.scrollTop();
      var scrollDifference = offset - self.scrollOffset;

      console.log(scrollDifference);

      if(scrollDifference < -self.options.directionThreshold && scrollDifference > -interval)
      {
        var child_no = Math.floor(offset / interval);
      }
      else if(scrollDifference > self.options.directionThreshold && scrollDifference < interval)
      {
        var child_no = Math.ceil(offset / interval);
      }
      else
      {
        var child_no = Math.round(offset / interval);
      }

      var target_class = $(self.options.panelSelector, self.$container)[child_no].className;
      var $target = $(self.options.panelSelector + '.' + target_class, self.$container);

      self.snapToPanel($target);
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

      var scrollTop = $target.offset().top;

      self.$container.animate(
      {
        scrollTop: scrollTop
      }, self.options.slideSpeed);

      if(self.options.$menu !== false)
      {
        $('a.active', self.options.$menu).removeClass('active');
        var $activeItem = $('a[data-panel=' + $target.attr('class') + ']', self.options.$menu)
        $activeItem.addClass('active');
      }

      self.options.onSlideFinish.call(self);
    }
  };

  $.fn[pluginName] = function(options)
  {
    return this.each(function()
    {
      var name = 'plugin_' + pluginName;
      var pluginInstance = $.data(self, name);
      if(typeof options === 'object' || options === 'init' || ! options)
      {
        if(!pluginInstance)
        {
          pluginInstance = $.data(this, name, Object.create(pluginObject).init(options, this));
        }
      }
      else if(!pluginInstance)
      {
        $.error('Plugin was not initialized for self object');
        return true;
      }
      else if(typeof options === 'string' && methods[options])
      {
        method = options;
        options = Array.prototype.slice.call(arguments, 1);
        pluginInstance[method](options);
      }
      else
      {
        $.error('Method ' +  options + ' does not exist on jQuery.panelSnap.');
        return true;
      }
    });
  };

  $.fn.panelSnap.options = {
    $menu: false,
    panelSelector: 'section',
    nameSpace: '.panelSnap',
    onSlideStart: function(){},
    onSlideFinish: function(){},
    directionThreshold: 50,
    slideSpeed: 200
  };

})(jQuery, window, document);
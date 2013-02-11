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
    mouseDown: false,
    scrollOffset: 0,

    init: function(options, container)
    {
      this.container = container;
      this.$container = $(container);
      this.$document = $(document);

      this.options = $.extend(true, {}, $.fn.panelSnap.options, options);

      this.bind();

      this.processScroll();

      return this;
    },

    bind: function()
    {
      this.$document.on('scrollstop' + this.options.nameSpace, this.processScroll);
      this.$document.on('scrollstart' + this.options.nameSpace, this.initScroll);
      this.$document.on('mousewheel' + this.options.nameSpace, this.holdScroll);
      this.$document.on('mousedown' + this.options.nameSpace, this.mouseDown);
      this.$document.on('mouseup' + this.options.nameSpace, this.mouseUp);
      this.$document.on('resize' + this.options.nameSpace, this.processScroll.call();

      if(this.options.$menu !== false)
      {
        $(a, this.options.$menu).on('click' + this.options.nameSpace, this.captureMenuClick);
      }
    },

    destroy: function()
    {
      // Gotta love namespaced events!
      this.options.$document.off(this.options.nameSpace);

      if(this.options.$menu !== false)
      {
        $(a, this.options.$menu).off(this.options.nameSpace);
      }
    },

    captureMenuClick: function(e)
    {
      var $target = $(panelSelector + '.' + $(this).data('panel'), this.settings.$container);
      snapToPanel($target);
    },

    holdScroll: function(e)
    {
      this.$container.stop(true);
    },

    initScroll: function(e)
    {
      this.scrollOffset = this.$container.scrollTop();
    },

    processScroll: function(e)
    {
      if(this.mouseDown)
      {
        this.$container.one('mouseup', this.processScroll);
        return false;
      }

      var interval = this.$container.height();
      var offset = this.$container.scrollTop();
      var scrollDifference = offset - scrollOffset;

      if(scrollDifference < -directionThreshold && scrollDifference > -interval)
      {
        var child_no = Math.floor(offset / interval);
      }
      else if(scrollDifference > directionThreshold && scrollDifference < interval)
      {
        var child_no = Math.ceil(offset / interval);
      }
      else
      {
        var child_no = Math.round(offset / interval);
      }

      var target_class = $(panelSelector, this.settings.$container)[child_no].className;
      var $target = $(panelSelector + '.' + target_class, this.options.$container);

      snapToPanel($target);
    },

    mouseDown: function(e)
    {
      mousedown = true;
    },

    mouseUp: function(e)
    {
      mousedown = false;
    },

    snapToPanel: function($target)
    {
      var scrollTop = $target.offset().top;

      this.options.$container.animate(
      {
        scrollTop: scrollTop
      }, this.options.slideSpeed);

      if(this.options.$menu !== false)
      {
        $('a.active', this.options.$menu).removeClass('active');
        var $activeItem = $('a[data-panel=' + $target.attr('class') + ']', this.options.$menu)
        $activeItem.addClass('active');
      }

      this.options.onSlideFinish.call(this);
    }
  };

  $.fn[pluginName] = function(options)
  {
    return this.each(function()
    {
      var name = 'plugin_' + pluginName;
      var pluginInstance = $.data(this, name);
      if(typeof options === 'object' || options === 'init' || ! options)
      {
        if(!pluginInstance)
        {
          pluginInstance = $.data(this, name, Object.create(pluginObject).init(options, this));
        }
      }
      else if(!pluginInstance)
      {
        $.error('Plugin was not initialized for this object');
        return true;
      }
      else if(typeof options === 'string' && methods[options])
      {
        method = options;
        options = Array.prototype.slice.call(arguments, 1);
        pluginInstance[method](options, this);
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
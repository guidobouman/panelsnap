!function(t){var e={};function n(i){if(e[i])return e[i].exports;var s=e[i]={i:i,l:!1,exports:{}};return t[i].call(s.exports,s,s.exports,n),s.l=!0,s.exports}n.m=t,n.c=e,n.d=function(t,e,i){n.o(t,e)||Object.defineProperty(t,e,{configurable:!1,enumerable:!0,get:i})},n.r=function(t){Object.defineProperty(t,"__esModule",{value:!0})},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=0)}([function(t,e){var n;"function"!=typeof Object.create&&(Object.create=function(t){function e(){}return e.prototype=t,new e}),function(t,e,n){"use strict";var i={isMouseDown:!1,isSnapping:!1,enabled:!0,scrollOffset:0,init:function(e,i){if(this.container=i,this.$container=t(i),this.$eventContainer=this.$container,this.$snapContainer=this.$container,this.$container.is("body")){this.$eventContainer=t(n),this.$snapContainer=t(n.scrollingElement||n.documentElement);var s=navigator.userAgent;-1!==s.indexOf("WebKit")&&-1===s.indexOf("Chrome")&&(this.$snapContainer=t("body"))}if(this.options=t.extend(!0,{},t.fn.panelSnap.options,e),this.bind(),!1!==this.options.$menu&&t(".active",this.options.$menu).length>0)t(".active",this.options.$menu).click();else{var o=this.getPanel(":first");this.activatePanel(o)}return this},bind:function(){this.bindProxied(this.$eventContainer,"scrollstop",this.scrollStop),this.bindProxied(this.$eventContainer,"mousewheel",this.mouseWheel),this.bindProxied(this.$eventContainer,"mousedown",this.mouseDown),this.bindProxied(this.$eventContainer,"mouseup",this.mouseUp),this.bindProxied(t(e),"resizestop",this.resize),this.options.$menu&&this.bindProxied(this.options.$menu,"click",this.captureMenuClick,this.options.menuSelector),(this.options.navigation.keys.nextKey||this.options.navigation.keys.prevKey)&&this.bindProxied(t(e),"keydown",this.keyDown),this.options.navigation.buttons.$nextButton&&this.bindProxied(this.options.navigation.buttons.$nextButton,"click",this.captureNextClick),this.options.navigation.buttons.$prevButton&&this.bindProxied(this.options.navigation.buttons.$prevButton,"click",this.capturePrevClick)},bindProxied:function(e,n,i,s){var o=this;s="string"==typeof s?s:null,e.on(n+o.options.namespace,s,t.proxy(function(t){return i.call(o,t)},o))},destroy:function(){this.$eventContainer.off(this.options.namespace),t(e).off(this.options.namespace),!1!==this.options.$menu&&t(this.options.menuSelector,this.options.$menu).off(this.options.namespace),this.$container.removeData("plugin_panelSnap")},scrollStop:function(t){var e;if(t.stopPropagation(),!this.isMouseDown&&!this.isSnapping){var n=this.getPanelsInViewport();if(!this.enabled||n.length<2)(e=n.eq(0)).is(this.getPanel(".active"))||this.activatePanel(e);else{var i,s=this.$snapContainer.scrollTop(),o=s-this.scrollOffset,a=Math.abs(o)>this.options.directionThreshold;if(o>0)i=a?1:0;else{if(!(o<0))return;i=a?0:1}e=n.eq(i);var r=this.$container[0].scrollHeight-this.scrollInterval;s<=0||s>=r?(this.activatePanel(e),this.scrollOffset=s<=0?0:r):this.snapToPanel(e)}}},getPanelsInViewport:function(){var e=this,n={top:e.$snapContainer.scrollTop()};return n.bottom=n.top+e.$snapContainer.height(),e.getPanel().filter(function(i,s){var o,a=t(s);return e.$container.is("body")?o=a.offset():(o=a.position()).top+=e.$snapContainer.scrollTop(),o.bottom=o.top+a.outerHeight(),!(n.bottom<o.top||n.top>o.bottom)})},mouseWheel:function(){this.isSnapping&&(this.scrollOffset=this.$snapContainer.scrollTop(),this.$snapContainer.stop(!0),this.isSnapping=!1)},mouseDown:function(){this.isMouseDown=!0},mouseUp:function(t){this.isMouseDown=!1,this.scrollOffset!==this.$snapContainer.scrollTop()&&this.scrollStop(t)},keyDown:function(t){var e=this.options.navigation;if(this.enabled){switch(t.which){case e.keys.prevKey:case e.keys.nextKey:t.preventDefault()}if(!this.isSnapping)switch(t.which){case e.keys.prevKey:this.snapTo("prev",e.wrapAround);break;case e.keys.nextKey:this.snapTo("next",e.wrapAround)}}},captureNextClick:function(t){t.preventDefault(),this.isSnapping||this.snapTo("next",this.options.navigation.wrapAround)},capturePrevClick:function(t){t.preventDefault(),this.isSnapping||this.snapTo("prev",this.options.navigation.wrapAround)},resize:function(){if(this.enabled){var t=this.getPanel(".active");this.snapToPanel(t)}},captureMenuClick:function(e){var n=t(e.currentTarget).data("panel"),i=this.getPanel('[data-panel="'+n+'"]');return this.snapToPanel(i),!1},snapToPanel:function(t){var e=this;if(t.jquery){e.isSnapping=!0,e.options.onSnapStart.call(e,t),e.$container.trigger("panelsnap:start",[t]);var n=0;n=e.$container.is("body")?t.offset().top:e.$snapContainer.scrollTop()+t.position().top,n-=e.options.offset;var i=e.scrollOffset>n,s=t.outerHeight()>e.$snapContainer.outerHeight();i&&s&&(n+=t.outerHeight(),n-=e.$snapContainer.outerHeight()),e.$snapContainer.stop(!0).delay(e.options.delay).animate({scrollTop:n},e.options.slideSpeed,e.options.easing,function(){e.scrollOffset=e.$snapContainer.scrollTop(),e.isSnapping=!1,e.options.onSnapFinish.call(e,t),e.$container.trigger("panelsnap:finish",[t]),e.activatePanel(t)})}},activatePanel:function(e){if(this.getPanel(".active").removeClass("active"),e.addClass("active"),!1!==this.options.$menu){var n=this.options.menuSelector+".active";t(n,this.options.$menu).removeClass("active");var i='[data-panel="'+e.data("panel")+'"]',s=this.options.menuSelector+i;t(s,this.options.$menu).addClass("active")}var o=this.options.navigation;if(!o.wrapAround){var a=this.getPanel(),r=a.index(this.getPanel(".active"));!1!==o.buttons.$nextButton&&((e=a.eq(r+1)).length<1?(t(o.buttons.$nextButton).attr("aria-disabled","true"),t(o.buttons.$nextButton).addClass("disabled")):(t(o.buttons.$nextButton).attr("aria-disabled","false"),t(o.buttons.$nextButton).removeClass("disabled"))),!1!==o.buttons.$prevButton&&(r<1?(t(o.buttons.$prevButton).attr("aria-disabled","true"),t(o.buttons.$prevButton).addClass("disabled")):(t(o.buttons.$prevButton).attr("aria-disabled","false"),t(o.buttons.$prevButton).removeClass("disabled")))}this.options.onActivate.call(this,e),this.$container.trigger("panelsnap:activate",[e])},getPanel:function(e){return void 0===e&&(e=""),t(this.options.panelSelector+e,this.$container)},snapTo:function(t,e){"boolean"!=typeof e&&(e=!0);var n,i=this.getPanel(),s=i.index(this.getPanel(".active"));switch(t){case"prev":n=i.eq(s-1),s<1&&!e&&(n=[]);break;case"next":(n=i.eq(s+1)).length<1&&e&&(n=i.filter(":first"));break;case"first":n=i.filter(":first");break;case"last":n=i.filter(":last")}n.length>0&&this.snapToPanel(n)},enable:function(){this.scrollOffset=this.$snapContainer.scrollTop(),this.enabled=!0},disable:function(){this.enabled=!1},toggle:function(){this.enabled?this.disable():this.enable()}};t.fn.panelSnap=function(e){var n=Array.prototype.slice.call(arguments);return this.each(function(){var s=t.data(this,"plugin_panelSnap");if("object"!=typeof e&&"init"!==e&&e)if(s)if(s[e]){var o=e;e=n.slice(1),s[o].apply(s,e)}else t.error("Method "+e+" does not exist on jQuery.panelSnap.");else t.error("Plugin is not initialized for this object yet.");else s?t.error("Plugin is already initialized for this object."):("init"===e&&(e=n[1]||{}),s=Object.create(i).init(e,this),t.data(this,"plugin_panelSnap",s))})},t.fn.panelSnap.options={$menu:!1,menuSelector:"a",panelSelector:"> section",namespace:".panelSnap",onSnapStart:function(){},onSnapFinish:function(){},onActivate:function(){},directionThreshold:50,slideSpeed:200,delay:0,easing:"linear",offset:0,navigation:{keys:{nextKey:!1,prevKey:!1},buttons:{$nextButton:!1,$prevButton:!1},wrapAround:!1}}}(jQuery,window,document),(n=jQuery).event.special.scrollstart={enabled:!0,setup:function(){var t,e,i=n(this);function s(t,e){t.type=e?"scrollstart":"scrollstop",i.trigger(t)}i.data("scrollwatch",!0),i.on("touchstart",function(){e=!0}),i.on("touchleave touchcancel touchend",function(){e=!1,setTimeout(function(){clearTimeout(t)},50)}),i.on("touchmove scroll",function(i){e||n.event.special.scrollstart.enabled&&(n.event.special.scrollstart.scrolling||(n.event.special.scrollstart.scrolling=!0,s(i,!0)),clearTimeout(t),t=setTimeout(function(){n.event.special.scrollstart.scrolling=!1,s(i,!1)},50))})}},n.event.special.scrollstop={setup:function(){n(this).data("scrollwatch")||n(this).on("scrollstart",function(){})}},function(t){t.event.special.resizestart={enabled:!0,setup:function(){var e,n=t(this);function i(t,e){t.type=e?"resizestart":"resizestop",n.trigger(t)}n.data("resizewatch",!0),n.on("resize",function(n){t.event.special.resizestart.enabled&&(t.event.special.resizestart.resizing||(t.event.special.resizestart.resizing=!0,i(n,!0)),clearTimeout(e),e=setTimeout(function(){t.event.special.resizestart.resizing=!1,i(n,!1)},200))})}},t.event.special.resizestop={setup:function(){t(this).data("resizewatch")||t(this).on("resizestart",function(){})}}}(jQuery),function(t){var e=["DOMMouseScroll","mousewheel"];if(t.event.fixHooks)for(var n=e.length;n;)t.event.fixHooks[e[--n]]=t.event.mouseHooks;function i(e){var n=e||window.event,i=[].slice.call(arguments,1),s=0,o=0,a=0;return(e=t.event.fix(n)).type="mousewheel",n.wheelDelta&&(s=n.wheelDelta/120),n.detail&&(s=-n.detail/3),a=s,void 0!==n.axis&&n.axis===n.HORIZONTAL_AXIS&&(a=0,o=-1*s),void 0!==n.wheelDeltaY&&(a=n.wheelDeltaY/120),void 0!==n.wheelDeltaX&&(o=-1*n.wheelDeltaX/120),i.unshift(e,s,o,a),(t.event.dispatch||t.event.handle).apply(this,i)}t.event.special.mousewheel={setup:function(){if(this.addEventListener)for(var t=e.length;t;)this.addEventListener(e[--t],i,!1);else this.onmousewheel=i},teardown:function(){if(this.removeEventListener)for(var t=e.length;t;)this.removeEventListener(e[--t],i,!1);else this.onmousewheel=null}},t.fn.extend({mousewheel:function(t){return t?this.bind("mousewheel",t):this.trigger("mousewheel")},unmousewheel:function(t){return this.unbind("mousewheel",t)}})}(jQuery)}]);
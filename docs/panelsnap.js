/**
 * PanelSnap.js v0.0.0-development
 * Copyright (c) 2013-present, Guido Bouman
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t="undefined"!=typeof globalThis?globalThis:t||self).PanelSnap=e()}(this,(function(){"use strict";function t(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);e&&(i=i.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,i)}return n}function e(e){for(var n=1;n<arguments.length;n++){var r=null!=arguments[n]?arguments[n]:{};n%2?t(Object(r),!0).forEach((function(t){i(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):t(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function n(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}function i(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function r(t){return function(t){if(Array.isArray(t))return o(t)}(t)||function(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}(t)||function(t,e){if(!t)return;if("string"==typeof t)return o(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);"Object"===n&&t.constructor&&(n=t.constructor.name);if("Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return o(t,e)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function o(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,i=new Array(e);n<e;n++)i[n]=t[n];return i}var s=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}();function a(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var l=function(){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};a(this,t),this.start=e.start,this.end=e.end,this.decimal=e.decimal}return s(t,[{key:"getIntermediateValue",value:function(t){return this.decimal?t:Math.round(t)}},{key:"getFinalValue",value:function(){return this.end}}]),t}(),c=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}();function h(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var u=function(){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};h(this,t),this.duration=e.duration||1e3,this.ease=e.easing||this._defaultEase,this.tweener=e.tweener||new l(e),this.start=this.tweener.start,this.end=this.tweener.end,this.frame=null,this.next=null,this.isRunning=!1,this.events={},this.direction=this.start<this.end?"up":"down"}return c(t,[{key:"begin",value:function(){return this.isRunning||this.next===this.end||(this.frame=window.requestAnimationFrame(this._tick.bind(this))),this}},{key:"stop",value:function(){return window.cancelAnimationFrame(this.frame),this.isRunning=!1,this.frame=null,this.timeStart=null,this.next=null,this}},{key:"on",value:function(t,e){return this.events[t]=this.events[t]||[],this.events[t].push(e),this}},{key:"_emit",value:function(t,e){var n=this,i=this.events[t];i&&i.forEach((function(t){return t.call(n,e)}))}},{key:"_tick",value:function(t){this.isRunning=!0;var e=this.next||this.start;this.timeStart||(this.timeStart=t),this.timeElapsed=t-this.timeStart,this.next=this.ease(this.timeElapsed,this.start,this.end-this.start,this.duration),this._shouldTick(e)?(this._emit("tick",this.tweener.getIntermediateValue(this.next)),this.frame=window.requestAnimationFrame(this._tick.bind(this))):(this._emit("tick",this.tweener.getFinalValue()),this._emit("done",null))}},{key:"_shouldTick",value:function(t){return{up:this.next<this.end&&t<=this.next,down:this.next>this.end&&t>=this.next}[this.direction]}},{key:"_defaultEase",value:function(t,e,n,i){return(t/=i/2)<1?n/2*t*t+e:-n/2*(--t*(t-2)-1)+e}}]),t}();function f(t){return t!==document.body?t:"scrollingElement"in document?document.scrollingElement:navigator.userAgent.indexOf("WebKit")>-1?document.body:document.documentElement}function d(t){if(t===document.body){var e=document.documentElement;return{top:0,left:0,bottom:e.clientHeight,right:e.clientWidth,height:e.clientHeight,width:e.clientWidth}}return t.getBoundingClientRect()}function v(t,e){var n=arguments.length>2&&void 0!==arguments[2]&&arguments[2],i=arguments.length>3&&void 0!==arguments[3]&&arguments[3],r=d(t),o=e.getBoundingClientRect(),s=o.top-r.top,a=o.left-r.left,l=n?o.height-r.height:0,c=i?o.width-r.width:0,h=f(t);return{top:s+l+h.scrollTop,left:a+c+h.scrollLeft}}var p=function(){var t=!1;try{var e=Object.defineProperty({},"passive",{get:function(){t=!0}});window.addEventListener("test",null,e),window.removeEventListener("test",null,e)}catch(t){}return t}(),m=0,b=1e4,y={container:document.body,panelSelector:"> section",directionThreshold:50,delay:0,duration:300,easing:function(t){return t},timeout:50},g=function(){function t(n){if(function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.options=e(e({},y),n),this.options.container.dataset.panelsnapId)throw new Error("PanelSnap is already initialised on this container, aborting.");var i;this.options.timeout<15&&(this.options.directionThreshold=0),this.container=this.options.container,this.scrollContainer=f(this.container),this.scrollEventContainer=(i=this.container)===document.body?window:f(i),m+=1,this.instanceIndex=m,this.container.dataset.panelsnapId=this.instanceIndex;var r='[data-panelsnap-id="'.concat(this.instanceIndex,'"] ').concat(this.options.panelSelector);this.panelList=Array.from(document.querySelectorAll(r)),this.events=[],this.isEnabled=!0,this.isInteracting=!1,this.scrollTimeout=null,this.resetAnimation(),this.onInteractStart=this.onInteractStart.bind(this),this.onInteractStop=this.onInteractStop.bind(this),this.onInteractStart=this.onInteractStart.bind(this),this.onInteractStop=this.onInteractStop.bind(this),this.onInteractStart=this.onInteractStart.bind(this),this.onInteractStop=this.onInteractStop.bind(this),this.onScroll=this.onScroll.bind(this),this.onInteract=this.onInteract.bind(this),this.scrollEventContainer.addEventListener("keydown",this.onInteractStart,p&&{passive:!0}),this.scrollEventContainer.addEventListener("keyup",this.onInteractStop,p&&{passive:!0}),this.scrollEventContainer.addEventListener("mousedown",this.onInteractStart,p&&{passive:!0}),this.scrollEventContainer.addEventListener("mouseup",this.onInteractStop,p&&{passive:!0}),this.scrollEventContainer.addEventListener("touchstart",this.onInteractStart,p&&{passive:!0}),this.scrollEventContainer.addEventListener("touchend",this.onInteractStop,p&&{passive:!0}),this.scrollEventContainer.addEventListener("scroll",this.onScroll,p&&{passive:!0}),this.scrollEventContainer.addEventListener("wheel",this.onInteract,p&&{passive:!0}),this.findSnapTarget()}var i,o,s;return i=t,o=[{key:"destroy",value:function(){this.stopAnimation(),this.disable(),this.scrollEventContainer.removeEventListener("keydown",this.onInteractStart,p&&{passive:!0}),this.scrollEventContainer.removeEventListener("keyup",this.onInteractStop,p&&{passive:!0}),this.scrollEventContainer.removeEventListener("mousedown",this.onInteractStart,p&&{passive:!0}),this.scrollEventContainer.removeEventListener("mouseup",this.onInteractStop,p&&{passive:!0}),this.scrollEventContainer.removeEventListener("touchstart",this.onInteractStart,p&&{passive:!0}),this.scrollEventContainer.removeEventListener("touchend",this.onInteractStop,p&&{passive:!0}),this.scrollEventContainer.removeEventListener("scroll",this.onScroll,p&&{passive:!0}),this.scrollEventContainer.removeEventListener("wheel",this.onInteract,p&&{passive:!0}),delete this.options.container.dataset.panelsnapId}},{key:"enable",value:function(){this.isEnabled=!0}},{key:"disable",value:function(){this.isEnabled=!1}},{key:"on",value:function(t,e){var n=this.events[t]||[];this.events[t]=[].concat(r(n),[e]),"activatePanel"===t&&e.call(this,this.activePanel)}},{key:"off",value:function(t,e){var n=this.events[t]||[];this.events[t]=n.filter((function(t){return t!==e}))}},{key:"emit",value:function(t,e){var n=this;(this.events[t]||[]).forEach((function(t){return t.call(n,e)}))}},{key:"onInteractStart",value:function(){this.stopAnimation(),this.isInteracting=!0}},{key:"onInteractStop",value:function(){this.isInteracting=!1,this.findSnapTarget()}},{key:"onInteract",value:function(){this.stopAnimation(),this.onScroll()}},{key:"onScroll",value:function(){clearTimeout(this.scrollTimeout),this.isInteracting||this.animation||(this.scrollTimeout=setTimeout(this.findSnapTarget.bind(this),this.options.timeout+this.options.delay))}},{key:"findSnapTarget",value:function(){var t=this.scrollContainer.scrollTop-this.currentScrollOffset.top,e=this.scrollContainer.scrollLeft-this.currentScrollOffset.left;this.currentScrollOffset={top:this.scrollContainer.scrollTop,left:this.scrollContainer.scrollLeft};var n,i,r,o=(n=this.container,i=this.panelList,r=d(n),i.filter((function(t){var e=t.getBoundingClientRect();return e.top<r.bottom&&e.right>r.left&&e.bottom>r.top&&e.left<r.right})));if(0===o.length)throw new Error("PanelSnap could not find a snappable panel, aborting.");if(o.length>1){if(Math.abs(t)<this.options.directionThreshold&&Math.abs(e)<this.options.directionThreshold&&this.activePanel)return void this.snapToPanel(this.activePanel,t>0,e>0);var s=t>0||e>0?1:o.length-2;this.snapToPanel(o[s],t<0,e<0)}else{var a=o[0];!function(t,e){var n=d(t),i=e.getBoundingClientRect();return i.top<=n.top&&i.bottom>=n.bottom&&i.left<=n.left&&i.right>=n.right}(this.container,a)?(console.error("PanelSnap does not support space between panels, snapping back."),this.snapToPanel(a,t>0,e>0)):this.activatePanel(a)}}},{key:"snapToPanel",value:function(t){var e=this,n=arguments.length>1&&void 0!==arguments[1]&&arguments[1],i=arguments.length>2&&void 0!==arguments[2]&&arguments[2];this.activatePanel(t),this.isEnabled&&(this.animation&&this.animation.stop(),this.targetScrollOffset=v(this.container,t,n,i),this.animation=new u({start:0,end:b,duration:this.options.duration}),this.animation.on("tick",this.animationTick.bind(this)),this.animation.on("done",(function(){e.emit("snapStop",t),e.resetAnimation()})),this.emit("snapStart",t),this.animation.begin())}},{key:"animationTick",value:function(t){var e=this.targetScrollOffset.top-this.currentScrollOffset.top,n=this.currentScrollOffset.top+e*t/b;this.scrollContainer.scrollTop=n;var i=this.targetScrollOffset.left-this.currentScrollOffset.left,r=this.currentScrollOffset.left+i*t/b;this.scrollContainer.scrollLeft=r}},{key:"stopAnimation",value:function(){this.animation&&(this.animation.stop(),this.resetAnimation())}},{key:"resetAnimation",value:function(){this.currentScrollOffset={top:this.scrollContainer.scrollTop,left:this.scrollContainer.scrollLeft},this.targetScrollOffset={top:0,left:0},this.animation=null}},{key:"activatePanel",value:function(t){this.activePanel!==t&&(this.emit("activatePanel",t),this.activePanel=t)}}],o&&n(i.prototype,o),s&&n(i,s),t}();return g}));

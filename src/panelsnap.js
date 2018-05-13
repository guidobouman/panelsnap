import Tweezer from 'tweezer.js';

import {
  getScrollingElement,
  getScrollEventContainer,
  getTargetScrollOffset,
  getElementsInContainerViewport,
  elementFillsContainer,
  passiveIsSupported,
} from './utilities';

let INSTANCE_COUNTER = 0;
const TWEEN_MAX_VALUE = 10000;

const defaultOptions = {
  container: document.body,
  panelSelector: '> section',
  directionThreshold: 50,
  delay: 0,
  duration: 300,
  easing: t => t,
};

export default class PanelSnap {
  constructor(options) {
    this.options = {
      ...defaultOptions,
      ...options,
    };

    if (this.options.container.dataset.panelsnapId) {
      throw new Error('PanelSnap is already initialised on this container, aborting.');
    }

    this.container = this.options.container;
    this.scrollContainer = getScrollingElement(this.container);
    this.scrollEventContainer = getScrollEventContainer(this.container);

    INSTANCE_COUNTER += 1;
    this.instanceIndex = INSTANCE_COUNTER;
    this.container.dataset.panelsnapId = this.instanceIndex;

    const panelQuery = `[data-panelsnap-id="${this.instanceIndex}"] ${this.options.panelSelector}`;
    this.panelList = Array.from(document.querySelectorAll(panelQuery));

    this.events = [];
    this.isEnabled = true;
    this.isInteracting = false;
    this.scrollTimeout = null;
    this.resetAnimation();

    this.scrollEventContainer.addEventListener('keydown', this.onInteractStart.bind(this), passiveIsSupported && { passive: true });
    this.scrollEventContainer.addEventListener('keyup', this.onInteractStop.bind(this), passiveIsSupported && { passive: true });
    this.scrollEventContainer.addEventListener('mousedown', this.onInteractStart.bind(this), passiveIsSupported && { passive: true });
    this.scrollEventContainer.addEventListener('mouseup', this.onInteractStop.bind(this), passiveIsSupported && { passive: true });
    this.scrollEventContainer.addEventListener('touchstart', this.onInteractStart.bind(this), passiveIsSupported && { passive: true });
    this.scrollEventContainer.addEventListener('touchend', this.onInteractStop.bind(this), passiveIsSupported && { passive: true });
    this.scrollEventContainer.addEventListener('scroll', this.onScroll.bind(this), passiveIsSupported && { passive: true });
    this.scrollEventContainer.addEventListener('wheel', this.onInteract.bind(this), passiveIsSupported && { passive: true });
  }

  enable() {
    this.isEnabled = true;
  }

  disable() {
    this.isEnabled = false;
  }

  on(name, handler) {
    const currentHandlers = this.events[name] || [];
    this.events[name] = [...currentHandlers, handler];
  }

  off(name, handler) {
    const currentHandlers = this.events[name] || [];
    this.events[name] = currentHandlers.filter(h => h !== handler);
  }

  emit(name, value) {
    const currentHandlers = this.events[name] || [];
    currentHandlers.forEach(h => h.call(this, value));
  }

  onInteractStart() {
    this.stopAnimation();
    this.isInteracting = true;
  }

  onInteractStop() {
    this.isInteracting = false;
    this.findSnapTarget();
  }

  onInteract() {
    this.stopAnimation();
    this.onScroll();
  }

  onScroll() {
    clearTimeout(this.scrollTimeout);

    if (this.isInteracting || this.animation) {
      return;
    }

    this.stopAnimation();

    this.scrollTimeout = setTimeout(this.findSnapTarget.bind(this), 50 + this.options.delay);
  }

  findSnapTarget() {
    const deltaY = this.scrollContainer.scrollTop - this.currentScrollOffset.top;
    const deltaX = this.scrollContainer.scrollLeft - this.currentScrollOffset.left;
    this.currentScrollOffset = {
      top: this.scrollContainer.scrollTop,
      left: this.scrollContainer.scrollLeft,
    };

    const panelsInViewport = getElementsInContainerViewport(this.container, this.panelList);
    if (panelsInViewport.length === 0) {
      throw new Error('PanelSnap could not find a snappable panel, aborting.');
    }

    if (panelsInViewport.length > 1) {
      if (
        Math.abs(deltaY) < this.options.directionThreshold
        && Math.abs(deltaX) < this.options.directionThreshold
        && this.activePanel
      ) {
        this.snapToPanel(this.activePanel, deltaY > 0, deltaX > 0);
        return;
      }

      const targetIndex = deltaY > 0 || deltaX > 0 ? 1 : panelsInViewport.length - 2;
      this.snapToPanel(panelsInViewport[targetIndex], deltaY < 0, deltaX < 0);
      return;
    }

    const visiblePanel = panelsInViewport[0];
    if (elementFillsContainer(this.container, visiblePanel)) {
      this.activatePanel(visiblePanel);
      return;
    }

    // TODO: Only one partial panel in viewport, add support for space between panels?
    // eslint-disable-next-line no-console
    console.error('PanelSnap does not support space between panels, snapping back.');
    this.snapToPanel(visiblePanel, deltaY > 0, deltaX > 0);
  }

  snapToPanel(panel, toBottom = false, toRight = false) {
    this.activatePanel(panel);

    if (!this.isEnabled) {
      return;
    }

    if (this.animation) {
      this.animation.stop();
    }

    this.targetScrollOffset = getTargetScrollOffset(this.container, panel, toBottom, toRight);

    this.animation = new Tweezer({
      start: 0,
      end: TWEEN_MAX_VALUE,
      duration: this.options.duration,
    });

    this.animation.on('tick', this.animationTick.bind(this));

    this.animation.on('done', () => {
      this.emit('snapStop', panel);
      this.resetAnimation();
    });

    this.emit('snapStart', panel);
    this.animation.begin();
  }

  animationTick(value) {
    const scrollTopDelta = this.targetScrollOffset.top - this.currentScrollOffset.top;
    const scrollTop = this.currentScrollOffset.top + (scrollTopDelta * value / TWEEN_MAX_VALUE);
    this.scrollContainer.scrollTop = scrollTop;

    const scrollLeftDelta = this.targetScrollOffset.left - this.currentScrollOffset.left;
    const scrollLeft = this.currentScrollOffset.left + (scrollLeftDelta * value / TWEEN_MAX_VALUE);
    this.scrollContainer.scrollLeft = scrollLeft;
  }

  stopAnimation() {
    if (!this.animation) {
      return;
    }

    this.animation.stop();
    this.resetAnimation();
  }

  resetAnimation() {
    this.currentScrollOffset = {
      top: this.scrollContainer.scrollTop,
      left: this.scrollContainer.scrollLeft,
    };
    this.targetScrollOffset = {
      top: 0,
      left: 0,
    };
    this.animation = null;
  }

  activatePanel(panel) {
    if (this.activePanel === panel) {
      return;
    }

    this.emit('activatePanel', panel);
    this.activePanel = panel;
  }
}

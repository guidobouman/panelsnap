import Tweezer from 'tweezer.js';

import {
  getScrollingElement,
  getScrollEventContainer,
  getTargetScrollTop,
  getElementsInContainerViewport,
  elementFillsContainer,
  passiveIsSupported,
} from './utilities';

let INSTANCE_COUNTER = 0;

const defaultOptions = {
  container: document.body,
  panelSelector: '> section',
  directionThreshold: 50,
  delay: 0,
  slideSpeed: 200,
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
    this.animation = null;
    this.currentScrollOffset = this.scrollContainer.scrollTop;
    this.targetScrollOffset = this.currentScrollOffset;

    this.scrollEventContainer.addEventListener('keydown', this.onInteractStart.bind(this), passiveIsSupported && { passive: true });
    this.scrollEventContainer.addEventListener('keyup', this.onInteractStop.bind(this), passiveIsSupported && { passive: true });
    this.scrollEventContainer.addEventListener('mousedown', this.onInteractStart.bind(this), passiveIsSupported && { passive: true });
    this.scrollEventContainer.addEventListener('mouseup', this.onInteractStop.bind(this), passiveIsSupported && { passive: true });
    this.scrollEventContainer.addEventListener('touchstart', this.onInteractStart.bind(this), passiveIsSupported && { passive: true });
    this.scrollEventContainer.addEventListener('touchend', this.onInteractStop.bind(this), passiveIsSupported && { passive: true });
    this.scrollEventContainer.addEventListener('scroll', this.onScroll.bind(this), passiveIsSupported && { passive: true });
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
    this.onScroll();
  }

  onInteract() {
    clearTimeout(this.scrollTimeout);
    this.stopAnimation();
  }

  onScroll() {
    clearTimeout(this.scrollTimeout);

    if (this.isInteracting || this.animation) {
      return;
    }

    if (this.currentScrollOffset === this.scrollContainer.scrollTop) {
      return;
    }

    this.stopAnimation();

    this.scrollTimeout = setTimeout(this.findSnapTarget.bind(this), 50 + this.delay);
  }

  findSnapTarget() {
    const delta = this.scrollContainer.scrollTop - this.currentScrollOffset;
    this.currentScrollOffset = this.scrollContainer.scrollTop;

    const panelsInViewport = getElementsInContainerViewport(this.container, this.panelList);
    if (panelsInViewport.length === 0) {
      throw new Error('PanelSnap could not find a snappable panel, aborting.');
    }

    if (panelsInViewport.length > 1) {
      if (Math.abs(delta) < this.options.directionThreshold && this.activePanel) {
        this.snapToPanel(this.activePanel, delta > 0);
        return;
      }

      const targetIndex = delta > 0 ? 1 : panelsInViewport.length - 2;
      this.snapToPanel(panelsInViewport[targetIndex], delta < 0);
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
    this.snapToPanel(visiblePanel, delta > 0);
  }

  snapToPanel(panel, toBottom = false) {
    this.activatePanel(panel);

    if (!this.isEnabled) {
      return;
    }

    if (this.animation) {
      this.animation.stop();
    }

    const start = this.scrollContainer.scrollTop;
    const end = getTargetScrollTop(this.container, panel, toBottom);
    const duration = 300;

    this.animation = new Tweezer({ start, end, duration });

    this.animation.on('tick', (value) => {
      this.scrollContainer.scrollTop = value;
    });
    this.animation.on('done', () => {
      this.emit('snapStop', panel);
      this.clearAnimation();
    });

    this.emit('snapStart', panel);
    this.animation.begin();
  }

  stopAnimation() {
    if (!this.animation) {
      return;
    }

    this.animation.stop();
    this.clearAnimation();
  }

  clearAnimation() {
    this.currentScrollOffset = this.scrollContainer.scrollTop;
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

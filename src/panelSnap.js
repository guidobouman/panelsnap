import Tweezer from 'tweezer.js';

import {
  getScrollingElement,
  getTargetScrollTop,
  getElementsInContainerViewport,
  elementFillsContainer,
} from './utilities';

let INSTANCE_COUNTER = 0;

const defaultOptions = {
  container: document.body,
  panelSelector: '> section',
  offset: 0,
  directionThreshold: 50,
  delay: 0,
  slideSpeed: 200,
  easing: t => t,
  onSnapStart: e => e,
  onSnapFinish: e => e,
  onActivate: e => e,
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

    INSTANCE_COUNTER += 1;
    this.instanceIndex = INSTANCE_COUNTER;
    this.container.dataset.panelsnapId = this.instanceIndex;

    const panelQuery = `[data-panelsnap-id="${this.instanceIndex}"] ${this.options.panelSelector}`;
    this.panelList = Array.from(document.querySelectorAll(panelQuery));

    this.isEnabled = true;
    this.isMouseDown = false;
    this.animation = null;
    this.currentScrollOffset = this.scrollContainer.scrollTop;
    this.targetScrollOffset = this.currentScrollOffset;

    this.container.addEventListener('mouseup', this.onMouseUp.bind(this));
    this.container.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.scrollContainer.addEventListener('wheel', this.onWheel.bind(this), { passive: true });
  }

  onMouseDown() {
    this.stopAnimation();
    this.isMouseDown = true;
  }

  onMouseUp() {
    this.isMouseDown = false;

    if (this.currentScrollOffset !== this.scrollContainer.scrollTop) {
      this.findSnapTarget();
    }
  }

  onWheel() {
    clearTimeout(this.scrollTimeout);

    if (this.currentScrollOffset === this.scrollContainer.scrollTop) {
      return;
    }

    this.stopAnimation();

    this.scrollTimeout = setTimeout(this.findSnapTarget.bind(this), 50);
  }

  findSnapTarget() {
    const delta = this.scrollContainer.scrollTop - this.currentScrollOffset;
    this.currentScrollOffset = this.scrollContainer.scrollTop;

    if (Math.abs(delta) < this.options.directionThreshold && this.activePanel) {
      this.snapToPanel(this.activePanel);
      return;
    }

    const panelsInViewport = getElementsInContainerViewport(this.container, this.panelList);

    switch (panelsInViewport.length) {
      case 1:
        this.snapToPanel(panelsInViewport[0], delta < 0);
        break;
      case 2:
        this.snapToPanel(panelsInViewport[delta > 0 ? 1 : 0], delta < 0);
        break;
      default:
        throw new Error('PanelSnap could not find a snappable panel, aborting.');
    }
  }

  snapToPanel(panel, toBottom = false) {
    if (!this.isEnabled) {
      return;
    }

    this.activatePanel(panel);

    if (elementFillsContainer(this.container, panel)) {
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
    this.animation.on('stop', this.clearAnimation.bind(this));
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
    this.activePanel = panel;
  }
}

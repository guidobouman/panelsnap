import Tweezer from 'tweezer.js';

import {
  getScrollingElement,
  getTargetScrollTop,
  getElementsInContainerViewport,
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

    this.scrollTimeout = setTimeout(this.findSnapTarget.bind(this), 50);
  }

  findSnapTarget() {
    const delta = this.scrollContainer.scrollTop - this.currentScrollOffset;

    if (Math.abs(delta) < this.options.directionThreshold && this.activePanel) {
      this.snapToPanel(this.activePanel);
      return;
    }

    const panelsInViewport = getElementsInContainerViewport(this.container, this.panelList);

    console.log('snap!', this.currentScrollOffset, delta, panelsInViewport);

    this.currentScrollOffset = this.scrollContainer.scrollTop;
  }

  snapToPanel(panel) {
    if (!this.isEnabled) {
      return;
    }

    if (this.animation) {
      this.animation.stop();
    }

    this.currentScrollOffset = this.scrollContainer.scrollTop;
    this.targetScrollOffset = getTargetScrollTop(this.scrollContainer, panel);

    this.animation = new Tweezer({
      start: this.currentScrollOffset,
      end: this.targetScrollOffset,
    });

    this.animation.on('tick', this.updateScroll);
    this.animation.on('stop', this.clearAnimation);
    this.animation.start();
  }

  updateScroll(value) {
    this.scrollContainer.scrollTop = value;
  }

  stopAnimation() {
    if (!this.animation) {
      return;
    }

    this.animation.stop();
    this.clearAnimation();
  }

  clearAnimation() {
    this.currentScrollOffset = this.targetScrollOffset;
    this.animation = null;
  }
}

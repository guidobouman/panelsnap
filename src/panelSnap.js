import Tweezer from 'tweezer.js';

import {
  getScrollingElement,
  getTargetScrollTop,
} from './utilities';

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

    this.container = this.options.container;
    this.scrollingContainer = getScrollingElement(this.container);
    this.panelList = this.container.querySelectorAll(this.options.panelSelector);

    this.isEnabled = true;
    this.isMouseDown = false;
    this.animation = null;
    this.currentScrollOffset = this.scrollingContainer.scrollTop;
    this.targetScrollOffset = this.currentScrollOffset;
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
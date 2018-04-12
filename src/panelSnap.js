import { getScrollingElement } from './utilities';

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
}

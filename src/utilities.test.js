import { getScrollingElement, getTargetScrollTop } from './utilities';

describe('getScrolllingElement', () => {
  test('returns same element when container is not body', () => {
    const container = document.createElement('div');
    expect(getScrollingElement(container)).toBe(container);
  });

  test('returns scrollingElement when container is body on modern browser', () => {
    const container = document.body;
    const scrollContainer = document.createElement('div');
    document.scrollingElement = scrollContainer;
    expect(getScrollingElement(container)).toBe(scrollContainer);

    // TODO: Jest should clean this up...
    delete document.scrollingElement;
  });

  test('returns same element when container is body on WebKit browser', () => {
    Object.defineProperty(window.navigator, 'userAgent', { value: 'WebKit', configurable: true });
    const container = document.body;
    expect(getScrollingElement(container)).toBe(container);
  });

  test('returns document element when container is body on legacy browser', () => {
    Object.defineProperty(window.navigator, 'userAgent', { value: 'legacy browser', configurable: true });
    const container = document.body;
    const scrollContainer = document.documentElement;
    expect(getScrollingElement(container)).toBe(scrollContainer);
  });
});


describe('getTargetScrollTop', () => {
  function getElements(scrollTop, containerTop, targetTop) {
    const container = document.createElement('div');
    container.scrollTop = scrollTop;
    container.getBoundingClientRect = () => ({
      top: containerTop,
    });

    const target = document.createElement('div');
    target.getBoundingClientRect = () => ({
      top: targetTop,
    });

    return [container, target];
  }

  test('calculates scrollTop for target element', () => {
    expect(getTargetScrollTop(...getElements(0, 0, 0))).toEqual(0);
    expect(getTargetScrollTop(...getElements(100, 0, -100))).toEqual(0);
    expect(getTargetScrollTop(...getElements(100, 0, 0))).toEqual(100);
    expect(getTargetScrollTop(...getElements(0, 0, 100))).toEqual(100);
    expect(getTargetScrollTop(...getElements(100, 0, 100))).toEqual(200);
    expect(getTargetScrollTop(...getElements(100, 100, 100))).toEqual(100);
  });
});

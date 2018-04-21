import {
  getScrollingElement,
  getTargetScrollTop,
  getElementsInContainerViewport,
} from './utilities';

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

describe('getElementsInContainerViewport', () => {
  const SCREEN_WIDTH = 800;
  function getElements(scrollTop, amountOfElements, elementHeight) {
    return Array.from(Array(amountOfElements), (_, i) => {
      const target = document.createElement('div');
      target.getBoundingClientRect = () => ({
        top: (i * elementHeight) - scrollTop,
        bottom: ((i + 1) * elementHeight) - scrollTop,
        left: 0,
        right: SCREEN_WIDTH,
      });

      return target;
    });
  }

  test('finds elements in body viewport', () => {
    window.innerWidth = SCREEN_WIDTH;
    window.innerHeight = 600;
    const test1 = getElementsInContainerViewport(document.body, getElements(0, 5, 300));
    expect(test1).toHaveLength(2);

    const test2 = getElementsInContainerViewport(document.body, getElements(200, 5, 300));
    expect(test2).toHaveLength(3);

    const test3 = getElementsInContainerViewport(document.body, getElements(600, 3, 300));
    expect(test3).toHaveLength(1);
  });

  test('finds elements in non-body viewport', () => {
    const container = getElements(0, 1, 400)[0];

    const test1 = getElementsInContainerViewport(container, getElements(0, 5, 300));
    expect(test1).toHaveLength(2);
    const test2 = getElementsInContainerViewport(container, getElements(0, 5, 400));
    expect(test2).toHaveLength(1);
  });
});

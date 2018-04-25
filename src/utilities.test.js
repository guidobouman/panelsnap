import {
  getScrollingElement,
  getTargetScrollTop,
  getElementsInContainerViewport,
  elementFillsContainer,
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

  function getBodyElements(scrollTop, targetTop) {
    const container = document.body;
    getScrollingElement(document.body).scrollTop = scrollTop;

    const target = document.createElement('div');
    target.getBoundingClientRect = () => ({
      top: targetTop,
    });

    return [container, target];
  }

  test('calculates scrollTop for target element in body', () => {
    expect(getTargetScrollTop(...getBodyElements(0, 0))).toEqual(0);
    expect(getTargetScrollTop(...getBodyElements(100, -100))).toEqual(0);
    expect(getTargetScrollTop(...getBodyElements(100, 0))).toEqual(100);
    expect(getTargetScrollTop(...getBodyElements(0, 100))).toEqual(100);
    expect(getTargetScrollTop(...getBodyElements(100, 100))).toEqual(200);
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


describe('elementFillsContainer', () => {
  const SCREEN_WIDTH = 800;
  function getElement(top, bottom, left = 0, right = SCREEN_WIDTH) {
    const target = document.createElement('div');
    target.getBoundingClientRect = () => ({
      top, bottom, left, right,
    });

    return target;
  }

  test('checks element in body viewport', () => {
    window.innerWidth = SCREEN_WIDTH;
    window.innerHeight = 600;
    expect(elementFillsContainer(document.body, getElement(-100, 700))).toBe(true);
    expect(elementFillsContainer(document.body, getElement(0, 600))).toBe(true);
    expect(elementFillsContainer(document.body, getElement(1, 601))).toBe(false);
    expect(elementFillsContainer(document.body, getElement(-1, 599))).toBe(false);
  });

  test('checks element in non-body viewport', () => {
    const container = getElement(200, 500);
    expect(elementFillsContainer(container, getElement(100, 600))).toBe(true);
    expect(elementFillsContainer(container, getElement(200, 500))).toBe(true);
    expect(elementFillsContainer(container, getElement(201, 501))).toBe(false);
    expect(elementFillsContainer(container, getElement(99, 499))).toBe(false);
  });
});

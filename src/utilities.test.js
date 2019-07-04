import {
  getScrollingElement,
  getTargetScrollOffset,
  getElementsInContainerViewport,
  elementFillsContainer,
  passiveIsSupported,
} from './utilities';

const SCREEN_WIDTH = 800;
const SCREEN_HEIGHT = 600;

Object.defineProperty(document.documentElement, 'clientWidth', { value: SCREEN_WIDTH });
Object.defineProperty(document.documentElement, 'clientHeight', { value: SCREEN_HEIGHT });

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

describe('getTargetScrollOffset', () => {
  function testElements(options) {
    const {
      scrollOffset,
      containerDimensions,
      targetDimensions,
      expectedResult,
      toBottom,
      toRight,
    } = options;

    const container = document.createElement('div');
    container.scrollTop = scrollOffset.top;
    container.scrollLeft = scrollOffset.left;
    container.getBoundingClientRect = () => ({
      ...containerDimensions,
      height: containerDimensions.bottom - containerDimensions.top,
      width: containerDimensions.right - containerDimensions.left,
    });

    const target = document.createElement('div');
    target.getBoundingClientRect = () => ({
      ...targetDimensions,
      height: targetDimensions.bottom - targetDimensions.top,
      width: targetDimensions.right - targetDimensions.left,
    });

    expect(getTargetScrollOffset(container, target, !!toBottom, !!toRight)).toEqual(expectedResult);
  }

  test('calculates scrollOffset for target element', () => {
    testElements({
      scrollOffset: { top: 0, left: 0 },
      containerDimensions: { top: 0, left: 0 },
      targetDimensions: { top: 0, left: 0 },
      expectedResult: { top: 0, left: 0 },
    });

    testElements({
      scrollOffset: { top: 100, left: 100 },
      containerDimensions: { top: 0, left: 0 },
      targetDimensions: { top: -100, left: -100 },
      expectedResult: { top: 0, left: 0 },
    });

    testElements({
      scrollOffset: { top: 100, left: 100 },
      containerDimensions: { top: 0, left: 0 },
      targetDimensions: { top: 0, left: 0 },
      expectedResult: { top: 100, left: 100 },
    });

    testElements({
      scrollOffset: { top: 0, left: 0 },
      containerDimensions: { top: 0, left: 0 },
      targetDimensions: { top: 100, left: 100 },
      expectedResult: { top: 100, left: 100 },
    });

    testElements({
      scrollOffset: { top: 100, left: 100 },
      containerDimensions: { top: 0, left: 0 },
      targetDimensions: { top: 100, left: 100 },
      expectedResult: { top: 200, left: 200 },
    });

    testElements({
      scrollOffset: { top: 100, left: 100 },
      containerDimensions: { top: 100, left: 100 },
      targetDimensions: { top: 100, left: 100 },
      expectedResult: { top: 100, left: 100 },
    });
  });

  test('calculates scrollOffset for target element bottom', () => {
    testElements({
      scrollOffset: { top: 0, left: 0 },
      containerDimensions: {
        top: 0, bottom: 300, left: 0, right: 300,
      },
      targetDimensions: {
        top: 0, bottom: 300, left: 0, right: 300,
      },
      expectedResult: { top: 0, left: 0 },
      toBottom: true,
      toRight: true,
    });

    testElements({
      scrollOffset: { top: 100, left: 100 },
      containerDimensions: {
        top: 0, bottom: 300, left: 0, right: 300,
      },
      targetDimensions: {
        top: -100, bottom: 200, left: -100, right: 200,
      },
      expectedResult: { top: 0, left: 0 },
      toBottom: true,
      toRight: true,
    });

    testElements({
      scrollOffset: { top: 100, left: 100 },
      containerDimensions: {
        top: 0, bottom: 300, left: 0, right: 300,
      },
      targetDimensions: {
        top: 0, bottom: 300, left: 0, right: 300,
      },
      expectedResult: { top: 100, left: 100 },
      toBottom: true,
      toRight: true,
    });

    testElements({
      scrollOffset: { top: 0, left: 0 },
      containerDimensions: {
        top: 0, bottom: 300, left: 0, right: 300,
      },
      targetDimensions: {
        top: 100, bottom: 400, left: 100, right: 400,
      },
      expectedResult: { top: 100, left: 100 },
      toBottom: true,
      toRight: true,
    });

    testElements({
      scrollOffset: { top: 100, left: 100 },
      containerDimensions: {
        top: 0, bottom: 300, left: 0, right: 300,
      },
      targetDimensions: {
        top: 100, bottom: 400, left: 100, right: 400,
      },
      expectedResult: { top: 200, left: 200 },
      toBottom: true,
      toRight: true,
    });

    testElements({
      scrollOffset: { top: 100, left: 100 },
      containerDimensions: {
        top: 100, bottom: 400, left: 100, right: 400,
      },
      targetDimensions: {
        top: 100, bottom: 400, left: 100, right: 400,
      },
      expectedResult: { top: 100, left: 100 },
      toBottom: true,
      toRight: true,
    });
  });

  function testBodyElements(options) {
    const {
      scrollOffset,
      targetDimensions,
      expectedResult,
      toBottom,
      toRight,
    } = options;

    const container = document.body;
    getScrollingElement(document.body).scrollTop = scrollOffset.top;
    getScrollingElement(document.body).scrollLeft = scrollOffset.left;

    const target = document.createElement('div');
    target.getBoundingClientRect = () => ({
      ...targetDimensions,
      height: targetDimensions.bottom - targetDimensions.top,
      width: targetDimensions.right - targetDimensions.left,
    });

    expect(getTargetScrollOffset(container, target, !!toBottom, !!toRight)).toEqual(expectedResult);
  }

  test('calculates scrollOffset for target element in body', () => {
    testBodyElements({
      scrollOffset: { top: 0, left: 0 },
      targetDimensions: { top: 0, left: 0 },
      expectedResult: { top: 0, left: 0 },
    });

    testBodyElements({
      scrollOffset: { top: 100, left: 100 },
      targetDimensions: { top: -100, left: -100 },
      expectedResult: { top: 0, left: 0 },
    });

    testBodyElements({
      scrollOffset: { top: 100, left: 100 },
      targetDimensions: { top: 0, left: 0 },
      expectedResult: { top: 100, left: 100 },
    });

    testBodyElements({
      scrollOffset: { top: 0, left: 0 },
      targetDimensions: { top: 100, left: 100 },
      expectedResult: { top: 100, left: 100 },
    });

    testBodyElements({
      scrollOffset: { top: 100, left: 100 },
      targetDimensions: { top: 100, left: 100 },
      expectedResult: { top: 200, left: 200 },
    });
  });

  test('calculates scrollOffset for target element bottom in body', () => {
    testBodyElements({
      scrollOffset: { top: 0, left: 0 },
      targetDimensions: {
        top: 0,
        left: 0,
        bottom: SCREEN_HEIGHT,
        right: SCREEN_WIDTH,
      },
      expectedResult: { top: 0, left: 0 },
      toBottom: true,
      toRight: true,
    });

    testBodyElements({
      scrollOffset: { top: 100, left: 100 },
      targetDimensions: {
        top: -100,
        left: -100,
        bottom: SCREEN_HEIGHT - 100,
        right: SCREEN_WIDTH - 100,
      },
      expectedResult: { top: 0, left: 0 },
      toBottom: true,
      toRight: true,
    });

    testBodyElements({
      scrollOffset: { top: 100, left: 100 },
      targetDimensions: {
        top: 0,
        left: 0,
        bottom: SCREEN_HEIGHT,
        right: SCREEN_WIDTH,
      },
      expectedResult: { top: 100, left: 100 },
      toBottom: true,
      toRight: true,
    });


    testBodyElements({
      scrollOffset: { top: 0, left: 0 },
      targetDimensions: {
        top: 100,
        left: 100,
        bottom: SCREEN_HEIGHT + 100,
        right: SCREEN_WIDTH + 100,
      },
      expectedResult: { top: 100, left: 100 },
      toBottom: true,
      toRight: true,
    });

    testBodyElements({
      scrollOffset: { top: 100, left: 100 },
      targetDimensions: {
        top: 100,
        left: 100,
        bottom: SCREEN_HEIGHT + 100,
        right: SCREEN_WIDTH + 100,
      },
      expectedResult: { top: 200, left: 200 },
      toBottom: true,
      toRight: true,
    });
  });
});

describe('getElementsInContainerViewport', () => {
  function getElements(scrollOffset, amountOfElements, elementSize, horizontal = false) {
    return Array.from(Array(amountOfElements), (_, i) => {
      const target = document.createElement('div');
      const elementOffset = (i * elementSize) - scrollOffset;
      target.getBoundingClientRect = () => ({
        top: horizontal ? 0 : elementOffset,
        bottom: horizontal ? SCREEN_HEIGHT : elementOffset + elementSize,
        left: horizontal ? elementOffset : 0,
        right: horizontal ? elementOffset + elementSize : SCREEN_WIDTH,
      });

      return target;
    });
  }

  test('finds vertical elements in body viewport', () => {
    const test1 = getElementsInContainerViewport(document.body, getElements(0, 5, 300));
    expect(test1).toHaveLength(2);

    const test2 = getElementsInContainerViewport(document.body, getElements(200, 5, 300));
    expect(test2).toHaveLength(3);

    const test3 = getElementsInContainerViewport(document.body, getElements(600, 3, 300));
    expect(test3).toHaveLength(1);
  });

  test('finds horizontal elements in body viewport', () => {
    const test1 = getElementsInContainerViewport(document.body, getElements(0, 5, 400, true));
    expect(test1).toHaveLength(2);

    const test2 = getElementsInContainerViewport(document.body, getElements(200, 5, 400, true));
    expect(test2).toHaveLength(3);

    const test3 = getElementsInContainerViewport(document.body, getElements(800, 3, 400, true));
    expect(test3).toHaveLength(1);
  });

  test('finds vertical elements in non-body viewport', () => {
    const container = getElements(0, 1, 400)[0];

    const test1 = getElementsInContainerViewport(container, getElements(0, 5, 300));
    expect(test1).toHaveLength(2);

    const test2 = getElementsInContainerViewport(container, getElements(0, 5, 400));
    expect(test2).toHaveLength(1);
  });

  test('finds horizontal elements in non-body viewport', () => {
    const container = getElements(0, 1, 400, true)[0];

    const test1 = getElementsInContainerViewport(container, getElements(0, 5, 300, true));
    expect(test1).toHaveLength(2);

    const test2 = getElementsInContainerViewport(container, getElements(0, 5, 400, true));
    expect(test2).toHaveLength(1);
  });
});


describe('elementFillsContainer', () => {
  function getElement(top, bottom, left = 0, right = SCREEN_WIDTH) {
    const target = document.createElement('div');
    target.getBoundingClientRect = () => ({
      top, bottom, left, right,
    });

    return target;
  }

  test('checks element in body viewport', () => {
    expect(elementFillsContainer(document.body, getElement(-100, SCREEN_HEIGHT + 100))).toBe(true);
    expect(elementFillsContainer(document.body, getElement(0, SCREEN_HEIGHT))).toBe(true);
    expect(elementFillsContainer(document.body, getElement(1, SCREEN_HEIGHT + 1))).toBe(false);
    expect(elementFillsContainer(document.body, getElement(-1, SCREEN_HEIGHT - 1))).toBe(false);
  });

  test('checks element in non-body viewport', () => {
    const container = getElement(200, 500);
    expect(elementFillsContainer(container, getElement(100, 600))).toBe(true);
    expect(elementFillsContainer(container, getElement(200, 500))).toBe(true);
    expect(elementFillsContainer(container, getElement(201, 501))).toBe(false);
    expect(elementFillsContainer(container, getElement(99, 499))).toBe(false);
  });
});

describe('isPassiveSupported', () => {
  test('returns false in JSDOM', () => {
    expect(passiveIsSupported).toBe(false);
  });
});

import { getScrollingElement } from './utilities';

describe('getScrolllingElement', () => {
  test('returns same element when container is not body', () => {
    const container = document.createElement('div');
    expect(getScrollingElement(container)).toBe(container);
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

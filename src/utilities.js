export function getScrollingElement(container) {
  if (container !== document.body) {
    return container;
  }

  if ('scrollingElement' in document) {
    return document.scrollingElement;
  }

  // Fallback for legacy browsers
  if (navigator.userAgent.indexOf('WebKit') > -1) {
    return document.body;
  }

  return document.documentElement;
}

function getContainerRect(container) {
  return container === document.body ? {
    top: 0,
    left: 0,
    bottom: window.innerHeight,
    right: window.innerWidth,
    height: window.innerHeight,
    width: window.innerWidth,
  } : container.getBoundingClientRect();
}

export function getTargetScrollTop(container, element, toBottom = false) {
  const containerRect = getContainerRect(container);
  const elementRect = element.getBoundingClientRect();
  const scrollOffset = elementRect.top - containerRect.top;
  const offsetCorrection = toBottom ? elementRect.height - containerRect.height : 0;
  return scrollOffset + offsetCorrection + getScrollingElement(container).scrollTop;
}

export function getElementsInContainerViewport(container, elementList) {
  const containerRect = getContainerRect(container);

  return elementList.filter((element) => {
    const elementRect = element.getBoundingClientRect();

    return (
      elementRect.top < containerRect.bottom &&
      elementRect.right > containerRect.left &&
      elementRect.bottom > containerRect.top &&
      elementRect.left < containerRect.right
    );
  });
}

export function elementFillsContainer(container, element) {
  const containerRect = getContainerRect(container);
  const elementRect = element.getBoundingClientRect();

  return (
    elementRect.top <= containerRect.top &&
    elementRect.bottom >= containerRect.bottom &&
    elementRect.left <= containerRect.left &&
    elementRect.right >= containerRect.right
  );
}

// Taken from MDN
// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Safely_detecting_option_support
export const passiveIsSupported = (function () {
  let isSupported = false;

  try {
    const options = Object.defineProperty({}, 'passive', {
      get() { // eslint-disable-line getter-return
        isSupported = true;
      },
    });

    window.addEventListener('test', null, options);
    window.removeEventListener('test', null, options);
  } catch (e) {
    // Do nothing
  }

  return isSupported;
}());

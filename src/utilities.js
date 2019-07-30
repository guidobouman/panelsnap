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

export function getScrollEventContainer(container) {
  return container === document.body ? window : getScrollingElement(container);
}

function getContainerRect(container) {
  if (container === document.body) {
    const htmlElement = document.documentElement;
    return {
      top: 0,
      left: 0,
      bottom: htmlElement.clientHeight,
      right: htmlElement.clientWidth,
      height: htmlElement.clientHeight,
      width: htmlElement.clientWidth,
    };
  }

  return container.getBoundingClientRect();
}

export function getTargetScrollOffset(container, element, toBottom = false, toRight = false) {
  const containerRect = getContainerRect(container);
  const elementRect = element.getBoundingClientRect();
  const scrollTop = elementRect.top - containerRect.top;
  const scrollLeft = elementRect.left - containerRect.left;
  const topCorrection = toBottom ? elementRect.height - containerRect.height : 0;
  const leftCorrection = toRight ? elementRect.width - containerRect.width : 0;
  const scrollingElement = getScrollingElement(container);

  return {
    top: scrollTop + topCorrection + scrollingElement.scrollTop,
    left: scrollLeft + leftCorrection + scrollingElement.scrollLeft,
  };
}

export function getElementsInContainerViewport(container, elementList) {
  const containerRect = getContainerRect(container);

  return elementList.filter((element) => {
    const elementRect = element.getBoundingClientRect();

    return (
      elementRect.top < containerRect.bottom
      && elementRect.right > containerRect.left
      && elementRect.bottom > containerRect.top
      && elementRect.left < containerRect.right
    );
  });
}

export function elementFillsContainer(container, element) {
  const containerRect = getContainerRect(container);
  const elementRect = element.getBoundingClientRect();

  return (
    elementRect.top <= containerRect.top
    && elementRect.bottom >= containerRect.bottom
    && elementRect.left <= containerRect.left
    && elementRect.right >= containerRect.right
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

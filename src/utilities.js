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

export function getTargetScrollTop(container, element) {
  const elementTop = element.getBoundingClientRect().top;
  const containerTop = container.getBoundingClientRect().top;
  const scrollOffset = elementTop - containerTop;
  return scrollOffset + container.scrollTop;
}

export function getElementsInContainerViewport(container, elementList) {
  const containerRect = container === document.body ? {
    top: 0,
    left: 0,
    bottom: window.innerHeight,
    right: window.innerWidth,
  } : container.getBoundingClientRect();

  return elementList.filter((element) => {
    const elementRect = element.getBoundingClientRect();

    // Top inside viewport?
    if (elementRect.top >= containerRect.top && elementRect.top <= containerRect.bottom) {
      return true;
    }

    // Bottom inside viewport?
    if (elementRect.bottom >= containerRect.top && elementRect.bottom <= containerRect.bottom) {
      return true;
    }
    return false;
  });
}

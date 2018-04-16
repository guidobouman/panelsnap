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

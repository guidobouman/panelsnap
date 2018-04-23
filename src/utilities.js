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
  } : container.getBoundingClientRect();
}

export function getTargetScrollTop(container, element) {
  const containerRect = getContainerRect(container);
  const elementRect = element.getBoundingClientRect();
  const scrollOffset = elementRect.top - containerRect.top;
  return scrollOffset + getScrollingElement(container).scrollTop;
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

// Usage example
// const element = document.getElementById('scrollable-element')
// const cleanup = useScrollStartEndEvents(
//   element,
//   () => console.log('Scroll started'),
//   () => console.log('Scroll ended'),
// )

// To cleanup event listeners when no longer needed
// cleanup();

/**
 * Simulate a 'scrollstart' and 'scrollend' event by listening to scroll and debouncing the calls.
 *
 * The proposal to standardize part of this is https://github.com/w3c/csswg-drafts/issues/3744
 */
export function useScrollStartEndEvents(
  element,
  onScrollStart,
  onScrollEnd,
  debounceTimeMs = 60,
) {
  let isScrolling = false
  let scrollLeft = 0
  let scrollTop = 0
  let activeTimeout

  const onTimeout = () => {
    if (element === null) {
      return
    }

    if (element.scrollLeft === scrollLeft && element.scrollTop === scrollTop) {
      isScrolling = false
      activeTimeout = undefined
      if (onScrollEnd) onScrollEnd()
    } else {
      scrollLeft = element.scrollLeft
      scrollTop = element.scrollTop
      activeTimeout = setTimeout(onTimeout, debounceTimeMs)
    }
  }

  const onScroll = () => {
    if (element === null) {
      return
    }
    if (!isScrolling) {
      if (onScrollStart) onScrollStart()
      isScrolling = true
    }
    if (activeTimeout !== undefined) {
      clearTimeout(activeTimeout)
    }
    scrollLeft = element.scrollLeft
    scrollTop = element.scrollTop
    activeTimeout = setTimeout(onTimeout, debounceTimeMs)
  }

  element.addEventListener('scroll', onScroll)

  return () => {
    element.removeEventListener('scroll', onScroll)
    if (activeTimeout !== undefined) {
      clearTimeout(activeTimeout)
    }
  }
}

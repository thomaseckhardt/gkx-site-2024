export function carousel(options) {
  const { enableMouseNavigation = false } = options ?? {}

  return {
    $root: undefined as any,
    carousel: undefined as any,
    activeElem: undefined as any,
    getActiveIndex() {
      const elementGap = parseInt(
        window.getComputedStyle(this.carousel).columnGap,
      )
      const scrollPosition = this.carousel.scrollLeft
      const elementWidth = this.carousel.children?.[0]?.offsetWidth ?? 0
      const middleElementIndex = Math.floor(
        (scrollPosition + window.innerWidth / 2 - elementWidth / 2) /
          (elementWidth + elementGap),
      )

      return middleElementIndex
    },
    getActiveElement() {
      const index = this.getActiveIndex()

      return this.carousel.children?.[index]
    },
    setActiveElement(activeElem) {
      if (activeElem && this.activeElem !== activeElem) {
        if (this.activeElem) {
          this.activeElem.classList.remove('active')
        }
        this.activeElem = activeElem
        this.activeElem.classList.add('active')
      }
    },
    init() {
      const carousel = this.$root.querySelector('[data-carousel-track]')
      if (!carousel) return
      this.carousel = carousel

      this.carousel.addEventListener('scroll', () => {
        const activeElem = this.getActiveElement()
        this.setActiveElement(activeElem)
      })
      this.carousel.addEventListener('scrollend', () => {
        this.carousel.classList.add('snap-mandatory', 'snap-x')
      })
      this.setActiveElement(this.getActiveElement())

      if (enableMouseNavigation) {
        this.$root.addEventListener('mousemove', (event) => {
          if (event.clientX > this.$root.clientWidth / 2) {
            this.$root.classList.replace('cursor-left', 'cursor-right')
          } else {
            this.$root.classList.replace('cursor-right', 'cursor-left')
          }
        })
        this.$root.addEventListener('click', (event) => {
          if (event.clientX > this.$root.clientWidth / 2) {
            this.next()
          } else {
            this.prev()
          }
        })
      }
    },
    prev() {
      this.scrollDir(-1)
    },
    next() {
      this.scrollDir(1)
    },
    scrollDir(dir) {
      if (!dir) return
      const carouselStyle = window.getComputedStyle(this.carousel)
      const slideWidth = this.carousel.children?.[0]?.offsetWidth ?? 0
      const slideGap = parseInt(carouselStyle.getPropertyValue('column-gap'))
      const scrollDist = (slideWidth + slideGap) * dir
      const scrollLeft = this.carousel.scrollLeft + scrollDist

      this.carousel.classList.remove('snap-mandatory', 'snap-x')

      this.carousel.scrollTo({
        left: scrollLeft,
        behavior: 'smooth',
      })
    },
    scrollToIndex(index) {
      if (index < 0) return
      if (index > this.carousel.children.length - 1) return
      const carouselStyle = window.getComputedStyle(this.carousel)
      const carouselRect = this.carousel.getBoundingClientRect()
      const scrollPadding =
        parseInt(carouselStyle.getPropertyValue('scroll-padding-left')) +
        parseInt(carouselStyle.getPropertyValue('scroll-padding-right'))
      const scrollDist = carouselRect.width - scrollPadding
      const elementGap = parseInt(carouselStyle.columnGap)

      const elementWidth = this.carousel.children?.[0]?.offsetWidth ?? 0
      const padding = parseInt(carouselStyle.scrollPaddingInlineStart)
      const scrollLeft = (elementGap + elementWidth) * index - 1

      this.carousel.classList.remove('snap-mandatory', 'snap-x')

      this.carousel.scrollTo({
        left: scrollLeft,
        behavior: 'smooth',
      })
    },
  }
}

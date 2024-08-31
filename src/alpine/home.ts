import type { AlpineComponent } from 'alpinejs'

interface HomeComponent {
  initThumbnails: () => void
}

export function home(): AlpineComponent<HomeComponent> {
  const component: AlpineComponent<HomeComponent> = {
    initThumbnails() {
      const elem = this.$refs.thumbnails
      if (!elem) return

      const splide = new Splide(elem, {
        arrows: false,
        pagination: false,
        drag: true,
        autoWidth: true,
        type: 'loop',
        snap: true,
        trimSpace: false,
        focus: 'center',
        gap: '0.125rem',
      })

      splide.on('overflow', function (isOverflow) {
        console.log('overflow', isOverflow)
        // Reset the carousel position
        // splide.go(5)

        splide.options = {
          drag: isOverflow,
          clones: isOverflow ? undefined : 0, // Toggle clones
        }
      })

      splide.mount()
      setTimeout(() => {
        splide.go(5)
      }, 1000)
    },

    init() {
      console.log('Home component initialized')
      this.initThumbnails()
    },
  }

  return component
}

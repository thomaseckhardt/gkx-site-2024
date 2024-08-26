import type { AlpineComponent } from 'alpinejs'

interface HeroComponent {
  carousel: HTMLElement | undefined
}

export function hero(): AlpineComponent<HeroComponent> {
  const component: AlpineComponent<HeroComponent> = {
    carousel: undefined,
    init() {
      this.carousel = new Splide(this.$refs.carousel, {
        rewind: false,
        pagination: false,
        // autoplay: true,
        interval: 5000,
        pauseOnHover: false,
        pauseOnFocus: true,
        // MouseWheel Support
        // https://splidejs.com/guides/options/#wheel
        // waitForTransition: true,
        // wheel: true,
        // classes: {
        //   // Add classes for arrows.
        //   arrows: 'splide__arrows your-class-arrows',
        //   arrow: 'splide__arrow your-class-arrow',
        //   prev: 'splide__arrow--prev your-class-prev',
        //   next: 'splide__arrow--next your-class-next',

        //   // Add classes for pagination.
        //   pagination: 'splide__pagination your-class-pagination', // container
        //   page: 'splide__pagination__page your-class-page', // each button
        // },
      }).mount()
    },
  }

  return component
}

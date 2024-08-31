// import collapse from '@alpinejs/collapse'
// import persist from '@alpinejs/persist'
import type { Alpine } from 'alpinejs'
import { carousel } from '@/alpine/carousel'
import { hero } from '@/alpine/hero'
import { home } from '@/alpine/home'
// import * as bodyScrollLock from 'body-scroll-lock'

export default (Alpine: Alpine) => {
  // Alpine.plugin(collapse)
  // Alpine.plugin(persist)

  Alpine.data('home', home)
  Alpine.data('carousel', carousel)
  Alpine.data('hero', hero)

  type UiStore = {
    navOpen: boolean
    toggleNav(force?: boolean): void
  }

  Alpine.store('ui', {
    navOpen: false,
    toggleNav(force: boolean) {
      this.navOpen = force ?? !this.navOpen
    },
  } as UiStore)
}

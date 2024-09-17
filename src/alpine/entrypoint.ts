// import collapse from '@alpinejs/collapse'
// import persist from '@alpinejs/persist'
import type { Alpine } from 'alpinejs'
import { carousel } from '@/alpine/carousel'
import { hero } from '@/alpine/hero'
import { home } from '@/alpine/home'
import { project } from '@/alpine/project'
// import * as bodyScrollLock from 'body-scroll-lock'

/* The following plugin is a Club GSAP perk */
// import { InertiaPlugin } from 'gsap/InertiaPlugin'

// import { gsap } from 'gsap'
// import { Draggable } from 'gsap/Draggable'
// import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
// import { ScrollTrigger } from 'gsap/ScrollTrigger'

export type UiStore = {
  navOpen: boolean
  toggleNav(force?: boolean): void
  infoOpen: boolean
  toggleInfo(force?: boolean): void
  heroActive: boolean
  toggleHeroActive(force?: boolean): void
}

export default (Alpine: Alpine) => {
  // gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, Draggable)

  // Alpine.plugin(collapse)
  // Alpine.plugin(persist)

  Alpine.data('carousel', carousel)
  Alpine.data('hero', hero)
  Alpine.data('home', home)
  Alpine.data('project', project)

  Alpine.store('ui', {
    navOpen: false,
    toggleNav(force: boolean) {
      this.navOpen = force ?? !this.navOpen
    },
    infoOpen: false,
    toggleInfo(force: boolean) {
      this.infoOpen = force ?? !this.infoOpen
    },
    heroActive: true,
    toggleHeroActive(force: boolean) {
      this.heroActive = force ?? !this.heroActive
    },
  } as UiStore)
}

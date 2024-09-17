import { useScrollStartEndEvents } from '@/utils/useScrollStartEndEvents'
import type { AlpineComponent } from 'alpinejs'
import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { UiStore } from './entrypoint'

gsap.registerPlugin(ScrollTrigger)
gsap.registerPlugin(ScrollToPlugin)

interface ProjectComponent {
  openInfo: () => void
  closeInfo: () => void
  handleScroll: () => void
  handleScrollStart: () => void
  handleScrollEnd: () => void
  heroActive: boolean
  scrollActive: boolean
}

export function project(): AlpineComponent<ProjectComponent> {
  let lastScrollY = 0
  let scrollDir = 1
  const component: AlpineComponent<ProjectComponent> = {
    scrollActive: false,
    heroActive: true,
    openInfo: function () {
      if (this.$refs.info) {
        this.$refs.info.scrollIntoView({
          behavior: 'smooth',
        })
      }
    },
    closeInfo: function () {
      console.log('close info')
      window.scroll({
        top: 0,
        behavior: 'smooth',
      })
    },
    init() {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.x-info',
          start: '0 100%',
          end: '0 50%',
          scrub: 1,
        },
      })

      const hero = gsap.timeline({
        scrollTrigger: {
          trigger: '.x-info',
          start: 'top 100%',
          end: 'top 0%',
          scrub: 1,
        },
      })
      hero.to('.x-hero-inner', {
        y: -100,
        ease: 'none',
      })

      window.addEventListener('scroll', this.handleScroll)
      useScrollStartEndEvents(
        window,
        this.handleScrollStart,
        this.handleScrollEnd,
      )

      const ui = Alpine.store('ui') as UiStore
      this.ui = ui
    },
    handleScroll() {
      const currentScrollY = window.scrollY
      scrollDir = currentScrollY > lastScrollY ? 1 : -1
      lastScrollY = currentScrollY

      const ui = Alpine.store('ui') as UiStore
      if (ui.heroActive) {
        ui.toggleHeroActive(false)
        console.log('-> ui.heroActive = false')
      }
      component.scrollActive = true
    },
    handleScrollStart() {
      console.log('scroll START')
      component.scrollActive = true
      // if (window.scrollY > 1 && window.scrollY < window.innerHeight - 10) {
      //   console.log('scroll START do something')
      // }
    },
    handleScrollEnd() {
      console.log('scroll END')
      component.scrollActive = false
      if (window.scrollY >= 0 && window.scrollY < window.innerHeight - 10) {
        console.log('scroll END do something')
        // const scrollTo =
        //   window.scrollY > window.innerHeight * 0.5 ? window.innerHeight : 0
        const scrollTo = scrollDir > 0 ? window.innerHeight : 0
        const onComplete =
          scrollTo === 0
            ? () => {
                const ui = Alpine.store('ui') as UiStore
                ui.toggleHeroActive(true)
                console.log('-> ui.heroActive = true')
              }
            : undefined
        gsap.to(window, {
          scrollTo: scrollTo,
          duration: 0.25,
          ease: 'power2.out',
          onComplete,
        })
      }
    },
  }

  return component
}

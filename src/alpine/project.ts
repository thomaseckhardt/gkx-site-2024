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
}

export function project(): AlpineComponent<ProjectComponent> {
  // const beforeCleanupElementHandler = (event) => {
  //   console.log('htmx:beforeCleanupElement', event.target)
  //   // this.$root.querySelectorAll('video').forEach((video) => {
  //   //   if (video.player) {
  //   //     video.player.pause()
  //   //     video.player.destroy()
  //   //     video.player = null
  //   //   } else {
  //   //     video.pause()
  //   //   }
  //   // })
  // }

  const component: AlpineComponent<ProjectComponent> = {
    destroy() {
      console.log('destroy project', this.$root.dataset.slug, this.handleScroll)
      window.removeEventListener('scroll', this.handleScroll)
    },
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

      const ui = Alpine.store('ui') as UiStore
      this.ui = ui

      // this.$root.addEventListener(
      //   'htmx:beforeCleanupElement',
      //   beforeCleanupElementHandler,
      // )
    },
    handleScroll() {
      const scrollTop = window.scrollY
      const ui = Alpine.store('ui') as UiStore
      if (scrollTop > 10 && ui.heroActive) {
        ui.toggleHeroActive(false)
      }
      if (scrollTop < 10 && !ui.heroActive) {
        ui.toggleHeroActive(true)
      }
    },
  }

  return component
}

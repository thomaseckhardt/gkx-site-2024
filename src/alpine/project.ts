import { useScrollStartEndEvents } from '@/utils/useScrollStartEndEvents'
import type { AlpineComponent } from 'alpinejs'
import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
gsap.registerPlugin(ScrollToPlugin)

interface ProjectComponent {
  openInfo: () => void
  closeInfo: () => void
  handleScroll: () => void
  handleScrollStart: () => void
  handleScrollEnd: () => void
}

export function project(): AlpineComponent<ProjectComponent> {
  let lastScrollY = 0
  let scrollDir = 1
  const component: AlpineComponent<ProjectComponent> = {
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

      tl.to('.x-backdrop', {
        opacity: 1,
        ease: 'none',
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
    },
    handleScroll() {
      const currentScrollY = window.scrollY
      scrollDir = currentScrollY > lastScrollY ? 1 : -1
      lastScrollY = currentScrollY
    },
    handleScrollStart() {
      const allVideos = document.querySelectorAll(
        '.x-hero video',
      ) as unknown as HTMLVideoElement[]
      allVideos.forEach((video) => {
        video.pause()
      })
    },
    handleScrollEnd() {
      if (window.scrollY > 1 && window.scrollY < window.innerHeight - 10) {
        // const scrollTo =
        //   window.scrollY > window.innerHeight * 0.5 ? window.innerHeight : 0
        const scrollTo = scrollDir > 0 ? window.innerHeight : 0
        gsap.to(window, {
          scrollTo: scrollTo,
          duration: 0.25,
          ease: 'power2.out',
        })
      }
    },
  }

  return component
}

import type { AlpineComponent } from 'alpinejs'
import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
gsap.registerPlugin(ScrollToPlugin)

interface ProjectComponent {
  openInfo: () => void
  closeInfo: () => void
}

export function project(): AlpineComponent<ProjectComponent> {
  const component: AlpineComponent<ProjectComponent> = {
    openInfo: function () {
      if (this.$refs.info) {
        this.$refs.info.scrollIntoView({
          behavior: 'smooth',
        })
      }
    },
    closeInfo: function () {
      this.$root.scroll({
        top: 0,
        behavior: 'smooth',
      })
    },
    init() {
      console.log('Project component initialized')

      const info = document.querySelector('.x-info')

      const tl = gsap.timeline({
        scrollTrigger: {
          scroller: '.x-main',
          // markers: true,
          trigger: '.x-info',
          start: '0 100%',
          end: '0 50%',
          scrub: 1,
          // snap: {
          //       snapTo: 'labels', // snap to the closest label in the timeline
          //       duration: { min: 0.2, max: 3 }, // the snap animation should be at least 0.2 seconds, but no more than 3 seconds (determined by velocity)
          //       delay: 0.2, // wait 0.2 seconds from the last scroll event before doing the snapping
          //       ease: 'power1.inOut' // the ease of the snap animation ("power3" by default)
          //   }
          // onEnter: () => {
          //   console.log('enter')
          // },
          // onEnterBack: () => {
          //   console.log('enter back')
          //   info?.classList.replace('overflow-y-auto', 'overflow-y-hidden')
          // },
          // onLeave: () => {
          //   console.log('leave')
          //   info?.classList.replace('overflow-y-hidden', 'overflow-y-auto')
          // },
        },
      })

      tl.to('.x-backdrop', {
        opacity: 1,
        ease: 'none',
      })
      // tl.to(
      //   '.x-info-open',
      //   {
      //     opacity: 0,
      //     ease: 'none',
      //   },
      //   0,
      // )

      const hero = gsap.timeline({
        scrollTrigger: {
          scroller: '.x-main',
          trigger: '.x-info',
          start: 'top 100%',
          end: 'top 0%',
          scrub: true,
        },
      })
      hero.to('.x-hero-inner', {
        y: -100,
        ease: 'none',
      })
    },
  }

  return component
}

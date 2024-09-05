import type { AlpineComponent } from 'alpinejs'
import type { init } from 'astro/virtual-modules/prefetch.js'
import { gsap } from 'gsap'
import { Draggable } from 'gsap/Draggable'
import { InertiaPlugin } from 'gsap/InertiaPlugin'

interface HomeComponent {
  initThumbnails: () => void
  initCarousel: () => void
  navigateTo: (slug: string) => void
  startPageTransition: (url: string) => void
}

export function home(): AlpineComponent<HomeComponent> {
  const dragDistancePerRotation = 3000
  const progressWrap = gsap.utils.wrap(0, 1)
  let startProgress = 0
  let proxy: HTMLElement | undefined = undefined
  let spin: GSAPTween | undefined = undefined
  let thumbsTween: GSAPTween | undefined = undefined

  function updateRotation() {
    // console.log('rotation', this.rotation)
    // let p = startProgress + (this.startX - this.x) / dragDistancePerRotation
    if (spin) {
      // spin?.progress(progressWrap(p))
      let p = this.rotation / 360
      spin?.progress(progressWrap(p))
    }
  }

  const component: AlpineComponent<HomeComponent> = {
    startPageTransition(url) {
      const hero = this.$refs.hero
      const card = document.querySelector(`[data-card="${url}"]`) as HTMLElement

      if (!card || !hero) {
        console.warn('card or hero not defined', card, hero)
        return
      }

      const cardContent = card
        .querySelector('a')
        ?.cloneNode(true) as HTMLImageElement
      if (cardContent) {
        cardContent.classList.add('pointer-events-none')
        hero.appendChild(cardContent)
      }
      const heroText = hero.querySelector('.x-home__text')
      const heroImage = hero.querySelector('img')

      const cardRect = card.getBoundingClientRect()
      const startDelay = 0.12
      const tl = gsap.timeline({
        onComplete: () => {
          window.location.href = url
        },
      })
      tl.to(
        heroText,
        {
          opacity: 0,
          duration: 0.4,
          y: '100%',
        },
        startDelay,
      )
      tl.to(
        heroImage,
        {
          borderRadius: 0,
          duration: 1,
        },
        startDelay,
      )
      tl.fromTo(
        hero,
        {
          x: cardRect.left,
          y: cardRect.top,
          width: cardRect.width,
          height: cardRect.height,
        },
        {
          x: 0,
          y: 0,
          width: window.innerWidth,
          height: window.innerHeight,
          duration: 1,
          ease: 'power4.out',
          borderRadius: 0,
        },
        startDelay,
      )
    },
    navigateTo: function (url) {
      console.log('navigate to', url)
      const component = this
      const card = document.querySelector(`[data-card="${url}"]`) as HTMLElement
      const carousel = this.$refs.carousel
      if (!card) {
        console.warn('card not defined', card)
        return
      }

      const index = Number(card.getAttribute('data-index'))
      const rotation = Number(gsap.getProperty(carousel, 'rotationY'))
      const total = parseInt(carousel.dataset.total ?? '0')
      const indexOfRotation = gsap.utils.mapRange(0, 360, 0, total, rotation)
      const diff = Math.abs(index - Math.abs(indexOfRotation))
      // console.log('index', index, total, rotation, indexOfRotation, diff)

      if (spin && diff > 0.05) {
        // const dir = indexOfRotation > 0 ? 1 : -1
        // TODO: Take current rotation into account
        const duration = Math.max(0.6, Math.min(0.2 * diff, 2))
        console.log('duration', duration)
        gsap.to(spin, {
          progress: index,
          duration,
          ease: 'sine.inOut',
          onComplete: () => {
            component.startPageTransition(url)
          },
        })
      } else {
        component.startPageTransition(url)
      }
    },
    initCarousel() {
      const carousel = document.querySelector('.x-home__carousel')
      if (!carousel) return

      const slides: HTMLElement[] = gsap.utils.toArray(
        carousel.querySelectorAll('.x-home__carousel-item'),
      )
      const thumbs: HTMLElement[] = gsap.utils.toArray(
        document.querySelectorAll('.x-home__thumb'),
      )
      const thumbsContainer: HTMLElement[] = gsap.utils.toArray(
        document.querySelectorAll('.x-home__nav'),
      )
      const total = slides.length
      const half = total / 2

      // thumbsTween = gsap.to(thumbs, {
      //   x: '-100%',
      // })
      // thumbsTween.pause()

      spin = gsap.fromTo(
        carousel,
        {
          rotationY: (i) => (i * 360) / total,
        },
        {
          rotationY: '-=360',
          duration: 10,
          ease: 'none',
          // repeat: -1,
          // transformOrigin: '50% 50% ' + -radius + 'px',
          onUpdate: () => {
            const progress = spin?.progress() ?? 0

            slides.forEach((slide, index) => {
              const progressIndex =
                (((index - progress * total) % total) + total) % total
              const depth = 1 - Math.abs(progressIndex - half) / half
              slide.style.setProperty('--depth', `${depth}`)
            })

            thumbs.forEach((elem, index) => {
              const indexDiff = parseFloat(
                (index - progress * total).toFixed(4),
              )
              // Clamp indexDiff between -1 and 1
              const scale = Math.max(-1, Math.min(1, indexDiff))

              elem.style.setProperty('--ratio', `${indexDiff}`)
              elem.style.setProperty('--scale', `${scale}`)
              elem.style.setProperty('--scaleAbs', `${Math.abs(scale)}`)
              elem.style.setProperty('--index', `${Math.round(indexDiff)}`)
            })

            gsap.set(thumbsContainer, {
              x: `${-progress * 100}%`,
            })
          },
        },
      )
      spin.pause()

      proxy = document.createElement('div')

      Draggable.create(proxy, {
        trigger: '.x-home__carousel', // activate the dragging when the user presses on the .demoWrapper
        type: 'rotation', // we only care about movement on the x-axis.
        inertia: true,
        snap: function (value) {
          const degree = 360 / total
          const snap = Math.round(value / degree) * degree
          return snap
        },
        allowNativeTouchScrolling: true,
        onPress() {
          gsap.killTweensOf(this.spin) // if it's in the middle of animating the spin back to timeScale: 1, kill that.
          spin?.timeScale(0) // stop the spin.
          startProgress = spin?.progress() ?? 0 // remember the current progress value because we'll make the drag relative to that.
        },
        onDrag: updateRotation,

        onThrowUpdate: updateRotation,
        // onRelease() {
        //   if (!this.tween || !this.tween.isActive()) {
        //     // if the user clicked and released (no inertia flick), resume the spin
        //     if (spin) {
        //       gsap.to(spin, { timeScale: 1, duration: 1 })
        //     }
        //   }
        // },
        // onThrowComplete() {
        //   // resume the spin after the inertia tween finishes
        //   if (spin) {
        //     gsap.to(spin, { timeScale: 1, duration: 1 })
        //   }
        // },
        // Alternative to inertia
        // onDragEnd: function () {
        //   const p = progressWrap(
        //     startProgress + (this.startX - this.x) / dragDistancePerRotation,
        //   )
        //   const snap = p / total
        //   gsap.to(carousel, {
        //     rotationY: gsap.utils.snap(360 / total, this.x),
        //   })
        // },
      })

      // OLD

      // const rotation = gsap.to(carousel, {
      //   '--progress': 1,
      //   rotateY: -360,
      //   duration: 24,
      //   repeat: -1,
      //   ease: 'none',
      //   onUpdate: (props) => {
      //     const progress = rotation.progress()

      //     slides.forEach((slide, index) => {
      //       const progressIndex =
      //         (((index - progress * total) % total) + total) % total
      //       const depth = 1 - Math.abs(progressIndex - half) / half
      //       slide.style.setProperty('--depth', `${depth}`)
      //     })
      //   },
      // })
    },
    initThumbnails() {
      const elem = this.$refs.thumbnails
      if (!elem) return

      // const splide = new Splide(elem, {
      //   arrows: false,
      //   pagination: false,
      //   drag: true,
      //   autoWidth: true,
      //   type: 'loop',
      //   snap: true,
      //   trimSpace: false,
      //   focus: 'center',
      //   gap: '0.125rem',
      // })

      // splide.on('overflow', function (isOverflow) {
      //   console.log('overflow', isOverflow)
      //   // Reset the carousel position
      //   // splide.go(5)

      //   splide.options = {
      //     drag: isOverflow,
      //     clones: isOverflow ? undefined : 0, // Toggle clones
      //   }
      // })

      // splide.on('move', function () {
      //   console.log('move', splide.index)
      // })

      // splide.mount()
      // setTimeout(() => {
      //   splide.go(5)
      // }, 1000)
    },

    init() {
      console.log('Home component initialized')
      gsap.registerPlugin(Draggable, InertiaPlugin)

      this.initCarousel()
      this.initThumbnails()
    },
  }

  return component
}

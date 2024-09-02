import type { AlpineComponent } from 'alpinejs'
import { gsap } from 'gsap'
import { Draggable } from 'gsap/Draggable'
// import { InertiaPlugin } from 'gsap/InertiaPlugin'

interface HomeComponent {
  initThumbnails: () => void
  initCarousel: () => void
}

export function home(): AlpineComponent<HomeComponent> {
  const dragDistancePerRotation = 3000
  const progressWrap = gsap.utils.wrap(0, 1)
  let startProgress = 0
  let proxy: HTMLElement | undefined = undefined
  let spin: GSAPTween | undefined = undefined

  function updateRotation() {
    let p = startProgress + (this.startX - this.x) / dragDistancePerRotation
    if (spin) {
      spin?.progress(progressWrap(p))
    }
  }

  const component: AlpineComponent<HomeComponent> = {
    initCarousel() {
      const carousel = document.querySelector('.x-home__carousel')
      if (!carousel) return

      const slides: HTMLElement[] = gsap.utils.toArray(
        carousel.querySelectorAll('.x-home__carousel-item'),
      )
      const total = slides.length
      const half = total / 2

      spin = gsap.fromTo(
        carousel,
        {
          rotationY: (i) => (i * 360) / total,
        },
        {
          rotationY: '-=360',
          duration: 20,
          ease: 'none',
          repeat: -1,
          // transformOrigin: '50% 50% ' + -radius + 'px',
          onUpdate: () => {
            const progress = spin?.progress() ?? 0

            slides.forEach((slide, index) => {
              const progressIndex =
                (((index - progress * total) % total) + total) % total
              const depth = 1 - Math.abs(progressIndex - half) / half
              slide.style.setProperty('--depth', `${depth}`)
            })
          },
        },
      )
      spin.pause()

      proxy = document.createElement('div')

      Draggable.create(proxy, {
        trigger: '.x-home__carousel', // activate the dragging when the user presses on the .demoWrapper
        type: 'x', // we only care about movement on the x-axis.
        // inertia: true,
        snap: {
          x: function (value) {
            console.log(value)
            let p = progressWrap(
              startProgress + value / dragDistancePerRotation,
            )
            //snap to the closest increment of 10.
            return p / total
          },
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
      gsap.registerPlugin(Draggable)

      this.initCarousel()
      this.initThumbnails()
    },
  }

  return component
}

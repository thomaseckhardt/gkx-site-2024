import type { AlpineComponent } from 'alpinejs'
import { gsap, Power2, Power3, Back, Linear } from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { Draggable } from 'gsap/Draggable'
import { InertiaPlugin } from 'gsap/InertiaPlugin'

const Power2InOutBack = CustomEase.create(
  'custom',
  'M0,0 C0.173,0 0.242,0.036 0.322,0.13 0.401,0.223 0.449,0.367 0.502,0.506 0.546,0.622 0.62,0.824 0.726,0.916 0.799,0.98 0.869,1.041 1,1 ',
)

interface HomeComponent {
  initCarousel: () => void
  navigateTo: (slug: string) => void
  startPageTransition: (url: string) => void
  prev: () => void
  next: () => void
  getRotationIndex: () => number
  spinToIndex: (index: number, onCompleteCallback?: () => void) => void
  rotateTo: (dir: -1 | 1) => void
  getIndexOfRotation: (round?: boolean) => number
  initIntroAnimation: () => void
}

export function home(): AlpineComponent<HomeComponent> {
  const progressWrap = gsap.utils.wrap(0, 1)
  let proxy: HTMLElement = document.createElement('div')
  let spin: GSAPTween | undefined = undefined
  let total: number = 0
  let totalHalf: number = 0
  let angle: number = 0
  let carousel: HTMLElement | undefined = undefined
  let cards: HTMLElement[] = []
  let thumbs: HTMLElement[] = []

  function updateRotation() {
    // console.log('rotation', this.rotation)
    // let p = startProgress + (this.startX - this.x) / dragDistancePerRotation
    if (spin) {
      // spin?.progress(progressWrap(p))
      let rotation = Number(gsap.getProperty(proxy, 'rotation'))
      let p = rotation / 360
      spin?.progress(progressWrap(p))
    }

    // var progressWrap = gsap.utils.wrap(0, 1)
    // animation.progress(progressWrap(gsap.getProperty(proxy, 'x') / wrapWidth))
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
    navigateTo: function (url, open = true) {
      console.log('navigate to', url, open)
      const component = this
      const card = document.querySelector(`[data-card="${url}"]`) as HTMLElement

      const index = Number(card.getAttribute('data-index'))
      const indexOfRotation = this.getIndexOfRotation(false)
      const diff = Math.abs(index - Math.abs(indexOfRotation))
      console.log('navigateTo', index, indexOfRotation, diff)

      if (!open) {
        this.spinToIndex(index)
      } else {
        if (spin && diff > 0.05) {
          this.spinToIndex(index, () => {
            component.startPageTransition(url)
          })
        } else {
          component.startPageTransition(url)
        }
      }
    },
    getIndexOfRotation(round = true) {
      const currentRotation = Number(gsap.getProperty(proxy, 'rotation')) % 360
      let indexOfRotation = gsap.utils.mapRange(
        0,
        360,
        0,
        total,
        currentRotation,
      )
      if (indexOfRotation < 0) {
        indexOfRotation = total + indexOfRotation
      }

      return round ? Math.round(indexOfRotation) : indexOfRotation
    },
    spinToIndex(index: number, onCompleteCallback?: () => void) {
      const indexOfRotation = this.getIndexOfRotation(true)
      const indexDiff = index - indexOfRotation
      const rotationChange = indexDiff * angle

      const currentRotation = Number(gsap.getProperty(proxy, 'rotation'))
      const rotationNormalized = currentRotation % 360
      const rotationRest = currentRotation - rotationNormalized

      const targetRotation = rotationChange + currentRotation
      const duration = Math.max(0.6, Math.min(0.2 * indexDiff, 2))
      console.log('spinToIndex', {
        index,
        indexDiff,
        indexOfRotation,
        rotationChange,
        currentRotation,
        rotationRest,
        targetRotation,
      })

      gsap.killTweensOf(proxy)
      gsap.to(proxy, {
        rotation: targetRotation,
        duration: duration,
        ease: 'sine.inOut',
        onUpdate: updateRotation,
        onComplete: onCompleteCallback,
      })
    },
    getRotationIndex() {
      const carousel = this.$refs.carousel
      const rotation = Number(gsap.getProperty(carousel, 'rotationY')) % 360
      const total = parseInt(this.total ?? '0')
      const indexOfRotation = gsap.utils.mapRange(
        0,
        360,
        0,
        total,
        Math.abs(rotation),
      )
      console.log('rotation', rotation, indexOfRotation)
      return indexOfRotation
    },
    rotateTo(dir = 1) {
      const currentRotation = Number(gsap.getProperty(proxy, 'rotation'))
      const targetRotation =
        Math.round((currentRotation + angle * dir) / angle) * angle

      gsap.killTweensOf(proxy)
      gsap.to(proxy, {
        rotation: targetRotation,
        duration: 0.6,
        ease: 'sine.inOut',
        onUpdate: updateRotation,
      })
    },
    prev() {
      this.rotateTo(-1)
    },
    next() {
      this.rotateTo(1)
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

      // thumbsTween = gsap.to(thumbs, {
      //   x: '-100%',
      // })
      // thumbsTween.pause()

      spin = gsap.to(carousel, {
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
            const depth = 1 - Math.abs(progressIndex - totalHalf) / totalHalf
            const scale = 1 - depth * 0.5
            slide.style.setProperty('--depth', `${depth}`)
            gsap.set(slide, {
              scale,
            })
          })

          thumbs.forEach((elem, index) => {
            const indexDiff = parseFloat((index - progress * total).toFixed(4))
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
      })
      // TODO: Recommendation: pre-render for performance. Does it make sense? Check also other timelines
      spin.progress(1, true).progress(0, true)
      spin.pause()

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
          gsap.killTweensOf(this.spin)
          spin?.timeScale(0)
        },
        onDrag: updateRotation,
        onThrowUpdate: updateRotation,
      })
    },

    initIntroAnimation() {
      const component = this
      // const frame = document.querySelector('.x-home__carousel-frame')
      const canvas = document.querySelector('.x-home__canvas')
      const carousel = document.querySelector('.x-home__carousel')
      const cards = document.querySelectorAll('.x-home__carousel-item')
      const firstCard = cards[0]
      if (!carousel || !firstCard) return

      const radius = Number(gsap.getProperty(firstCard, 'z'))
      const startZ = radius * -80
      const endZ = radius * -1
      const durationSpin = 4
      const cardDuration = 2
      const cardDelay = durationSpin - cardDuration * 0.4

      gsap.set(canvas, { rotationX: -90, z: startZ })
      gsap.set(carousel, { rotationY: -360 * 3 })

      const tl = gsap.timeline({
        delay: 0,
        // repeat: -1,
        // yoyo: true,
        onStart: () => {
          console.log('timeline started')
          component.$root.classList.remove('sr-only')
        },
        onComplete: () => {
          component.initCarousel()
          component.$root.classList.add('is-ready')
        },
      })
      tl.to(
        '.x-home__circle',
        { opacity: 0, duration: 1, strokeWidth: 0.1, ease: Linear.easeNone },
        0,
      )
      tl.to(
        carousel,
        {
          rotationY: 0,
          duration: durationSpin,
          ease: Power2.easeOut,
        },
        0,
      )
      tl.to(
        canvas,
        {
          rotationX: 0,
          z: endZ,
          duration: durationSpin * 0.75,
          ease: Power3.easeInOut,
        },
        durationSpin * 0.125,
      )
      cards.forEach((card, index) => {
        const depth = 1 - Math.abs(index - totalHalf) / totalHalf
        const scale = 1 - depth * 0.5
        tl.to(
          card,
          {
            scale,
            '--depth': depth,
            duration: cardDuration,
            ease: Power3.easeOut,
          },
          cardDelay,
        )
      })
      tl.fromTo(
        '.x-home__thumb',
        {
          x: '100%',
          scale: 1.1,
          opacity: 0,
        },
        {
          x: 0,
          scale: 1,
          opacity: 1,
          duration: 0.6,
          ease: Back.easeOut,
          stagger: 0.05,
        },
        '-=1',
      )
      // thumbs.forEach((thumb, index) => {
      //   tl.fromTo(
      //     thumb,
      //     { x: '100%', scale: 1.1, opacity: 0 },
      //     {
      //       x: 0,
      //       scale: 1,
      //       opacity: 1,
      //       duration: 0.6,
      //       ease: Back.easeOut,
      //     },
      //     '-=0.4',
      //   )
      // })
      tl.progress(1, true).progress(0, true)
      tl.pause()
      tl.restart(true)

      // tl.pause()
      // gsap.to(canvas, {
      //   rotationX: 0,
      //   yoyo: true,
      //   repeat: -1,
      //   duration: 2,
      //   ease: Power2.easeInOut,
      // })
    },

    init() {
      console.log('Home component initialized')
      gsap.registerPlugin(Draggable, InertiaPlugin)

      carousel = this.$refs.carousel
      cards = gsap.utils.toArray(
        carousel?.querySelectorAll('.x-home__carousel-item') ?? [],
      )
      thumbs = gsap.utils.toArray(
        document.querySelectorAll('.x-home__thumb') ?? [],
      )

      total = cards.length
      totalHalf = total / 2
      angle = 360 / total

      // this.initCarousel()
      this.initIntroAnimation()
    },
  }

  return component
}

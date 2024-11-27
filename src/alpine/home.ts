import type { AlpineComponent } from 'alpinejs'
import { gsap, Power2, Power3, Back, Linear } from 'gsap'
import { Draggable } from 'gsap/Draggable'
import { InertiaPlugin } from 'gsap/InertiaPlugin'
import { Splide } from '@splidejs/splide'
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
  restored: () => void
  closeProject: () => void
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
  let projectSlug: undefined | string = undefined
  let projectContainer: HTMLElement | null = document.getElementById('project')
  let thumbsSplide: Splide | undefined = undefined

  function stopAllVideos() {
    const videos = document.querySelectorAll('video')
    videos.forEach((video) => {
      // @ts-ignore
      if (video.player) {
        // @ts-ignore
        video.player.pause()
      } else {
        video.pause()
      }
    })
  }

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
    closeProject() {
      const card = document.querySelector(
        `[data-card="${projectSlug}"]`,
      ) as HTMLElement
      const cardRect = card.getBoundingClientRect()

      const hero = this.$refs.hero
      const heroImage = hero.querySelector('img')

      projectContainer?.classList.add('pointer-events-none')
      // this.$refs.hero?.classList.add('pointer-events-none')
      console.log('closeProject', projectContainer)
      stopAllVideos()

      const startDelay = 0.3
      const tl = gsap.timeline({
        onComplete: () => {
          console.log('closeProject completed')

          htmx.ajax('GET', '/partials/clear-project/', {
            target: '#project',
            swap: 'innerHTML',
          })
        },
      })
      tl.to('#project', { opacity: 0, duration: 0.3 })
      tl.to(
        hero,
        {
          x: cardRect.left,
          y: cardRect.top,
          width: cardRect.width,
          height: cardRect.height,
          borderRadius: 24,
          ease: Power3.easeInOut,
          duration: 1,
        },
        startDelay,
      )
      tl.to(
        heroImage,
        {
          borderRadius: 24,
          duration: 1,
        },
        startDelay,
      )
      tl.to(hero, {
        opacity: 0,
        duration: 0.3,
        ease: Linear.easeNone,
      })
    },
    startPageTransition(url) {
      const hero = this.$refs.hero
      // Reset hero and projectContainer
      while (hero.firstChild) {
        hero.removeChild(hero.firstChild)
      }
      gsap.set(hero, { opacity: 1 })
      gsap.set(projectContainer, { opacity: 1 })

      const card = document.querySelector(`[data-card="${url}"]`) as HTMLElement
      projectSlug = url

      if (!card || !hero) {
        console.warn('card or hero not defined', card, hero)
        return
      }

      const cardContent = card
        .querySelector('a')
        ?.cloneNode(true) as HTMLImageElement
      if (cardContent) {
        cardContent.classList.add('pointer-events-none__')
        hero.appendChild(cardContent)
      }
      const heroText = hero.querySelector('.x-home__text')
      const heroImage = hero.querySelector('img')
      console.log('heroImage', heroImage)

      const cardRect = card.getBoundingClientRect()
      const startDelay = 0.12
      projectContainer?.classList.remove('pointer-events-none')
      this.$refs.hero?.classList.add('pointer-events-none')

      const tl = gsap.timeline({
        onComplete: () => {
          console.log('transition completed', url)
          htmx.trigger('#project', 'loadProject', {
            slug: url,
          })
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
    navigateTo: function (url, open = false) {
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

      const clockwiseDistance = (index - indexOfRotation + total) % total
      const counterClockwiseDistance = (indexOfRotation - index + total) % total
      const shortestDistance = Math.min(
        clockwiseDistance,
        counterClockwiseDistance,
      )
      const direction = clockwiseDistance <= counterClockwiseDistance ? 1 : -1
      const targetPosition =
        shortestDistance * direction * angle + currentRotation

      // console.log('spinToIndex', {
      //   index,
      //   indexDiff,
      //   indexOfRotation,
      //   rotationChange,
      //   currentRotation,
      //   rotationRest,
      //   targetRotation,
      //   clockwiseDistance,
      //   counterClockwiseDistance,
      //   direction,
      //   targetPosition,
      // })

      gsap.killTweensOf(proxy)
      gsap.to(proxy, {
        rotation: targetPosition,
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

          const index = Math.round(progress * total)

          if (thumbsSplide && index !== thumbsSplide?.index) {
            thumbsSplide.go(index)
          }

          // gsap.set(thumbsContainer, {
          //   x: `${-progress * 100}%`,
          // })
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
          console.log('timeline completed')
          component.initCarousel()
          component.$root.classList.add('is-ready')
        },
      })
      tl.to(
        '.x-home__circle',
        { opacity: 0, duration: 0.6, strokeWidth: 0.1, ease: Linear.easeNone },
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
      if (window.innerWidth < 1024) {
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
      }
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
    },

    restored() {
      const progress = 0

      gsap.set('.x-home__circle', { opacity: 0, strokeWidth: 0.1 })
      cards.forEach((card, index) => {
        const depth = 1 - Math.abs(index - totalHalf) / totalHalf
        const scale = 1 - depth * 0.5
        gsap.set(card, {
          scale,
          '--depth': depth,
        })
      })

      const firstCard = cards[0]
      const radius = Number(gsap.getProperty(firstCard, 'z'))
      const endZ = radius * -1
      gsap.set('.x-home__canvas', { rotationX: 0, z: endZ })

      thumbs.forEach((elem, index) => {
        const indexDiff = parseFloat((index - progress * total).toFixed(4))
        // Clamp indexDiff between -1 and 1
        const scale = Math.max(-1, Math.min(1, indexDiff))

        elem.style.setProperty('--ratio', `${indexDiff}`)
        elem.style.setProperty('--scale', `${scale}`)
        elem.style.setProperty('--scaleAbs', `${Math.abs(scale)}`)
        elem.style.setProperty('--index', `${Math.round(indexDiff)}`)
      })

      // @ts-ignore
      component.$root.classList.remove('sr-only')
      // @ts-ignore
      component.$root.classList.add('is-ready')
      component.initCarousel()
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

      const thumbsSplideElem = this.$refs.thumbnails
      if (thumbsSplideElem) {
        thumbsSplide = new Splide(thumbsSplideElem, {
          type: 'loop',
          fixedWidth: 'var(--nav-item-w)',
          gap: '0.125rem',
          pagination: false,
          focus: 'center',
        }).mount()
      }

      total = cards.length
      totalHalf = total / 2
      angle = 360 / total

      const sessionActive = this.$store.session.checkSession()
      console.log('sessionActive', sessionActive)

      if (sessionActive) {
        this.restored()
      } else {
        this.initIntroAnimation()
      }
    },
  }

  return component
}

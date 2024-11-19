import type { AlpineComponent } from 'alpinejs'
import type { UiStore } from './entrypoint'

interface HeroComponent {
  splide:
    | {
        length: number
        index: number
        Components: {
          Autoplay: {
            play: () => void
            pause: () => void
            isPaused: boolean
          }
          Elements: {
            slides: HTMLElement[]
          }
        }
        on: (
          event: string,
          callback: (elem: { slide: HTMLElement }) => void,
        ) => void
        go: (direction: '>' | '<') => void
      }
    | undefined
  ratio: number
  next: () => void
  prev: () => void
  playAutoPlay: () => void
  pauseAutoPlay: () => void
  stopAutoPlay: () => void
  enableMouseControls: () => void
  index: number
  total: number
  getCurrentSlide: () => HTMLElement | undefined
  pointerDownStart: number
  onTimeUpdateVideo: (event: Event) => void
  waitForTransition: boolean
  pointerdownHandler: (event: PointerEvent) => void
  pointerupHandler: (event: PointerEvent) => void
  mousemoveHandler: (event: PointerEvent) => void
  clickHandler: (event: PointerEvent) => void
}

export function hero(): AlpineComponent<HeroComponent> {
  const component: AlpineComponent<HeroComponent> = {
    splide: undefined,
    ratio: 0,
    index: 0,
    total: 0,
    pointerDownStart: 0,
    waitForTransition: true,
    destroy() {
      console.log('destroy hero')
      if (this.splide) {
        this.splide.destroy(true)
        this.splide = undefined
      }
      const allVideos = this.$refs.carousel?.querySelectorAll('video') ?? []
      allVideos.forEach((video) => {
        video.removeEventListener('timeupdate', this.onTimeUpdateVideo)
        if (video.player) {
          video.player.pause()
          video.player.destroy()
          video.player = null
        } else {
          video.pause()
        }
      })
      this.$root.addEventListener('pointerdown', this.pointerdownHandler)
      this.$root.addEventListener('pointerup', this.pointerupHandler)
      this.$root.addEventListener('mousemove', this.mousemoveHandler)
      this.$root.addEventListener('click', this.clickHandler)
    },
    getCurrentSlide() {
      return this.splide?.Components?.Elements?.slides[this.splide?.index ?? 0]
    },
    next() {
      this.ratio = 0
      if (this.splide) {
        this.splide.go('>')
      }
    },
    prev() {
      if (this.splide) {
        this.splide.go('<')
      }
    },
    playAutoPlay() {
      this.splide?.Components?.Autoplay?.play()
    },
    pauseAutoPlay() {
      this.splide?.Components?.Autoplay?.pause()
    },
    stopAutoPlay() {
      this.splide?.Components?.Autoplay?.pause()
      this.ratio = 0
    },
    pointerdownHandler(event) {
      this.pointerDownStart = event.timeStamp

      const slide = this.getCurrentSlide()
      const video = slide?.querySelector('video')
      if (video) {
        video.pause()
      } else {
        this.pauseAutoPlay()
      }
    },
    pointerupHandler(event) {
      this.$root.classList.replace('cursor-wait', 'cursor-left')

      const slide = this.getCurrentSlide()
      const video = slide?.querySelector('video')
      if (video) {
        video.play()
      } else {
        this.playAutoPlay()
      }
    },
    mousemoveHandler(event) {
      if (event.clientX > this.$root.clientWidth / 2) {
        this.$root.classList.replace('cursor-left', 'cursor-right')
      } else {
        this.$root.classList.replace('cursor-right', 'cursor-left')
      }
    },
    clickHandler(event) {
      const clickDuration = event.timeStamp - this.pointerDownStart
      if (clickDuration > 300) {
        return
      }

      const target = event.target as HTMLElement
      if (target.tagName === 'BUTTON' || target.tagName === 'A') {
        return
      }

      if (event.clientX > this.$root.clientWidth / 2) {
        this.next()
      } else {
        this.prev()
      }
    },
    enableMouseControls() {
      this.$root.classList.add('cursor-left')
      this.$root.addEventListener(
        'pointerdown',
        this.pointerdownHandler.bind(this),
      )
      this.$root.addEventListener('pointerup', this.pointerupHandler.bind(this))
      this.$root.addEventListener('mousemove', this.mousemoveHandler.bind(this))
      this.$root.addEventListener('click', this.clickHandler.bind(this))
    },
    onTimeUpdateVideo(event) {
      const video = event.target as HTMLVideoElement
      if (!video) return

      const ratio = video.currentTime / video.duration
      this.ratio = ratio
      // TODO: Maybe on event 'eneded' instead
      if (ratio > 0.99) {
        console.log('ended', ratio, this.next)
        video.removeEventListener('timeupdate', this.onTimeUpdateVideo)
        this.next()
      }
    },
    init() {
      // console.log('heroActive', this.$store.heroActive)
      // this.$watch('$store.ui.heroActive', (value, oldValue) =>
      //   console.log('heroActive changed', value, oldValue),
      // )

      const allVideos = this.$refs.carousel?.querySelectorAll('video') ?? []
      allVideos.forEach((video) => {
        video.muted = true
        video.currentTime = 0
        if (video.player) {
          video.player.pause()
        } else {
          video.pause()
        }
      })

      const splide = new Splide(this.$refs.carousel, {
        type: 'loop',
        // rewind: false,
        pagination: false,
        arrows: false,
        autoplay: false,
        interval: 5000,
        pauseOnHover: false,
        pauseOnFocus: true,
        // MouseWheel Support
        // https://splidejs.com/guides/options/#wheel
        // waitForTransition: true,
        // wheel: true,
        // classes: {
        //   // Add classes for arrows.
        //   arrows: 'splide__arrows your-class-arrows',
        //   arrow: 'splide__arrow your-class-arrow',
        //   prev: 'splide__arrow--prev your-class-prev',
        //   next: 'splide__arrow--next your-class-next',

        //   // Add classes for pagination.
        //   pagination: 'splide__pagination your-class-pagination', // container
        //   page: 'splide__pagination__page your-class-page', // each button
        // },
      }).mount()
      this.splide = splide
      this.total = splide.length
      this.index = splide.index + 1

      splide.on('visible', (elem) => {
        const video = elem.slide.querySelector('video')
        if (video) {
          this.stopAutoPlay()
          video.currentTime = 0
          video.muted = false
          video.play()
          video.addEventListener(
            'timeupdate',
            this.onTimeUpdateVideo.bind(this),
          )
        } else {
          this.playAutoPlay()
        }
      }),
        splide.on('hidden', (elem) => {
          const video = elem.slide.querySelector('video')
          if (video) {
            video.muted = true
            video.currentTime = 0
            video.pause()
          }
        })
      splide.on('move', () => {
        this.index = splide.index + 1
        allVideos.forEach((video) => video.player?.pause())
      })
      splide.on('autoplay:playing', (rate) => {
        this.ratio = rate as number
      })

      setTimeout(() => {
        this.waitForTransition = false
        this.playAutoPlay()
      }, 1600)

      this.enableMouseControls()

      Alpine.effect(() => {
        const ui = Alpine.store('ui') as UiStore
        console.log('hero.heroActive', ui.heroActive)
        if (!ui.heroActive) {
          const allVideos = document.querySelectorAll(
            '.x-hero video',
          ) as unknown as HTMLVideoElement[]
          console.log('allVideos', allVideos)
          allVideos.forEach((video) => {
            // @ts-ignore
            video.player?.pause()
          })
          this.stopAutoPlay()
        } else if (!this.waitForTransition) {
          const video = document.querySelector(
            '.x-hero .splide__slide.is-active video',
          ) as HTMLVideoElement
          if (video) {
            video.play()
          }
          this.playAutoPlay()
        }
      })
    },
  }

  return component
}

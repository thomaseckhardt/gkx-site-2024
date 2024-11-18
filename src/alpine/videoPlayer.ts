import type { AlpineComponent } from 'alpinejs'
import Plyr from 'plyr'

interface VideoPlayerComponent {
  video: HTMLVideoElement | null
  source: string | null
  initPlayer(): void
  initObserver(): void
}

export function videoPlayer({
  ratio,
  hls,
  hlsLandscape,
  hlsPortrait,
  showControls = false,
  playerConfig,
  autoShowMute = false,
}): AlpineComponent<VideoPlayerComponent> {
  const component: AlpineComponent<VideoPlayerComponent> = {
    video: null,
    source: null,
    init() {
      console.log({
        hls,
        hlsLandscape,
        hlsPortrait,
        showControls,
      })

      const video = this.$refs.player as HTMLElement
      if (!video) return

      const viewportAspectRatio = window.innerWidth / window.innerHeight
      this.source = hls
        ? hls
        : viewportAspectRatio > 1
          ? hlsLandscape
          : hlsPortrait || hlsLandscape
      // container.setAttribute('data-plyr-provider', 'vimeo')
      // container.setAttribute(
      //   'data-plyr-embed-id',
      //   viewportAspectRatio > 1 ? videoIdLandscape : videoIdPortrait,
      // )

      this.video = video
      this.initPlayer()
      this.initObserver()
    },
    initPlayer() {
      const isBackgroundVideo = !showControls
      // For more options see: https://github.com/sampotts/plyr/#options
      // captions.update is required for captions to work with hls.js
      const player = new Plyr(this.video, {
        debug: false,
        controls: showControls
          ? [
              'play-large',
              'play',
              'progress',
              'current-time',
              'mute',
              // 'volume',
              'settings',
              'pip',
              'airplay',
              'fullscreen',
            ]
          : autoShowMute
            ? ['mute']
            : [],

        hideControls: showControls || (!showControls && !autoShowMute),
        settings: ['quality', 'speed'],
        // iconUrl,
        autoplay: isBackgroundVideo,
        autopause: !isBackgroundVideo,
        muted: true,
        loop: { active: isBackgroundVideo },
        iconUrl: '/plyr-icons.svg',
        iconPrefix: 'player',
        ratio,
        ...playerConfig,
      })
      player.on('ready', () => {
        this.$store.sound.onVideoVolumeChange(player.muted)
      })
      player.on('volumechange', () => {
        this.$store.sound.onVideoVolumeChange(player.muted)
      })

      if (!Hls.isSupported()) {
        this.video.src = this.source
      } else {
        // For more Hls.js options, see https://github.com/dailymotion/hls.js
        const hls = new Hls()
        hls.loadSource(this.source)
        hls.attachMedia(this.video)
      }

      this.player = player
      this.video.player = player
    },
    initObserver() {
      // Auto play/pause video, when in viewport
      const config = {
        rootMargin: '0px -200px',
        threshold: 0,
      }
      const callback = (entries) => {
        entries.forEach((entry) => {
          const player = entry.target.player
          if (!player) return

          if (!entry.isIntersecting) {
            player.pause()
          } else if (player.autoplay && !player.playing) {
            player.play()
          }
        })
      }

      const observer = new IntersectionObserver(callback, config)
      observer.observe(this.video)

      // Check initial intersection
      const initialEntries = observer.takeRecords()
      if (initialEntries.length > 0) {
        callback(initialEntries)
      }
    },
  }
  return component
}

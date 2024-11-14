import type { AlpineComponent } from 'alpinejs'
import Plyr from 'plyr'

interface VideoPlayerComponent {
  video: HTMLVideoElement | null
  source: string | null
  initPlayer(): void
}

export function videoPlayer({
  ratio,
  hls,
  hlsLandscape,
  hlsPortrait,
  showControls = false,
  playerConfig,
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
          : [],
        settings: ['quality', 'speed'],
        // iconUrl,
        autoplay: isBackgroundVideo,
        autopause: !isBackgroundVideo,
        muted: isBackgroundVideo,
        loop: { active: isBackgroundVideo },
        iconUrl: '/plyr-icons.svg',
        iconPrefix: 'player',
        ratio,
        ...playerConfig,
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
  }
  return component
}

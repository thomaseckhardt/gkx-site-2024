import type { AlpineComponent } from 'alpinejs'
import Plyr from 'plyr'

interface VideoPlayerComponent {
  container: HTMLElement | null
  initPlayer(): void
}

export function videoPlayer({
  videoIdLandscape,
  videoIdPortrait,
  showControls = false,
}): AlpineComponent<VideoPlayerComponent> {
  const component: AlpineComponent<VideoPlayerComponent> = {
    container: null,
    init() {
      console.log({
        videoIdLandscape,
        videoIdPortrait,
        showControls,
      })

      const container = this.$refs.player as HTMLElement
      if (!container) return

      const viewportAspectRatio = window.innerWidth / window.innerHeight
      container.setAttribute('data-plyr-provider', 'vimeo')
      container.setAttribute(
        'data-plyr-embed-id',
        viewportAspectRatio > 1 ? videoIdLandscape : videoIdPortrait,
      )

      this.container = container
      this.initPlayer()
    },
    initPlayer() {
      const isBackgroundVideo = !showControls
      // For more options see: https://github.com/sampotts/plyr/#options
      // captions.update is required for captions to work with hls.js
      const player = new Plyr(this.container, {
        debug: false,
        controls: showControls
          ? [
              'play-large',
              'play',
              'progress',
              'current-time',
              'mute',
              'volume',
              'settings',
              'pip',
              'airplay',
              'fullscreen',
            ]
          : ['mute'],
        settings: ['quality', 'speed'],
        // iconUrl,
        autoplay: isBackgroundVideo,
        autopause: !isBackgroundVideo,
        muted: isBackgroundVideo,
        loop: { active: isBackgroundVideo },
      })

      this.player = player
    },
  }
  return component
}

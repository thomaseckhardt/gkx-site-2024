import Tempus from '@darkroom.engineering/tempus'

export default function (Alpine) {
  Alpine.directive(
    'image-state',
    (el, { expression }, { Alpine, evaluate, cleanup }) => {
      let data = Alpine.reactive(evaluate(expression))
      data.isLoaded = false
      data.isRendered = false

      if (el.nodeName.toLowerCase() !== 'img') {
        el = el.querySelector('img')

        if (el === null) {
          data.error = {
            message: 'No image found',
          }
        }
      }
      if (el) {
        let nextTick = false
        const checkImage = () => {
          const isRendered =
            el.complete && el.naturalHeight !== 0 && el.naturalWidth !== 0
          if (isRendered) {
            nextTick = true
          }
          if (isRendered && nextTick) {
            data.isRendered = isRendered
            Tempus.remove(checkImage)
          }
        }
        const onLoad = (event) => {
          data.isLoaded = true
          Tempus.add(checkImage, 0)
        }
        const onError = (event) => {
          data.error = { message: 'Failed to load image', target: event.target }
        }

        if (el.complete) {
          data.isLoaded = true
          Tempus.add(checkImage, 0)
        } else {
          el.addEventListener('load', onLoad)
          el.addEventListener('error', onError)
        }

        cleanup(() => {
          el.removeEventListener('load', onLoad)
          el.removeEventListener('error', onError)
          Tempus.remove(checkImage)
        })
      }
    },
  )
}

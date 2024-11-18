import type { AlpineComponent } from 'alpinejs'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

interface WriteOnComponent {}

export function writeOn(): AlpineComponent<WriteOnComponent> {
  const component: AlpineComponent<WriteOnComponent> = {
    init() {
      if (!this.$refs.writeOnText || !this.$refs.writeOnTarget) return

      gsap.registerPlugin(SplitText)
      gsap.registerPlugin(ScrollTrigger)

      const cloneContainer = this.$refs.writeOnTarget
      const clone = this.$refs.writeOnText.cloneNode(true)
      clone.removeAttribute('x-ref')
      cloneContainer.appendChild(clone)
      this.$el.appendChild(cloneContainer)

      const children = Array.from(clone.children) as HTMLElement[]

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: this.$el,
          scrub: 1.5,
          start: 'top center',
          // end: 'bottom center+=100px',
          end: 'bottom center',
        },
      })
      children.map((child) => {
        const split = new SplitText(child, {
          type: 'lines',
          wordsClass: 'word++',
        })
        const lines = split.lines as HTMLElement[]
        lines.forEach((line) => {
          line.style.overflow = 'hidden'
          line.style.whiteSpace = 'nowrap'
          line.style.width = '0%'
          tl.to(line, { width: '100%', ease: 'none' })
        })
      })
    },
  }

  return component
}

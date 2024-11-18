import type { AlpineComponent } from 'alpinejs'
import { SplitText } from 'gsap/SplitText'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import gsap from 'gsap'

interface WriteOnComponent {
  scrollY: number
  lines: HTMLElement[]
  scrollUpdate(): void
}

export function writeOn(): AlpineComponent<WriteOnComponent> {
  const component: AlpineComponent<WriteOnComponent> = {
    scrollY: 0,
    lines: [],
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

      const split = new SplitText(children, {
        type: 'lines',
        wordsClass: 'word++',
      })

      const lines = split.lines as HTMLElement[]
      lines.forEach((line) => {
        line.style.overflow = 'hidden'
        line.style.whiteSpace = 'nowrap'
        line.style.width = '0%'
      })
      this.lines = lines

      // window.addEventListener('scroll', () => {
      //   gsap.to(this, {
      //     scrollY: window.scrollY,
      //     onUpdate: () => this.scrollUpdate(),
      //   })
      // })

      ScrollTrigger.create({
        scrub: 0.5,
      })
    },
    scrollUpdate: function () {
      this.lines.forEach((line) => {
        const scrollCorrectionY = this.scrollY - window.scrollY
        const elem = line
        const rect = elem.getBoundingClientRect()
        const startY = 200
        const y = rect.top - startY + scrollCorrectionY
        const height = line.clientHeight
        const ratio = 1 - Math.max(0, Math.min(y / height, 1))
        elem.style.width = `${ratio * 100}%`
      })
    },
  }

  return component
}

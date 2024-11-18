import type { AlpineComponent } from 'alpinejs'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

interface WriteOnComponent {}

export function writeOn(): AlpineComponent<WriteOnComponent> {
  // We use a workaround for nested elements by Jack Doyle himself
  // https://gsap.com/community/forums/topic/18243-split-text-confused/?do=findComment&comment=189997
  function nestedLinesSplit(target, vars) {
    target = gsap.utils.toArray(target)
    if (target.length > 1) {
      let splits = target.map((t) => nestedLinesSplit(t, vars)),
        result = splits[0],
        resultRevert = result.revert
      result.lines = splits.reduce((acc, cur) => acc.concat(cur.lines), [])
      result.revert = () =>
        splits.forEach((s) => (s === result ? resultRevert() : s.revert()))
      return result
    }
    target = target[0]
    let contents = target.innerHTML
    gsap.utils.toArray(target.children).forEach((child: HTMLElement) => {
      let split = new SplitText(child, { type: 'lines' })
      split.lines.forEach((line) => {
        let clone = child.cloneNode(false) as HTMLElement
        clone.innerHTML = line.innerHTML
        target.insertBefore(clone, child)
      })
      target.removeChild(child)
    })
    let split = new SplitText(target, vars),
      originalRevert = split.revert
    split.revert = () => {
      originalRevert.call(split)
      target.innerHTML = contents
    }
    return split
  }

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
        const split = nestedLinesSplit(child, { type: 'lines' })
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

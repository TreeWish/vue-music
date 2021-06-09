import { createApp } from 'vue'
import { addClass, removeClass } from '@/assets/js/dom.js'

const relativeClassName = 'g-relative'
export default function createDerective(Comp) {
  const name = Comp.name
  const Directive = {
    mounted(el, binding) {
      const app = createApp(Comp)
      const intance = app.mount(document.createElement('div'))
      if (!el[name]) {
        el[name] = {}
      }
      el[name].intance = intance
      const title = binding.arg
      if (typeof title !== 'undefined') {
        intance.setTitle(title)
      }
      if (binding.value) {
        append(el)
      }
    },
    updated(el, binding) {
      if (binding.value !== binding.oldValue) {
        binding.value ? append(el) : remove(el)
      }
    }
  }
  function append(el) {
    const style = getComputedStyle(el)
    if (!['fixed', 'relative', 'absolute'].includes(style.position)) {
      addClass(el, relativeClassName)
    }
    el.appendChild(el[name].intance.$el)
  }
  function remove(el) {
    removeClass(el, relativeClassName)
    el.removeChild(el[name].intance.$el)
  }

  return Directive
}

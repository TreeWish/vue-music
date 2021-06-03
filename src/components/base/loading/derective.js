import { createApp } from 'vue'
import Loading from './loading'
import { addClass, removeClass } from '@/assets/js/dom.js'

const relativeClassName = 'g-relative'
const loadingDirective = {
  mounted(el, binding) {
    const app = createApp(Loading)
    const intance = app.mount(document.createElement('div'))
    el.intance = intance
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
  el.appendChild(el.intance.$el)
}
function remove(el) {
  removeClass(el, relativeClassName)
  el.removeChild(el.intance.$el)
}

export default loadingDirective

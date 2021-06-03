import { computed, ref } from 'vue'

export default function useShortcut(props, groupRef) {
  const scrollRef = ref(null)
  const touch = {}
  const ANCHOR_HEIGHT = 18
  const shortcutList = computed(() => {
    return props.data.map(item => {
      return item.title
    })
  })
  function onShortcutTouchStart(e) {
    const touchIndex = parseInt(e.target.dataset.index)
    touch.touchIndex = touchIndex
    touch.y1 = e.touches[0].pageY
    scrollToElement(touchIndex)
  }
  function onShortcutTouchMove(e) {
    touch.y2 = e.touches[0].pageY
    const delta = (touch.y2 - touch.y1) / ANCHOR_HEIGHT | 0
    const touchIndex = delta + touch.touchIndex
    scrollToElement(touchIndex)
  }
  function scrollToElement(index) {
    if (isNaN(index)) return
    index = Math.max(0, Math.min(shortcutList.value.length - 1, index))
    const touchElement = groupRef.value.children[index]
    const scroll = scrollRef.value.scroll
    scroll.scrollToElement(touchElement, 0)
  }
  return {
    shortcutList,
    onShortcutTouchStart,
    onShortcutTouchMove,
    scrollRef
  }
}

import Bscroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'
import { ref, onMounted, onUnmounted } from 'vue'

Bscroll.use(Slide)

export default function useSlide(wrapperRef) {
  const slider = ref(null)
  const currentPageIndex = ref(0)
  onMounted(() => {
    slider.value = new Bscroll(wrapperRef.value, {
      click: true,
      scrollX: true,
      scrollY: false,
      momentum: false,
      bounce: false,
      probeType: 2,
      slide: true
    })
    slider.value.on('slideWillChange', (page) => {
      currentPageIndex.value = page.pageX
    })
  })
  onUnmounted(() => {
    slider.value.destroy()
  })
  return {
    slider,
    currentPageIndex
  }
}

import { ref, watch, nextTick, computed } from 'vue'

export default function useFixed(props) {
  const groupRef = ref(null)
  const listHeights = ref([])
  const scrollY = ref(0)
  const currIndex = ref(0)
  const distance = ref(0)
  const TITLE_HEIGHT = 30
  const fixedTitle = computed(() => {
    if (scrollY.value < 0) {
      return ''
    }

    const currGroup = props.data[currIndex.value]
    return currGroup ? currGroup.title : ''
  })
  const fixedStyle = computed(() => {
    const distanceVal = distance.value
    const diff = distanceVal > 0 && distanceVal < TITLE_HEIGHT ? distanceVal - TITLE_HEIGHT : 0
    return {
      transform: `translate3d(0,${diff}px,0)`
    }
  })
  watch(() => props.data, async () => {
    //  nextTick之后dom才会更新
    await nextTick()
    calculate()
  })
  watch(scrollY, newY => {
    const listHeightsVal = listHeights.value
    for (let i = 0; i < listHeightsVal.length - 1; i++) {
      const heightTop = listHeightsVal[i]
      const heightBottom = listHeightsVal[i + 1]
      if (newY >= heightTop && newY <= heightBottom) {
        currIndex.value = i
        distance.value = heightBottom - newY
      }
    }
  })
  function calculate() {
    const list = groupRef.value.children
    const listHeightsVal = listHeights.value
    let height = 0
    listHeightsVal.length = 0
    listHeightsVal.push(height)

    for (let i = 0; i < list.length; i++) {
      height += list[i].clientHeight
      listHeightsVal.push(height)
    }
  }
  function onScroll(pos) {
    scrollY.value = -pos.y
  }
  return {
    groupRef,
    onScroll,
    fixedTitle,
    fixedStyle,
    currIndex
  }
}

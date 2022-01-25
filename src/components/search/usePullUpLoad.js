import BScroll from '@better-scroll/core';
import Pullup from '@better-scroll/pull-up';
import ObserverDom from '@better-scroll/observe-dom';
import { onMounted, onUnmounted, ref } from 'vue';
BScroll.use(Pullup);
BScroll.use(ObserverDom);

export default function usePullUpLoad(requestData, preventPullLoad) {
  const rootRef = ref(null);
  const scroll = ref(null);
  const isPullUpLoad = ref(false);

  onMounted(() => {
    const scrollVal = (scroll.value = new BScroll(rootRef.value, {
      pullUpLoad: true,
      observeDOM: true,
      click: true
    }));

    scrollVal.on('pullingUp', pullingUpHandler);

    async function pullingUpHandler() {
      if (preventPullLoad.value) {
        scrollVal.finishPullUp();
        return;
      }
      isPullUpLoad.value = true;
      await requestData();
      scrollVal.finishPullUp();
      scrollVal.refresh();
      isPullUpLoad.value = false;
    }
  });

  onUnmounted(() => {
    scroll.value.destroy();
  });

  return {
    rootRef,
    scroll,
    isPullUpLoad
  };
}

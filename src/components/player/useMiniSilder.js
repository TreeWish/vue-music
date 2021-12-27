import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { useStore } from 'vuex';
import BScroll from '@better-scroll/core';
import Slide from '@better-scroll/slide';
BScroll.use(Slide);

export default function useMiniSlider() {
  const sliderWrapperRef = ref(null);
  const slider = ref(null);

  const stroe = useStore();
  const fullScreen = computed(() => stroe.state.fullScreen);
  const currentIndex = computed(() => stroe.state.currentIndex);
  const playList = computed(() => stroe.state.playList);
  // 计算当前调用需要调用slider实例
  const sliderShow = computed(() => {
    return !fullScreen.value && !!playList.value;
  });
  // 组件挂载钩子 进行初始化slider等操作
  onMounted(() => {
    let sliderVal;
    watch(sliderShow, async newSliderShow => {
      if (newSliderShow) {
        // 等待一个nextTick 避免获取不到对应的DOM实例
        await nextTick();
        if (!sliderVal) {
          // 初始化slider实例
          sliderVal = slider.value = new BScroll(sliderWrapperRef.value, {
            click: true,
            scrollX: true,
            scrollY: false,
            momentum: false,
            bounce: false,
            probeType: 2,
            slide: {
              autoplay: false,
              loop: true
            }
          });
          // 监听slider页数发生变化事件 更改当前当前播放歌曲的index
          sliderVal.on('slidePageChanged', ({ pageX }) => {
            stroe.commit('setCurrentIndex', pageX);
          });
        } else {
          sliderVal.refresh();
        }
        sliderVal.goToPage(currentIndex.value, 0, 0);
      }
    });
    //  监听当前播放歌曲的下标变化 跳转到歌曲下标对应的page
    watch(currentIndex, newIndex => {
      if (slider.value && sliderShow.value) {
        slider.value.goToPage(newIndex, 0, 0);
      }
    });
    // 监听播放列表的变化 刷新sliderDOM页面
    watch(playList, async newPlayList => {
      if (sliderVal && sliderShow.value && newPlayList.length) {
        await nextTick()
        sliderVal.refresh();
      }
    });
  });

  onUnmounted(() => {
    if (slider.value) {
      slider.value.destroy();
    }
  });
  return {
    slider,
    sliderWrapperRef
  };
}

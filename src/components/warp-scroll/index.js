/*
 * @Description: 在scroll组基础上导出一个高阶scroll 组件
    监听playlist的变化, 当playlist变化时刷新bsScrollDOM层面的变化
 */
import Scroll from '@/components/base/scroll/scroll';
import {
  computed,
  h,
  mergeProps,
  nextTick,
  ref,
  renderSlot,
  watch,
  withCtx
} from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'warp-scroll',
  props: Scroll.props,
  emits: Scroll.emits,
  render(ctx) {
    return h(
      Scroll,
      mergeProps(
        {
          ref: 'scrollRef'
        },
        ctx.$props,
        {
          onScroll: e => {
            ctx.$emit('scroll', e);
          }
        }
      ),
      {
        default: withCtx(() => {
          return [renderSlot(ctx.$slots, 'default')];
        })
      }
    );
  },
  setup() {
    const scrollRef = ref(null);
    const scroll = computed(() => {
      return scrollRef.value.scroll;
    });
    const store = useStore();
    // 使用better-scroll 实例
    const playList = computed(() => store.state.playList);

    watch(playList, async () => {
      await nextTick();
      scroll.value.refresh();
    });

    return {
      scrollRef,
      scroll
    };
  }
};

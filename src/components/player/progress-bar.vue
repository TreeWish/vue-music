<template>
  <div class="progress-bar" @click="onClick">
    <div class="bar-inner">
      <div ref="progress" class="progress" :style="progressStyle"></div>
      <div
        class="progress-btn-wrapper"
        @touchstart.prevent="onTouchStart"
        @touchmove.prevent="onTouchMove"
        @touchend.prevent="onTouchEnd"
      >
        <div class="progress-btn" :style="btnStyle"></div>
      </div>
    </div>
  </div>
</template>

<script>
const progressBtnWidth = 16;
export default {
  name: 'progress-bar',
  props: {
    progress: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      offset: 0
    };
  },
  watch: {
    progress(newVal) {
      this.setOffet(newVal)
    }
  },
  computed: {
    progressStyle() {
      return {
        width: `${this.offset}px`
      };
    },
    btnStyle() {
      return {
        transform: `translateX(${this.offset}px)`
      };
    }
  },
  created() {
    this.touch = {};
  },
  emits: ['progress-changing', 'progress-changed'],
  methods: {
    onTouchStart(e) {
      this.touch.x1 = e.touches[0].pageX;
      this.touch.beginWidth = this.$refs.progress.clientWidth;
    },
    onTouchMove(e) {
      const x2 = e.touches[0].pageX;
      const delta = x2 - this.touch.x1;
      const tempWidth = this.touch.beginWidth + delta;
      const barWidth = this.$el.clientWidth - progressBtnWidth;
      // 滑块边界情况处理，不能划出进度条
      const progress = Math.min(1, Math.max(tempWidth / barWidth, 0));
      this.offset = progress * barWidth;
      this.$emit('progress-changing', progress);
    },
    onTouchEnd(e) {
      const barWidth = this.$el.clientWidth - progressBtnWidth;
      const progress = this.$refs.progress.clientWidth / barWidth;
      this.$emit('progress-changed', progress);
    },
    onClick(e) {
      console.log(this.$el.getBoundingClientRect());
      const rect = this.$el.getBoundingClientRect();
      const offsetWidth = e.pageX - rect.left;
      const barWidth = this.$el.clientWidth - progressBtnWidth;
      const progress = offsetWidth / barWidth;
      this.$emit('progress-changed', progress);
    },
    setOffet(progress) {
      const barWidth = this.$el.clientWidth - progressBtnWidth;
      this.offset = barWidth * progress;
    }
  }
};
</script>

<style lang="scss" scoped>
.progress-bar {
  height: 30px;
  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background-color: $color-text-d;
    .progress {
      position: absolute;
      height: 100%;
      background-color: $color-theme;
    }
    .progress-btn-wrapper {
      width: 30px;
      .progress-btn {
        position: relative;
        top: -6px;
        width: 16px;
        height: 16px;
        box-sizing: border-box;
        border-radius: 50%;
        border: 3px solid #fff;
        background-color: $color-theme;
      }
    }
  }
}
</style>

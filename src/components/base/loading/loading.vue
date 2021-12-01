<template>
  <div class="loading">
    <div class="loading-content">
      <img src="./loading.gif" width="24" height="24" alt="图片加载失败" />
      <p class="desc">{{ title }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'loading',
  data() {
    return {
      title: '加载中...'
    };
  },
  methods: {
    setTitle(title) {
      this.title = title;
    }
  }
};
</script>

<style lang="scss" scoped>
.loading {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .loading-content {
    text-align: center;
    color: #fff;
    .desc {
      line-height: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
    }
  }
}
</style>

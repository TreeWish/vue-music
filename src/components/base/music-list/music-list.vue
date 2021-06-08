<template>
  <div class="music-list">
    <div
      class="back"
      @click="goBack"
    >
      <i class="icon-back"></i>
    </div>
    <h1 class="title">{{ title }}</h1>
    <div
      class="bg-image"
      ref="bgImage"
      :style="bgStyle"
    >
      <div
        class="play-btn-wrapper"
      >
        <div
          v-show="songs.length > 0"
          class="play-btn"
        >
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div
        class="filter"
        :style="filterStyle"
      ></div>
    </div>
    <scroll
      class="list"
      v-loading="loading"
      :probe-type="3"
      @scroll="onScroll"
      :style="scrollStyle"
    >
      <div class="song-list-wrapper">
        <song-list
          :songs="songs"
          :rank="rank"
        ></song-list>
      </div>
    </scroll>
  </div>
</template>

<script>
import SongList from '@/components/base/song-list/song-list'
import Scroll from '@/components/base/scroll/scroll'
const NAVBAR_HEIGHT = 40
export default {
  name: 'music-list',
  components: {
    SongList,
    Scroll
  },
  props: {
    songs: {
      type: Array,
      defualt() {
        return []
      }
    },
    pic: {
      type: String
    },
    title: {
      type: String
    },
    loading: {
      type: Boolean
    }
  },
  data() {
    return {
      imgHeight: 0,
      scrollY: 0,
      maxTranstionY: 0
    }
  },
  computed: {
    bgStyle() {
      let zIndex = 0
      let paddingTop = '70%'
      let height = 0
      // translateZ解决IOS层级问题
      let translateZ = 0
      let scale = 1
      const scrollY = this.scrollY
      if (scrollY < 0) {
        scale = 1 + Math.abs(scrollY / this.imgHeight)
      }
      if (scrollY > this.maxTranstionY) {
        zIndex = 10
        paddingTop = 0
        height = `${NAVBAR_HEIGHT}px`
        translateZ = 1
      }
      return {
        zIndex,
        paddingTop,
        height,
        backgroundImage: `url(${this.pic})`,
        transform: `scale(${scale})translateZ(${translateZ}px)`
      }
    },
    scrollStyle() {
      return {
        top: `${this.imgHeight}px`
      }
    },
    filterStyle() {
      let blur = 0
      const scrollY = this.scrollY
      const imgHeight = this.imgHeight
      const maxTranstionY = this.maxTranstionY
      if (scrollY >= 0) {
        blur = Math.min(maxTranstionY / imgHeight, scrollY / imgHeight) * 20
      }
      return {
        // backdropFilter CSS模糊滤镜
        backdropFilter: `blur(${blur}px)`
      }
    }
  },
  mounted() {
    this.imgHeight = this.$refs.bgImage.clientHeight
    this.maxTranstionY = this.imgHeight - NAVBAR_HEIGHT
  },
  methods: {
    goBack() {
      this.$router.back()
    },
    onScroll(pos) {
      this.scrollY = -pos.y
    }
  }

}
</script>

<style lang="scss" scoped>
  .music-list {
  position: relative;
  height: 100%;
  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 20;
    transform: translateZ(2px);
    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }
  .title {
    position: absolute;
    top: 0;
    left: 10%;
    width: 80%;
    z-index: 20;
    transform: translateZ(2px);
    text-align: center;
    line-height: 40px;
    font-size: $font-size-large;
    color: $color-text;
  }
  .bg-image {
    position: relative;
    width: 100%;
    transform-origin: top;
    background-size: cover;
    .play-btn-wrapper {
      position: absolute;
      bottom: 20px;
      z-index: 10;
      width: 100%;
      .play-btn {
        box-sizing: border-box;
        width: 135px;
        padding: 7px 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid;
        border-color: $color-theme;
        color: $color-theme;
        border-radius: 100px;
        font-size: 0;
      }
      .icon-play {
        display: inline-block;
        vertical-align: middle;
        margin-right: 6px;
        font-size: $font-size-medium-x;
      }
      .text {
        display: inline-block;
        vertical-align: middle;
        font-size: $font-size-small;
      }
    }
    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }
  }
  .list {
    position: absolute;
    bottom: 0;
    width: 100%;
    z-index: 0;
    .song-list-wrapper {
      padding: 20px 30px;
      background: $color-background;
    }
  }
}
</style>

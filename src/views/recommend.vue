<template>
  <div class="recommend" v-loading="loading">
    <scroll class="recommend-content">
      <div>
        <div class="slider-wrapper">
          <div class="slider-content">
            <slider v-if="sliders.length" :sliders="sliders"></slider>
          </div>
        </div>
        <div class="recommend-list">
          <h1 class="list-title" v-show="!loading">热门歌单推荐</h1>
          <ul>
            <li
              v-for="item in albums"
              class="item"
              :key="item.id"
            >
              <div class="icon" >
                <img width="60" height="60" v-lazy="item.pic">
              </div>
              <div class="text">
                <h2 class="name">
                  {{ item.username }}
                </h2>
                <p class="title">
                  {{item.title}}
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
   </scroll>
  </div>
</template>

<script>
import { getRecommend } from '@/service/recommend'
import Slider from '@/components/base/slider/slider.vue'
import Scroll from '@/components/base/scroll/scroll.vue'

export default {
  name: 'recommend',
  components: {
    Slider,
    Scroll

  },
  data() {
    return {
      albums: [],
      sliders: []
    }
  },
  computed: {
    loading() {
      return !this.albums.length && !this.sliders.length
    }
  },
  async created() {
    const result = await getRecommend()
    this.albums = result.albums
    this.sliders = result.sliders
  }
}
</script>
<style lang="scss" scoped>
  .recommend {
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
    overflow: scroll;
    .recommend-content {
      height: 100%;
      overflow: hidden;
    }
    .recommend-list {
      .list-title {
        text-align: center;
        color: $color-theme;
        height: 65px;
        line-height: 65px;
        font-size: 14px;
      }
      .item {
        display: flex;
        width: 100%;
        height: 83px;
        padding: 0 20px 20px;
        .icon {
          flex: 0 0 60px;
          width: 60px;
          padding-right: 20px;
        }
        .text {
          text-align: left;
          line-height: 20px;
          overflow: hidden;
          font-size: 14px;
          .name {
            color: #fff;
            margin-bottom: 10px;
          }
          .title {
            color: #ffffff4d;
          }
        }
      }
    }
  }
</style>

<template>
  <div v-show="!fullScreen" @click="showNormailPlayer" class="mini-player">
    <div class="cd-wrapper">
      <div ref="cdRef" class="cd">
        <img ref="cdImageRef" :class="cdCls" :src="currentSong.pic" alt="" />
      </div>
    </div>
    <div ref="sliderWrapperRef" class="slider-wrapper">
      <div class="slider-group">
        <div class="slider-page" v-for="song in playList" :key="song.id">
          <h2 class="name">{{ song.name }}</h2>
          <p class="desc">{{ song.singer }}</p>
        </div>
      </div>
    </div>
    <div class="control">
      <progress-circle
        :radius="32"
        :progress="progress"
        @click.stop="togglePlay"
      >
        <i class="icon-mini" :class="miniPlayIcon"></i>
      </progress-circle>
    </div>
    <div class="control" @click.stop="showPlayList">
      <i class="icon-playlist"></i>
    </div>
    <playlist ref="palyListRef"></playlist>
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import useCd from './useCd';
import progressCircle from './progress-circle';
import useMiniSilder from './useMiniSilder';
import Playlist from './playlist';
export default {
  components: { progressCircle, Playlist },
  name: 'mini-player',
  props: {
    progress: {
      type: Number,
      default: 0
    },
    togglePlay: Function
  },
  setup() {
    const palyListRef = ref(null)

    const store = useStore();
    const currentSong = computed(() => store.getters.currentSong);
    const playList = computed(() => store.state.playList);
    const fullScreen = computed(() => store.state.fullScreen);
    const playing = computed(() => store.state.playing);

    const miniPlayIcon = computed(() => {
      return playing.value ? 'icon-pause-mini' : 'icon-play-mini';
    });

    function showNormailPlayer() {
      store.commit('setFullScreen', true);
    }

    function showPlayList() {
      palyListRef.value.show()
    }
    const { cdCls, cdRef, cdImageRef } = useCd();
    const { sliderWrapperRef } = useMiniSilder();
    return {
      currentSong,
      playList,
      fullScreen,
      playing,
      showNormailPlayer,
      miniPlayIcon,
      // cd
      cdCls,
      cdRef,
      cdImageRef,
      // mini-slider
      sliderWrapperRef,
      // palylist
      palyListRef,
      showPlayList
    };
  }
};
</script>

<style lang="scss" scoped>
.mini-player {
  display: flex;
  align-items: center;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 180;
  width: 100%;
  height: 60px;
  background: $color-highlight-background;
  .cd-wrapper {
    flex: 0 0 40px;
    width: 40px;
    height: 40px;
    padding: 0 10px 0 20px;
    .cd {
      height: 100%;
      width: 100%;
      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        &.playing {
          animation: rotate 10s linear infinite;
        }
        &.pause {
          animation-play-state: paused;
        }
      }
    }
  }
  .slider-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    line-height: 20px;
    overflow: hidden;
    .slider-group {
      position: relative;
      overflow: hidden;
      white-space: nowrap;
      .slider-page {
        display: inline-block;
        width: 100%;
        transform: translate3d(0, 0, 0);
        backface-visibility: hidden;
        .name {
          margin-bottom: 2px;
          @include no-wrap();
          font-size: $font-size-medium;
          color: $color-text;
        }
        .desc {
          @include no-wrap();
          font-size: $font-size-small;
          color: $color-text-d;
        }
      }
    }
  }
  .control {
    flex: 0 0 30px;
    width: 30px;
    padding: 0 10px;
    .icon-playlist {
      position: relative;
      top: -2px;
      font-size: 28px;
      color: $color-theme-d;
    }
    .icon-mini {
      position: absolute;
      left: 0;
      top: 0;
      color: $color-theme-d;
      font-size: 32px;
    }
  }
  &.mini-enter-active,
  &.mini-leave-active {
    transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
  }
  &.mini-enter-from,
  &.mini-leave-to {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }
}
</style>

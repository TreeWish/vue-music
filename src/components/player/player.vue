<template>
  <div class="player">
    <div class="normal-play" v-show="fullScreen">
      <div class="background">
        <img :src="currentSong.pic">
      </div>
      <div class="top">
        <div class="back" @click="goBack">
          <i class="icon-back"></i>
        </div>
        <div class="title">{{currentSong.name}}</div>
        <div class="subtitle">{{currentSong.singer}}</div>
      </div>
      <div class="bottom">
        <div class="operators">
          <div class="icon i-left">
            <i :class="modeIcon" @click="changeMode"></i>
          </div>
          <div class="icon i-left" :class="disabledCls">
            <i class="icon-prev" @click="prev"></i>
          </div>
          <div class="icon i-center" :class="disabledCls">
            <i :class="playIcon" @click="togglePlay"></i>
          </div>
          <div class="icon icon-right" :class="disabledCls">
            <i class="icon-next" @click="next"></i>
          </div>
           <div class="icon icon-right">
            <i :class="favoriteIcon" @click="toggleFavorite"></i>
          </div>
        </div>
      </div>
    </div>
    <audio
      ref="audioRef"
      @pause="pause"
      @canplay="ready"
      @error="error"
      ></audio>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { ref, computed, watch } from 'vue'
import { useMode } from './useMode'
import { useFavorite } from './useFavorite'

export default {
  setup() {
    const store = useStore()
    const audioRef = ref(null)
    const songReady = ref(false)
    const currentSong = computed(() => store.getters.currentSong)
    const fullScreen = computed(() => store.state.fullScreen)
    const playing = computed(() => store.state.playing)
    const playList = computed(() => store.state.playList)
    const currentIndex = computed(() => store.state.currentIndex)
    const disabledCls = computed(() => {
      return songReady.value ? '' : 'disable'
    })
    const playIcon = computed(() => {
      return playing.value ? 'icon-pause' : 'icon-play'
    })
    watch(playing, (newPlay) => {
      if (!songReady.value) {
        return
      }
      const audioElement = audioRef.value
      if (newPlay) {
        audioElement.play()
      } else {
        audioElement.pause()
      }
    })

    watch(currentSong, (newSong) => {
      if (!newSong.id || !newSong.url) {
        return
      }
      songReady.value = false
      const audioElement = audioRef.value

      audioElement.src = newSong.url
      audioElement.play()
    })

    function goBack() {
      store.commit('setFullScreen', false)
    }
    function togglePlay() {
      if (!songReady.value) {
        return
      }
      store.commit('setPlayState', !playing.value)
    }
    function pause() {
      store.commit('setPlayState', false)
    }
    function prev() {
      const list = playList.value
      if (!songReady.value || !list.length) {
        return
      }
      if (list.length === 1) {
        loop()
      } else {
        let index = currentIndex.value - 1
        if (index === -1) {
          index = list.length - 1
        }
        store.commit('setCurrentIndex', index)
        if (!playing.value) {
          store.commit('setPlayState', true)
        }
      }
    }
    function next() {
      const list = playList.value
      if (!songReady.value || !list.length) {
        return
      }
      if (list.length === 1) {
        loop()
      } else {
        let index = currentIndex.value + 1
        if (index === list.length) {
          index = 0
        }
        store.commit('setCurrentIndex', index)
        if (!playing.value) {
          store.commit('setPlayState', true)
        }
      }
    }
    function loop() {
      const audioElement = audioRef.value
      audioElement.currentTime = 0
      audioElement.play()
      store.commit('setPlayState', true)
    }
    function ready() {
      if (songReady.value) {
        return
      }
      songReady.value = true
    }
    function error() {
      songReady.value = true
    }
    const { modeIcon, changeMode } = useMode()
    const { favoriteIcon, toggleFavorite } = useFavorite()

    return {
      audioRef,
      currentSong,
      fullScreen,
      goBack,
      togglePlay,
      playIcon,
      pause,
      prev,
      next,
      loop,
      songReady,
      disabledCls,
      ready,
      error,
      modeIcon,
      changeMode,
      favoriteIcon,
      toggleFavorite
    }
  }
}
</script>

<style lang="scss" scoped>
  .player {
    .normal-play {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 150;
      background-color: $color-background;
      .background {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        opacity: 6;
        filter: blur(20px);
        img {
          width: 100%;
          height: 100%;
        }
      }
      .top {
        position: relative;
        margin-bottom: 25px;
        height: 40px;
        width: 100%;
        .back {
          position: absolute;
          top: 0;
          left: 6px;
          z-index: 50;
          .icon-back {
            display: block;
            padding: 9px;
            font-size: $font-size-large-x;
            color: $color-theme;
            transform: rotate(-90deg);
          }
        }
        .title {
          width: 70%;
          margin: 0 auto;
          text-align: center;
          line-height: 40px;
          font-size: $font-size-large;
          color: $color-text;
          @include no-wrap();
        }
        .subtitle {
          line-height: 20px;
          text-align: center;
          font-size: $font-size-medium;
          color: $color-text;
        }
      }
      .bottom {
        position: absolute;
        bottom: 50px;
        width: 100%;
        .operators {
          display: flex;
          justify-content: space-around;
          align-items: center;
          font-size: 30px;
          padding: 0 20px;
          .icon {
            color: $color-theme;
            &.disable {
              color: $color-theme-d;
              // 禁用鼠标点击事件
              // pointer-events: none;
            }
            .icon-favorite {
              color: $color-sub_theme;
            }
          }
          .i-center {
            font-size: 40px;
          }
        }
      }
    }
  }
</style>

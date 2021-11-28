<template>
  <div class="player">
    <div class="normal-play" v-show="fullScreen">
      <div class="background">
        <img :src="currentSong.pic" />
      </div>
      <div class="top">
        <div class="back" @click="goBack">
          <i class="icon-back"></i>
        </div>
        <div class="title">{{ currentSong.name }}</div>
        <div class="subtitle">{{ currentSong.singer }}</div>
      </div>
      <div class="middle">
        <div class="middle-l">
          <div ref="cdWrapperRef" class="cd-wrapper">
            <div ref="cdRef" class="cd">
              <img
                ref="cdImageRef"
                class="image"
                :class="cdCls"
                :src="currentSong.pic"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="bottom">
        <div class="progress-wrapper">
          <span class="time time-l">{{ formatTime(currentTime) }}</span>
          <div class="progress-bar-wrapper">
            <progress-bar
              :progress="progress"
              @progress-changing="onProgressChanging"
              @progress-changed="onProgressChanged"
            ></progress-bar>
          </div>
          <span class="time time-r">{{
            formatTime(currentSong.duration)
          }}</span>
        </div>
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
            <i
              :class="getFavoriteIcon(currentSong)"
              @click="toggleFavorite(currentSong)"
            ></i>
          </div>
        </div>
      </div>
    </div>
    <audio
      ref="audioRef"
      @pause="pause"
      @canplay="ready"
      @error="error"
      @timeupdate="updateTime"
      @ended="end"
    ></audio>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { ref, computed, watch } from 'vue';
import useMode from './useMode';
import useFavorite from './useFavorite';
import useCd from '@/components/player/useCd';
import ProgressBar from './progress-bar.vue';
import { formatTime } from '@/assets/js/utils';
import { PLAY_MODE } from '@/assets/js/constant';
export default {
  components: {
    ProgressBar
  },
  setup() {
    const store = useStore();
    const audioRef = ref(null);
    const songReady = ref(false);
    const currentTime = ref(0);
    let progressChanging = false;
    const currentSong = computed(() => store.getters.currentSong);
    const fullScreen = computed(() => store.state.fullScreen);
    const playing = computed(() => store.state.playing);
    const playList = computed(() => store.state.playList);
    const currentIndex = computed(() => store.state.currentIndex);
    const playMode = computed(() => store.state.playMode);
    const disabledCls = computed(() => {
      return songReady.value ? '' : 'disable';
    });
    const playIcon = computed(() => {
      return playing.value ? 'icon-pause' : 'icon-play';
    });
    const progress = computed(() => {
      return currentTime.value / currentSong.value.duration;
    });
    watch(playing, newPlay => {
      if (!songReady.value) {
        return;
      }
      const audioElement = audioRef.value;
      if (newPlay) {
        audioElement.play();
      } else {
        audioElement.pause();
      }
    });

    watch(currentSong, newSong => {
      if (!newSong.id || !newSong.url) {
        return;
      }
      currentTime.value = 0;
      songReady.value = false;
      const audioElement = audioRef.value;

      audioElement.src = newSong.url;
      audioElement.play();
    });

    function goBack() {
      store.commit('setFullScreen', false);
    }
    function togglePlay() {
      if (!songReady.value) {
        return;
      }
      store.commit('setPlayState', !playing.value);
    }
    function pause() {
      store.commit('setPlayState', false);
    }
    function prev() {
      const list = playList.value;
      if (!songReady.value || !list.length) {
        return;
      }
      if (list.length === 1) {
        loop();
      } else {
        let index = currentIndex.value - 1;
        if (index === -1) {
          index = list.length - 1;
        }
        store.commit('setCurrentIndex', index);
        if (!playing.value) {
          store.commit('setPlayState', true);
        }
      }
    }
    function next() {
      const list = playList.value;
      if (!songReady.value || !list.length) {
        return;
      }
      if (list.length === 1) {
        loop();
      } else {
        let index = currentIndex.value + 1;
        if (index === list.length) {
          index = 0;
        }
        store.commit('setCurrentIndex', index);
        if (!playing.value) {
          store.commit('setPlayState', true);
        }
      }
    }
    function loop() {
      const audioElement = audioRef.value;
      audioElement.currentTime = 0;
      audioElement.play();
      store.commit('setPlayState', true);
    }
    function ready() {
      if (songReady.value) {
        return;
      }
      songReady.value = true;
    }
    function error() {
      songReady.value = true;
    }
    function updateTime(e) {
      if (!progressChanging) {
        currentTime.value = e.target.currentTime;
      }
    }
    function onProgressChanging(progress) {
      progressChanging = true;
      currentTime.value = currentSong.value.duration * progress;
    }
    function onProgressChanged(progress) {
      progressChanging = false;
      audioRef.value.currentTime = currentTime.value =
        currentSong.value.duration * progress;
      store.commit('setPlayState', true);
    }
    function end() {
      currentTime.value = 0;
      if (playMode.value === PLAY_MODE.loop) {
        loop();
      } else {
        next();
      }
    }
    const { modeIcon, changeMode } = useMode();
    const { getFavoriteIcon, toggleFavorite } = useFavorite();
    const { cdCls, cdRef, cdImageRef } = useCd();

    return {
      // player
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
      // mode
      songReady,
      disabledCls,
      ready,
      error,
      modeIcon,
      changeMode,
      // favorite
      getFavoriteIcon,
      toggleFavorite,
      // progress
      progress,
      currentTime,
      formatTime,
      updateTime,
      onProgressChanging,
      onProgressChanged,
      end,
      // cd
      cdCls,
      cdRef,
      cdImageRef
    };
  }
};
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
    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;
      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;
        .cd-wrapper {
          position: absolute;
          left: 50%;
          top: 0;
          transform: translate(-50%, 0);
          width: 80%;
          height: 100%;
          box-sizing: border-box;
          .cd {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            img {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border-radius: 50%;
              border: 10px solid rgba(255, 255, 255, 0.1);
            }
            .playing {
              animation: rotate 20s linear infinite;
            }
          }
        }
      }
    }
    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;
      .progress-wrapper {
        width: 80%;
        display: flex;
        // justify-content: center;
        margin: 0 auto;
        align-items: center;
        padding: 10px 0;
        .time {
          width: 40px;
          font-size: $font-size-small;
        }
        .time-l {
          text-align: left;
        }
        .time-r {
          text-align: right;
        }
        .progress-bar-wrapper {
          flex: 1;
        }
      }
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

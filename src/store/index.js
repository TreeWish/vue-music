import { createStore, createLogger } from 'vuex'
import { shuffle } from '@/assets/js/utils'
import { PLAY_MODE, FAVORITE_KEY } from '@/assets/js/constant'
import { load } from '@/assets/js/array-store'

const debug = process.env.NODE_ENV !== 'production'
export default createStore({
  state: {
    sequenceList: [],
    playList: [],
    playing: false,
    playMode: PLAY_MODE.sequence,
    currentIndex: 0,
    fullScreen: false,
    favoriteList: load(FAVORITE_KEY)
  },
  getters: {
    currentSong (state) {
      return state.playList[state.currentIndex] || {}
    }
  },
  mutations: {
    setSequenceList(state, list) {
      state.sequenceList = list
    },
    setPlayList(state, list) {
      state.playList = list
    },
    setPlayState(state, playing) {
      state.playing = playing
    },
    setPlayMode(state, mode) {
      state.playMode = mode
    },
    setCurrentIndex(state, index) {
      state.currentIndex = index
    },
    setFullScreen(state, fullScreen) {
      state.fullScreen = fullScreen
    },
    setFavoriteList(state, list) {
      state.favoriteList = list
    }
  },
  actions: {
    selectPlay({ commit }, { list, index }) {
      commit('setSequenceList', list)
      commit('setPlayList', list)
      commit('setPlayState', true)
      commit('setPlayMode', PLAY_MODE.sequence)
      commit('setCurrentIndex', index)
      commit('setFullScreen', true)
    },
    randomPlay({ commit }, list) {
      commit('setSequenceList', list)
      commit('setPlayState', true)
      commit('setPlayMode', PLAY_MODE.random)
      commit('setCurrentIndex', 0)
      commit('setFullScreen', true)
      commit('setPlayList', shuffle(list))
    },
    changeMode({ commit, state, getters }, mode) {
      const id = getters.currentSong.id
      if (mode === PLAY_MODE.random) {
        commit('setPlayList', shuffle(state.sequenceList))
      } else if (mode === PLAY_MODE.loop) {
        commit('setPlayList', [getters.currentSong])
      } else {
        commit('setPlayList', state.sequenceList)
      }
      const index = state.playList.findIndex(song => song.id === id)
      commit('setCurrentIndex', index)
      commit('setPlayMode', mode)
    }
  },
  strict: debug,
  plugins: debug ? [createLogger()] : [],
  modules: {
  }
})

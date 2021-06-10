import { createStore, createLogger } from 'vuex'
import { shuffle } from '@/assets/js/utils'
const PLAY_MODE = {
  sequence: 0,
  loop: 1,
  random: 2
}
const debug = process.env.NODE_ENV !== 'production'
export default createStore({
  state: {
    sequenceList: [],
    playList: [],
    playing: false,
    playMode: PLAY_MODE.sequence,
    currentIndex: 0,
    fullScreen: false
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
    }
  },
  strict: debug,
  plugins: debug ? [createLogger()] : [],
  modules: {
  }
})

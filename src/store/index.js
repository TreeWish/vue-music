import { createStore, createLogger } from 'vuex';
import { shuffle } from '@/assets/js/utils';
import { PLAY_MODE, FAVORITE_KEY, SEARCH_KET } from '@/assets/js/constant';
import { load } from '@/assets/js/array-store';

const debug = process.env.NODE_ENV !== 'production';
export default createStore({
  state: {
    sequenceList: [],
    playList: [],
    playing: false,
    playMode: PLAY_MODE.sequence,
    currentIndex: 0,
    fullScreen: false,
    favoriteList: load(FAVORITE_KEY),
    searchHistroy: load(SEARCH_KET)
  },
  getters: {
    currentSong(state) {
      return state.playList[state.currentIndex] || {};
    }
  },
  mutations: {
    setSequenceList(state, list) {
      state.sequenceList = list;
    },
    setPlayList(state, list) {
      state.playList = list;
    },
    setPlayState(state, playing) {
      state.playing = playing;
    },
    setPlayMode(state, mode) {
      state.playMode = mode;
    },
    setCurrentIndex(state, index) {
      state.currentIndex = index;
    },
    setFullScreen(state, fullScreen) {
      state.fullScreen = fullScreen;
    },
    setFavoriteList(state, list) {
      state.favoriteList = list;
    },
    addSongLyric(state, { song, lyric }) {
      state.sequenceList.forEach(item => {
        if (item.mid === song.mid) {
          item.lyric = lyric;
          return item;
        }
      });
    },
    setSearchHistory(state, searches) {
      state.searchHistroy = searches
    }
  },
  actions: {
    selectPlay({ commit }, { list, index }) {
      commit('setSequenceList', list);
      commit('setPlayList', list);
      commit('setPlayState', true);
      commit('setPlayMode', PLAY_MODE.sequence);
      commit('setCurrentIndex', index);
      commit('setFullScreen', true);
    },
    randomPlay({ commit }, list) {
      commit('setSequenceList', list);
      commit('setPlayState', true);
      commit('setPlayMode', PLAY_MODE.random);
      commit('setCurrentIndex', 0);
      commit('setFullScreen', true);
      commit('setPlayList', shuffle(list));
    },
    changeMode({ commit, state, getters }, mode) {
      const id = getters.currentSong.id;
      if (mode === PLAY_MODE.random) {
        commit('setPlayList', shuffle(state.sequenceList));
      } else if (mode === PLAY_MODE.loop) {
        commit('setPlayList', [getters.currentSong]);
      } else {
        commit('setPlayList', state.sequenceList);
      }
      const index = state.playList.findIndex(song => song.id === id);
      commit('setCurrentIndex', index);
      commit('setPlayMode', mode);
    },
    removeSong({ commit, state }, song) {
      // 克隆副本，以备splice state vuex报错
      const sequenceList = state.sequenceList.slice();
      const playList = state.playList.slice();

      const sequenceIndex = findIndex(sequenceList, song);
      const playIndex = findIndex(playList, song);

      if (sequenceIndex < 0 || playIndex < 0) {
        return;
      }
      sequenceList.splice(sequenceIndex, 1);
      playList.splice(playIndex, 1);

      let currentIndex = state.currentIndex;
      if (currentIndex > playIndex || currentIndex === playList.length) {
        currentIndex--;
      }

      commit('setSequenceList', sequenceList);
      commit('setPlayList', playList);
      commit('setCurrentIndex', currentIndex);
      if (!playList.length) {
        commit('setPlayState', false);
      }
    },
    clearSongList({ commit }) {
      commit('setSequenceList', []);
      commit('setPlayList', []);
      commit('setCurrentIndex', 0);
      commit('setPlayState', false);
    },
    addSong({ commit, state }, song) {
      const sequenceList = state.sequenceList.slice();
      const playList = state.playList.slice();

      const sequenceIndex = findIndex(sequenceList, song);
      const playIndex = findIndex(playList, song);
      let currentIndex = state.currentIndex;
      if (playIndex > -1) {
        currentIndex = playIndex;
      } else {
        playList.push(song);
        currentIndex = playList.length - 1;
      }
      if (sequenceIndex === -1) {
        sequenceList.push(song);
      }
      commit('setSequenceList', sequenceList);
      commit('setPlayList', playList);
      commit('setCurrentIndex', currentIndex);
      commit('setPlayState', true);
      commit('setFullScreen', true);
    }
  },
  strict: debug,
  plugins: debug ? [createLogger()] : [],
  modules: {}
});
function findIndex(list, song) {
  return list.findIndex(item => {
    return item.id === song.id;
  });
}

import { useStore } from 'vuex';
import { computed, watch, ref } from 'vue';
import { getLyric } from '@/service/song';
import Lyric from 'lyric-parser'

export default function useLyric({ songReady, currentTime }) {
  const currentLyric = ref(null)
  const currentLineNum = ref(0)
  const playingLyric = ref('')
  const pureMusicLyric = ref('')
  const lyricScrollRef = ref(null)
  const lyricListRef = ref(null)
  const store = useStore();
  const currentSong = computed(() => store.getters.currentSong);
  watch(currentSong, async newSong => {
    // 判断当时是否为有效歌曲
    if (!newSong.url || !newSong.id) {
      return;
    }
    stopLyric()
    currentLyric.value = null
    currentLineNum.value = 0
    playingLyric.value = ''
    pureMusicLyric.value = ''
    const lyric = await getLyric(newSong);
    store.commit('addSongLyric', { song: newSong, lyric });
    // 判断如果正在请求lyric，切换歌曲直接return
    if (currentSong.value.lyric !== lyric) {
      debugger
      return
    }
    currentLyric.value = new Lyric(lyric, handleLyric)
    const hasLyric = currentLyric.value.lines.length
    if (hasLyric) {
      if (songReady.value) {
        playLyric()
      }
    } else {
      playingLyric.value = pureMusicLyric.value = lyric.replace(/\[(\d{2}):(\d{2}):(\d{2})\]/g, '')
    }
    console.log(currentLyric.value);
  });
  function playLyric() {
    const currentLyricVal = currentLyric.value
    if (currentLyricVal) {
      currentLyricVal.seek(currentTime.value * 1000)
    }
  }

  function stopLyric() {
    const currentLyricVal = currentLyric.value
    if (currentLyricVal) {
      currentLyricVal.stop()
    }
  }

  function handleLyric({ lineNum, txt }) {
    currentLineNum.value = lineNum
    playingLyric.value = txt
    const scrollComp = lyricScrollRef.value
    const listEl = lyricListRef.value
    if (!listEl) {
      return
    }
    if (lineNum > 6) {
      const lineEl = listEl.children[lineNum - 5]
      scrollComp.scroll.scrollToElement(lineEl, 1000)
    } else {
      scrollComp.scroll.scrollTo(0, 0, 1000)
    }
  }
  return {
    currentLyric,
    currentLineNum,
    lyricScrollRef,
    lyricListRef,
    playLyric,
    stopLyric,
    playingLyric,
    pureMusicLyric
  }
}

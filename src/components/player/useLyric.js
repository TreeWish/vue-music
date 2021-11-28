import { useStore } from 'vuex';
import { computed, watch, ref } from 'vue';
import { getLyric } from '@/service/song';
import Lyric from 'lyric-parser'

export default function useLyric() {
  const currentLyric = ref(null)
  const store = useStore();
  const currentSong = computed(() => store.getters.currentSong);
  watch(currentSong, async newSong => {
    // 判断当时是否为有效歌曲
    if (!newSong.url || !newSong.id) return;
    const lyric = await getLyric(newSong);
    store.commit('addSongLyric', { song: newSong, lyric });
    // 判断如果正在请求lyric，切换歌曲直接return
    if (currentLyric.value.lyric !== lyric) return
    currentLyric.value = new Lyric(lyric, handleLyric)
  });
  function handleLyric() {}
}

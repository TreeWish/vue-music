import { computed } from 'vue'
import { useStore } from 'vuex'
import { FAVORITE_KEY } from '@/assets/js/constant.js'
import { save, remove } from '@/assets/js/array-store'
export default function useFavorite() {
  const store = useStore()
  const favoriteList = computed(() => store.state.favoriteList)
  function getFavoriteIcon(song) {
    return isFavorite(song) ? 'icon-favorite' : 'icon-not-favorite'
  }
  function isFavorite(song) {
    return favoriteList.value.findIndex(item => {
      return item.id === song.id
    }) > -1
  }
  function toggleFavorite(song) {
    function compare(item) {
      return item.id === song.id
    }
    let list = []
    if (isFavorite(song)) {
      list = remove(FAVORITE_KEY, compare)
    } else {
      list = save(song, FAVORITE_KEY, compare)
    }
    store.commit('setFavoriteList', list)
    return list
  }
  return {
    getFavoriteIcon,
    toggleFavorite
  }
}

import { SEARCH_KET } from '@/assets/js/constant';
import { save, remove, clear } from '@/assets/js/array-store';
import { useStore } from 'vuex';
export default function useSearchHistory() {
  const store = useStore();
  function saveHistory(query) {
    if (!query) {
      return;
    }
    const searches = save(query, SEARCH_KET, item => {
      return item === query;
    });

    store.commit('setSearchHistory', searches);
  }

  function deleteSearch(query) {
    const searches = remove(SEARCH_KET, item => {
      return item === query;
    });
    store.commit('setSearchHistory', searches);
  }

  function clearSearch(key) {
    const searches = clear(SEARCH_KET);
    store.commit('setSearchHistory', searches);
  }

  return {
    saveHistory,
    deleteSearch,
    clearSearch
  };
}

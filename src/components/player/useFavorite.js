import { computed, ref } from 'vue'

export function useFavorite() {
  const bol = ref(true)
  const favoriteIcon = computed(() => {
    return bol.value ? 'icon-not-favorite' : 'icon-favorite'
  })
  function toggleFavorite() {
    bol.value = !bol.value
  }

  return {
    favoriteIcon,
    toggleFavorite
  }
}

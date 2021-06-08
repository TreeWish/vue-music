<template>
  <div class="singer-detail">
    <music-list :songs="songs" :title="title" :pic="pic" :loading="loading"></music-list>
  </div>
</template>

<script>
import { getSingerDetail } from '@/service/singer'
import { processSongs } from '@/service/song'
import MusicList from '@/components/base/music-list/music-list'
export default {
  name: 'singer-detail',
  components: {
    MusicList
  },
  props: {
    singer: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      songs: [],
      loading: true
    }
  },
  async created() {
    const result = await getSingerDetail(this.singer)
    this.songs = await processSongs(result.songs)
    this.loading = false
  },
  computed: {
    title() {
      return this.singer && this.singer.name
    },
    pic() {
      return this.singer && this.singer.pic
    }
  }
}
</script>

<style lang="scss" scoped>
.singer-detail {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: #222;
}
</style>

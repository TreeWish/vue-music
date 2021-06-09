<template>
  <div class="singer-detail">
    <music-list :songs="songs" :title="title" :pic="pic" :loading="loading"></music-list>
  </div>
</template>

<script>
import storage from 'good-storage'
import { SINGER_KEY } from '@/assets/js/constant'
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
    const singer = this.computedSinger
    if (!singer) {
      const path = this.$route.matched[0].path
      this.$router.push({
        path
      })
      return
    }
    const result = await getSingerDetail(singer)
    this.songs = await processSongs(result.songs)
    this.loading = false
  },
  computed: {
    computedSinger() {
      let result = null
      const singer = this.singer
      if (singer) {
        result = singer
      } else {
        const cacheSinger = storage.session.get(SINGER_KEY)
        if (cacheSinger && cacheSinger.mid === this.$route.params.id) {
          result = cacheSinger
        }
      }
      return result
    },
    title() {
      const singer = this.computedSinger
      return singer && singer.name
    },
    pic() {
      const singer = this.computedSinger
      return singer && singer.pic
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

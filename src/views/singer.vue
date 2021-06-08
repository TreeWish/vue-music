<template>
  <div class="singer" v-loading="!singers.length">
    <index-list :data="singers" @select="onSelect"></index-list>
    <router-view :singer="selectSinger"></router-view>
  </div>
</template>

<script>
import { getSingerList } from '@/service/singer.js'
import IndexList from '@/components/base/index-list/index-list'
export default {
  name: 'Singer',
  components: {
    IndexList
  },
  data() {
    return {
      singers: [],
      selectSinger: null,
      rout: ''
    }
  },
  async created() {
    const result = await getSingerList()
    this.singers = result.singers
  },
  methods: {
    onSelect(singer) {
      this.selectSinger = singer
      this.$router.push({
        path: `/singer/${singer.mid}`
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .singer {
    height: 800px;
  }
</style>

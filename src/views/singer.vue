<template>
  <div class="singer" v-loading="!singers.length">
    <index-list :data="singers"></index-list>
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
      singers: []
    }
  },
  async created() {
    const result = await getSingerList()
    this.singers = result.singers
  }
}
</script>

<style lang="scss" scoped>
  .singer {
    height: 800px;
  }
</style>

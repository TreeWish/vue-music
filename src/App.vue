<template>
  <m-header />
  <tab />
  <router-view :style="viewStyle"></router-view>
  <player></player>
</template>
<script>
import Header from '@/components/header/header'
import Tab from '@/components/tab/tab.vue'
import Player from '@/components/player/player.vue'
import { mapState } from 'vuex'
export default {
  components: {
    MHeader: Header,
    Tab,
    Player
  },
  computed: {
    ...mapState(['playList']),
    viewStyle() {
      const bottom = this.playList.length ? '60px' : '0'
      return {
        bottom
      }
    }
  }
}
</script>
<style lang="scss">

</style>

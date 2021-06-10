<template>
  <m-header />
  <tab />
  <router-view></router-view>
  <player></player>
</template>
<script>
import Header from '@/components/header/header'
import Tab from '@/components/tab/tab.vue'
import Player from '@/components/player/player.vue'
export default {
  components: {
    MHeader: Header,
    Tab,
    Player
  }
}
</script>
<style lang="scss">

</style>

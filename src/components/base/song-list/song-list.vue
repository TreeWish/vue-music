<template>
  <ul class="song-list">
    <li class="item" v-for="(song, index) in songs" :key="song.id" @click="seleteItem(song, index)">
      <div class="content">
        <h2 class="name">{{song.name}}</h2>
        <p class="desc">{{getDesc(song)}}</p>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'song-list',
  props: {
    songs: {
      type: Object
    }
  },
  emits: ['select'],
  methods: {
    getDesc(song) {
      return `${song.singer} · ${song.album}`
    },
    seleteItem(song, index) {
      this.$emit('select', { song, index })
    }
  }
}
</script>

<style lang="scss" scoped>
.song-list {
  .item {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 64px;
    font-size: $font-size-medium;
    .content {
      flex: 1;
      line-height: 20px;
      overflow: hidden;
      .name {
        @include no-wrap();
      }
      .desc {
        @include no-wrap();
        margin-top: 4px;
        color: $color-text-l;
      }
    }
  }
}
</style>

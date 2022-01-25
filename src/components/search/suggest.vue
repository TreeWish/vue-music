<template>
  <div
    ref="rootRef"
    class="suggest"
    v-loading:[loadingText]="loading"
    v-no-result:[noResultText]="noResult"
  >
    <ul class="suggest-list">
      <li class="suggest-item" v-if="singer" @click="selectSinger(singer)">
        <div class="icon">
          <i class="icon-mine"></i>
        </div>
        <div class="name">
          <p class="text">{{ singer.name }}</p>
        </div>
      </li>
      <li
        class="suggest-item"
        v-for="song in songs"
        :key="song.id"
        @click="selectSong(song)"
      >
        <div class="icon">
          <i class="icon-music"></i>
        </div>
        <div class="name">
          <p class="text">{{ song.singer }}-{{ song.name }}</p>
        </div>
      </li>
      <div class="suggest-item" v-loading:[loadingText]="pullUpLoading"></div>
    </ul>
  </div>
</template>

<script>
import { ref, watch, computed, nextTick } from 'vue';
import { search } from '@/service/search';
import { processSongs } from '@/service/song';
import usePullUpLoad from '@/components/search/usePullUpLoad';
export default {
  name: 'suggest',
  props: {
    query: String,
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  emits: ['select-song', 'select-singer'],
  setup(props, { emit }) {
    const loadingText = ref('');
    const noResultText = ref('抱歉，搜素结果为空');
    const manualLoading = ref(false);

    const singer = ref();
    const songs = ref([]);
    // 记录是否还有更多数据的状态值
    const hasMore = ref(true);
    // 记录当前请求数据的页数
    const page = ref(1);

    const loading = computed(() => {
      return !singer.value && !songs.value.length;
    });

    const noResult = computed(() => {
      return !singer.value && !songs.value.length && !hasMore.value;
    });

    const pullUpLoading = computed(() => {
      return isPullUpLoad.value && hasMore.value;
    });

    const preventPullLoad = computed(() => {
      return loading.value || manualLoading.value;
    });

    watch(
      () => props.query,
      async newQuery => {
        if (!newQuery) {
          return;
        }
        await searchFirst();
      }
    );

    async function searchFirst() {
      // 重置数据
      page.value = 1;
      singer.value = null;
      songs.value = [];
      hasMore.value = true;

      const result = await search(props.query, page.value, props.showSinger);
      songs.value = await processSongs(result.songs);
      singer.value = result.singer;
      hasMore.value = result.hasMore;
      await nextTick();
      await makeItScrollable();
    }

    async function searchMore() {
      if (!hasMore.value || !props.query) {
        return;
      }
      page.value++;
      const result = await search(props.query, page.value, props.showSinger);
      songs.value = songs.value.concat(await processSongs(result.songs));
      singer.value = result.singer;
      hasMore.value = result.hasMore;

      await nextTick();
      await makeItScrollable();
    }

    // 如果当前的搜索获取的数据不足一屏,则轮询发起请求获取更多直到数据达到一屏
    async function makeItScrollable() {
      if (scroll.value.maxScrollY >= -1) {
        manualLoading.value = true;
        await searchMore();
        manualLoading.value = false;
      }
    }

    function selectSong(song) {
      emit('selectSong', song);
    }
    function selectSinger(singer) {
      emit('selectSinger', singer);
    }

    const { scroll, rootRef, isPullUpLoad } = usePullUpLoad(
      searchMore,
      preventPullLoad
    );
    return {
      loadingText,
      noResultText,
      singer,
      songs,
      loading,
      noResult,
      pullUpLoading,
      selectSong,
      selectSinger,
      // pullupload
      rootRef,
      scroll,
      isPullUpLoad
    };
  }
};
</script>

<style lang="scss" scoped>
.suggest {
  height: 100%;
  overflow: hidden;

  .suggest-list {
    padding: 0 30px;

    .suggest-item {
      display: flex;
      align-items: center;
      padding-bottom: 20px;

      .icon {
        flex: 0 0 30px;
        width: 30px;

        [class^='icon-'] {
          font-size: 14px;
          color: $color-text-d;
        }
      }

      .name {
        flex: 1;
        font-size: $font-size-medium;
        color: $color-text-d;
        overflow: hidden;

        .text {
          @include no-wrap();
        }
      }
    }
  }
}
</style>

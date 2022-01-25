<template>
  <div class="search">
    <div class="search-input-wrapper">
      <search-input v-model="query"></search-input>
    </div>
    <scroll ref="scrollRef" class="search-content" v-show="!query">
      <div>
        <div class="hot-keys">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li
              class="item"
              v-for="item in hotKeys"
              :key="item.id"
              @click="addQuery(item.key)"
            >
              <span>{{ item.key }}</span>
            </li>
          </ul>
        </div>
        <div class="search-history" v-show="searchHistory.length">
          <h1 class="title">
            <span class="text">搜索历史</span>
            <span class="clear" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
          </h1>
          <confirm
            ref="confirmRef"
            text="是否清空所有搜索历史"
            confirm-btn-text="清空"
            @confirm="clearSearch"
          >
          </confirm>
          <search-list
            :searches="searchHistory"
            @select="addQuery"
            @delete="deleteSearch"
          ></search-list>
        </div>
      </div>
    </scroll>
    <div class="search-result" v-show="query">
      <suggest
        :query="query"
        @select-song="selectSong"
        @select-singer="selectSinger"
      ></suggest>
    </div>
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :data="selectedSinger" />
      </transition>
    </router-view>
  </div>
</template>

<script>
import SearchInput from '@/components/search/search-input';
import Suggest from '@/components/search/suggest';
import SearchList from '@/components/search/search-list';
import { computed, nextTick, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { getHotKeys } from '@/service/search';
import storage from 'good-storage';
import { SINGER_KEY } from '@/assets/js/constant';
import useSearchHistory from '@/components/search/useSearchHistory';
import Scroll from '@/components/base/scroll/scroll';

export default {
  name: 'search',
  components: {
    SearchInput,
    Suggest,
    SearchList,
    Scroll
  },
  setup() {
    const query = ref('');
    const selectedSinger = ref(null);
    const hotKeys = ref([]);

    const scrollRef = ref(null);
    const confirmRef = ref(null);

    const store = useStore();
    const router = useRouter();

    const searchHistory = computed(() => store.state.searchHistroy);

    const { saveHistory, deleteSearch, clearSearch } = useSearchHistory();

    getHotKeys().then(result => {
      hotKeys.value = result.hotKeys;
    });

    watch(query, async (newQuery) => {
      if (!newQuery) {
        await nextTick()
        refreshScroll()
      }
    })
    function refreshScroll() {
      scrollRef.value.scroll.refresh()
    }

    function addQuery(s) {
      query.value = s;
    }

    function selectSong(song) {
      saveHistory(query.value);
      store.dispatch('addSong', song);
    }

    function selectSinger(singer) {
      saveHistory(query.value);
      selectedSinger.value = singer;
      cacheSinger(singer);
      router.push({
        path: `/search/${singer.mid}`
      });
    }

    function cacheSinger(singer) {
      storage.session.set(SINGER_KEY, singer);
    }
    return {
      scrollRef,
      confirmRef,
      query,
      hotKeys,
      searchHistory,
      addQuery,
      selectSong,
      selectSinger,
      selectedSinger,
      // searh-history
      deleteSearch,
      clearSearch
    };
  }
};
</script>

<style lang="scss" scoped>
.search {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  display: flex;
  flex-direction: column;
  .search-input-wrapper {
    margin: 20px;
  }
  .search-content {
    flex: 1;
    overflow: hidden;
    .hot-keys {
      margin: 0 20px 20px 20px;
      .title {
        margin-bottom: 20px;
        font-size: $font-size-medium;
        color: $color-text-l;
      }
      .item {
        display: inline-block;
        padding: 5px 10px;
        margin: 0 20px 10px 0;
        border-radius: 6px;
        background-color: $color-highlight-background;
        font-size: $font-size-medium;
        color: $color-text-d;
      }
    }
    .search-history {
      position: relative;
      margin: 0 20px;
      .title {
        display: flex;
        align-items: center;
        height: 40px;
        font-size: $font-size-medium;
        color: $color-text-d;
        .text {
          flex: 1;
        }
        .clear {
          @include extend-click();
          .icon-clear {
            font-size: $font-size-medium;
            color: $color-text-d;
          }
        }
      }
    }
  }
  .search-result {
    flex: 1;
    overflow: hidden;
  }
}
</style>

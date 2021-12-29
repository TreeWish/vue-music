import storage from 'good-storage';
import { processSongs } from '@/service/song';
import MusicList from '@/components/base/music-list/music-list';
export default function createDetailComponent(name, key, fetch) {
  return {
    name,
    components: {
      MusicList
    },
    props: {
      data: {
        type: Object,
        default() {
          return {};
        }
      }
    },
    data() {
      return {
        songs: [],
        loading: true
      };
    },
    async created() {
      const data = this.computedData;
      if (!data) {
        const path = this.$route.matched[0].path;
        this.$router.push({
          path
        });
        return;
      }
      const result = await fetch(data);
      this.songs = await processSongs(result.songs);
      this.loading = false;
    },
    computed: {
      computedData() {
        let result = null;
        const data = this.data;
        if (data) {
          result = data;
        } else {
          const cacheData = storage.session.get(key);
          if (cacheData && (cacheData.mid || cacheData.id + '') === this.$route.params.id) {
            result = cacheData;
          }
        }
        return result;
      },
      title() {
        const data = this.computedData;
        return data && (data.name || data.title);
      },
      pic() {
        const data = this.computedData;
        return data && data.pic;
      }
    }
  };
}

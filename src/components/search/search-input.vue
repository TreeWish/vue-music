<template>
  <div class="search-input">
    <i class="icon-search"></i>
    <input class="input-inner" v-model="query" :placeholder="placeholder" />
    <i v-show="query" class="icon-dismiss" @click="clear"></i>
  </div>
</template>

<script>
export default {
  name: 'search-input',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '搜索歌曲,歌手'
    }
  },
  data() {
    return {
      query: this.modelVal
    };
  },
  created() {
    this.$watch(
      'query',
      this.debounce(newQuery => {
        this.$emit('update:modelValue', newQuery.trim());
      }, 300)
    );

    this.$watch('modelValue', newVal => {
      this.query = newVal;
    });
  },
  methods: {
    clear() {
      this.query = '';
    },
    debounce(func, time) {
      let timer = null;
      return function(a, b) {
        clearInterval(timer);
        const args = arguments;
        timer = setTimeout(() => {
          func.apply(this, args);
        }, time);
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.search-input {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: 0 6px;
  height: 32px;
  background-color: $color-highlight-background;

  border-radius: 6px;
  .icon-search {
    font-size: 24px;
    color: $color-text-d;
  }
  .input-inner {
    flex: 1;
    margin: 0 5px;
    line-height: 18px;
    background-color: $color-highlight-background;
    color: $color-text;
    font-size: $font-size-medium;
    outline: 0;
    &::placeholder {
      color: $color-text-d;
    }
  }
  .icon-dismiss {
    font-size: 16px;
    color: $color-text-d;
  }
}
</style>

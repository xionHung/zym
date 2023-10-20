<template>
  <view class="md-search-wrap">
    <view class="md-search flex-start">
      <text class="icon-search"></text>
      <input
        @input="keyInput"
        :placeholder="placeholder"
        class="md-search-input"
      />
    </view>
  </view>
</template>

<script>
export default {
  name: 'search',
  props: {
    //查询提示文字
    placeholder: {
      type: String,
      default: '请输入'
    }
  },
  data() {
    return {};
  },
  methods: {
    /**
     * @desc 监听输入框的值
     */
    keyInput(event) {
      this.$emit('search', event.detail.value);
    }
  }
};
</script>

<style scoped lang="scss">
.md-search-wrap {
  padding: 20rpx 32rpx;

  .md-search {
    position: relative;
    color: #666;
    border-radius: 30rpx;
    background: #e5e5e5;
    /deep/ .uni-input-input,
    .uni-input-placeholder {
      font-size: 28rpx;
      color: inherit;
    }

    .icon-search {
      width: 72rpx;
      font-size: 38rpx;
      text-align: center;
    }

    &-input {
      flex: 1;
      margin: 0 auto;
      height: 60rpx;
      line-height: 60rpx;
      padding: 0 30rpx 0 4rpx;
      border: none;
    }
  }
}
</style>

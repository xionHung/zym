<template>
  <view class="md-panel">
    <view class="md-panel-position" @click="_click">
      <image
        class="icon"
        :src="IMGURL + 'img/arena/arena_tool.png'"
        mode="widthFix"
      />
      <view class="text">{{ title }}</view>
    </view>
    <slot />
  </view>
</template>

<script>
export default {
  props: {
    title: String,
  },
	methods: {
		_click() {
			this.$emit('click');
		}
	}
}
</script>

<style lang="scss" scoped>
.md-panel {
  padding: 57rpx 20rpx 46rpx;
  border-radius: 20rpx;
  background-color: #fff;
  position: relative;
  &-position {
    position: absolute;
    top: -8rpx;
    left: 0;
  }
  .icon {
    width: 216rpx;
  }
  .text {
    width: 100%;
    color: #fffefe;
    position: absolute;
    top: 8rpx;
    text-align: center;
    font-size: 28rpx;
    line-height: 1;
    font-weight: bold;
  }
}
</style>
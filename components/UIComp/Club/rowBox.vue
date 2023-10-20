<template>
  <view class="club-row flex" @click="_click">
    <md-avatar :src="obj.club_headpic" :width="76" />
    <view class="centent-box">
      <view class="flex mb-6">
        <text>{{ obj.name }}</text>
        <text class="number">{{ "(" + obj.count + "人)" }}</text>
        <image
          v-if="obj.is_vip == 1"
          class="union-icon"
          :src="IMGURL + 'img/club/union.png'"
          mode="heightFix"
        />
      </view>
      <md-star :number="obj.activity_level" />
    </view>
    <text class="icon-right" />
  </view>
</template>

<script>
export default {
  props: {
    obj: {
      type: Object,
      default: () => {
        return {
          club_headpic: '',
          activity_level: 0,
        }
      }
    },
  },
  methods: {
    _click() {
      uni.navigateTo({
        url: '/pages/club/index?id=' + this.obj.id
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.club-row {
  height: 120rpx;
  padding: 0 30rpx;
  .union-icon {
    height: 32rpx;
  }
  .centent-box {
    flex: 1;
    margin: 0 16rpx;
    color: #333;
    font-size: 30rpx;
    font-weight: bold;
    .number {
      margin: 0 10rpx;
      color: #666;
      font-size: 20rpx;
    }
  }
}
</style>
<template>
  <PageComp
    title="羽盟卡"
    :isApplique="false"
    navStyle="background-color: #fff"
  >
    <view class="top-card">
      <view class="top-card-title flex-space-between">
        <view class="title">{{ "羽盟卡" }}</view>
      </view>
      <view class="mark">
        <view>{{ "1.本卡一经购买，不可退卡" }}</view>
        <view>{{ "2.本卡有效期一个月" }}</view>
        <view>{{ "3.本卡仅限于联盟商家的球馆和俱乐部使用" }}</view>
      </view>
    </view>
    <view class="notes">
      <md-linear-title title="购买须知" />
      <ul class="notes-ul">
        <li>{{ "全国范围开通联盟商家的球馆或俱乐部都可使用" }}</li>
        <li>{{ "购买完当月可获得8张3元抵用券，当月末使用完 不累积到下月" }}</li>
      </ul>
    </view>
    <view class="footer-container" slot="footer">
      <view class="remark-text">{{
        "已购用户8张未消耗完之前不能再次购买 拷贝"
      }}</view>
      <view class="btns">
        <view class="left">
          <text class="fs-26">{{ "剩余:" }}</text>
          <text class="fs-40 ml-8">{{ "8" }}</text>
          <text class="fs-30 ml-10">{{ "张" }}</text>
        </view>
        <view class="right">
          <image
            class="re-btn"
            :src="IMGURL + 'img/arena/re_btn.png'"
            mode="heightFix"
          />
          <view class="right-text">
            <text>{{ "¥" }}</text>
            <text class="fs-40 mr-24 ml-6">{{ "12" }}</text>
            <text>{{ "立即购买" }}</text>
          </view>
        </view>
      </view>
      <view class="remark" @click="details">{{ "交易明细" }}</view>
    </view>
  </PageComp>
</template>

<script>
export default {
  data() {
    return {
      show: false
    }
  },
  methods: {
    details() {
      uni.navigateTo({
        url: '/pages/home/other/arena/transactionDetails'
      });
    },
  }
}
</script>

<style lang="scss" scoped>
.top-card {
  height: 370rpx;
  margin: 20rpx 32rpx 40rpx 34rpx;
  background: linear-gradient(124deg, #f7edd7 0%, #e9ce93 100%);
  box-shadow: 0px 8rpx 22rpx 0px rgba(213, 213, 213, 0.09);
  border-radius: 20rpx;
  padding: 51rpx 102rpx 65rpx 35rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: #664630;
  font-size: 26rpx;
  .title {
    font-size: 38rpx;
    font-weight: bold;
    line-height: 1;
  }
  .mark {
    font-size: 20rpx;
    line-height: 30rpx;
  }
}
.notes {
  background: #ffffff;
  border: 1rpx solid #f2d9a1;
  border-radius: 20rpx;
  margin: 30rpx;
  padding: 36rpx 0;
  &-ul {
    padding-right: 66rpx;
    color: #333;
    font-size: 22rpx;
    font-weight: bold;
    & > li {
      line-height: 32rpx;
      margin-bottom: 28rpx;
    }
  }
}
.footer-container {
  margin: 0 71rpx;
  .btns {
    height: 105rpx;
    display: flex;
    align-items: center;
    background: #edd6a4;
    border-radius: 52rpx;
    font-size: 36rpx;
    font-weight: bold;
    color: #fff;
    .left {
      flex: 1;
      text-align: center;
    }
    .right {
      position: relative;
      height: 100%;
      .re-btn {
        height: 100%;
      }
      &-text {
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1;
        top: 0;
      }
    }
  }

  .remark {
    color: #dfc18d;
    font-size: 26rpx;
    font-weight: bold;
    line-height: 1;
    margin-top: 20rpx;
    text-align: center;
    margin-bottom: 40rpx;
  }
  .remark-text {
    font-size: 20rpx;
    color: #999;
    text-align: center;
    margin-bottom: 16rpx;
  }
}
</style>
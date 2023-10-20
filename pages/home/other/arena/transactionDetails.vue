<template>
  <!-- 羽盟卡交易明细 -->
  <PageComp
    title="交易明细"
    navStyle="color: #fff; background: rgb(254, 106, 28)"
  >
    <view slot="header" class="head-bg" />
    <mescroll-uni :fixed="false" ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback">
    <view class="list">
      <view
        class="item flex-space-between"
        v-for="(item, index) in list"
        :key="index"
      >
        <view class="left-icon">
          <text class="iconfont icon-qianbao1"></text>
        </view>
        <view class="center">
          <view class="title">{{ item.title }}</view>
          <text>{{ item.desc }}</text>
        </view>
        <view class="right">
          <text class="time">{{ item.addtime }}</text>
          <view>{{ item.money }}</view>
        </view>
      </view>
    </view>
    </mescroll-uni>
  </PageComp>
</template>

<script>
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
export default {
  mixins: [MescrollMixin],
  data() {
    return {
      listData: [],
    };
  },
  methods: {
    async upCallback(page) {
      let pageNum = page.num; // 页码, 默认从1开始
      let limit = page.size; // 页长, 默认每页10条
      try {
        let { data } = await this.$api.Card.unionCardBill({
          pageNum,
          limit,
        });
        if (!data) return this.mescroll.endErr();
        let curPageData = data.data || [];
        let curPageLen = curPageData.length;
        let totalSize = data.total;
        if (page.num == 1) this.listData = [];
        this.listData = this.listData.concat(curPageData);
        this.mescroll.endBySize(curPageLen, totalSize);
      } catch (err) {
        console.log(err)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.head-bg {
  width: 100%;
  height: 174rpx;
  background: rgb(254, 106, 28);
  border-radius: 0 0 380rpx 380rpx / 0 0 40rpx 40rpx;
}
.left-icon {
  width: 66rpx;
  height: 66rpx;
  line-height: 66rpx;
  text-align: center;
  background: #ff7234;
  border-radius: 50%;
  font-size: 43rpx;
  color: white;
}
.list {
  margin: 34rpx 60rpx;
  .item {
    height: 104rpx;
    border-bottom: 1rpx solid #f3f3f3;
    color: #333;
    font-size: 24rpx;
    font-weight: bold;
    &:first-child {
      border-top: 1rpx solid #f3f3f3;
    }
    .center {
      flex: 1;
      margin: 0 20rpx;
      color: #fe6a1c;
      font-size: 20rpx;
      .title {
        color: #333;
        font-size: 26rpx;
        line-height: 1;
        margin-bottom: 10rpx;
      }
    }
    .right {
      text-align: right;
    }
    .time {
      color: #999;
      font-size: 18rpx;
      line-height: 1;
      margin-bottom: 12rpx;
    }
  }
}
</style>
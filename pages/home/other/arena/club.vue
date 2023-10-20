<template>
  <PageComp
    title="入驻俱乐部"
    :isApplique="false"
    navStyle="background-color: #fff"
  >
    <mescroll-uni
      :fixed="false"
      ref="mescrollRef"
      @init="mescrollInit"
      @down="downCallback"
      @up="upCallback"
    >
      <view class="content">
        <view class="c-title"><text class="relative">入驻俱乐部</text></view>
        <view class="list">
          <view class="item" v-for="item in listData" :key="item.id" @click="_click(item.id)">
            <view class="top flex-space-between">
              <view class="t-left flex-start">
                <image
                  :src="item.club_headpic"
                  mode="aspectFill"
                  class="img"
                ></image>
                <view class="tl-info">
                  <view class="name"
                    >{{ item.name }}
                    <text class="num">（{{ item.count }}人）</text></view
                  >
                  <view class="star flex-start">
                    <image
                      class="icon"
                      :src="IMGURL + 'img/icon/star.png'"
                      v-for="o of item.activity_level"
                      :key="o"
                    >
                    </image>
                  </view>
                </view>
              </view>
              <text class="icon-right"></text>
            </view>
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
      id: null,
    };
  },
  onLoad(options) {
    this.id = options.id;
  },
  methods: {
    async upCallback(page) {
      let pageNum = page.num; // 页码, 默认从1开始
      let limit = page.size; // 页长, 默认每页10条
      try {
        let { data } = await this.$api.Room.enterClub({
          pageNum,
          limit,
          room_id: this.id,
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
    _click(id) {
      uni.navigateTo({ url: '/pages/club/index?id=' + id });
    }
  },
};
</script>

<style lang="scss" scoped>
.content {
  margin: 20rpx 30rpx;
  padding: 30rpx;
  background: #fff;
  box-shadow: 0px 4rpx 4rpx 0px rgba(153, 153, 153, 0.11);
  border-radius: 20rpx;
  .c-title {
    position: relative;
    margin-left: 20rpx;
    font-size: 30rpx;
    color: #333;
    font-weight: bold;
    line-height: 70rpx;
    &:before {
      content: "";
      position: absolute;
      left: 0;
      bottom: 16rpx;
      width: 55rpx;
      height: 12rpx;
      background: #ff945b;
      border-radius: 6rpx;
    }
  }
  .list {
    .item {
      border-bottom: 1px solid #e5e5e5;
      &:last-child {
        border-bottom: 0;
      }
      .top {
        height: 104rpx;
        color: #333;
        .t-left {
          .img {
            width: 76rpx;
            height: 76rpx;
            border-radius: 50%;
            margin-right: 18rpx;
          }
          .name {
            font-size: 30rpx;
            line-height: 1;
            font-weight: bold;
            margin-bottom: 11rpx;
            .num {
              font-size: 20rpx;
              color: #666;
              vertical-align: bottom;
              font-weight: normal;
            }
          }
        }
        .m-btn {
          width: 104rpx;
          height: 54rpx;
          border-radius: 10rpx;
          background: #ff5902;
          font-size: 38rpx;
          font-weight: bold;
          color: #fff;
        }
        .star {
          height: 22rpx;
          .icon {
            width: 21rpx;
            height: 21rpx;
            margin-right: 2rpx;
          }
        }
      }
    }
  }
}
</style>
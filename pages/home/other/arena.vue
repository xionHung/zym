<template>
  <view class="page-home">
    <CustomPage title="球馆">
      <view class="page-container" slot="content">
        <view class="search-container flex">
          <view class="input-inner flex1 flex-start">
            <image
              class="icon"
              :src="IMGURL + 'img/icon/search.png'"
              mode="widthFix"
            ></image>
            <input
              class="input"
              v-model="keyword"
              placeholder-style="color: #FDEADF"
              placeholder="搜索球馆"
              @blur="searchEvent"
            />
          </view>
        </view>
        <view class="banner-container">
          <HomeBanner height="260rpx" isInner />
        </view>
        <view class="content">
          <mescroll-uni
            :fixed="false"
            ref="mescrollRef"
            @init="mescrollInit"
            @down="downCallback"
            @up="upCallback"
          >
            <view class="tab-container flex-space-between">
              <view class="left">
                <view
                  class="item"
                  :class="{ active: current == 1 }"
                  @click="tabChange(1)"
                  >联盟球馆</view
                >
                <view
                  class="item"
                  :class="{ active: current == 0 }"
                  @click="tabChange(0)"
                  >全部球馆</view
                >
              </view>
              <button class="rbtn right-btn" @click="arenaCreate">
                球馆入驻
              </button>
            </view>
            <view class="list">
              <view
                class="item flex-start"
                v-for="item in listData"
                :key="item.id"
                @click="jumpDetail(item.id)"
              >
                <image
                  :src="item.room_headpic"
                  mode="aspectFill"
                  class="img"
                ></image>
                <view class="flex1 right">
                  <view class="title flex-space-between">
                    <view class="flex-start">
                      <text>{{ item.name }}</text>
                      <image
                        v-if="item.is_vip == 1"
                        class="union-icon"
                        :src="IMGURL + 'img/club/union.png'"
                        mode="heightFix"
                      />
                    </view>
                    <text class="icon-right"></text>
                  </view>
                  <view class="address flex">
                    <text class="icon-location"></text>
                    <view class="text-ellipsis">{{ item.address }}</view>
                    <view class="flex">
                      <view class="line"></view>
                      <view>{{ item.distance }}</view>
                    </view>
                  </view>
                  <view
                    class="flex-space-between"
                    style="align-items: flex-end"
                  >
                    <view class="tags">
                      <text
                        class="tag"
                        v-for="(o, idx) in item.room_device"
                        :key="idx"
                        v-if="idx < 3"
                        >{{ o }}</text
                      >
                    </view>
                    <button
                      class="rbtn right-btn"
                      @click.stop="predetermine(item.id)"
                    >
                      预定
                    </button>
                  </view>
                </view>
              </view>
            </view>
          </mescroll-uni>
        </view>
      </view>
    </CustomPage>
  </view>
</template>

<script>
import HomeBanner from "@/components/home-banner.vue";
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
export default {
  mixins: [MescrollMixin],
  components: {
    HomeBanner,
  },
  data() {
    return {
      keyword: '',
      current: 0,
      listData: [],
    };
  },
  computed: {
    hasRoom() {
      return this.$store.state.userInfo.has_room ? true : false;
    },
    address() {
      return this.$store.state.address;
    },
  },
  methods: {
    async upCallback(page) {
      let pageNum = page.num; // 页码, 默认从1开始
      let limit = page.size; // 页长, 默认每页10条
      try {
        let { data } = await this.$api.Room.getList({
          pageNum,
          limit,
          area_name: this.address.cityName || undefined,
          name: this.keyword,
          is_vip: this.current,
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
    tabChange(type) {
      this.current = type;
      this.mescroll.resetUpScroll();
    },
    searchEvent() {
      this.mescroll.resetUpScroll();
    },
    // 预定
    predetermine(id) {
      uni.navigateTo({ url: '/pages/arena/predetermine?id=' + id });
    },
    // 详情
    jumpDetail(id) {
      uni.navigateTo({ url: '/pages/arena/detail?id=' + id });
    },
    // 创建球馆
    arenaCreate() {
      if (this.hasRoom) return this.$toast('已有球馆，请到首页系统消息中查看账号');
      uni.navigateTo({ url: '/pages/arena/create' });
    }
  },
};
</script>

<style lang="scss" scoped>
.page-home {
  .union-icon {
    height: 32rpx;
    margin-left: 6rpx;
  }
  .page-container {
    position: relative;
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 0 30rpx;
    overflow: hidden;

    .search-container {
      flex: 0 0 60rpx;
      margin-top: 48rpx;
      height: 60rpx;
      color: #fff;
      margin-bottom: 32rpx;
      font-size: 28rpx;

      .input-inner {
        padding-left: 20rpx;
        height: 60rpx;
        margin: 0 22rpx;
        background: #fe8849;
        border-radius: 44rpx;

        .icon {
          width: 24rpx;
          height: 26rpx;
          margin-right: 20rpx;
        }

        .input {
          width: 600rpx;
          font-size: 22rpx;
        }
      }

      .btn {
        flex-direction: column;
        font-size: 24rpx;

        .icon {
          width: 28rpx;
          height: 34rpx;
          margin-bottom: 6rpx;
        }
      }
    }

    .banner-container {
      margin-bottom: 20rpx;
    }

    .content {
      position: relative;
      flex: 1;
      overflow-y: auto;
      padding: 20rpx 0;

      .tab-container {
        padding-left: 8rpx;
        margin-bottom: 30rpx;

        .left {
          display: flex;
          font-size: 22rpx;
          color: #666;
          align-items: flex-end;

          .item {
            margin-right: 52rpx;
          }

          .active {
            color: $themeColor;
            font-size: 36rpx;
            font-weight: bold;
          }
        }

        .right-btn {
          width: 190rpx;
          height: 60rpx;
          background: rgba(255, 202, 174, 0.6);
          border-radius: 30rpx;
          color: #ff5800;
          font-size: 26rpx;
        }
      }

      .list {
        .item {
          padding: 24rpx 20rpx 20rpx 22rpx;
          height: 190rpx;
          border: 2rpx solid rgba(254, 106, 28, 0.29);
          border-radius: 20rpx;
          margin-bottom: 18rpx;
          box-shadow: 0rpx 4rpx 4rpx 0rpx rgba(254, 106, 28, 0.22);
          background: #ffffff;

          .img {
            flex: none;
            width: 140rpx;
            height: 140rpx;
            border-radius: 14rpx;
            margin-right: 24rpx;
          }

          .right {
            font-size: 22rpx;
            color: #666;
            overflow: hidden;

            .title {
              line-height: 1;
              color: #333;
              font-weight: bold;
              font-size: 34rpx;
              margin-bottom: 18rpx;
            }

            .icon-right {
              font-size: 28rpx;
            }

            .address {
              margin-bottom: 2rpx;
              .line {
                width: 1rpx;
                height: 22rpx;
                background-color: #666;
                margin: 0 10rpx;
              }
            }

            .tags {
              .tag {
                display: inline-block;
                line-height: 36rpx;
                border-radius: 14rpx;
                background: #ededed;
                padding: 0 19rpx;
                margin-right: 16rpx;

                &:nth-last-child(1) {
                  margin-right: 0;
                }
              }
            }

            .right-btn {
              width: 114rpx;
              height: 54rpx;
              background: #fe6a1c;
              border-radius: 28rpx;
              font-size: 30rpx;
              color: #fff;
            }
          }
        }
      }
    }
  }
}
</style>
<template>
  <PageComp
    title="接龙活动"
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
        <view class="date-container">
          <view class="top flex-space-between">
            <text class="">{{ monthLabel }}</text>
            <image
              class="icon"
              :src="IMGURL + 'img/icon/calendar.png'"
              mode="widthFix"
              @click="openDate"
            />
          </view>
          <view class="bottom flex-space-between">
            <view
              class="date-item"
              v-for="item in dateList"
              :key="item.time"
              :class="{ active: checkDate == item.time }"
              @click="handleCheckDate(item)"
            >
              <view class="day">{{ item.time | getDay }}</view>
              <view class="date">{{ item.time | getDate }}</view>
            </view>
          </view>
        </view>
        <view class="list">
          <view
            class="item"
            v-for="item in listData"
            :key="item.id"
            @click="chainsClick(item)"
          >
            <view class="top flex-space-between">
              <view class="t-left flex-start">
                <image
                  :src="item.club_headpic"
                  mode="aspectFill"
                  class="img"
                  @click.stop="goClub(item.club_id)"
                ></image>
                <view class="tl-info">
                  <view class="name" @click.stop="goClub(item.club_id)">{{
                    item.club_name
                  }}</view>
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
            <view class="cont">
              <view class="line flex-space-between">
                <view class="flex-start">
                  <text class="iconfont icon-changguan mr-8"></text>
                  <text>{{ item.activity_name }} | {{ item.distance }}</text>
                </view>
                <text class="money" :class="status[item.status].class">{{
                  item.unit_price
                }}</text>
              </view>
              <view class="line flex-start">
                <text class="icon-clock mr-8"></text>
                <text class="time">{{ item.time }}</text>
              </view>
              <view class="line flex-start">
                <text class="iconfont icon-yonghu mr-8"></text>
                <text class="time">{{ item.sign_name }}</text>
              </view>
              <view class="line flex-start">
                <text class="iconfont icon-zuanshi mr-8"></text>
                <text class="time">{{ item.level_desc }}</text>
              </view>
              <view class="bottom flex-space-between">
                <view class="flex-start">
                  <button class="rbtn more-btn">
                    <text class="icon-more"></text>
                  </button>
                  <template v-if="item.room_device && item.room_device.length">
                    <text
                      class="tag"
                      v-for="(o, ti) in item.room_device"
                      :key="ti"
                      v-if="ti < 3"
                      >{{ o }}</text
                    >
                  </template>
                </view>
                <view class="flex-start">
                  <view class="act-type">{{ item.pay_aa.name }}</view>
                  <button
                    class="rbtn apply-btn"
                    :class="status[item.status].class"
                    @click.stop="handleClickItem(item)"
                  >
                    {{ item.status_name }}
                  </button>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </mescroll-uni>
    <md-modal :show.sync="alrmShow" hideButton>
      <view class="alrm-remark">{{
        "很抱歉，您的段位未达到该活动的 段位要求！"
      }}</view>
    </md-modal>
    <DatetimePicker
      ref="datePiker"
      @submit="checkDateEvent"
      :start-year="2000"
      :end-year="2099"
      :defaultValue="timeDate"
      :time-hide="[true, true, true, true, true, true]"
      :time-label="['年', '月', '日', '时', '分', '秒']"
    />
  </PageComp>
</template>

<script>
import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
import moment from 'moment';
import { dayList, levelKeys } from '@/utils/fileds';
import DatetimePicker from '@/components/datetime-picker';
export default {
  mixins: [MescrollMixin],
  components: {
    DatetimePicker,
  },
  data() {
    let nowDate = new Date(new Date().toLocaleDateString()).getTime();
    return {
      timeDate: nowDate,
      keyword: '',
      current: 0,
      listData: [],
      levelKeys,
      nowDate: nowDate,
      checkDate: nowDate,
      dateList: [],
      status: {
        '0': {
          class: 'cancel',
          button: '已取消'
        },
        '1': {
          class: 'start',
          button: '一键报名',
        },
        '2': {
          class: 'end',
          button: '已结束',
        },
      },
      id: null,
      alrmShow: false,
    };
  },
  filters: {
    disdanceLabel(num) {
      if (!num) return;
      return num >= 1000 ? (num / 1000).toFixed(2) + 'km' : num + 'm';
    },
    dateDayLabel(time) {
      let s_t = moment(time[0]).format('MM.DD HH:mm'),
        e_t = moment(time[1]).format('MM.DD HH:mm');
      return `${s_t.substring(0, 5)} ${dayList[moment(time[0]).get('day')]} ${s_t.substring(6, 11)}-${e_t.substring(6, 11)}`;
    },
    getDay(time) {
      let day = new Date(time).getDay();
      return day == new Date().getDay() ? '今天' : dayList[day];
    },
    getDate(time) {
      return new Date(time).getDate();
    }
  },
  computed: {
    monthLabel() {
      let d = new Date(this.nowDate);
      return `${d.getFullYear()}年${d.getMonth() + 1}月`
    }
  },
  onLoad(e) {
    this.id = e.id;
    this.timeList(this.nowDate)
  },
  methods: {
    async upCallback(page) {
      let pageNum = page.num; // 页码, 默认从1开始
      let limit = page.size; // 页长, 默认每页10条
      try {
        let { data } = await this.$api.Chains.getList({
          pageNum,
          limit,
          room_id: this.id,
          time: this.checkDate / 1000,
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
    openDate() {
      this.$refs.datePiker.show();
    },
    checkDateEvent(res) {
      this.nowDate = res.timeStr;
      this.timeList(res.time)
      this.checkDate = res.time;
      this.mescroll.resetUpScroll();
    },
    handleClickItem(item) {
      if (this.$store.state.userInfo.level < item.level) return this.alrmShow = true;
      if (item.status != 1) return;
      this.chainsClick(item);
    },
    chainsClick(row) {
      uni.navigateTo({
        url: '/pages/chains/chainsDetail?id=' + row.id + '&time=' + row.starttime,
      })
    },
    goClub(id) {
      uni.navigateTo({
        url: '/pages/club/index?id=' + id,
      })
    },
    handleCheckDate(item) {
      this.checkDate = item.time;
      this.mescroll.resetUpScroll();
    },
    timeList(date) {
      this.dateList = [];
      for (let i = 0; i < 7; i++) {
        this.dateList.push({
          time: date + (1000 * 60 * 60 * 24) * i,
        })
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.content {
  margin: 30rpx;

  .date-container {
    height: 210rpx;
    padding: 34rpx 20rpx 22rpx;
    background: #ffffff;
    border-radius: 20rpx;
    margin-bottom: 20rpx;
    color: #333;

    .top {
      font-size: 34rpx;
      font-weight: bold;
      margin-bottom: 22rpx;
      line-height: 1;

      .icon {
        width: 32rpx;
        height: 32rpx;
      }
    }

    .bottom {
      height: 100rpx;

      .date-item {
        position: relative;
        width: 80rpx;
        height: 100rpx;
        background: #f4f4f4;
        border-radius: 10rpx;
        text-align: center;
        font-size: 22rpx;

        .day {
          line-height: 50rpx;
        }

        .date {
          position: absolute;
          left: 0;
          width: 100%;
          bottom: 14rpx;
          line-height: 1;
          font-size: 34rpx;
          font-weight: bold;
        }

        &.active {
          background: #fe6a1c;
          color: #fff;
          font-size: 26rpx;
        }
      }
    }
  }

  .list {
    .item {
      // height: 362rpx;
      padding-bottom: 20rpx;
      border: 2rpx solid rgba(254, 106, 28, 0.3);
      border-radius: 20rpx;
      margin-bottom: 18rpx;
      box-shadow: 0rpx 4rpx 4rpx 0rpx rgba(254, 106, 28, 0.22);
      background: #ffffff;

      .top {
        height: 112rpx;
        padding: 0 51rpx 0 21rpx;
        color: #333;
        border-bottom: 2rpx solid #e7e7e7;

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
          }
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

      .cont {
        padding: 7rpx 30rpx 0 18rpx;
        line-height: 44rpx;
        font-size: 22rpx;
        color: #666;

        .icon {
          width: 24rpx;
          height: 24rpx;
          margin-right: 8rpx;
        }

        .money {
          font-size: 30rpx;
          color: #fe6a1c;
          margin-right: 40rpx;

          &.end,
          &.cancel {
            color: #999999;
          }
        }

        .bottom {
          margin-top: 10rpx;
        }

        .more-btn {
          width: 34rpx;
          height: 34rpx;
          border-radius: 50%;
          background: #f0f2f5;
          margin-right: 10rpx;
          color: #ccc;
        }

        .tag {
          height: 38rpx;
          border: 1px solid #fe6a1c;
          border-radius: 19rpx;
          padding: 0 24rpx;
          margin-right: 10rpx;
          color: #fe6a1c;
          line-height: 38rpx;
        }

        .act-type {
          font-size: 26rpx;
          font-weight: bold;
          line-height: 50rpx;
          color: #fe6a1c;
          font-style: italic;
          margin-right: 26rpx;
        }
      }

      .apply-btn {
        width: 140rpx;
        height: 50rpx;
        border-radius: 25rpx;
        background: #fe6a1c;
        color: #fff;
        font-size: 24rpx;

        &.cancel,
        &.end {
          background: #999;
        }
      }
    }
  }
}
.alrm-remark {
  color: #666;
  font-weight: bold;
  text-align: center;
}
</style>

<template>
  <PageComp
    title="会员充值"
    :isApplique="false"
    navStyle="background-color: #fff"
  >
    <view class="top-card">
			<!-- 右上角背景图 -->
			<image :src="IMGURL + 'img/jiangpai_bg.png'" mode="widthFix" class="coupon-bg"></image>
      <view class="top-card-title flex-space-between">
        <view class="title">{{ info.room_name }}</view>
        <view>充值卡</view>
      </view>
      <view class="mark">
        <view v-for="(item, index) in info.card_desc" :key="item">{{
          item
        }}</view>
      </view>
    </view>
    <view class="notes">
      <md-linear-title title="购买须知" />
      <view class="notes-ul">
        <view v-for="item in info.buy_desc" class="flex" :key="item">
          <view class="br-p50 wh-8 bg-black mr-18 flex-top-self mt-12"></view>
          <view class="flex1">{{ item }}</view>
        </view>
      </view>
    </view>
    <view class="footer-container" slot="footer">
      <view class="btns">
        <view class="left">
          <text class="fs-26">{{ "余额:" }}</text>
          <text class="fs-30 ml-8">{{ "¥" }}</text>
          <text class="fs-40 ml-10">{{ info.money }}</text>
        </view>
        <view class="right">
          <image
            class="re-btn"
            :src="IMGURL + 'img/arena/re_btn.png'"
            mode="heightFix"
          />
          <view class="right-text" @click="handleRecharge">{{ "充值" }}</view>
        </view>
      </view>
      <view class="remark" @click="details">{{ "交易明细" }}</view>
    </view>
    <!-- 弹窗 -->
    <md-b-dialog title="充值" :show.sync="show" customFooter>
      <!-- 余额 -->
      <view class="flex flex-between pb-43">
        <view>
          余额
          <text class="text-price" style="font-size: 46.25rpx">{{
            info.money
          }}</text>
          元
        </view>
        <text>交易明细</text>
      </view>
      <!-- 充值比例 -->
      <view class="border-bottom border-top pt-20 pb-20">
        <view class="text-left mb-26">充值比例</view>
        <view class="pl-29">
          <view class="flex wp-100">
            <md-radio
              v-model="check"
              :mode="3"
              :list="info.card_rule"
              :config="{ value: 'id' }"
              class="wp-100"
              @change="handleCheck"
            >
              <template v-slot="{ item }">
                <view class="flex">
                  <view>
                    充值
                    <text class="text-price fs-34 fw-bold">{{
                      item.recharge
                    }}</text>
                  </view>
                  <view class="ml-20">
                    赠送
                    <text class="text-price fs-34 fw-bold">{{
                      item.give
                    }}</text>
                  </view>
                </view>
              </template>
            </md-radio>
          </view>
        </view>
      </view>
      <view class="text-left mt-26 mb-48">
        充值后余额：
        <text class="text-price primary-color" style="font-size: 46rpx">{{
          total || info.money
        }}</text>
        元
      </view>
      <template #footer>
        <md-button class="pay-btn" @click="handlePay">立即购买</md-button>
      </template>
    </md-b-dialog>
  </PageComp>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      room_id: -1,
      info: {},
      check: null,
      total: 0
    };
  },
  onLoad(options) {
    const { id } = options;
    this.room_id = id;
    id && this.getRoomCard(id);
  },
  methods: {
    details() {
      uni.navigateTo({
        url: '/pages/home/other/arena/details'
      });
    },
    handleRecharge() {
      this.show = true;
    },
    handlePay() {
      if (!this.check) {
        uni.showModal({ content: '请先勾选！', showCancel: false });
        return;
      }
      this.roomCardBuy(this.check);
    },
    handleCheck(val) {
      const obj = this.info.card_rule.find((item) => item.id == val);
      // 计算充值后余额
      const rechargeVal = +obj.recharge + +obj.give;
      const totalVal = rechargeVal + +this.info.money;
      this.total = totalVal;
    },
    /**
     * 接口相关
     */
    async getRoomCard(room_id) {
      try {
        const res = await this.$api.Card.getRoomCard({ room_id });
        this.info = res.data;
      } catch (error) {
        console.error(error);
      }
    },
    async roomCardBuy(rule_id) {
      const room_id = this.room_id;
      try {
        const res = await this.$api.Card.roomCardBuy({ room_id, rule_id });
        const { config, pay_status } = res.data;
        // pay_status	string	支付状态 1待支付，唤起微信支付
        if (pay_status == 1) {
          // 唤起微信支付
          uni.requestPayment({
            provider: 'wxpay',
            ...config,
            timeStamp: config.timestamp,
            success(payRes) {
              uni.showModal({
                content: '支付成功',
                showCancel: false,
                success: function(r) {
                  if (r.confirm) {
                    this.show = false;
                    // 充值完成调整场馆详情
                    uni.navigateBack({
                      delta: 1
                    });
                  }
                }.bind(this)
              });
            },
            fail(e) {
              console.log('requestPayment::', e);
            }
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.top-card {
  height: 370rpx;
	position: relative;
	z-index: 1;
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
	.coupon-bg {
		position: absolute;
		right: 0;
		top: 0;
		width: 272rpx;
		z-index: -1;
	}
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
  padding: 36rpx;
  &-ul {
    padding-right: 66rpx;
    color: #333;
    font-size: 22rpx;
    font-weight: bold;
    & > view {
      line-height: 32rpx;
      margin-bottom: 28rpx;
    }
    .dian {
      width: 8rpx;
      height: 8rpx;
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
}

.pay-btn {
  /deep/ .md-btn {
    width: 500rpx;
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    background: #ec6826;
    border-radius: 40rpx;
    font-size: 40rpx;
    color: white;
  }
}
</style>

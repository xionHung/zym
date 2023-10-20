<template>
	<PageComp title="AA付款" :isApplique="false" navStyle="background: #fff" >
		<view class="top-card flex-center">
			<view>{{ pay_status == 2? '需支付': '已支付'}}</view>
			<view class="price">{{ '¥' + money }}</view>
			<view class="details">
				<view>
					<text class="label">{{ pay[pay_aa] }}</text>
					<text>{{ '¥' + total_moneys }}</text>
				</view>
			</view>
		</view>
		<view class="price-card" v-if="pay_status == 2">
			<view class="flex-space-between">
				<view>{{'微信支付'}}</view>
				<md-radio-circle v-model="wei" @click="weiClick" />
			</view>
			<view class="flex-space-between">
				<view>{{'是否使用羽盟卡'}}</view>
				<md-radio-circle v-model="is_union_card" @click="unionClick" />
			</view>
		</view>
		<view class="btns flex-center" @click="submit" v-if="pay_status == 2">{{ '确认支付' }}</view>
		<view class="items">
			<view class="mb-20 fw-bold">{{ pay_count + '人待支付，' + nopay_count + '人已支付'}}</view>
			<view class="flex item" v-for="(item, index) in listData" :key="index">
				<md-avatar :width="70" :sex="item.sex" :src="item.headpic" />
				<view class="name">{{ item.nickname }}</view>
				<view class="price" :class="{active: item.status == 1}">
					<text>{{ item.money_desc }}</text>
				</view>
			</view>
		</view>
	</PageComp>
</template>

<script>
	export default {
		data() {
			return {
				wei: true,
				is_union_card: false,
				
				pay_status: 2,
				total_moneys: '0.00',
				money: '0.00',
				pay_count: 0,
				nopay_count: 0,

				listData: [],
				pay_aa: 1,
				pay: {
					1: '活动支出',
					2: '用球支出',
					3: '其他支出',
				},
				id: null,
			}
		},
		onLoad(options) {
			this.id = options.id;
			this.init();
			
			// 扫码获取的联盟编码
			if (options.code) {
				this.$store.commit('SET_UNIONCODE', options.code);
			}
		},
		methods: {
			async init() {
				let { data } = await this.$api.Settle.aaPay({activity_id: this.id});
				this.listData = data.data;
				this.pay_aa = data.pay_aa;
				this.pay_status = data.pay_status;
				this.total_moneys = data.total_moneys;
				this.money = data.money;
				this.pay_count = data.pay_count;
				this.nopay_count = data.nopay_count;
			},
			async submit() {
				let { wei } = this;
				let parmas = {
					activity_id: this.id,
					pay_type: wei?1: 2
				}
				const { data } = await this.$api.Settle.pay(parmas);
				if (data.pay_status == 1) {
				  // 唤起微信支付
				  uni.requestPayment({
				    provider: 'wxpay',
				    ...data.config,
				    timeStamp: data.config.timestamp,
				    success: () => {
				      uni.showModal({
				        content: '支付成功',
				        showCancel: false,
				        success: function(r) {
				          if (r.confirm) {
				            this.show = false;
				            uni.redirectTo({
				            	url: '/pages/mine/order/index'
				            })
				          }
				        }.bind(this)
				      });
				    },
				    fail(e) {
				      console.log('requestPayment::', e);
				    }
				  });
				}
			},
			weiClick() {
				if (!this.wei) return this.wei = true;
				this.is_union_card = false;
			},
			unionClick() {
				if (!this.is_union_card) return this.is_union_card = true;
				this.wei = false;
			},
		}
	}
</script>

<style lang="scss" scoped>
	.top-card {
		height: 204rpx;
		flex-direction: column;
		color: #666;
		font-size: 22rpx;
		position: relative;
		.price {
			font-size: 70rpx;
			color: $themeColor;
			font-weight: bold;
		}
		.details {
			position: absolute;
			top: 20rpx;
			right: 20rpx;
			color: #333;
			font-size: 20rpx;
			.label {
				font-size: 14rpx;
				margin-right: 20rpx;
			}
		}
	}
	.price-card {
		margin: 0 30rpx 30rpx;
		background: #FFFFFF;
		border-radius: 20rpx;
		.flex-space-between {
			height: 118rpx;
			padding: 0 24rpx 0 60rpx;
			border-bottom: 1rpx solid #DFDFDF;
			font-size: 30rpx;
			color: #666;
			font-weight: bold;
			&:last-child {
				border: 0;
			}
		}
	}
	.btns {
		height: 70rpx;
		background: #FE6A1C;
		box-shadow: 9rpx 9rpx 35rpx 0px rgba(254,106,28,0.4);
		border-radius: 20rpx;
		margin: 0 30rpx;
		font-size: 30rpx;
		font-weight: bold;
		color: #FFFFFF;
	}
	.items {
		background: #FFFFFF;
		padding: 30rpx;
		font-size: 26rpx;
		color: #333333;
		margin-top: 84rpx;
		.item {
			padding-left: 18rpx;
			margin-bottom: 30rpx;
			&:last-child {
				margin-bottom: 0;
			}
			.name {
				flex: 1;
				margin: 0 36rpx;
			}
			.price {
				color: #999;
				&.active {
					color: $themeColor;
				}
			}
		}
	}
</style>
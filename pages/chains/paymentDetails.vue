<template>
	<PageComp title="收款明细" :isApplique="false" navStyle="background: #fff">
		<view class="box-car">
			<view class="remark">{{ '结算' + total_count + '人，' + nopay_count + '人待支付，' + pay_count + '人已支付' }}</view>
			<view class="box-container">
				<view class="flex personal-box" v-for="item in selectList" :key="item.id">
					<md-avatar :width="64" :sex="item.sex" :src="item.headpic" />
					<view class="flex-1 ml-10">
						<view class="flex">
							<view class="title">{{ item.nickname }}</view>
							<view v-show="item.remark" class="ml-16 mr-16">{{ item.remark }}</view>
							<text v-show="item.remark" :class="[item.sign_sex == 1 ? 'icon-man' : 'icon-woman', 'fs-19']"></text>
						</view>
						<view class="label">{{ item.strength + item.group }}</view>
					</view>
					<view class="price">{{ item.money_desc }}</view>
				</view>
			</view>
		</view>
		<view class="footer-box" slot="footer">
			<view class="btns flex-space-between">
				<view class="btn flex-center" @click="remind">
					<text class="icon icon-clock mr-10"></text>
					<text>{{ '提醒收款' }}</text>
				</view>
				<button class="btn flex-center" open-type="share">
					<text class="iconfont icon-fenxiang mr-10"></text>
					<text>{{ '转发收款' }}</text>
				</button>
			</view>
		</view>
	</PageComp>
</template>

<script>
export default {
	data() {
		return {
			selectList: [],
			total_count: 0,
			pay_count: 0,
			nopay_count: 0,
			title: '',
		};
	},
	onLoad(options) {
		this.id = options.id;
		this.init();
		// 开启分享
		wx.showShareMenu({
			withShareTicket: true,
			menus: ['shareAppMessage', 'shareTimeline']
		});
	},
	methods: {
		async init() {
			let { data } = await this.$api.Settle.detail({ activity_id: this.id });
			this.selectList = data.data;
			this.total_count = data.total_count;
			this.pay_count = data.pay_count;
			this.nopay_count = data.nopay_count;
			this.title = data.title;
		},
		async remind() {
			await this.$api.Settle.remind({ activity_id: this.id });
			this.$toast('提醒成功');
		}
	},
	async onShareAppMessage() {
		const { id, title } = this;
		const userInfo = uni.getStorageSync('userInfo');
		return {
			title: title || '中羽盟',
			imageUrl: this.IMGURL + 'fenxiang.jpg',
			//如果有参数的情况可以写path
			path: '/pages/chains/payment?id=' + id + '&code=' + userInfo.code
		};
	}
};
</script>

<style lang="scss" scoped>
.box-car {
	margin: 20rpx;
	background-color: #fff;
	padding: 10rpx;
	color: #333;
	.remark {
		font-weight: bold;
		margin: 20rpx 0 30rpx;
	}
	.box-container {
		& > view {
			margin-bottom: 24rpx;
			.price {
				color: $themeColor;
				font-size: 30rpx;
			}
		}
		.personal-box {
			.icon-woman {
				color: $red;
			}
			.icon-man {
				color: #2793e1;
			}
			.title {
				font-size: 22rpx;
				font-weight: bold;
				line-height: 1;
			}
			.label {
				height: 24rpx;
				line-height: 24rpx;
				display: inline-block;
				background-color: $themeColor;
				border-radius: 10rpx;
				font-size: 16rpx;
				font-weight: bold;
				color: #fff;
				padding: 0 10rpx;
			}
		}
	}
}
.footer-box {
	.btns {
		margin: 30rpx;
		.btn {
			width: 281rpx;
			height: 76rpx;
			box-shadow: 9rpx 9rpx 35rpx 0px rgba(254, 106, 28, 0.4);
			border-radius: 38rpx;
			font-size: 30rpx;
			color: #fff;
			font-weight: bold;
			background-color: $themeColor;
			margin: 0;
		}
	}
}
</style>

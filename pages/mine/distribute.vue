<template>
	<view class="container">
		<!-- 顶部标题 -->
		<cu-custom isBack leftStyle="color: white;">
			<template #content>帮分销</template>
		</cu-custom>
		<!-- 背景图 -->
		<image class="bg-image" src="http://api.xmcity.cloud/uploads/room/img/user/fenxiao.png"></image>
		<view
			class="content"
			:style="{
				top: `calc(${Number(CustomBar) + Number(StatusBar)}px + 338rpx)`
			}"
		>
			<view class="title">帮分销</view>
			<view class="desc">邀请球馆 / 俱乐部 / 培训机构入驻享佣金</view>
			<!-- 邀请按钮 -->
			<!-- 没通过 和 待审核 不让邀请分享，通过了 可以邀请 -->
			<button v-if="info.is_distributor == 1" class="btn" open-type="share">
				<text class="btn-text">立即邀请</text>
			</button>
			<view v-else class="btn"><text class="btn-text" @click="handleInvite">立即邀请</text></view>
			<view class="bottom flex flex-between wp-100 pl-30 pr-30" v-if="info.is_distributor == 1">
				<view>已审核：{{ info.check }}人</view>
				<view>待审核：{{ info.uncheck }}人</view>
				<view @click="handleGive">可提现：{{ info.cash_money }}元</view>
			</view>
			<view class="bottom-desc" v-else>
				<view>分销说明：</view>
				<view v-for="item in info.desc" :key="item">{{ item }}</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			CustomBar: this.CustomBar,
			StatusBar: this.StatusBar,
			info: {}
		};
	},
	methods: {
		// 邀请
		handleInvite() {
			uni.showModal({
				content: '待审核及没通过审核不可邀请',
				showCancel: false
			});
		},
		inviteModal() {
			uni.showModal({
				content: '申请成为分销员',
				success: function (res) {
					if (res.confirm) {
						console.log('confirm');
						this.addDistribute();
					}
				}.bind(this)
			});
		},
		// 提现
		handleGive() {
			if (this.info.cash_money > 0) {
				uni.showModal({
					content: `提现${this.info.cash_money}元`,
					success: function (res) {
						if (res.confirm) {
							this.cashDistribute();
						}
					}.bind(this)
				});
			}
		},
		/**
		 * 接口相关
		 */
		// 帮分销信息
		async getInfo() {
			try {
				const { data } = await this.$api.My.distribute();
				this.info = data;
				if (data.is_distributor != 1) {
					this.inviteModal();
				}
			} catch (e) {
				//TODO handle the exception
			}
		},
		// 申请成为分销员
		async addDistribute() {
			try {
				const { message } = await this.$api.My.addDistribute();
				uni.showModal({
					content: message,
					showCancel: false,
					success: function (res) {
						if (res.confirm) {
							this.getInfo();
						}
					}.bind(this)
				});
			} catch (e) {
				console.log(e);
				//TODO handle the exception
			}
		},
		// 分销提现
		async cashDistribute() {
			try {
				const { message } = await this.$api.My.cashDistribute();
				uni.showModal({
					content: message,
					showCancel: false
				});
			} catch (e) {
				//TODO handle the exception
			}
		}
	},
	onLoad() {
		this.getInfo();
	},
	onShareAppMessage() {
		const userInfo = uni.getStorageSync('userInfo');
		uni.showShareMenu({
			withShareTicket: true,
			menus: ['shareAppMessage', 'shareTimeline']
		});
		return {
			title: '中羽盟',
			imageUrl: this.IMGURL + 'fenxiang.jpg',
			path: '/pages/cover/cover?code=' + userInfo.code
		};
	}
};
</script>

<style lang="scss" scoped>
.container {
	height: 100vh;
	width: 100vw;
	position: relative;
	.bg-image {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		pointer-events: none;
	}
	.content {
		width: 100%;
		position: absolute;
		top: calc(480rpx + env(safe-area-inset-top));
		left: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		.title {
			width: 340rpx;
			height: 78rpx;
			font-size: 108rpx;
			font-weight: bold;
			color: white;
			line-height: 51rpx;
			text-shadow: 2rpx 3rpx 0rpx #fff2ac, 2rpx 3rpx 32rpx #ffac3e;
			background: linear-gradient(0deg, #ffffff 0%, #fff2ac 100%);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
		}
		.desc {
			width: 100%;
			height: 29rpx;
			text-align: center;
			font-size: 30rpx;
			font-weight: bold;
			color: #69411a;
			line-height: 50rpx;
			text-shadow: 0rpx 4rpx 3rpx rgba(95, 65, 21, 0.22);
			margin-top: 73rpx;
		}
		.btn {
			margin: 0;
			padding: 0;
			border: 0;
			margin-top: 246rpx;
			width: 348rpx;
			height: 106rpx;
			background: linear-gradient(0deg, #f9a02e, #fdd76c);
			box-shadow: 0rpx 23rpx 38rpx 0rpx rgba(187, 32, 0, 0.79), 0rpx -13rpx 29rpx 0rpx #cebe5c, 0rpx 3rpx 6rpx 0rpx rgba(255, 255, 255, 0.66);
			border-radius: 53rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			&-text {
				height: 37rpx;
				font-size: 50rpx;
				font-weight: bold;
				color: #ad2011;
				line-height: 37rpx;
				text-shadow: 0rpx 2rpx 0rpx rgba(255, 255, 255, 0.47);
			}
		}
		.bottom {
			margin-top: 127rpx;
			height: 27rpx;
			font-size: 36rpx;
			font-weight: bold;
			color: #ffffff;
			line-height: 51rpx;
			text-shadow: 2rpx 3rpx 0rpx #fff2ac, 2rpx 3rpx 32rpx #ffac3e;
			background: linear-gradient(0deg, #ffffff 0%, #fff2ac 100%);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
		}
		.bottom-desc {
			width: 100%;
			padding: 8rpx 50rpx;
			color: white;
			& > view {
				text-align: center;
			}
		}
	}
}
</style>

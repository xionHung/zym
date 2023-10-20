<template>
	<view class="page-message">
		<view class="custom-header" :style="{ height: topHeight, flex: '0 0 ' + topHeight, paddingTop: Number(StatusBar) + 'px' }">
			<image :src="IMGURL + 'img/home/bg-banner.png'" class="icon-bg"></image>
			<view class="head-top flex-space-between relative">
				<button class="rbtn back-btn" @click="backEvent">
					<text class="icon-left"></text>
				</button>
				<view class="title flex1">{{ title }}</view>
				<view class="rbtn right-btn"></view>
			</view>
			<view class="head-cont relative">
				<view class="hl-title">{{ headLeftTitle }}</view>
				<!-- 打球积分 1 -->
				<view class="type-1 flex-start" v-if="type == 1">
					<view class="item flex1">
						<view class="num">
							{{ info.total_point }}
							<text class="unit">积分</text>
						</view>
						<view class="label">总积分</view>
					</view>
					<view class="item flex1">
						<view class="num">
							{{ info.month_point }}
							<text class="unit">积分</text>
						</view>
						<view class="label">本月</view>
					</view>
				</view>
				<!-- 本月消费 2 -->
				<view class="type-2 flex-space-between" v-else-if="type == 2">
					<view class="side"></view>
					<view class="item flex1 flex-column">
						<view class="num">
							{{ info.total }}
							<text class="unit">元</text>
						</view>
						<view class="label">消费金额</view>
					</view>
					<button class="rbtn side" @click="handleOther">
						<text class="iconfont icon-edit mr-2"></text>
						其他支出
					</button>
				</view>
				<!-- 本月场次 3 -->
				<view class="type-2 flex-space-between" v-else-if="type == 3">
					<view class="item flex1 flex-column">
						<view class="num">
							{{ info.total }}
							<text class="unit">次</text>
						</view>
						<view class="label">场次</view>
					</view>
				</view>
			</view>
		</view>
		<image class="cont-bg" :src="IMGURL + 'img/home/bg-banner.png'"></image>
		<view class="container">
			<view class="list relative" style="height: calc(100vh - 300rpx)">
				<mescroll-uni :fixed="false" ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback">
					<view class="item flex-space-between" v-for="(item, index) in listData" :key="index">
						<view class="left flex-start">
							<view class="icon">
								<md-avatar width="55" :src="IMGURL + 'img/home/ymq.png'"></md-avatar>
							</view>
							<view class="text">{{ item[config.label] }}</view>
						</view>
						<view class="right">
							<text class="num">{{ item[config.value] }}</text>
							{{ unit }}
						</view>
					</view>
				</mescroll-uni>
			</view>
		</view>
		<!-- 弹窗 -->
		<md-modal :show.sync="show" title="其他支出" :hasCancel="false" @confirm="handleOk">
			<view class="flex border-bottom mb-10" style="align-items: baseline">
				<text class="primary-color fs-40">￥</text>
				<input type="digit" style="font-size: 30rpx; color: #fe6a1c" placeholder="请输入金额" v-model="otherForm.pay_money" />
				<text class="fs-20">(元)</text>
			</view>
			<textarea v-model="otherForm.remark" placeholder="添加备注" class="wp-100 h-24 fs-22"></textarea>
		</md-modal>
	</view>
</template>

<script>
import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
const titles = {
	1: {
		title: '我的羽球数据',
		hlTitle: '打球积分'
	},
	2: {
		title: '交易明细',
		hlTitle: '本月消费'
	},
	3: {
		title: '我的羽球数据',
		hlTitle: '本月场次'
	}
};
export default {
	mixins: [MescrollMixin],
	data() {
		return {
			StatusBar: this.StatusBar,
			type: 0,
			headLeftTitle: '',
			title: '',
			info: {},
			listData: [],
			// 其他支出
			show: false,
			otherForm: { pay_money: '', remark: '' }
		};
	},
	onLoad(e) {
		if (e.type) {
			this.type = Number(e.type);
			this.title = titles[e.type].title;
			this.headLeftTitle = titles[e.type].hlTitle;

			// if (e.type == 1) {
			// 	// this.getPoints();
			// 	// this.mescroll.resetUpScroll();
			// } else if (e.type == 2) {
			// 	this.getPays();
			// } else {
			// 	this.getPlays();
			// }
		}
	},
	computed: {
		topHeight() {
			return `calc(300rpx + ${this.StatusBar}px);`;
		},
		unit() {
			switch (this.type) {
				case 1:
					return '积分';
				case 2:
					return '元';
				case 3:
					return '次';
				default:
					return '积分';
			}
		},
		config() {
			switch (this.type) {
				case 1:
					return { label: 'relation_name', value: 'point' };
				case 2:
					return { label: 'relation_name', value: 'pay_money' };
				case 3:
					return { label: 'room_name', value: 'count' };
				default:
					return { label: 'relation_name', value: 'point' };
			}
		}
	},
	methods: {
		backEvent() {
			uni.navigateBack();
		},
		handleOther() {
			this.show = true;
		},
		handleOk() {
			this.addPay();
		},
		async upCallback(page) {
			let pageNum = page.num; // 页码, 默认从1开始
			let limit = page.size; // 页长, 默认每页10条
			try {
				let { data } = await this.getList({
					pageNum,
					limit
				});
				if (!data) return this.mescroll.endErr();
				console.log(data);
				let curPageData = data.data || [];
				let curPageLen = curPageData.length;
				let totalSize = data.total;
				this.info = data;
				if (page.num == 1) this.listData = [];
				this.listData = this.listData.concat(curPageData);
				this.mescroll.endBySize(curPageLen, totalSize);
			} catch (err) {
				console.log(err);
			}
		},
		/**
		 * 接口相关
		 */
		async getList(params) {
			let res;
			try {
				if (this.type == 1) {
					// 积分 1
					res = await this.$api.UserPoint.index(params);
				} else if (this.type == 2) {
					// 消费 2
					res = await this.$api.My.pay();
				} else {
					// 场次 3
					res = await this.$api.My.play();
				}
				return res;
			} catch (e) {
				//TODO handle the exception
			}
			return {};
		},
		// 场次 3
		async getPlays() {
			try {
				const res = await this.$api.My.play();
				this.info = res.data;
			} catch (e) {
				//TODO handle the exception
			}
		},
		// 消费 2
		async getPays() {
			try {
				const res = await this.$api.My.pay();
				this.info = res.data;
			} catch (e) {
				//TODO handle the exception
			}
		},
		// 积分 1
		async getPoints(params) {
			try {
				const res = await this.$api.UserPoint.index(params);
				return res;
			} catch (e) {
				//TODO handle the exception
			}
			return {};
		},
		// 添加其他支出
		async addPay() {
			try {
				await this.$api.My.addPay(this.otherForm);
				uni.showModal({
					content: '添加成功',
					showCancel: false,
					success: (res) => {
						if (res.confirm) {
							this.show = false;
							this.getPays();
						}
					}
				});
			} catch (e) {
				//TODO handle the exception
			}
		}
	}
};
</script>

<style>
page {
	overflow: hidden;
}
</style>

<style lang="scss" scoped>
.page-message {
	overflow: hidden;
	position: relative;
	display: flex;
	flex-direction: column;
	height: 100vh;
	background: #fff;

	.custom-header {
		position: relative;
		width: 100%;
		height: 346rpx;
		flex: 0 0 346rpx;
		color: #fff;
		background: $themeColor;
		border-radius: 0 0 500rpx 500rpx / 0 0 40rpx 40rpx;
		z-index: 2;

		.icon-bg {
			position: absolute;
			top: 40rpx;
			width: 178rpx;
			height: 260rpx;
		}

		.head-top {
			height: 60rpx;
			text-align: center;

			.title {
				font-weight: bold;
				font-size: 30rpx;
			}

			.rbtn {
				font-size: 32rpx;
				width: 80rpx;
			}
		}

		.head-cont {
			padding-top: 14rpx;
			font-size: 26rpx;
			line-height: 1;
			text-align: center;

			.hl-title {
				text-align: left;
				font-size: 30rpx;
				font-weight: bold;
				padding-left: 30rpx;
				margin-bottom: 50rpx;
			}

			.num {
				font-size: 50rpx;

				.unit {
					font-size: 22rpx;
					margin-left: 6rpx;
				}
			}

			.label {
				margin-top: 24rpx;
			}

			.type-1 {
				// padding-top: 30rpx;
				.item {
					position: relative;

					&:nth-child(1):after {
						position: absolute;
						content: '';
						right: 0;
						top: 50%;
						margin-top: -33rpx;
						width: 2rpx;
						height: 66rpx;
						background: #d9d9d9;
					}
				}
			}

			.type-2 {
				.side {
					width: 6em;
					// flex: 0 0 6em;
				}
			}
		}
	}

	.cont-bg {
		position: absolute;
		left: 0;
		top: 366rpx;
		width: 687rpx;
		height: 995rpx;
	}

	.container {
		position: relative;
		flex: 1;
		width: 100%;
		padding: 22rpx 60rpx 0 58rpx;
		color: #333;
		font-size: 26rpx;
		overflow-y: auto;
		margin-top: -32rpx;

		.list {
			.item {
				height: 102rpx;
				border-bottom: 2rpx solid #f3f3f3;

				&:nth-last-child(1) {
					border-bottom: 0;
				}

				.left {
					margin-right: 30rpx;

					.icon {
						overflow: hidden;
						width: 66rpx;
						height: 66rpx;
						border-radius: 50%;
						background: #ff7234;
						margin-right: 20rpx;
						display: flex;
						align-items: center;
						justify-content: center;
					}

					.text {
						font-size: 26rpx;
					}
				}

				.right {
					color: #fe6a1c;
					font-size: 26rpx;

					.num {
						font-size: 30rpx;
						font-weight: bold;
						margin-right: 6rpx;
					}
				}
			}
		}
	}
}
</style>
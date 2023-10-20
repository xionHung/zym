<template>
	<PageComp title="场地预定">
		<!-- calendar-日历 -->
		<view class="calendar-container">
			<view class="calendar" :class="{ active: index === calendarCureent }" v-for="(calendar, index) in calendares" :key="index" @click="calendarClick(index)">
				<view>{{ calendar.week }}</view>
				<view class="number">{{ calendar.day }}</view>
			</view>
		</view>
		<view class="calendar-table" v-if="mockData.length <= 8">
			<view class="table-head">
				<view class="table-head-item" v-for="(item, index) in mockData" :key="index">{{ item.name }}</view>
			</view>
			<view class="table-body">
				<view class="left">
					<view class="left-item" :style="{ top: index * 50 - 12 + 'rpx' }" v-for="(item, index) in time" :key="index">{{ item }}</view>
				</view>
				<view class="right">
					<view class="right-box" v-for="(item, index) in mockData" :key="index">
						<view class="right-box-item" v-for="(j, k) in item.site_time" :key="k">
							<view class="train" v-if="j.site_status === 3">{{ j.title }}</view>
							<view class="train yuding" v-else-if="j.site_status === 1">{{ j.price }}</view>
							<text v-else :class="{ check: isChecked(item.id + '_' + j.hour) }" @click="_click(item.id + '_' + j.hour, j, item)">{{ j.price }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="mock-container" v-if="mockData.length > 8">
			<view class="left">
				<view class="left-item" :style="{ top: index * 50 - 12 + 'rpx' }" v-for="(item, index) in time" :key="index">{{ item }}</view>
			</view>
			<scroll-view class="mock-box" :scroll-x="true" :scroll-left="scrollLeft" @scroll="scroll">
				<view class="mock-items">
					<view class="item" v-for="(item, index) in mockData" :key="index">
						<view class="table-head flex-center">{{ item.name }}</view>
						<view class="clunms">
							<view class="clunms-item" v-for="(j, k) in item.site_time" :key="k">
								<view class="train" v-if="j.site_status === 3">{{ j.title }}</view>
								<view class="train yuding" v-else-if="j.site_status === 1">{{ j.price }}</view>
								<text v-else :class="{ check: isChecked(item.id + '_' + j.hour) }" @click="_click(item.id + '_' + j.hour, j, item)">{{ j.price }}</text>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
			<view class="mock-popup" />
			<text class="icon-left" @click="preClick" />
			<text class="icon-right" @click="nextClick" />
		</view>
		<view class="type-box">
			<view class="item" v-for="(item, index) in types" :key="index">
				<view class="brock" :style="{ background: item.colors }" />
				<view>{{ item.title }}</view>
			</view>
		</view>
		<view class="remark-box" @click="cardUrl">
			<image class="remark-box-icon" :src="IMGURL + 'img/arena/arena_remark.png'" mode="widthFix" />
			<view class="content">
				<text>{{ '订场说明：' + booking_desc }}</text>
				<view class="btns">
					<view>{{ '欢迎成为球馆会员' }}</view>
					<view>{{ '立即充值' }}</view>
				</view>
			</view>
		</view>
		<view class="tool-box">
			<view class="tool-box-position">
				<image class="icon" :src="IMGURL + 'img/arena/arena_tool.png'" mode="widthFix" />
				<view class="text">{{ '已选场次' }}</view>
			</view>
			<view class="items">
				<view class="item" v-for="item in submitData" :key="item.site_id_hour">
					<view class="label">{{ item.date }}</view>
					<view>{{ item.time }}</view>
					<view>{{ item.num }}</view>
					<text class="icon-close" @click="deleteSite(item.site_id_hour)" />
				</view>
			</view>
		</view>
		<!--  -->
		<view slot="footer">
			<!-- 弹窗 -->
			<md-b-dialog title="充值卡" :show.sync="show" customFooter>
				<!-- 余额 -->
				<view class="flex flex-between pb-43">
					<view>
						余额
						<text class="text-price" style="font-size: 46.25rpx">{{ couponMap.money }}</text>
						元
					</view>
					<text @click="mingxi">交易明细</text>
				</view>
				<!-- 充值比例 -->
				<view class="pt-20 pb-20">
					<view class="text-left mb-26">{{ '支付' }}</view>
					<view class="pl-29">
						<view class="flex wp-100">
							<md-radio
								v-model="check"
								:mode="1"
								:list="[
									{ label: '充值卡余额支付', value: '1' },
									{ label: '微信支付', value: '2' },
									{ label: '羽盟卡抵扣', value: '3' }
								]"
								class="wp-100"
							></md-radio>
						</view>
					</view>
				</view>
				<view class="text-left mt-26 mb-48">
					支付金额：
					<text class="text-price primary-color" style="font-size: 46rpx">{{ total }}</text>
					元
				</view>
				<template #footer>
					<md-button class="pay-btn" @click="handlePay">立即支付</md-button>
				</template>
			</md-b-dialog>
			<view class="btn" @click="submit">
				<text>{{ '¥' + total }}</text>
				<text class="ml-20">{{ '确认预定' }}</text>
			</view>
		</view>
	</PageComp>
</template>

<script>
import moment from 'moment';
import { dayList } from '@/utils/fileds';
import { parseTime } from '@/utils/tools.js';
// const time = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];
export default {
	data() {
		return {
			id: null,
			show: false,
			mockData: [],
			time: [],
			calendares: [],
			calendarCureent: 0,
			types: [
				{ title: '固定场锁定', colors: '#FFD041' },
				{ title: '空闲', colors: '#fff' },
				{ title: '小程序预定', colors: '#FF6D6D' }
			],
			submitData: [],
			couponMap: {},
			check: null,
			booking_desc: null,
			scrollLeft: 0
		};
	},
	computed: {
		total() {
			if (!this.submitData.length) return 0;
			let data = this.submitData.reduce((pre, cur) => {
				return (pre += Number(cur.price));
			}, 0);
			return Number(data).toFixed(2);
		}
	},
	onLoad(options) {
		this.id = options.id;
		this.getWeeks();
		this.init();
	},
	methods: {
		// 获取今天到往后七天
		getWeeks() {
			this.calendares = [];
			for (let i = 0; i < 7; i++) {
				let week = !i ? '今天' : dayList[new Date(moment().add(i, 'days').format('YYYY-MM-DD')).getDay()];
				this.calendares.push({
					day: moment().add(i, 'days').format('DD'),
					week,
					value: new Date(moment().add(i, 'days').format('YYYY-MM-DD')).valueOf()
				});
			}
		},
		calendarClick(idx) {
			if (this.calendarCureent === idx) return;
			this.calendarCureent = idx;
			this.init(this.calendares[idx].day);
		},
		async init(time) {
			let starttime = time ? new Date(parseTime(Date.now(), '{y}-{m}') + '-' + time).valueOf() : Date.now();
			let { data } = await this.$api.Room.RoomBookingIndex({ room_id: this.id, starttime: parseInt(starttime / 1000) });
			this.booking_desc = data.booking_desc;
			this.mockData = data.site;
			this.submitData = [];
			if (data.site && data.site.length) {
				this.time = data.site[0].site_time.map((el) => el.hour_name);
				let lastTime = data.site[0].site_time[data.site[0].site_time.length - 1].hour_name;
				this.time.push(parseFloat(lastTime) + 1 + ':00');
			}
		},
		isChecked(id) {
			return this.submitData.some((el) => el.site_id_hour === id);
		},
		_click(id, row, item) {
			if (this.isChecked(id)) return;
			this.submitData.push({
				site_id_hour: id,
				num: item.name,
				time: row.hour_name + '-' + (parseFloat(row.hour_name) + 1) + ':00',
				date: parseTime(this.calendares[this.calendarCureent].value, '{m}月{d}日'),
				price: row.price
			});
		},
		deleteSite(id) {
			this.submitData = this.submitData.filter((el) => el.site_id_hour !== id);
		},
		submit() {
			if (!this.submitData.length) return this.$toast('请先预定');
			this.getRoomCard(this.id);
		},
		async getRoomCard(room_id) {
			try {
				const { data } = await this.$api.Card.getRoomCard({ room_id, type: 1 });
				this.couponMap = data;
				this.show = true;
			} catch (error) {
				console.error(error);
			}
		},
		async handlePay() {
			if (!this.check) return this.$toast('请选择支付方式');
			let parmas = {
				room_id: this.id,
				starttime: this.calendares[this.calendarCureent].value / 1000,
				pay_type: this.check,
				site_id_hour: this.submitData.map((el) => el.site_id_hour).toString()
			};
			try {
				const { data } = await this.$api.Room.RoomBookingAdd(parmas);
				// pay_status	string	支付状态 1待支付，唤起微信支付
				if (data.pay_status == 1) {
					// 唤起微信支付
					uni.requestPayment({
						provider: 'wxpay',
						...data.config,
						timeStamp: data.config.timestamp,
						success: () => {
							this.show = false;
							this.$toast('预定成功');
							this.init(this.calendares[this.calendarCureent].day);
							// uni.showModal({
							//   content: '支付成功',
							//   showCancel: false,
							//   success: function(r) {
							//     if (r.confirm) {
							//       this.show = false;
							//       uni.redirectTo({
							//       	url: '/pages/mine/order/index'
							//       })
							//     }
							//   }.bind(this)
							// });
						},
						fail(e) {
							this.$toast('您已取消支付');
							console.log('requestPayment::', e);
						}
					});
				} else {
					this.show = false;
					this.$toast('预定成功');
					this.init(this.calendares[this.calendarCureent].day);
				}
			} catch (error) {
				console.error(error);
			}
		},
		cardUrl() {
			uni.navigateTo({ url: '/pages/home/other/arena/recharge?id=' + this.id });
		},
		mingxi() {
			uni.navigateTo({ url: '/pages/home/other/arena/details' });
		},
		scroll(e) {
			this.scrollLeft = e.detail.scrollLeft;
		},
		preClick() {
			this.scrollLeft -= uni.upx2px(50);
			if (this.scrollLeft <= 0) return (this.scrollLeft = 0);
		},
		nextClick() {
			this.scrollLeft += uni.upx2px(50);
			if (this.scrollLeft >= uni.upx2px(50) * this.mockData.length) return (this.scrollLeft = uni.upx2px(50) * this.mockData.length);
		}
	}
};
</script>

<style lang="scss" scoped>
.calendar-container {
	background-color: #fff;
	padding: 30rpx 20rpx;
	margin: 0 30rpx;
	border-radius: 20rpx;
	display: flex;
	justify-content: space-between;
	.calendar {
		width: 80rpx;
		flex: none;
		height: 100rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		color: #555;
		font-size: 22rpx;
		background: #f5f5f5;
		border-radius: 10rpx;
		overflow: hidden;
		.number {
			color: #222222;
			font-size: 34rpx;
		}
		&.active {
			color: #fe6a1c;
			background-color: #fbe5da;
			position: relative;
			.number {
				color: #fe6a1c;
			}
			&::before {
				content: '';
				position: absolute;
				width: 60rpx;
				height: 40rpx;
				left: -30rpx;
				top: -20rpx;
				background-color: #fe6a1c;
				transform: rotateZ(-45deg);
			}
		}
	}
}
.calendar-table {
	.table-head {
		width: 710rpx;
		height: 70rpx;
		position: relative;
		padding-left: 74rpx;
		display: flex;
		align-items: center;
		color: #333;
		font-size: 20rpx;
		font-weight: bold;
		&-item {
			flex: 1;
			text-align: center;
		}
	}
	.table-body {
		display: flex;
		.left {
			width: 74rpx;
			flex: none;
			text-align: right;
			font-size: 20rpx;
			color: #333;
			position: relative;
			.left-item {
				position: absolute;
				right: 10rpx;
				top: -8rpx;
			}
		}
		.right {
			flex: 1;
			border-radius: 10rpx;
			border: 4rpx solid #ff6d6d;
			display: flex;
			margin-right: 40rpx;
			&-box {
				flex: 1;
				text-align: center;
				color: #ffa87b;
				font-size: 18rpx;
				border-right: 1px solid #ff6d6d;
				&:last-child {
					border-right: 0;
				}
				&-item {
					height: 50rpx;
					line-height: 50rpx;
					border-bottom: 1px solid #e8e8e8;
					&:last-child {
						border-bottom: 0;
					}
					.train {
						width: 100%;
						height: 100%;
						text-align: center;
						line-height: 50rpx;
						color: #fff;
						font-size: 24rpx;
						background-color: #ffd041;
						&.yuding {
							background-color: #ff6d6d;
						}
					}
					.check {
						background-color: $themeColor;
						width: 100%;
						height: 100%;
						text-align: center;
						line-height: 50rpx;
						color: #fff;
						font-size: 24rpx;
						display: inline-block;
					}
				}
			}
		}
	}
}
.mock-container {
	padding-left: 74rpx;
	position: relative;
	.left {
		width: 62rpx;
		position: absolute;
		text-align: right;
		font-size: 20rpx;
		color: #333;
		left: 0;
		top: 64rpx;
		.left-item {
			margin-bottom: 30rpx;
			line-height: 1;
			&:last-child {
				margin-bottom: 0;
			}
		}
	}
	.mock-box {
		width: calc(100% - 46rpx);
		.mock-items {
			display: flex;
			.item {
				width: 78rpx;
				flex: none;
				&:last-child {
					.clunms {
						border-right: 0;
					}
				}
				.table-head {
					height: 70rpx;
					color: #333;
					font-size: 20rpx;
					font-weight: bold;
				}
				.clunms {
					text-align: center;
					color: #ffa87b;
					font-size: 18rpx;
					border-right: 1px solid #ff6d6d;
					&-item {
						height: 50rpx;
						line-height: 50rpx;
						border-bottom: 1px solid #e8e8e8;
						&:last-child {
							border-bottom: 0;
						}
						.train {
							width: 100%;
							height: 100%;
							text-align: center;
							line-height: 50rpx;
							color: #fff;
							font-size: 24rpx;
							background-color: #ffd041;
							&.yuding {
								background-color: #ff6d6d;
							}
						}
						.check {
							background-color: $themeColor;
							width: 100%;
							height: 100%;
							text-align: center;
							line-height: 50rpx;
							color: #fff;
							font-size: 24rpx;
							display: inline-block;
						}
					}
				}
			}
		}
	}
	.mock-popup {
		width: calc(100% - 120rpx);
		height: calc(100% - 70rpx);
		position: absolute;
		left: 74rpx;
		top: 70rpx;
		border: 4rpx solid #ff6d6d;
		border-radius: 10rpx;
		pointer-events: none;
	}
	.icon-left {
		position: absolute;
		font-size: 28rpx;
		left: 30rpx;
		color: #666;
		top: 20rpx;
	}
	.icon-right {
		position: absolute;
		font-size: 28rpx;
		right: 16rpx;
		color: #666;
		top: 20rpx;
	}
}
.type-box {
	margin: 16rpx 40rpx 0 74rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	.item {
		margin-right: 30rpx;
		display: flex;
		color: #666666;
		font-size: 18rpx;
		&:last-child {
			margin-right: 0;
		}
		.brock {
			width: 80rpx;
			height: 32rpx;
			border-radius: 10rpx;
			margin-right: 16rpx;
		}
	}
}
.remark-box {
	height: 156rpx;
	margin: 0 17rpx 0 32rpx;
	position: relative;
	&-icon {
		position: absolute;
		width: 100%;
	}
	.content {
		width: 100%;
		position: absolute;
		z-index: 1;
		bottom: 0;
		text-align: center;
		font-weight: bold;
		font-size: 20rpx;
		color: #333;
		.btns {
			margin-top: 6rpx;
			display: flex;
			justify-content: space-between;
			font-size: 30rpx;
			color: #522f11;
			padding: 24rpx 94rpx 24rpx 56rpx;
			line-height: 1;
		}
	}
}
.tool-box {
	margin: 30rpx;
	padding: 57rpx 20rpx 46rpx;
	border-radius: 20rpx;
	background-color: #fff;
	position: relative;
	&-position {
		position: absolute;
		top: -8rpx;
		left: 0;
	}
	.icon {
		width: 216rpx;
	}
	.text {
		width: 100%;
		color: #fffefe;
		position: absolute;
		top: 8rpx;
		text-align: center;
		font-size: 28rpx;
		line-height: 1;
		font-weight: bold;
	}
	.items {
		display: grid;
		row-gap: 10rpx;
		.item {
			display: flex;
			border-radius: 10rpx;
			height: 54rpx;
			align-items: center;
			justify-content: space-between;
			background: #fff8f4;
			padding-right: 34rpx;
			font-size: 24rpx;
			color: #333;
			font-weight: bold;
			overflow: hidden;
			.label {
				color: #fff;
				width: 164rpx;
				background-color: #ec6826;
				text-align: center;
				line-height: 54rpx;
				position: relative;
				&::after {
					content: '';
					position: absolute;
					border-top: 54rpx solid transparent;
					border-right: 28rpx solid #fff8f4;
					border-bottom: 54rpx solid transparent;
					border-left: 16rpx solid transparent;
					right: -2rpx;
				}
			}
			.icon-close {
				font-size: 32rpx;
			}
		}
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
.btn {
	height: 70rpx;
	margin: 10rpx 30rpx;
	box-shadow: 9rpx 9rpx 35rpx 0px rgba(254, 106, 28, 0.4);
	border-radius: 35rpx;
	background: #ec6826;
	color: #fff;
	font-size: 28rpx;
	text-align: center;
	line-height: 70rpx;
}
</style>

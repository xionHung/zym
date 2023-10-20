<template>
	<view class="page-home">
		<CustomPage :title="current == 0 ? '接龙' : '俱乐部'" bgHeight="420rpx">
			<view class="page-container" slot="content">
				<view class="banner-container">
					<HomeBanner height="260rpx" isInner />
				</view>
				<view class="search-container flex-space-between">
					<view class="input-inner">
						<text class="icon-search"></text>
						<input type="text" class="input" placeholder-style="color:#A8A6A7;" v-model="keyword" @confirm="searchEvent" placeholder="搜索接龙或者俱乐部" />
					</view>
					<view class="flex">
						<button class="rbtn right-btn" v-if="hasClub.length" @click="clubManage">管理</button>
						<button class="rbtn right-btn" style="margin-left: 10rpx" v-if="hasClub.length < 2" @click="handleCreatClub">创建俱乐部</button>
					</view>
				</view>
				<view class="content">
					<mescroll-uni :fixed="false" ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback">
						<view class="tab-container flex-center">
							<view class="item flex-center" :class="{ active: current == 0 }" @click="tabChange(0)">接龙</view>
							<view class="item flex-center" :class="{ active: current == 1 }" @click="tabChange(1)">
								<text>{{ '俱乐部' }}</text>
								<view class="iconfont-box" v-if="current == 1" @click.stop="isMore = !isMore">
									<text class="iconfont icon-xiangshang-fill"></text>
								</view>
								<!-- 更多按钮 -->
								<view class="bg-white br-10 tooltip" v-if="isMore && current == 1">
									<view class="flex flex-col hp-100">
										<view class="flex1 fs-20 btn border-bottom" @click.stop="typeChange(1)">联盟俱乐部</view>
										<view class="flex1 fs-20 btn" @click.stop="typeChange(0)">全部俱乐部</view>
									</view>
								</view>
							</view>
						</view>
						<view class="date-container" v-show="!current">
							<view class="top flex-space-between">
								<text class="">{{ monthLabel }}</text>
								<image class="icon" :src="IMGURL + 'img/icon/calendar.png'" mode="widthFix" @click="openDate" />
							</view>
							<view class="bottom flex-space-between">
								<view class="date-item" v-for="item in dateList" :key="item.time" :class="{ active: checkDate == item.time }" @click="handleCheckDate(item)">
									<view class="day">{{ item.time | getDay }}</view>
									<view class="date">{{ item.time | getDate }}</view>
								</view>
							</view>
						</view>
						<view class="list" v-if="!current">
							<view class="item" v-for="item in listData" :key="item.id" @click="chainsClick(item)">
								<view class="top flex-space-between">
									<view class="t-left flex-start">
										<image :src="item.club_headpic" mode="aspectFill" class="img" @click.stop="goClub(item.club_id)"></image>
										<view class="tl-info">
											<view class="name" @click.stop="goClub(item.club_id)">{{ item.club_name }}</view>
											<view class="star flex-start">
												<image class="icon" :src="IMGURL + 'img/icon/star.png'" v-for="o of item.activity_level" :key="o"></image>
											</view>
										</view>
									</view>
									<text class="icon-right"></text>
								</view>
								<view class="cont">
									<view class="line flex-space-between">
										<view class="flex-start">
											<!-- <image class="icon" :src="IMGURL + 'img/home/s-icon1.png'" mode="widthFix"></image> -->
											<text class="iconfont icon-changguan mr-8"></text>
											<text>{{ item.room_name }} | {{ item.distance }}</text>
										</view>
										<text class="money" :class="status[item.status].class">{{ item.unit_price }}</text>
									</view>
									<view class="line flex-start">
										<!-- <image class="icon" :src="IMGURL + 'img/home/s-icon2.png'" mode="widthFix"></image> -->
										<text class="icon-clock mr-8"></text>
										<text class="time">{{ item.time }}</text>
									</view>
									<view class="line flex-start">
										<!-- <image class="icon" :src="IMGURL + 'img/home/s-icon3.png'" mode="widthFix"></image> -->
										<text class="iconfont icon-yonghu mr-8"></text>
										<text class="time">{{ item.sign_name }}</text>
									</view>
									<view class="line flex-start">
										<!-- <image class="icon" :src="IMGURL + 'img/home/s-icon4.png'" mode="widthFix"></image> -->
										<text class="iconfont icon-zuanshi mr-8"></text>
										<text class="time">{{ item.level_desc }}</text>
									</view>
									<view class="bottom flex-space-between">
										<view class="flex-start">
											<button class="rbtn more-btn">
												<text class="icon-more"></text>
											</button>
											<template v-if="item.room_device && item.room_device.length">
												<text class="tag" v-for="(o, ti) in item.room_device" :key="ti" v-if="ti < 3">{{ o }}</text>
											</template>
										</view>
										<view class="flex-start">
											<view class="act-type">{{ item.pay_aa.name }}</view>
											<button class="rbtn apply-btn" :class="status[item.status_name].class" @click.stop="handleClickItem(item)">
												{{ item.status_name }}
											</button>
										</view>
									</view>
								</view>
							</view>
						</view>
						<view class="list" v-else>
							<view class="row" v-for="item in listData" :key="item.id">
								<ClubRow :obj="item" />
							</view>
						</view>
					</mescroll-uni>
				</view>
			</view>
		</CustomPage>
		<md-b-dialog :show.sync="show" title="选择管理俱乐部" customFooter>
			<view class="club-box">
				<view class="item mb-30" v-for="item in mineClub" :key="item.id" @click="clickManage(item.id)">
					<view class="left flex-center">
						<text class="iconfont icon-yumaoqiu" />
					</view>
					<view class="title">{{ item.name }}</view>
					<text class="icon icon-right" />
				</view>
			</view>
		</md-b-dialog>
		<md-modal :show.sync="alrmShow" hideButton>
			<view class="alrm-remark">{{ '很抱歉，您的段位未达到该活动的 段位要求！' }}</view>
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
	</view>
</template>

<script>
import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
import HomeBanner from '@/components/home-banner.vue';
import { dayList, levelKeys } from '@/utils/fileds';
import DatetimePicker from '@/components/datetime-picker';
import ClubRow from '@/components/UIComp/Club/rowBox.vue';
export default {
	mixins: [MescrollMixin],
	components: {
		HomeBanner,
		DatetimePicker,
		ClubRow
	},
	data() {
		let nowDate = new Date(new Date().toLocaleDateString()).getTime();
		return {
			timeDate: nowDate,
			keyword: '',
			current: 0,
			isVip: 0,
			listData: [],
			levelKeys,
			nowDate: nowDate,
			checkDate: nowDate,
			dateList: [],
			status: {
				已取消: {
					class: 'cancel',
					button: '已取消'
				},
				一键报名: {
					class: 'start',
					button: '一键报名'
				},
				已结束: {
					class: 'end',
					button: '已结束'
				}
			},
			isMore: false,
			show: false,
			mineClub: [],
			alrmShow: false
		};
	},
	filters: {
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
			return `${d.getFullYear()}年${d.getMonth() + 1}月`;
		},
		hasClub() {
			return this.$store.state.userInfo.has_club || [];
		},
		address() {
			return this.$store.state.address;
		}
	},
	onLoad() {
		this.timeList(this.nowDate);
	},
	methods: {
		async upCallback(page) {
			let pageNum = page.num; // 页码, 默认从1开始
			let limit = page.size; // 页长, 默认每页10条
			let url = !this.current ? 'Chains' : 'Club';
			try {
				let { data } = await this.$api[url].getList({
					pageNum,
					limit,
					name: this.keyword,
					time: this.checkDate / 1000,
					is_vip: this.isVip,
					area_name: this.address.cityName || undefined
				});
				if (!data) return this.mescroll.endErr();
				let curPageData = data.data || [];
				let curPageLen = curPageData.length;
				let totalSize = data.total;
				if (page.num == 1) this.listData = [];
				this.listData = this.listData.concat(curPageData);
				this.mescroll.endBySize(curPageLen, totalSize);
			} catch (err) {
				console.log(err);
			}
		},
		openDate() {
			this.$refs.datePiker.show();
		},
		checkDateEvent(res) {
			this.nowDate = res.timeStr;
			this.timeList(res.time);
			this.checkDate = res.time;
			this.mescroll.resetUpScroll();
		},
		handleCreatClub() {
			uni.navigateTo({
				url: '/pages/club/create'
			});
			console.log('create');
		},
		handleClickItem(item) {
			if (this.$store.state.userInfo.level < item.level) return (this.alrmShow = true);
			if (item.status != 1) return;
			this.chainsClick(item);
		},
		handleCheckDate(item) {
			this.checkDate = item.time;
			this.mescroll.resetUpScroll();
		},
		tabChange(type) {
			this.keyword = '';
			this.current = type;
			this.isVip = 0;
			this.isMore = false;
			this.listData = [];
			this.mescroll.resetUpScroll();
		},
		goClub(id) {
			uni.navigateTo({
				url: '/pages/club/index?id=' + id
			});
		},
		searchEvent() {
			this.mescroll.resetUpScroll();
		},
		timeList(date) {
			this.dateList = [];
			for (let i = 0; i < 7; i++) {
				this.dateList.push({
					time: date + 1000 * 60 * 60 * 24 * i
				});
			}
		},
		typeChange(type) {
			this.isVip = type;
			this.isMore = false;
			this.mescroll.resetUpScroll();
		},
		chainsClick(row) {
			uni.navigateTo({
				url: '/pages/chains/chainsDetail?id=' + row.id + '&time=' + row.starttime
			});
		},
		async clubManage() {
			let { data } = await this.$api.Club.getList({ uid: this.$store.state.userInfo.id });
			this.show = true;
			this.mineClub = data.data || [];
		},
		clickManage(id) {
			uni.navigateTo({
				url: '/pages/club/manage?id=' + id
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.page-home {
	.page-container {
		position: relative;
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 70rpx 30rpx 0;
		overflow: hidden;

		.banner-container {
			margin-bottom: 34rpx;
		}

		.search-container {
			.input-inner {
				position: relative;
				width: 350rpx;
				line-height: 60rpx;
				height: 60rpx;
				background: rgba(206, 206, 206, 0.6);
				padding: 0 20rpx 0 56rpx;
				border-radius: 30rpx;
				font-size: 22rpx;

				.icon-search {
					font-size: 36rpx;
					position: absolute;
					left: 16rpx;
					top: 14rpx;
				}

				.input {
					height: 60rpx;
					line-height: 60rpx;
				}
			}

			.right-btn {
				height: 60rpx;
				background: rgba(255, 202, 174, 0.6);
				border-radius: 30rpx;
				color: #ff5800;
				font-size: 26rpx;
				padding: 0 30rpx;
			}
		}

		.content {
			position: relative;
			flex: 1;
			overflow-y: auto;
			padding: 20rpx 0;

			.tab-container {
				margin-bottom: 30rpx;

				.item {
					position: relative;
					width: 260rpx;
					.iconfont-box {
						margin-left: 10rpx;
						transform: rotateZ(180deg);
					}
					.tooltip {
						position: absolute;
						right: 0rpx;
						top: 50rpx;
						width: 120rpx;
						height: 94rpx;
						background: #ffffff;
						box-shadow: 1rpx 1rpx 9rpx 0rpx rgba(102, 102, 102, 0.27);
						border-radius: 10rpx;
						z-index: 1;
						.btn {
							line-height: 47rpx;
						}
					}

					&:nth-child(1):after {
						position: absolute;
						top: 0;
						right: 0;
						content: '';
						width: 5rpx;
						height: 44rpx;
						background: #d2d2d2;
					}
				}

				.active {
					color: #333;
					font-size: 36rpx;
					font-weight: bold;
				}
			}

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
				.row {
					border: 2rpx solid rgba(254, 106, 28, 0.3);
					border-radius: 20rpx;
					margin-bottom: 18rpx;
					box-shadow: 0rpx 4rpx 4rpx 0rpx rgba(254, 106, 28, 0.22);
					background: #ffffff;
				}
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
	}
	.club-box {
		height: 520rpx;
		// display: grid;
		// grid-template-columns: 1fr;
		// row-gap: 30rpx;
		.item {
			height: 100rpx;
			display: flex;
			align-items: center;
			padding: 0 26rpx;
			background: #ffe0d1;
			border: 2rpx solid rgba(254, 106, 28, 0.29);
			box-shadow: 0px 4rpx 4rpx 0px rgba(254, 106, 28, 0.22);
			border-radius: 10rpx;
			color: $themeColor;
			font-size: 30rpx;
			.left {
				width: 66rpx;
				height: 66rpx;
				flex: none;
				background: #fbbfa2;
				border-radius: 50%;
				color: #fff;
				font-size: 48rpx;
				transform: rotateZ(75deg);
			}
			.title {
				flex: 1;
				margin: 0 16rpx;
				text-align: left;
			}
			.icon-right {
				color: #999;
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

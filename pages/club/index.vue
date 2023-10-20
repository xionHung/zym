<template>
	<view class="container">
		<PageComp navStyle="color: rgb(254, 106, 28);" :isApplique="false" :isFooterbtn="!form.is_member" btnText="加入俱乐部" @confirm="confirm">
			<image class="bg-image" slot="header" :src="form.club_back_pic" mode="aspectFill" />
			<view class="top-card">
				<button class="rbtn share-btn" @click="handleShare">
					<image class="title-bg" :src="IMGURL + 'img/mine/text-bg1.png'"></image>
					<text class="relative">分享名片</text>
				</button>
				<view class="top flex">
					<md-avatar :width="130" :src="form.club_headpic" @click="previewClick(form.club_headpic)" />
					<view class="right">
						<view class="flex-space-between mb-14">
							<view class="title flex">
								<text>{{ form.name }}</text>
								<image v-if="form.is_vip === 1" class="union-icon" :src="IMGURL + 'img/club/union.png'" mode="heightFix" />
							</view>
							<text class="iconfont icon-bianji fs-36" @click="addressClick('/pages/club/indexSetting?id=' + form.id)" v-if="isMineClub"></text>
						</view>
						<view class="flex mb-14" @click="ruleClick">
							<view class="mr-8">{{ '活跃度' }}</view>
							<md-star :number="form.activity_level" />
						</view>
						<view class="flex mb-14">
							<view>
								<text class="iconfont icon-group-fill primary-color mr-8" />
								<text>{{ '成立' }}</text>
								<text class="fs-24 fw-bold ml-4 mr-4">{{ form.buildday }}</text>
								<text>{{ '年' }}</text>
							</view>
							<view class="shu"></view>
							<view @click="memberClick">
								<text class="icon-broker" />
								<text>{{ '成员人数' }}</text>
								<text class="fs-24 fw-bold ml-4 mr-4">{{ form.member_count }}</text>
								<text>{{ '人' }}</text>
							</view>
						</view>
						<view class="flex">
							<text class="mr-10">{{ '活动日' }}</text>
							<view class="flex week">
								<view class="normal" :class="{ theme: form.activity_time.includes(item.value) }" v-for="(item, index) in activityTime" :key="index">{{ item.label }}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="tabs flex-center">
				<view class="item" :class="{ active: index === tabCurrent }" v-for="(item, index) in tabs" :key="index" @click="tabClick(index)">
					<view>{{ item }}</view>
					<view class="shu" />
				</view>
			</view>
			<view class="remark-box">
				<u-parse v-show="form[!tabCurrent ? 'desc' : 'notice']" :content="form[!tabCurrent ? 'desc' : 'notice']"></u-parse>
			</view>
			<view class="actity-card" @click="addressClick('/pages/mine/coupon/detail?type=union')" v-if="form.is_vip === 1">
				<image class="actity-card-icon" :src="IMGURL + 'img/club/union_card.png'" mode="heightFix" />
			</view>
			<view class="activity-card">
				<view class="flex-space-between">
					<view class="title">{{ '近期活动' }}</view>
					<text class="icon-right"></text>
				</view>
				<view class="activity-content">
					<ActivityBox v-for="item in form.activity" :key="item.id" :item="item" @predetermine="activityClick" @click="activityGo" />
				</view>
			</view>
			<view class="activity-card">
				<view class="flex-space-between" @click="addressClick('/pages/mine/person/yudong-life?card_id=' + form.id)">
					<view class="title">{{ '活动记录' }}</view>
					<text class="icon-right"></text>
				</view>
				<view class="record-box">
					<RecordBox v-for="item in form.notice_list.data" :key="item.id" :obj="item" />
				</view>
			</view>
			<md-modal :show.sync="alrmShow" hideButton>
				<view class="alrm-remark">{{ '很抱歉，您的段位未达到该活动的 段位要求！' }}</view>
			</md-modal>
			<!-- 分享二维码弹窗 -->
			<Dialog :show.sync="show" @cancel="handleModalCancel">
				<ShareQrcode page="pages/club/index" :scene="'id=' + form.id" :title="form.name" envVersion="trial" />
			</Dialog>
		</PageComp>
	</view>
</template>

<script>
import ActivityBox from '@/components/UIComp/Club/chainsItem.vue';
import RecordBox from './components/record.vue';
import Dialog from '@/pages/components/Dialog.vue';
import ShareQrcode from '@/pages/components/ShareQrcode.vue';
import Uparse from '@/pages/components/Uparse.vue'
export default {
	components: {
		ActivityBox,
		RecordBox,
		Dialog,
		ShareQrcode,
		Uparse
	},
	data() {
		return {
			tabs: ['俱乐部简介', '公告'],
			tabCurrent: 0,
			form: {
				activity_time: '',
				club_headpic: '',
				activity_level: 0,
				is_member: 1,
				name: ''
			},
			activityTime: [
				{ label: '一', value: '1' },
				{ label: '二', value: '2' },
				{ label: '三', value: '3' },
				{ label: '四', value: '4' },
				{ label: '五', value: '5' },
				{ label: '六', value: '6' },
				{ label: '日', value: '7' }
			],
			alrmShow: false,
			show: false // 分享二维码弹窗
		};
	},
	computed: {
		isMineClub() {
			return this.$store.state.userInfo.has_club.includes(this.form.id);
		}
	},
	onLoad(options) {
		this.init(options.id);

		// 扫码获取的联盟编码
		if (options.code) {
			this.$store.commit('SET_UNIONCODE', options.code);
		}
	},
	methods: {
		tabClick(idx) {
			this.tabCurrent = idx;
		},
		addressClick(url) {
			if (!url) return;
			uni.navigateTo({ url });
		},
		async confirm() {
			await this.$api.Club.join({ club_id: this.form.id });
			this.$toast('申请成功');
			this.init(this.form.id);
		},
		memberClick() {
			uni.navigateTo({
				url: '/pages/club/member?id=' + this.form.id
			});
		},
		ruleClick() {
			uni.navigateTo({
				url: '/pages/club/rule?level=' + this.form.activity_level + '&value=' + this.form.activity_level_value
			});
		},
		async init(club_id) {
			let { data } = await this.$api.Club.home({ club_id });
			this.form = data;
		},
		activityClick(item) {
			if (this.$store.state.userInfo.level < item.level) return (this.alrmShow = true);
			if (item.status != 1) return;
			this.activityGo(item);
		},
		activityGo(row) {
			uni.navigateTo({
				url: '/pages/chains/chainsDetail?id=' + row.id + '&time=' + row.starttime
			});
		},
		// 预览头像
		previewClick(url) {
			if (!url) return;
			uni.previewImage({
				urls: [url]
			});
		},
		// 分享二维码相关回调
		handleShare() {
			this.show = true;
		},
		handleModalCancel() {
			this.show = false;
		}
	},
	onShareAppMessage() {
		const userInfo = uni.getStorageSync('userInfo');
		wx.showShareMenu({
			withShareTicket: true,
			menus: ['shareAppMessage', 'shareTimeline']
		});
		return {
			title: this.form.name,
			imageUrl: this.IMGURL + 'fenxiang.jpg',
			path: '/pages/club/index?id=' + this.form.id + '&code=' + userInfo.code
		};
	}
};
</script>

<style lang="scss" scoped>
.bg-image {
	position: fixed;
	top: 0;
	height: 422rpx;
	width: 100%;
}
// .container {
// 	/deep/ .app-container {
// 		top: 110rpx;
// 	}
// }
.top-card {
	padding: 30rpx;
	margin: 140rpx 30rpx 0;
	background-color: #fff;
	border-radius: 20rpx;
	position: relative;
	.share-btn {
		position: absolute;
		right: 0;
		top: -26rpx;
		width: 192rpx;
		height: 50rpx;
		color: #2b1f1b;
		line-height: 50rpx;
		font-size: 22rpx;
		text-indent: 40rpx;
		text-align: right;

		.title-bg {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
		}
	}
	.top {
		.right {
			color: #333;
			margin-left: 20rpx;
			font-size: 22rpx;
			flex: 1;
			.union-icon {
				height: 32rpx;
				margin-left: 12rpx;
			}
			.title {
				color: #222;
				font-size: 32rpx;
				font-weight: bold;
				line-height: 1;
			}
			.icon-broker {
				color: $themeColor;
				margin-right: 10rpx;
			}
			.shu {
				width: 1rpx;
				height: 20rpx;
				background-color: #999;
				margin: 0 10rpx;
			}
			.week {
				& > view {
					width: 30rpx;
					height: 30rpx;
					border-radius: 6rpx;
					position: relative;
					background: #e1e1e1;
					font-size: 20rpx;
					text-align: center;
					line-height: 30rpx;
					&.normal {
						border-radius: 6rpx 0 0 6rpx;
					}
					&.theme {
						background: $themeColor;
						color: #fff;
						margin: 0 2rpx;
					}
				}
			}
		}
	}
}
.tabs {
	height: 30rpx;
	align-items: flex-end;
	justify-content: flex-start;
	color: #999;
	font-size: 24rpx;
	margin: 30rpx 0 20rpx 54rpx;
	.item {
		display: flex;
		align-items: flex-end;
		line-height: 1;
		&.active {
			color: #333;
			font-size: 30rpx;
			font-weight: bold;
		}
		&:last-child {
			.shu {
				display: none;
			}
		}
	}
	.shu {
		width: 1px;
		height: 20rpx;
		background-color: #999;
		margin: 0 12rpx;
	}
}
.remark-box {
	margin: 0 30rpx;
	padding: 30rpx 20rpx;
	border-radius: 20rpx;
	background-color: #fff;
	color: #333;
	font-size: 22rpx;
	line-height: 34rpx;
	white-space: pre-line;
}
.actity-card {
	margin: 30rpx;
	height: 138rpx;
	border-radius: 40rpx;
	box-shadow: 0px 5rpx 8rpx 0px rgba(216, 215, 215, 0.36);
	&-icon {
		height: 100%;
	}
}
.activity-card {
	background: #ffffff;
	box-shadow: 0px 5rpx 8rpx 0px rgba(216, 215, 215, 0.36);
	border-radius: 20rpx;
	margin: 30rpx;
	padding: 24rpx;
	padding-bottom: 0;
	.title {
		font-size: 34rpx;
		font-family: YouSheBiaoTiHei;
		font-weight: 400;
		color: #222222;
		font-weight: bold;
		margin-bottom: 16rpx;
	}
}
.record-box {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	column-gap: 24rpx;
	row-gap: 24rpx;
	padding-bottom: 24rpx;
}
.alrm-remark {
	color: #666;
	font-weight: bold;
	text-align: center;
}
</style>

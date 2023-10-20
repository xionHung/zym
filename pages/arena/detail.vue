<template>
	<view class="container">
		<PageComp navStyle="color: rgb(254, 106, 28);" :isApplique="false">
			<image class="bg-image" slot="header" :src="form.room_bk_image" mode="aspectFill" />
			<view class="top-card">
				<button class="rbtn share-btn" @click="handleShare">
					<image class="title-bg" :src="IMGURL + 'img/mine/text-bg1.png'"></image>
					<text class="relative">分享名片</text>
				</button>
				<view class="top">
					<image :src="form.room_headpic" mode="aspectFill" class="img" @click="previewClick(form.room_headpic)" />
					<view class="top-right flex-center">
						<text class="title">{{ form.name }}</text>
						<view class="flex-between-center mt-24 oneoo-width">
							<view class="flex-center">
								<view class="item" v-for="(item, index) in form.room_device" :key="index">{{ item }}</view>
							</view>
							<view @click="addressClick('/pages/arena/more?id=' + form.id)">
								<text>{{ '更多' }}</text>
								<text class="icon-right" />
							</view>
						</view>
					</view>
				</view>
				<view class="bottom flex-space-between">
					<view class="left flex-center" @click="openLocation(form.latitude, form.longitude, form.address)">
						<view>
							<md-image src="img/icon/location2.png" :width="16" :height="20" />
							<text>{{ form.address }}</text>
						</view>
						<view class="fs-20 mt-20">{{ form.address_other }}</view>
					</view>
					<view class="right" @click="makePhoneCall(form.room_mobile)">
						<text class="icon-phone"></text>
						<view>{{ '联系我们' }}</view>
					</view>
				</view>
			</view>
			<view class="tabs flex-center">
				<view class="item" :class="{ active: index === tabCurrent }" v-for="(item, index) in tabs" :key="index" @click="tabClick(index)">
					<view class="">{{ item }}</view>
					<view class="shu" />
				</view>
			</view>
			<view class="remark-box">
				<u-parse v-show="form[labeles[tabCurrent]]" :content="form[labeles[tabCurrent]]"></u-parse>
			</view>
			<view class="address-card">
				<view class="item" v-for="(item, index) in addressList" :key="index" @click="addressClick(item.url)">
					<image class="item-bg" :src="item.icon"></image>
					<view class="">{{ item.title }}</view>
				</view>
			</view>

			<view class="actity-card" v-if="form.is_union_card" @click="addressClick('/pages/mine/coupon/detail?type=union')">
				<md-image src="img/club/union_card.png" :height="138" mode="heightFix" />
			</view>

			<!-- 分享二维码弹窗 -->
			<Dialog :show.sync="show" @cancel="handleModalCancel">
				<ShareQrcode page="pages/arena/detail" :scene="'id=' + form.id" :title="form.name" envVersion="trial" />
			</Dialog>
		</PageComp>
	</view>
</template>

<script>
import Dialog from '@/pages/components/Dialog.vue';
import ShareQrcode from '@/pages/components/ShareQrcode.vue';
import Uparse from '@/pages/components/Uparse.vue'
export default {
	components: {
		Dialog,
		ShareQrcode,
		Uparse
	},
	data() {
		return {
			labeles: ['desc', 'notice', 'activity'],
			tabs: ['球馆简介', '公告', '活动'],
			tabCurrent: 0,
			addressList: [
				{ title: '场地预定', icon: this.IMGURL + 'img/arena/cdyd.png', url: '/pages/arena/predetermine' },
				{ title: '接龙活动', icon: this.IMGURL + 'img/arena/jlhd.png', url: '/pages/home/other/arena/solitaire' },
				{ title: '培训', icon: this.IMGURL + 'img/arena/px.png', url: '' },
				{ title: '会员充值', icon: this.IMGURL + 'img/arena/hycz.png', url: '/pages/home/other/arena/recharge' },
				{ title: '入驻俱乐部', icon: this.IMGURL + 'img/arena/rzjlb.png', url: '/pages/home/other/arena/club' },
				{ title: '球馆报错', icon: this.IMGURL + 'img/arena/qgbc.png', url: '/pages/home/other/arena/errorPage' }
			],
			form: {},
			show: false // 分享二维码弹窗
		};
	},
	onLoad(options) {
		this.getInfo(options.id);
	},
	methods: {
		tabClick(idx) {
			this.tabCurrent = idx;
		},
		addressClick(url) {
			if (!url) return;
			uni.navigateTo({ url: url + '?id=' + this.form.id });
		},
		async getInfo(room_id) {
			let { data } = await this.$api.Room.home({ room_id });
			this.form = data;
		},
		// 拨打电话
		makePhoneCall(phoneNumber) {
			uni.makePhoneCall({ phoneNumber });
		},
		// 打开地图
		openLocation(latitude, longitude, name) {
			uni.openLocation({
				latitude: Number(latitude),
				longitude: Number(longitude),
				name
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
		display: flex;
		padding-bottom: 18rpx;
		border-bottom: 1rpx solid #d8d8d8;
		.img {
			width: 134rpx;
			height: 134rpx;
			border-radius: 50%;
			border: 6rpx solid #fff7f3;
		}
		&-right {
			flex: 1;
			color: #333;
			font-size: 22rpx;
			margin-left: 16rpx;
			flex-direction: column;
			align-items: flex-start;
			.title {
				font-size: 34rpx;
				font-weight: bold;
			}
			.item {
				min-width: 42rpx;
				height: 34rpx;
				line-height: 34rpx;
				background-color: #ec6826;
				border-radius: 10rpx;
				margin-right: 8rpx;
				color: #fff;
				text-align: center;
				padding: 0 16rpx;
				font-size: 22rpx;
			}
		}
	}
	.bottom {
		margin-top: 10rpx;
		.left {
			height: 104rpx;
			background: linear-gradient(90deg, #fff2ec 0%, #ffffff 100%);
			border-radius: 10rpx;
			flex-direction: column;
			align-items: flex-start;
			padding-left: 28rpx;
			color: #222;
			font-size: 22rpx;
			.fs-20 {
				color: #999;
			}
		}
		.right {
			text-align: center;
			font-size: 20rpx;
			color: #999;
			.icon-phone {
				color: #666;
				font-size: 40rpx;
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
}
.address-card {
	margin: 40rpx 30rpx 20rpx;
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	column-gap: 28rpx;
	grid-template-rows: repeat(3, 130rpx);
	row-gap: 30rpx;
	.item {
		background: #fff1e9;
		box-shadow: 0px 4rpx 9rpx 0px rgba(217, 217, 217, 0.5);
		border-radius: 30rpx;
		color: #ec6826;
		font-size: 34rpx;
		font-weight: bold;
		text-align: center;
		line-height: 130rpx;
		position: relative;
		z-index: 1;
		& > view {
			position: relative;
			z-index: inherit;
		}
		.item-bg {
			position: absolute;
			width: 112rpx;
			height: 105rpx;
			z-index: 0;
			left: 0;
			right: 0;
			bottom: 0;
			margin: auto;
		}
	}
}
</style>

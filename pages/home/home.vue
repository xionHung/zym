<template>
	<view class="page-home">
		<view class="wp-100" :style="{ height: StatusBar + 'px' }"></view>
		<view class="fixed-head-bg">
			<image :src="IMGURL + 'img/home/bg-banner.png'" class="icon-bg" mode="widthFix"></image>
		</view>
		<view class="fixed-head-title">
			<view class="title">中羽盟</view>
			<!-- 打造中国羽毛球爱好者联盟 -->
			<view class="tip">
				<image :src="IMGURL + 'home/dazao.png'" mode="widthFix"></image>
			</view>
		</view>
		<view class="page-container">
			<view class="search-container flex">
				<button class="rbtn btn" @click="toPath('/pages/home/other/check-city')">
					<image class="icon" :src="IMGURL + 'img/icon/location.png'" mode="widthFix"></image>
					{{ address.cityName ? address.cityName.replace('市', '') : '未定位' }}
				</button>
				<view class="input-inner flex1 flex-center" @click="toPath('/pages/home/other/search', true)">
					<image class="icon" :src="IMGURL + 'img/icon/search.png'" mode="widthFix"></image>
					<text class="input" style="color: #fdeadf">搜索俱乐部、球馆</text>
				</view>
				<button class="rbtn btn" @click="toPath('/pages/home/other/message')">
					<image class="icon" :src="IMGURL + 'img/icon/message.png'" mode="widthFix"></image>
					消息
				</button>
			</view>
			<view class="banner-container">
				<HomeBanner />
			</view>
			<view class="information-container">
				<view class="title">
					<image class="title-bg" :src="IMGURL + 'img/home/text-bg1.png'"></image>
					<text class="relative">我的羽球数据</text>
				</view>
				<view class="data-list flex-space-between">
					<button class="rbtn item flex-column" @click="toPath('/pages/home/other/data?type=1')">
						<text class="iconfont icon-yumaoqiu primary-color" style="font-size: 46rpx"></text>
						<view class="bold">{{ info.point }}</view>
						<view class="data-text">
							打球积分
							<text class="icon-right"></text>
						</view>
					</button>
					<button class="rbtn item flex-column" @click="toPath('/pages/home/other/data?type=3')">
						<text class="iconfont icon-yumaoqiupai primary-color" style="font-size: 46rpx"></text>
						<view class="bold">{{ info.count }}</view>
						<view class="data-text">
							本月场次
							<text class="icon-right"></text>
						</view>
					</button>
					<button class="rbtn item flex-column" @click="toPath('/pages/home/other/data?type=2')">
						<text class="iconfont icon-qianbao primary-color" style="font-size: 46rpx"></text>
						<view class="bold">{{ info.amount }}</view>
						<view class="data-text">
							本月消费
							<text class="icon-right"></text>
						</view>
					</button>
				</view>
			</view>
			<view class="nav-container">
				<view class="nav-item" @click="toPath('/pages/home/other/arena', true)">
					<image class="nav-bg" :src="IMGURL + 'img/home/qg_dc.png'" mode="widthFix"></image>
					<text class="text">球馆/订场</text>
				</view>
				<view class="nav-item" @click="toPath('/pages/home/other/solitaire', true)">
					<image class="nav-bg" :src="IMGURL + 'img/home/jlb_jl.png'" mode="widthFix"></image>
					<text class="text">俱乐部/接龙</text>
				</view>
				<view class="nav-item" @click="toPath('', true)">
					<image class="nav-bg" :src="IMGURL + 'img/home/px.png'" mode="widthFix"></image>
					<text class="text">赛事</text>
				</view>
				<view class="nav-item" @click="toPath('/pages/home/other/badminton-circle', true)">
					<image class="nav-bg" :src="IMGURL + 'img/home/ylq.png'" mode="widthFix"></image>
					<text class="text">羽乐圈</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import HomeBanner from '@/components/home-banner.vue';
import { getWXUserLocation } from '@/utils/tools.js';
// 阻止onShow执行相关函数字段
let isNotOnShow = false;
export default {
	components: { HomeBanner },
	data() {
		return {
			StatusBar: this.StatusBar,
			current: 0,
			info: {},
		};
	},
	computed: {
		address() {
			return this.$store.state.address;
		},
		userinfo() {
			return this.$store.state.userInfo;
		},
	},
	async onLoad() {
		isNotOnShow = true;

		// 判断是否存在经纬度
		if (!this.userinfo.latitude) {
			// 地理位置授权
			getWXUserLocation();
		}

		// 获取最新的用户信息并更新缓存数据
		const _info = await this.$store.dispatch('getUserInfo');
		// 用户没有绑定手机号，跳转手机授权界面
		if (!_info.mobile) {
			uni.navigateTo({
				url: '/pages/login/login',
			});
			return;
		}

		// 开启分享
		wx.showShareMenu({
			withShareTicket: true,
			menus: ['shareAppMessage', 'shareTimeline'],
		});
	},
	async onShow() {
		if (!isNotOnShow) {
			this.$store.dispatch('getUserInfo');
		}
		this.getMyInfo();
	},
	onHide() {
		// 重置isNotOnShow状态
		isNotOnShow = false;
	},
	methods: {
		toPath(url, isflag) {
			if (!url) return this.$toast('敬请期待');
			// 用户没有入住个人信息,跳转我的信息页面进行填写资料
			if (isflag && this.userinfo.state == -1) {
				uni.navigateTo({
					url: '/pages/mine/person/create',
				});
				return;
			}
			uni.navigateTo({ url });
		},
		/**
		 * 接口
		 */
		// 我的/首页共用
		async getMyInfo() {
			try {
				const res = await this.$api.My.index();
				this.info = res.data;
				uni.setStorageSync('indexInfo', res.data);
			} catch (e) {
				//TODO handle the exception
			}
		},
	},
	async onShareAppMessage() {
		return {
			title: '中羽盟',
			imageUrl: this.IMGURL + 'fenxiang.jpg',
			//如果有参数的情况可以写path
			path: '/pages/cover/cover?code=' + this.userinfo.code,
		};
	},
};
</script>

<style lang="scss" scoped>
$banner-height: 316rpx;
.page-home {
	.fixed-head-title {
		position: relative;
		width: 100%;
		color: #fff;
		font-size: 36rpx;
		text-align: center;

		.title {
			line-height: 36rpx;
			font-weight: bold;
		}

		.tip {
			width: 312rpx;
			height: 32rpx;
			margin: 12rpx auto 0;
		}
	}
}
.page-container {
	padding: 0 30rpx;
}
.search-container {
	position: relative;
	margin-top: 48rpx;
	height: 88rpx;
	color: #fff;
	margin-bottom: 32rpx;
	font-size: 28rpx;
	.input-inner {
		height: 88rpx;
		margin: 0 22rpx;
		background: #fe8849;
		border-radius: 44rpx;
		.icon {
			width: 32rpx;
			height: 34rpx;
			margin-right: 18rpx;
		}
		.input {
			width: 230rpx;
		}
	}
	.btn {
		flex-direction: column;
		font-size: 24rpx;
		.icon {
			width: 28rpx;
			height: 34rpx;
			margin-bottom: 6rpx;
		}
	}
}
.information-container {
	margin-top: 32rpx;
	.title {
		width: 262rpx;
		height: 68rpx;
		position: relative;
		color: #222;
		font-weight: bold;
		line-height: 68rpx;
		text-indent: 20rpx;
		.title-bg {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
		}
	}
	.data-list {
		width: 680rpx;
		height: 190rpx;
		padding: 0 74rpx 0 40rpx;
		margin: -10rpx auto 36rpx;
		background: #ffffff;
		box-shadow: 0rpx 5rpx 27rpx 0rpx rgba(254, 162, 113, 0.17);
		border-radius: 0rpx 10rpx 10rpx 10rpx;
		.item {
			.icon {
				width: 40rpx;
				height: 40rpx;
			}
			.bold {
				font-size: 36rpx;
				font-weight: bold;
				color: #222;
				margin: 18rpx 0 28rpx;
			}
			.data-text {
				font-size: 24rpx;
				color: #666;
				.icon-right {
					margin-left: 8rpx;
				}
			}
		}
	}
}
.nav-container {
	display: flex;
	flex-wrap: wrap;
	.nav-item {
		width: 336rpx;
		height: 210rpx;
		box-shadow: 0rpx 7rpx 17rpx 0rpx rgba(18, 22, 25, 0.3);
		border-radius: 12rpx;
		margin-bottom: 24rpx;
		padding-top: 55rpx;
		padding-left: 30rpx;
		color: #fff;
		font-size: 30rpx;
		font-weight: bold;
		text-align: left;
		position: relative;
		z-index: 1;
		&:nth-child(even) {
			margin-left: 18rpx;
		}
		.text {
			position: relative;
			z-index: 1;
		}
		.nav-bg {
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0;
			left: 0;
			z-index: 0;
		}
	}
}
</style>

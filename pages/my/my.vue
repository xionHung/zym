<template>
	<view class="page-mine">
		<CustomPage title="我的" bgHeight="406rpx" :showBack="false">
			<view class="page-container" slot="content">
				<view class="content">
					<view class="user-card">
						<!-- open-type="share" -->
						<button class="rbtn share-btn" @click="handlerClick('/pages/mine/settings/share')">
							<image class="title-bg" :src="IMGURL + 'img/mine/text-bg1.png'"></image>
							<text class="relative">分享名片</text>
						</button>
						<view class="flex-space-between">
							<view class="left">
								<view class="head-img">
									<md-avatar :src="info.headpic" width="112" :sex="info.sex" @click="handleUser(info.nickname)"></md-avatar>
								</view>
								<view class="info">
									<view class="name">{{ info.nickname }}</view>
									<view class="level flex-start">
										<text>段位：</text>
										<text class="level-tag">{{ info.level }}</text>
									</view>
									<view class="tags flex-start">
										<text>个人标签：</text>
										<text class="tag" v-for="(item, index) in info.label" :key="index">{{ item }}</text>
									</view>
								</view>
							</view>
							<view class="right" @click="handlerClick(`/pages/mine/person/person?user_id=${info.id}`)">
								个人主页
								<text class="icon-right"></text>
							</view>
						</view>
						<view class="hint">羽球箴言:{{ info.desc }}</view>
					</view>
					<view class="nav-container flex-space-between">
						<view class="nav-item" v-for="(item, index) in navItems" :key="index" :class="{ disabled: item.disabled }" @click="_click(item)">
							<image class="icon" :src="item.icon" mode="heightFix" :style="{ right: item.right }" />
							<view class="label">{{ item.label }}</view>
						</view>
					</view>
					<view class="link-container">
						<view class="item flex-space-between" v-for="(item, index) in otherLink" :key="index" @click="handlerClick(item.url)">
							<view class="left flex-start">
								<view class="icon flex flex-center" :class="item.color">
									<image :src="item.icon" class="h-8 w-8"></image>
								</view>
								<text class="label">{{ item.label }}</text>
							</view>
							<text class="icon-right"></text>
						</view>
					</view>
				</view>
			</view>
		</CustomPage>
	</view>
</template>

<script>
import { getUserProfile } from '@/utils/tools.js';
export default {
	data() {
		return {
			info: {},
			navItems: [
				{
					value: 0,
					icon: this.IMGURL + 'img/mine/enter.png',
					label: '球馆入驻',
					url: '/pages/arena/create',
					right: '20rpx',
				},
				{
					value: 1,
					icon: this.IMGURL + 'img/mine/train.png',
					label: '培训管理',
					url: '',
					right: '6rpx',
				},
				{
					value: 2,
					icon: this.IMGURL + 'img/mine/order.png',
					label: '我的订单',
					url: '/pages/mine/order/index',
					right: '22rpx',
				},
				{
					value: 3,
					icon: this.IMGURL + 'img/mine/coupon.png',
					label: '我的卡券',
					url: '/pages/mine/coupon/coupon',
					right: '0rpx',
				},
			],
			otherLink: [
				{
					label: '我的俱乐部',
					url: '/pages/mine/other/my-club',
					color: 'icon1',
					icon: this.IMGURL + 'img/user/club.png',
				},
				{
					label: '我的球馆',
					url: '/pages/mine/other/my-arena',
					color: 'icon2',
					icon: this.IMGURL + 'img/user/room.png',
				},
				// {
				// 	label: '我的培训',
				// 	url: '/pages/mine/settings',
				// 	color: 'icon3'
				//  icon: this.IMGURL + 'img/user/px.png',
				// },
				{
					label: '帮分销',
					url: '/pages/mine/distribute',
					color: 'icon4',
					icon: this.IMGURL + 'img/user/fx.png',
				},
				{
					label: '设置',
					url: '/pages/mine/settings',
					color: 'icon5',
					icon: this.IMGURL + 'img/user/help.png',
				},
				{
					label: '自助中心',
					url: '/pages/mine/self-help',
					color: 'icon6',
					icon: this.IMGURL + 'img/user/set.png',
				},
			],
		};
	},
	computed: {
		userinfo() {
			return this.$store.state.userInfo;
		},
	},
	onShow() {
		this.info = uni.getStorageSync('indexInfo');
	},
	methods: {
		_click(row) {
			if (!row.value) {
				if (!!this.userinfo.has_room) {
					return this.$toast('已有球馆，请到首页系统消息中查看账号');
				}
				// 用户没有入住个人信息,跳转我的信息页面进行填写资料
				if (this.userinfo.state == -1) {
					uni.navigateTo({
						url: '/pages/mine/person/create',
					});
					return;
				}
			}
			if (row.value === 1) return this.$toast('敬请期待');
			this.handlerClick(row.url);
		},
		handlerClick(url) {
			uni.navigateTo({
				url,
			});
		},
		// 用户授权
		handleUser(nickname) {
			return;
			if (nickname !== '游客') return;
			uni.showModal({
				content: '是否授权用户信息？',
				success: async res => {
					if (res.confirm) {
						try {
							const { iv, encryptedData: encrypt_data } = await getUserProfile();
							const { message } = await this.$api.User.save_auth({ iv, encrypt_data });
							this.$toast(message);
							// 刷新用户信息
							this.$store.dispatch('getUserInfo');
						} catch (e) {
							//TODO handle the exception
						}
					}
				},
			});
		},
	},
};
</script>

<style lang="scss" scoped>
.page-mine {
	.page-container {
		flex: 1;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.content {
		position: relative;
		padding: 160rpx 30rpx 20rpx;
		overflow-y: auto;

		.user-card {
			position: relative;
			height: 210rpx;
			margin-bottom: 20rpx;
			padding: 20rpx 30rpx 30rpx;
			background: #ffffff;
			box-shadow: 0rpx 4rpx 25rpx 0rpx rgba(254, 106, 28, 0.08);
			border-radius: 20rpx 10rpx 20rpx 20rpx;
			font-size: 22rpx;
			color: #333;

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

			.left {
				display: flex;
			}

			.right {
				height: 78rpx;
				color: #fe6a1c;
				font-size: 20rpx;

				.icon-right {
					margin-left: 6rpx;
				}
			}

			.head-img {
				width: 112rpx;
				height: 112rpx;
				margin-right: 22rpx;

				.blue {
					color: rgb(25, 151, 220);
				}

				.red {
					color: red;
				}

				.img {
					display: block;
					width: 100%;
					height: 100%;
				}
			}

			.info {
				line-height: 44rpx;

				.level-tag {
					display: inline-block;
					line-height: 22rpx;
					border-radius: 10rpx;
					background: #d2e6ff;
					color: #4c9cfe;
					font-size: 18rpx;
					padding: 0 12rpx;
					margin-right: 8rpx;
				}

				.tags {
					.tag {
						display: inline-block;
						height: 22rpx;
						line-height: 22rpx;
						padding: 0 12rpx;
						background: #ffe2d3;
						font-size: 18rpx;
						color: #fe6c1f;
						margin-right: 8rpx;
						border-radius: 10rpx;
						vertical-align: middle;
					}
				}
			}

			.name {
				color: #222;
				font-weight: bold;
				font-size: 32rpx;
				line-height: 1.1;
				margin-bottom: 10rpx;
			}

			.level {
			}
		}

		.nav-container {
			margin-bottom: 8rpx;
			flex-wrap: wrap;
			color: #fff;
			font-size: 36rpx;

			.nav-item {
				overflow: hidden;
				position: relative;
				width: 330rpx;
				height: 140rpx;
				background: linear-gradient(90deg, #c0a4fd 0%, #7147f7 100%);
				box-shadow: 0rpx 4rpx 20rpx 0rpx rgba(141, 103, 249, 0.5);
				border-radius: 50rpx;

				&:nth-child(2) {
					background: linear-gradient(90deg, #a2b5ff 0%, #4966f5 100%);
					box-shadow: 0rpx 4rpx 20rpx 0rpx rgba(113, 139, 250, 0.46);
				}

				&:nth-child(3) {
					background: linear-gradient(90deg, #ff9b9b 0%, #f25a59 99%);
					box-shadow: 0rpx 4rpx 20rpx 0rpx rgba(248, 119, 118, 0.5);
					margin-top: 28rpx;
				}

				&:nth-child(4) {
					background: linear-gradient(90deg, #fbc171 0%, #f38c00 100%);
					box-shadow: 0rpx 4rpx 20rpx 0rpx rgba(247, 167, 58, 0.5);
					margin-top: 28rpx;
				}

				.label {
					position: relative;
					top: 52rpx;
					left: 34rpx;
					line-height: 1;
				}

				.icon {
					position: absolute;
					right: 0;
					bottom: 0;
					height: 80rpx;
					width: 108rpx;
				}
			}
		}

		.link-container {
			color: #222222;

			.item {
				height: 124rpx;

				.left {
					.label {
						font-size: 28rpx;
						font-weight: bold;
					}

					.icon {
						width: 64rpx;
						height: 64rpx;
						margin-right: 18rpx;
						border-radius: 50%;
					}

					.icon1 {
						background: linear-gradient(90deg, #fe6a1c 0%, #ffcaad 100%);
						box-shadow: 4rpx 4rpx 16rpx 0rpx rgba(254, 114, 41, 0.5);
					}

					.icon2 {
						background: linear-gradient(90deg, #7249f7 0%, #bda0fc 100%);
						box-shadow: 4rpx 4rpx 16rpx 0rpx rgba(122, 83, 247, 0.5);
					}

					.icon3 {
						background: linear-gradient(90deg, #4c69f5 0%, #9fb2fe 100%);
						box-shadow: 4rpx 4rpx 16rpx 0rpx rgba(85, 113, 246, 0.5);
					}

					.icon4 {
						background: linear-gradient(90deg, #fda246 0%, #fabe6b 100%);
						box-shadow: 4rpx 4rpx 16rpx 0rpx rgba(253, 165, 75, 0.5);
					}

					.icon5 {
						background: linear-gradient(90deg, #3090f6 0%, #59c1ff 100%);
						box-shadow: 4rpx 4rpx 16rpx 0rpx rgba(52, 149, 247, 0.5);
					}

					.icon6 {
						background: linear-gradient(90deg, #1fbc5a 0%, #4bda7f 100%);
						box-shadow: 4rpx 4rpx 16rpx 0rpx rgba(38, 192, 95, 0.5);
					}
				}

				.icon-right {
					font-size: 28rpx;
					color: #999999;
				}

				.contact-btn {
					height: 104rpx;
					flex: 1;
					justify-content: space-between;
				}
			}
		}
	}
}
</style>

<template>
	<view class="container">
		<!-- 顶部导航栏 -->
		<view class="custom-nav">
			<cu-custom isBack leftStyle="color: black;" />
		</view>
		<view class="logo flex flex-center">
			<image :src="IMGURL + 'img/home/bg-banner.png'"></image>
		</view>
		<view class="flex flex-col">
			<text class="title">欢迎来到中羽盟</text>
			<text class="sub-title">打造中国羽毛球爱好者联盟</text>
		</view>
		<view class="bottom">
			<view class="flex-center">
				<button class="login-btn" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" :disabled="!check">
					<text class="iconfont icon-weixin fs-33 mr-8" style="line-height: 90rpx"></text>
					手机号快捷登录
				</button>
			</view>
			<label class="md-checkbox flex flex-center fs-18" @click="handleCheck">
				<view
					:class="{
						circle: 'circle',
						'flex-center': 'flex-center',
						active: check,
					}"
				>
					<image v-show="check" class="icon" :src="IMGURL + 'img/arena/radio_gou.png'" mode="aspectFill" />
				</view>
				<span>我已阅读并同意</span>
				<view class="text-btn" @click.stop="handleView(1)">《隐私政策》</view>
				<span>和</span>
				<view class="text-btn" @click.stop="handleView(2)">《用户协议》</view>
			</label>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			check: false,
		};
	},
	methods: {
		handleView(type) {
			uni.navigateTo({
				url: '/pages/mine/settings/detail?type=' + type,
			});
		},
		handleCheck() {
			this.check = !this.check;
		},
		async getPhoneNumber(e) {
			if (!this.check) {
				uni.showModal({
					content: '是否阅读并同意《隐私政策》和《用户协议》',
					success: function (res) {
						this.check = res.confirm;
					},
				});
			}
			const { code } = e.detail;
			try {
				await this.$api.User.saveMobile({ code });
				uni.switchTab({ url: '/pages/home/home' });
			} catch (error) {}
		},
	},
};
</script>

<style scoped lang="scss">
$red: #b2282f;
.container {
	position: relative;
	padding-top: env(safe-area-inset-top);
	height: 100%;
	width: 100%;
	background: white;
	// 顶部导航栏
	.custom-nav {
		width: 100%;
		position: absolute;
		left: 0;
		top: 0;
	}
	.logo {
		margin-top: 187rpx;
		margin-bottom: 40rpx;
		& > image {
			width: 178rpx;
			height: 199rpx;
		}
	}
	.title {
		font-size: 67rpx;
		color: $red;
		font-weight: bold;
		font-style: italic;
	}
	.sub-title {
		font-size: 34rpx;
		font-family: yuweij;
		font-weight: 500;
		color: $red;
	}
	.bottom {
		margin-top: 490rpx;
		.login-btn {
			width: 565rpx;
			height: 90rpx;
			background: $red;
			border-radius: 31rpx;
			margin: 0;
			color: white;
			font-size: 33rpx;
		}
		.md-checkbox {
			margin-top: 56rpx;
			.circle {
				border-radius: 50%;
				border: 1px solid;
				margin-right: 20rpx;
				width: 18rpx;
				height: 18rpx;
				&.active {
					background: $red;
					border-color: $red;
				}
				.icon {
					width: 100%;
					height: 100%;
				}
			}
		}

		.text-btn {
			color: $red;
		}
	}
}
</style>

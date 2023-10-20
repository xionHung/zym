<template>
	<PageComp title="创建俱乐部" isArc navStyle="color: #fff; background: #FE6A1C">
		<view class="content">
			<view class="upoad-box">
				<md-upload-image v-model="form.club_headpic" typeName="club" circle :width="130" />
				<view class="mt-2 fw-bold">{{ '俱乐部logo' }}</view>
				<view class="remark">{{ '不得使用敏感照片' }}</view>
			</view>
			<view class="container">
				<md-from-item label="俱乐部名称" v-model="form.name" required placeholder="请输入俱乐部全称" remark="不得包含敏感字或敏感字符！" />
				<view style="margin-top: 68rpx"></view>
				<md-from-item label="常驻场馆" v-model="form.room_name" placeholder="请输入场馆名称" />
			</view>
			<view class="yuedu">
				<text class="icon icon-yes-fill" :class="{ active: isCheck }" @click="isCheck = !isCheck"></text>
				<text @click="isCheck = !isCheck">{{ '我已阅读并同意' }}</text>
				<text class="active" @click="remark(1)">{{ '《隐私政策》' }}</text>
				<text>{{ '、' }}</text>
				<text class="active" @click="remark(2)">{{ '《用户协议》' }}</text>
				<text>{{ '、' }}</text>
				<text class="active" @click="remark(3)">{{ '《提现服务协议》' }}</text>
			</view>
			<view class="btn" @click="submit">{{ '立即创建' }}</view>
		</view>
	</PageComp>
</template>

<script>
export default {
	data() {
		return {
			form: {
				club_headpic: '',
				name: '',
				room_name: ''
			},
			isCheck: false
		};
	},
	onLoad() {
		uni.setNavigationBarColor({
			frontColor: '#ffffff',
			backgroundColor: '#FE6A1C'
		});
	},
	methods: {
		async submit() {
			let { club_headpic, name, room_name } = this.form;
			// if (!club_headpic) return this.$toast('请上传俱乐部logo');
			if (!name) return this.$toast('请输入俱乐部全称');
			if (!this.isCheck) return this.$toast('请勾选协议');
			try {
				let parmas = {
					club_headpic,
					name,
					room_name,
					code: uni.getStorageSync('unionCode')
				};
				await this.$api.Club.register(parmas);
				this.$store.dispatch('getUserInfo');
				await this.$toast('创建成功');
				uni.navigateBack();
			} catch (e) {}
		},
		remark(type) {
			uni.navigateTo({
				url: '/pages/mine/settings/detail?type=' + type
			});
		}
	}
};
</script>

<style lang="scss" scoped>
::v-deep {
	.app-container {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		.content {
			height: 90%;
			border-radius: 30rpx 30rpx 0 0;
			background-color: #fff;
			position: relative;
			color: #333;
			font-size: 26rpx;
			display: flex;
			flex-direction: column;
			.remark {
				color: #999;
				font-size: 18rpx;
				line-height: 1;
				margin-top: 6rpx;
			}
			.upoad-box {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				margin-top: -46rpx;
				margin-bottom: 60rpx;
			}
			.container {
				margin: 0 68rpx;
				flex: 1;
			}
		}
	}
	.btn {
		width: 320rpx;
		height: 76rpx;
		background: #fe6a1c;
		box-shadow: 9rpx 9rpx 35rpx 0px rgba(254, 106, 28, 0.4);
		border-radius: 38rpx;
		color: #fff;
		font-size: 30rpx;
		font-weight: bold;
		line-height: 76rpx;
		text-align: center;
		margin: 20rpx auto;
	}
}
.yuedu {
	color: #333;
	font-size: 18rpx;
	font-weight: bold;
	text-align: center;
	.icon-yes-fill {
		color: #999;
		margin-right: 24rpx;
	}
	.active {
		color: $themeColor;
	}
}
</style>

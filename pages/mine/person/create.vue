<template>
	<PageComp title="我的信息" isArc navStyle="color: #fff; background: #FE6A1C">
		<view class="content">
			<view class="upoad-box">
				<md-upload-image v-model="form.headpic" typeName="user" circle :width="130" />
				<view class="mt-2 fw-bold">{{ '个人头像' }}</view>
				<view class="remark">{{ '不得使用敏感照片' }}</view>
			</view>
			<view class="container">
				<md-from-item label="昵称" v-model="form.nickname" required placeholder="请输入昵称" remark="不得包含敏感字或敏感字符！" />
				<view class="mt-32"></view>
				<md-cell label="性别" @click="handleGender" :value="sexname"></md-cell>
				<md-cell label="段位自评" required :value="levelname" @click="handleUrl('/pages/mine/person/dan?level=' + form.level)"></md-cell>
			</view>
			<view class="yuedu">
				<text class="icon icon-yes-fill" :class="{ active: isCheck }" @click="isCheck = !isCheck"></text>
				<text @click="isCheck = !isCheck">{{ '我已阅读并同意' }}</text>
				<text class="active" @click="remark(1)">{{ '《隐私政策》' }}</text>
				<text>{{ '、' }}</text>
				<text class="active" @click="remark(2)">{{ '《用户协议》' }}</text>
			</view>
			<view class="btn" @click="submit">{{ '保存' }}</view>
		</view>

		<!-- 弹窗 -->
		<md-b-dialog :show.sync="show" title="性别" @confirm="handleConfirm">
			<md-picker :list="genders" @picker="handlePicker"></md-picker>
		</md-b-dialog>
	</PageComp>
</template>

<script>
export default {
	data() {
		return {
			form: {
				headpic: '',
				nickname: '',
				sex: null,
				level: null,
			},
			levelname: '',
			isCheck: false,
			// 性别
			show: false,
			genders: [
				{ label: '男', value: 1 },
				{ label: '女', value: 2 },
			],
			sexname: '',
			maps: {}, // 各枚举集合
		};
	},
	onLoad() {
		uni.setNavigationBarColor({
			frontColor: '#ffffff',
			backgroundColor: '#FE6A1C',
		});
	},
	methods: {
		handleUrl(url) {
			if (!url) return;
			uni.navigateTo({
				url,
			});
		},
		// 性别
		handleGender() {
			this.show = true;
		},
		// 性别选择回调
		handlePicker(val) {
			this.maps = { ...this.maps, genders: val };
		},
		// 弹窗确认
		handleConfirm() {
			// 性别
			this.form.sex = this.maps.genders.value;
			this.sexname = this.maps.genders.label;
			this.show = false;
		},
		// 获取段位
		getDanValue(val) {
			this.levelname = val.name;
			this.form.level = val.id;
		},
		async submit() {
			let { nickname, level, sex } = this.form;
			if (!nickname) return this.$toast('请输入昵称');
			if (!sex) return this.$toast('请选择性别');
			if (!level) return this.$toast('请选择段位自评');
			if (!this.isCheck) return this.$toast('请勾选协议');
			try {
				const { message } = await this.$api.User.save({ ...this.form });
				await this.$toast(message);
				uni.switchTab({ url: '/pages/home/home' });
			} catch (e) {}
		},
		remark(type) {
			uni.navigateTo({
				url: '/pages/mine/settings/detail?type=' + type,
			});
		},
	},
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
	.footer-box {
		background: white;
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

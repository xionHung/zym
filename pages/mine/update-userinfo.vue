<template>
	<view class="page-userinfo">
		<view class="form-card">
			<!-- <view class="form-item flex-center" style="padding: 40rpx 0;">
				<button class="avatar-wrapper rbtn" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
					<image class="avatar" :src="avatarUrl"></image>
				</button> 
			</view> -->
			<view class="form-item flex-space-between">
				<view class="label em-4">头像</view>
				<view class="flex-start">
					<button class="avatar-wrapper rbtn" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
						<image class="avatar" :src="avatarUrl"></image>
					</button> 
					<text class="icon-right"></text>
				</view>
			</view>
			<view class="form-item flex-space-between">
				<view class="label em-4">昵称</view>
				<view class="flex-start">
					<input type="nickname" class="weui-input input" @change="changeName" v-model="nickName" placeholder="请输入昵称"/>
					<text class="icon-right"></text>
				</view>
			</view>
		</view>
		<view class="tip">*推荐使用微信头像和名称，便于营养管家提供售后服务</view>
		<button class="rbtn submit" :class="{disabled: !checkName}" @click="handleSubmit">保存</button>
	</view>
</template>

<script>
	import verify from "@/utils/verify";
	import appConfig from "@/configs/"
	import configSettings from "@/static/config"
	
	export default {
		computed: {
			// userInfo() {
			// 	return this.$store.state.userInfo
			// }
		},
		data() {
			return {
				loading: false,
				checkName: false,
				avatarUrl: '',
				nickName: '',
				headImg: '',
				userInfo: {},
			}
		},
		async mounted() {
			this.userInfo = await this.$store.dispatch('getUserInfo');
			if(this.userInfo.headImgUrl) this.avatarUrl = this.headImg = this.userInfo.headImgUrl;
			if(this.userInfo.nickName) {
				this.nickName = this.userInfo.nickName;
				this.checkName = true;
			}
			// let userInfo = await this.$store.dispatch('getUserInfo');
			// let { realName, mobile} = userInfo;
			// if(mobile) this.formData.mobile = mobile;
			// if(realName) this.formData.realName = realName;
		},
		watch: {
			nickName(val) {
				if(!val) this.checkName = false;
			}
		},
		methods: {
			changeName(e) {
				this.nickName = e.detail.value
				this.checkName = !!this.nickName
			},
			uploadImg() {

			},
			async onChooseAvatar(e) {
				const { avatarUrl } = e.detail;
				this.avatarUrl = avatarUrl;
				let data = uni.getFileSystemManager().readFileSync(avatarUrl, 'binary');
				
				const companyId = configSettings.companyId;
				const platformId = uni.getStorageSync('platformId');
				const token = uni.getStorageSync('token');
				let header = {};
				if(token) header.token = token;
				if(companyId) header.companyId = companyId;
				if(platformId) header.platformId = platformId;
				uni.uploadFile({
					url: appConfig.baseUrl + '/api/ApiWeChantUser/Upload',
					header: header,
					filePath: avatarUrl,
					name: 'file',
					success: (res) => {
						let data = JSON.parse(res.data);
						if(data.code !== 0) {
							this.avatarUrl = '';
							this.headImg = '';
							return this.$message(data.msg);
						}
						this.headImg = data.result;
					},
					fail: (err) => {
						console.log(err,'***********')
						this.avatarUrl = '';
					}
				})
				// this.$api.User.Upload({
				// 	file: data
				// }).then(res => {
				// 	console.log(res, 2333)
				// })
				// console.log(data, 2333)
			},
			async handleSubmit() {
				// console.log(this.avatarUrl)
				// console.log(this.nickName, 2333)
				if(this.loading) return;
				if(!this.headImg) return this.$showToast('请选择头像');
				if(!this.nickName) return this.$showToast('请输入昵称');
				let params = {
					headImg: this.headImg,
					nickName: this.nickName
				}
				console.log(params);
				this.loading = true;
				uni.showLoading();
				let res = await this.$api.User.UpdateWechantUserInfo(params)
				uni.hideLoading();
				this.loading = false;
				if(res.code === 0) {
					uni.navigateBack();
					this.$showToast('修改成功~')
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-userinfo {
		height: 100vh;
		background: #f1f1f1;
		font-size: 24rpx;
		.tip {
			text-align: center;
			color: #a0a0a0;
			font-size: 18rpx;
			line-height: 64rpx;
		}
		.form-card {
			background: #fff;
			.avatar {
				width: 74rpx;
				height: 74rpx;
				background: #ccc;
				border-radius: 50%;
			}
			.input {
				font-size: 32rpx;;
			}
			.form-item {
				position: relative;
				padding: 26rpx 44rpx;
				border-bottom: 2rpx solid #C7C7C7;
				&:nth-last-child(1) {
					border-bottom: 0;
				}
				.label {
					// font-weight: bold;
				}
				.input {
					text-align: right;
				}
				.icon-right {
					margin-left: 20rpx;
					// font-size: 20rpx;
					// transform: translateY(-50%);
				}
			}
		}

		.submit {
			position: fixed;
			bottom: 40rpx;
			width: 222rpx;
			height: 50rpx;
			background: $themeColor;
			color: #383838;
			font-size: 22rpx;
			border-radius: 25rpx;
			left: 50%;
			margin-left: -111rpx;
		}
	}
</style>

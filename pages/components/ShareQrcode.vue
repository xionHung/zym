<template>
	<view class="container">
		<view class="top flex flex-col">
			<view class="title">{{ !title ? '中羽盟' : '邀请你加入' }}</view>
			<!-- 打造中国羽毛球爱好者联盟 -->
			<view class="sub">
				<image v-if="!title" :src="IMGURL + 'home/dazao.png'" mode="widthFix" class="sub-image"></image>
				<text v-else>{{ title }}</text>
			</view>
			<image mode="aspectFill" :src="url" class="codeimg wp-100"></image>
			<view class="fs-30 mt-17">长按识别二维码</view>
		</view>
		<view class="bottom flex">
			<button class="flex1 flex flex-col" open-type="share">
				<view class="icon">
					<text class="iconfont icon-weixin"></text>
				</view>
				<view>分享好友</view>
			</button>
			<button class="flex1 flex flex-col" @click="savePoster">
				<view class="icon">
					<text class="iconfont icon-yunduanxiazai"></text>
				</view>
				<view>保存到相册</view>
			</button>
		</view>
	</view>
</template>

<script>
export default {
	name: 'share-qrcode',
	props: {
		title: {
			type: String,
			default: ''
		}, // 球馆 或 俱乐部 名称
		// 分享地址
		page: {
			type: String,
			default: 'pages/cover/cover'
		},
		// 正式版为 release，体验版为 trial，开发版为 develop。默认是正式版
		envVersion: {
			type: String,
			default: 'release'
		},
		scene: String
	},
	data() {
		return {
			url: ''
		};
	},
	computed: {
		setScene() {
			const userinfo = this.$store.state.userInfo;
			let s = `code=${userinfo.code}`;
			if (!!this.scene.length) {
				return `${s}&${this.scene}`;
			}
			return s;
		}
	},
	mounted() {
		this.getCode();
	},
	methods: {
		async getCode() {
			try {
				const { data } = await this.$api.Config.getCode({ page: this.page, scene: this.setScene, check_path: false, env_version: this.envVersion });
				this.url = data.img;
			} catch (e) {
				console.log(e);
				//TODO handle the exception
			}
		},
		// 保存图片到相册
		savePoster() {
			uni.getSetting({
				//获取用户的当前设置
				success: (res) => {
					// 判断是否有访问相册的权限
					if (res.authSetting['scope.writePhotosAlbum']) {
						//验证用户是否授权可以访问相册
						this.saveImageToPhotosAlbum();
					} else {
						uni.authorize({
							//如果没有授权，向用户发起请求
							scope: 'scope.writePhotosAlbum',
							success: () => {
								this.saveImageToPhotosAlbum();
							},
							fail: () => {
								uni.showToast({
									title: '请打开保存相册权限，再点击保存相册分享',
									icon: 'none',
									duration: 3000
								});
								setTimeout(() => {
									uni.openSetting({
										//调起客户端小程序设置界面,让用户开启访问相册
										success: (res2) => {
											// console.log(res2.authSetting)
										}
									});
								}, 3000);
							}
						});
					}
				}
			});
		},
		// 保存图片到相册
		saveImageToPhotosAlbum() {
			let base64 = this.url.replace(/^data:image\/\w+;base64,/, ''); //去掉data:image/png;base64,
			let extName = this.url.match(/data:\S+\/(\S+);/);
			if (extName) {
				//获取文件后缀
				extName = extName[1];
			}
			let filePath = wx.env.USER_DATA_PATH + '/share_qrcode.' + extName;
			uni.showLoading({
				title: '加载中',
				mask: true
			});
			uni.getFileSystemManager().writeFile({
				filePath: filePath, //创建一个临时文件名
				data: base64, //写入的文本或二进制数据
				encoding: 'base64', //写入当前文件的字符编码
				success: (res) => {
					uni.saveImageToPhotosAlbum({
						filePath: filePath,
						success: function (res2) {
							uni.hideLoading();
							uni.showToast({
								title: '保存成功，请从相册选择再分享',
								icon: 'none',
								duration: 5000
							});
						},
						fail: function (err) {
							uni.hideLoading();
							// console.log(err.errMsg);
						}
					});
				},
				fail: (err) => {
					uni.hideLoading();
					//console.log(err)
				}
			});
		}
	},
	onShareAppMessage() {
		const userInfo = uni.getStorageSync('userInfo');
		wx.showShareMenu({
			withShareTicket: true,
			menus: ['shareAppMessage', 'shareTimeline']
		});
		return {
			title: '中羽盟',
			imageUrl: this.IMGURL + 'fenxiang.jpg',
			//如果有参数的情况可以写path
			path: '/pages/cover/cover?code=' + userInfo.code
		};
	}
};
</script>

<style scoped lang="scss">
.container {
	width: 100%;
	height: 100%;
	background: #ffffff;
	border-radius: 20rpx;
	font-weight: bold;
	overflow: hidden;
	.top {
		width: 100%;
		height: 732rpx;
		background-color: $themeColor;
		color: white;
		.title {
			line-height: 48rpx;
			font-size: 50rpx;
			margin-top: 58rpx;
		}
		.sub {
			line-height: 50rpx;
			font-size: 40rpx;
			margin-top: 17rpx;
			margin-bottom: 84rpx;
			&-image {
				width: 312rpx;
				height: 32rpx;
			}
		}
		.codeimg {
			width: 404rpx;
			height: 404rpx;
			border-radius: 50%;
		}
	}
	.bottom {
		height: 190rpx;
		width: 100%;
		color: #666;
		font-size: 20rpx;
		button {
			padding: 0;
			margin: 0;
			background-color: transparent;
			font-size: 20rpx;
			&::after {
				border: none;
			}
		}
		.icon {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 80rpx;
			height: 80rpx;
			background: #ffffff;
			box-shadow: 0rpx 2rpx 8rpx 0rpx rgba(153, 153, 153, 0.13);
			border-radius: 50%;
			margin-bottom: 17rpx;
			text.icon-weixin {
				font-size: 49rpx;
				color: #24db59;
			}
			text.icon-yunduanxiazai {
				font-size: 49rpx;
				color: #ee763d;
			}
		}
	}
}
</style>

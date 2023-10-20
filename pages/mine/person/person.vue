<template>
	<view style="position: relative">
		<view class="top-bg">
			<cu-custom isBack leftStyle="color: white;">
				<template #content>个人中心</template>
			</cu-custom>
			<!-- 自己主页才有上传背景按钮 -->
			<view class="add-btn" v-if="userinfo.id == user_id">
				<md-upload-image typeName="user" v-model="info.user_back_pic" mode="custom" @upload="uploadBackPic">+</md-upload-image>
			</view>
			<image class="back-head" :src="info.user_back_pic" mode="aspectFill"></image>
		</view>
		<view class="header bg-white">
			<view class="header-card">
				<view class="flex wp-100 pl-46 pr-46 pt-8">
					<!-- 头像 -->
					<md-avatar width="140" class="br-p50 mr-8" :src="info.headpic" :sex="info.sex" @click="previewClick(info.headpic)"></md-avatar>
					<view class="flex1 flex info pt-8 pb-8">
						<view class="wp-100 hp-100 flex flex-col flex-top flex-between">
							<view class="flex flex-between wp-100 text-black">
								<view class="fs-32 mb-4">{{ info.nickname }}</view>
								<!-- 自己的主页才有编辑按钮 -->
								<text v-if="userinfo.id == user_id" class="iconfont icon-bianji fs-32" @click="handleItemJump('/pages/mine/person/detail')"></text>
							</view>
							<view class="flex">
								<text class="fs-22">段位：</text>
								<text class="level fs-18">{{ info.level }}</text>
							</view>
							<view class="flex">
								<text class="fs-22">个人标签：</text>
								<text class="position fs-18 mr-8" v-for="(label, index) in info.label" :key="index">{{ label }}</text>
							</view>
						</view>
					</view>
				</view>
				<view class="remark flex flex-between fs-22">
					<text>羽球箴言: {{ info.desc }}</text>
					<text>IP: {{ info.info.IP }}</text>
				</view>
			</view>
			<view class="data">
				<!-- 我的的羽毛球数据 -->
				<view class="title-tag">
					<image :src="IMGURL + 'img/home/text-bg1.png'"></image>
					<text class="text">我的羽球数据</text>
				</view>
				<view class="data-content card">
					<view class="border-bottom pb-26">
						<view class="flex flex-between">
							<view class="flex flex-col">
								<text class="fs-36 text-black fw-bold">{{ info.point }}</text>
								<text class="fs-24">打球积分</text>
							</view>
							<view class="flex flex-col">
								<text class="fs-36 text-black fw-bold">{{ info.count }}</text>
								<text class="fs-24">本月场次</text>
							</view>
							<view class="flex flex-col">
								<text class="fs-36 text-black fw-bold">{{ info.amount }}</text>
								<text class="fs-24">本月消费</text>
							</view>
						</view>
					</view>
					<view class="flex1 pt-26 flex">
						<view class="flex1 flex-top border-right hp-100 flex flex-col fs-24">
							<view class="mb-18">
								<text class="primary-color">球龄：</text>
								<text>{{ info.info.ball_age }}年</text>
							</view>
							<view class="mb-18" @click="handleWaponry">
								<text class="primary-color">兵器：</text>
								<text>{{ info.info.racket }}</text>
							</view>
							<view>
								<text class="primary-color">联盟代号：</text>
								<text>{{ info.info.code }}</text>
							</view>
						</view>
						<view class="flex1 flex-top hp-100 flex flex-col fs-24 ml-20">
							<view class="mb-18">
								<text class="primary-color">常去球馆：</text>
								<text>{{ info.info.ball_area }}</text>
							</view>
							<view>
								<text class="primary-color">俱乐部：</text>
								<text>{{ info.info.club }}</text>
							</view>
						</view>
					</view>
				</view>
				<view class="fans card flex mt-20">
					<view class="flex1 flex flex-center" @click="handleItemJump('/pages/home/other/badminton-circle/attention-list?title=粉丝列表&uid=' + user_id)">
						<text class="iconfont icon-fensi primary-color"></text>
						<text class="mr-20 fs-22" style="line-height: 30rpx">粉丝：</text>
						<text class="fs-30 text-black">{{ info.info.fans_num }}</text>
					</view>
					<view class="flex1 flex flex-center" @click="handleItemJump('/pages/home/other/badminton-circle/attention-list?uid=' + user_id)">
						<text class="iconfont icon-tianjiaguanzhu primary-color"></text>
						<text class="mr-20 fs-22" style="line-height: 30rpx">关注：</text>
						<text class="fs-30 text-black">{{ info.info.fllow_num }}</text>
					</view>
				</view>
				<!-- 个人荣誉/证书 -->
				<view class="honor card mt-20 pa-20 pt-30 pb-30 flex flex-col">
					<!-- title -->
					<view class="flex flex-between wp-100">
						<view class="text-black flex fw-bold">
							<text>个人荣誉/证书</text>
							<text class="iconfont icon-diyi fw-bold ml-8"></text>
						</view>
						<!-- 自己的主页才有编辑按钮 -->
						<view class="flex" v-if="userinfo.id == user_id" @click="handleItemJump('/pages/mine/person/honor?user_id=' + user_id)">
							编辑
							<text class="icon-right ml-8"></text>
						</view>
					</view>
					<!-- content -->
					<view class="wp-100 hp-100 flex flex-col flex-between">
						<view class="honor-item flex wp-100 flex-between pl-28 pb-14 pt-14" v-for="(item, index) in info.honor" :key="index">
							<view class="pt-20 pb-20 flex flex-top mr-8 flex-1">
								<view class="honor-icon mt-12">
									<image class="wp-100 hp-100" :src="IMGURL + 'img/jiangzhang.png'" mode="aspectFill"></image>
								</view>
								<view class="flex1 msg ml-8">{{ item.title }}</view>
							</view>
							<view class="honor-image">
								<image @click="showImage(item.img)" class="wp-100 hp-100" :src="item.img" mode="widthFix"></image>
							</view>
						</view>
					</view>
				</view>
				<!-- 羽动人生 · 爱分享 -->
				<view class="share card mt-20 pa-20 pt-30 pb-30">
					<!-- title -->
					<!-- 跳转羽动人生 -->
					<view class="flex flex-between wp-100" @click="handleItemJump('/pages/mine/person/yudong-life?user_id=' + user_id)">
						<view class="text-black flex fw-bold">
							<text>羽动人生 · 爱分享</text>
							<text class="icon-image fw-bold ml-8"></text>
						</view>
						<text class="icon-right ml-8"></text>
					</view>
					<!-- content -->
					<view class="content pl-50 pt-40" v-for="(item, index) in info.notice.data" :key="item.id">
						<!-- 跳转帖子详情 -->
						<view class="item-top flex flex-between br-10" @click="handleItemJump('/pages/mine/person/person?user_id=' + item.uid)">
							<view class="flex1 flex">
								<!-- 头像 -->
								<md-avatar width="55" class="mr-8" :src="item.headpic"></md-avatar>
								<view class="flex1 flex flex-col flex-top">
									<view class="flex flex-between wp-100">
										<text class="fs-20 mb-4">{{ item.nickname }}</text>
										<!-- 更多按钮 -->
										<MorePop :info="item" :showList="userinfo.id == item.uid ? ['删除', '转换为粉丝可见', '转换为自己可见'] : ['收藏', '投诉']" />
									</view>
									<view class="flex flex-between fs-14 wp-100">
										<view class="flex">
											<text class="level mr-8">{{ item.level }}</text>
											<text class="position mr-8" v-for="(label, i) in item.label" :key="i">{{ label }}</text>
										</view>
										<view class="ip">IP: {{ item.ip_name }}</view>
									</view>
								</view>
							</view>
						</view>
						<view @click="handleItemJump('/pages/mine/person/share-details?id=' + item.id)">
							<view class="fs-23 text-black text-cut mt-12 mb-18">{{ item.title }}</view>
							<!-- 图片 -->
							<view class="flex flex-between" v-if="item.image.length >= 1">
								<view class="flex1 br-10 h-52 mr-10">
									<image class="wp-100 hp-100" :src="item.image[0]" mode="aspectFill"></image>
								</view>
								<view class="flex flex-col" v-if="item.image.length > 1">
									<view class="br-10 mb-10 w-25 h-25" v-for="(img, index) in item.image" :key="index" v-if="index > 0 && index < 3">
										<image class="wp-100 hp-100" :src="img" mode="aspectFill"></image>
									</view>
								</view>
							</view>
							<view class="flex flex-between mt-10 fs-24">
								<view class="flex">
									<view class="flex mr-10">
										<text class="icon-heart mr-8"></text>
										{{ item.like_num }}
									</view>
									<view class="flex mr-10">
										<text class="iconfont icon-message mr-8 fs-34"></text>
										{{ item.comment_num || 0 }}
									</view>
									<view class="flex mr-10">
										<text class="iconfont icon-fenxiang mr-8 fs-30"></text>
										{{ item.send_num }}
									</view>
								</view>
								<view>{{ item.addtime }}</view>
							</view>
						</view>
					</view>
					<!-- 别人的主页才有 关注 和 打招呼 按钮 -->
					<view class="ml-50 flex mt-40" v-if="userinfo.id != user_id">
						<button class="primary-btn w-50 flex flex-center btn-shadow" @click.stop="handleFollow">
							<text class="icon-heart mr-8"></text>
							关注
						</button>
						<view class="w-20"></view>
						<button class="primary-btn w-50 btn-shadow" @click.stop="handleSayHi">打招呼</button>
					</view>
				</view>
			</view>
		</view>
		<!-- 弹窗 -->
		<md-modal :show.sync="show" hideButton>
			<view class="dialog-items flex flex-col flex-between hp-100 pl-53 pr-78 pb-40">
				<view class="wp-100 item flex flex-between">
					<text>兵器</text>
					<view class="valuebox">{{ info.info.racket }}</view>
				</view>
				<view class="wp-100 item flex flex-between">
					<text>球线</text>
					<view class="valuebox">{{ info.info.ball_line }}</view>
				</view>
				<view class="wp-100 item flex flex-between">
					<text>磅数</text>
					<view class="valuebox">
						{{ info.info.pounds }}
						<text class="fs-20" style="float: right; color: #818181">磅</text>
					</view>
				</view>
			</view>
		</md-modal>
		<!-- say hi modal -->
		<md-modal :show.sync="showHi" :hasCancel="false" confirmText="发送" title="打招呼吧~" @confirm="handleModalHi">
			<view class="wp-100 text-center">
				<input type="text" v-model="sayHi" />
			</view>
		</md-modal>
	</view>
</template>

<script>
import MorePop from '@/pages/components/MorePop.vue';
export default {
	components: { MorePop },
	data() {
		return {
			show: false,
			user_id: null,
			info: {
				notice: {
					data: []
				}
			},
			showHi: false,
			sayHi: '你好，有时间方便一起打球吗？'
		};
	},
	computed: {
		userinfo() {
			return this.$store.state.userInfo;
		}
	},
	methods: {
		handleWaponry() {
			this.show = true;
		},
		handleCancel() {
			this.show = false;
		},
		// 跳转页面
		handleItemJump(url) {
			uni.navigateTo({
				url
			});
		},
		// 打招呼
		handleSayHi() {
			this.showHi = true;
		},
		// 预览头像
		previewClick(url) {
			if (!url) return;
			uni.previewImage({
				urls: [url]
			});
		},
		/**
		 * 接口相关
		 */
		// 上传顶部背景图片
		async uploadBackPic(val) {
			try {
				await this.$api.User.setting({ user_back_pic: val });
				uni.showModal({
					content: '保存成功',
					showCancel: false,
					success: function (res) {
						if (res.confirm) {
							this.getHomeInfo(this.user_id);
						}
					}.bind(this)
				});
			} catch (e) {
				console.log(e);
				//TODO handle the exception
			}
		},
		async getHomeInfo(user_id) {
			try {
				const res = await this.$api.User.home({ user_id });
				this.info = res.data;
			} catch (e) {
				//TODO handle the exception
			}
		},
		// 关注
		async handleFollow() {
			try {
				await this.$api.UserFans.add({ user_id: this.user_id });
				// this.getFansList();
				uni.showModal({
					content: '关注成功',
					showCancel: false
				});
			} catch (e) {
				//TODO handle the exception
			}
		},
		// 打招呼发送
		async handleModalHi() {
			try {
				await this.$api.UserCircle.sendMsg({ uid: this.user_id, content: this.sayHi });
				uni.showModal({
					content: '发送成功',
					showCancel: false,
					success: (res) => {
						if (res.confirm) {
							this.showHi = false;
						}
					}
				});
			} catch (e) {
				//TODO handle the exception
			}
		},
		showImage(img) {
			uni.previewImage({
				urls: [img]
			});
		}
	},
	onLoad(options) {
		const { user_id } = options;
		this.user_id = user_id;
		user_id && this.getHomeInfo(user_id);

		uni.$on('refresh', () => {
			this.getHomeInfo(user_id);
		});
	},
	onUnload() {
		uni.$off('refresh');
	},
	onPullDownRefresh() {
		this.getHomeInfo(this.user_id);
		setTimeout(() => {
			uni.stopPullDownRefresh();
		}, 1000);
	}
};
</script>

<style scoped lang="scss">
@import '../../home/index.scss';
.top-bg {
	padding-top: 66%;
	width: 750rpx;
	height: 495rpx;
	background: #409dc7;
	position: relative;
	.add-btn {
		position: absolute;
		right: 37rpx;
		top: calc(205rpx + env(safe-area-inset-top));
		width: 35rpx;
		height: 35rpx;
		line-height: 33rpx;
		text-align: center;
		background: #f6f6f6;
		opacity: 0.57;
		border-radius: 50%;
		color: #808080;
		font-size: 34rpx;
		z-index: 1;
	}
	.back-head {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
	}
}

.header {
	margin-top: -150rpx;
	border-radius: 40rpx 40rpx 0rpx 0rpx;
	height: 100%;
	position: relative;
	z-index: 1;
}
.header-card {
	/deep/ .md-avatar {
		view.sex-box {
			width: 26rpx;
			height: 26rpx;
			font-size: 17rpx;
			right: 17rpx;
		}
	}
	.info {
		height: 140rpx;
	}
	.remark {
		padding: 24rpx 66rpx 40rpx;
	}
}
.data {
	padding: 0 30rpx;
	.title-tag {
		width: 240rpx;
		height: 60rpx;
		line-height: 60rpx;
		position: relative;
		image {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
		}
		.text {
			position: relative;
			font-size: 26rpx;
			color: #222222;
			font-weight: bold;
			margin-left: 20rpx;
		}
	}
	.data-content {
		width: 100%;
		height: 312rpx;
		padding: 30rpx 50rpx;
		display: flex;
		flex-direction: column;
	}
	.fans {
		width: 100%;
		height: 70rpx;
	}
}
.honor {
	width: 100%;
	max-height: 370rpx;
	.title {
		width: 184rpx;
		height: 23rpx;
		font-size: 30rpx;
		font-family: YouSheBiaoTiHei;
		font-weight: 400;
	}
	&-item {
		&:not(:last-of-type) {
			border-bottom: 1rpx solid $border-color;
		}
	}
	&-icon {
		height: 43rpx;
		width: 33rpx;
	}
	.msg {
		line-height: 42rpx;
	}
	&-image {
		width: 190rpx;
		height: 110rpx;
		border-radius: 20rpx;
		overflow: hidden;
	}
}

.share {
	.content {
		.icon-more {
			position: relative;
			.tooltip {
				position: absolute;
				left: -30rpx;
				width: 54rpx;
				height: 94rpx;
				background: #ffffff;
				box-shadow: 1rpx 1rpx 9rpx 0rpx rgba(102, 102, 102, 0.27);
				border-radius: 10rpx;
				.btn {
					line-height: 47rpx;
				}
			}
		}
	}
}

.dialog-items {
	font-size: 30rpx;
	.valuebox {
		width: 220rpx;
		height: 50rpx;
		line-height: 50rpx;
		background: #eeeeee;
		border-radius: 10rpx;
		text-align: center;
		color: #ff5500;
		padding: 0 10rpx;
	}
}
</style>

<template>
	<view class="page-home">
		<CustomPage title="羽乐圈" bgHeight="420rpx">
			<view class="page-container" slot="content">
				<!-- 每个人心中都有一个江湖 -->
				<view class="title-tip">
					<image :src="IMGURL + 'home/jianghu.png'" mode="widthFix"></image>
				</view>
				<view class="banner-container">
					<HomeBanner height="260rpx" isInner />
				</view>
				<view class="location-container flex-space-between">
					<view class="city flex-start" @click="handleItemJump('/pages/home/other/check-city')">
						<image class="icon" :src="IMGURL + 'img/icon/location2.png'" style="width: 16rpx; height: 20rpx"></image>
						{{ address.cityName ? address.cityName : '未定位' }}
					</view>
					<view class="flex-start" @click="handleItemJump('/pages/home/other/badminton-circle/nearby?area_name=' + address.cityName)">
						<image class="icon" :src="IMGURL + 'img/icon/location2.png'" style="width: 24rpx; height: 24rpx"></image>
						附近球友
					</view>
				</view>
				<view class="content flex flex-top">
					<!-- 左侧 -->
					<view class="left w-48 mr-10 flex flex-column">
						<view class="youxiabang flex1 wp-100">
							<view class="title flex br-10 bg-white pa-20 mb-10" @click="handleItemJump('/pages/home/other/badminton-circle/youxia')">
								<view class="icon-imgage wh-28">
									<text class="iconfont icon-diyi fw-bold primary-color"></text>
								</view>
								<view class="ml-10 mr-8 fs-26">游侠榜</view>
								<text class="icon-down"></text>
							</view>
							<!-- list -->
							<view class="list">
								<view class="list-item flex br-10 bg-white pa-20 mb-10" v-for="item in lists" :key="item.id">
									<!-- 头像 -->
									<md-avatar width="55" class="mr-8" :src="item.headpic" :sex="item.sex" @click="handleItemJump('/pages/mine/person/person?user_id=' + item.uid)"></md-avatar>
									<view class="flex flex-col flex-top flex-between">
										<text class="fs-20 mb-4">{{ item.nickname }}</text>
										<view class="flex">
											<text class="level mr-8">{{ item.level }}</text>
											<!-- <text class="position mr-8" v-for="(label, index) in item.label" :key="index">{{ label }}</text> -->
											<text class="position mr-8" v-show="item.label.length > 0">{{ item.label[0] }}</text>
										</view>
									</view>
								</view>
							</view>
						</view>
						<view class="action wp-100 bg-white br-10 pa-20">
							<view class="item flex mb-10" @click="handleItemJump('/pages/home/other/badminton-circle/attention-list')">
								<view class="iconfont icon-wodeguanzhu mr-8"></view>
								我的关注
							</view>
							<view class="item flex mb-10" @click="handleItemJump('/pages/home/other/badminton-circle/attention-list?title=我的粉丝')">
								<view class="iconfont icon-fensi mr-8"></view>
								我的粉丝
								<view class="tip-icon ml-8" v-if="countInfo.userfans_count > 0">+{{ countInfo.userfans_count }}</view>
							</view>
							<view class="item flex mb-10" @click="handleItemJump('/pages/home/other/badminton-circle/my-collect')">
								<view class="icon-collect mr-8 fw-bold"></view>
								我的收藏
							</view>
							<!-- <view class="item flex mb-10">
                <view class="iconfont icon-dianzan mr-8"></view>
                我的赞
              </view> -->
							<view class="item flex mb-10" @click="handleItemJump('/pages/home/other/badminton-circle/message')">
								<view class="iconfont icon-xiaoxi mr-8"></view>
								消息
								<view class="tip-icon ml-8" v-if="countInfo.message_count > 0">+{{ countInfo.message_count }}</view>
							</view>
						</view>
					</view>
					<!-- 右侧 -->
					<view class="flex2">
						<!-- 只言片羽 -->
						<view class="br-10 pa-20 bg-white" @click="handleItemJump('/pages/mine/person/share-send?type=circle')">
							<view class="textarea-box">只言片羽.....</view>
							<view class="flex flex-between mt-20">
								<text class="icon-image fs-30"></text>
								<view class="send-btn">发布</view>
							</view>
						</view>
						<!-- 羽乐圈列表 -->
						<view class="list-wrapper">
							<mescroll-uni :fixed="false" ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback">
								<view class="list mt-20 pa-20 bg-white" v-for="(item, index) in list" :key="item.id">
									<!-- 跳转用户详情 -->
									<view class="item-top flex flex-between br-10">
										<view class="flex1 flex">
											<!-- 头像 -->
											<md-avatar width="55" class="mr-8" :sex="item.sex" :src="item.headpic" @click="handleItemJump('/pages/mine/person/person?user_id=' + item.uid)"></md-avatar>
											<view class="flex1 flex flex-col flex-top">
												<view class="flex flex-between wp-100">
													<text class="fs-20 mb-4">{{ item.nickname }}</text>
													<!-- 更多按钮 -->
													<MorePop :info="item" :showList="userinfo.id == item.uid ? ['删除'] : ['收藏', '投诉']" />
												</view>
												<view class="flex flex-between fs-14 wp-100">
													<view class="flex">
														<text class="level mr-8">{{ item.level }}</text>
														<text class="position mr-8" v-for="(label, index) in item.label" :key="index">{{ label }}</text>
													</view>
													<view class="ip">IP: {{ item.ip_name }}</view>
												</view>
											</view>
										</view>
									</view>
									<!-- 跳转帖子详情 -->
									<view @click="handleItemJump('/pages/mine/person/share-details?id=' + item.id)">
										<view class="title mb-10 mt-10 fs-20 text-cut text-black">{{ item.title }}</view>
										<!-- 图片 -->
										<view class="flex flex-between" v-if="item.image.length >= 1">
											<view class="flex1 h-35 mr-10">
												<image class="wp-100 hp-100 br-10" :src="item.image[0]" mode="aspectFill"></image>
											</view>
											<view class="h-35 flex flex-col flex-start" v-if="item.image.length > 1">
												<view class="circle-image w-16 h-16" v-for="(img, i) in item.image" :key="i" v-if="i > 0 && i < 3">
													<image class="wp-100 hp-100 br-10" :src="img" mode="aspectFill"></image>
												</view>
											</view>
										</view>
										<view class="flex flex-between mt-10 fs-16">
											<view class="flex">
												<view class="flex mr-10">
													<text class="icon-heart mr-8 fs-16"></text>
													{{ item.like_num || 0 }}
												</view>
												<view class="flex mr-10">
													<text class="iconfont icon-message mr-8 fs-19"></text>
													{{ item.comment_num || 0 }}
												</view>
												<view class="flex mr-10">
													<text class="iconfont icon-fenxiang mr-8 fs-19"></text>
													{{ item.send_num || 0 }}
												</view>
											</view>
											<view>{{ item.addtime }}</view>
										</view>
									</view>
								</view>
							</mescroll-uni>
						</view>
					</view>
				</view>
			</view>
		</CustomPage>
	</view>
</template>

<script>
import HomeBanner from '@/components/home-banner.vue';
import MorePop from '@/pages/components/MorePop.vue';
import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
export default {
	mixins: [MescrollMixin],
	components: {
		HomeBanner,
		MorePop
	},
	data() {
		return {
			lists: [], // 游侠榜列表
			activeNames: ['1'],
			list: [], // 羽乐圈列表
			countInfo: {}
		};
	},
	computed: {
		address() {
			return this.$store.state.address;
		},
		userinfo() {
			return this.$store.state.userInfo;
		}
	},
	onLoad(e) {
		this.getLists();
		uni.$on('refresh', () => {
			this.mescroll.resetUpScroll();
		});
	},
	onUnload() {
		uni.$off('refresh');
	},
	onShow() {
		this.newCount();
	},
	methods: {
		// 跳转页面
		handleItemJump(url) {
			uni.navigateTo({
				url
			});
		},
		// 羽乐圈帖子列表
		async upCallback(page) {
			let pageNum = page.num; // 页码, 默认从1开始
			let limit = page.size; // 页长, 默认每页10条
			try {
				let params = {
					pageNum,
					limit
				};
				const { data } = await this.$api.UserCircle.index(params);
				if (!data) return this.mescroll.endErr();
				let curPageData = data.data || [];
				let curPageLen = curPageData.length;
				let totalSize = data.total;
				if (page.num == 1) this.list = [];
				this.list = this.list.concat(curPageData);
				this.mescroll.endBySize(curPageLen, totalSize);
			} catch (err) {
				console.log(err);
			}
		},
		/**
		 * 接口相关
		 */
		// 游侠列表
		async getLists() {
			try {
				const res = await this.$api.UserCircle.lists({ area_name: this.address.cityName || undefined, limit: 10, pageNum: 1 });
				this.lists = res.data.data;
			} catch (e) {
				console.log(e);
				//TODO handle the exception
			}
		},
		// 新增粉丝数和消息数
		async newCount() {
			try {
				const res = await this.$api.UserCircle.newCount();
				this.countInfo = res.data;
			} catch (e) {
				//TODO handle the exception
			}
		}
	}
};
</script>

<style>
page {
	overflow: hidden;
}
</style>

<style lang="scss" scoped>
@import '../index.scss';

.page-home {
	.page-container {
		position: relative;
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 70rpx 30rpx 0;
		overflow: hidden;

		.title-tip {
			width: 285rpx;
			height: 33rpx;
			position: absolute;
			top: -4rpx;
			margin: auto;
			left: 0;
			right: 0;
		}

		.banner-container {
			margin-bottom: 36rpx;
		}

		.location-container {
			margin-bottom: 10rpx;
			font-size: 20rpx;
			color: #333;

			.icon {
				margin-right: 5rpx;
			}
		}

		.content {
			position: relative;
			flex: 1;
			padding: 20rpx 0;
			.left {
				padding-bottom: constant(safe-area-inset-bottom);
				padding-bottom: env(safe-area-inset-bottom);
			}
		}
	}
}

.tip-icon {
	height: 20rpx;
	line-height: 20rpx;
	padding: 0 8rpx;
	background: #ff7234;
	border-radius: 8rpx;
	font-size: 14rpx;
	color: white;
	text-align: center;
}

.list-wrapper {
	height: calc(100vh - 725rpx - env(safe-area-inset-top) - env(safe-area-inset-bottom));
	overflow-y: scroll;
}

.circle-image {
	&:not(:last-of-type) {
		margin-bottom: 10rpx;
	}
}

.textarea-box {
	width: 100%;
	height: 104rpx;
	background: #f0f0f0;
	border-radius: 10rpx;
	color: #999;
	padding: 10rpx;
	font-size: 20rpx;
}

.send-btn {
	width: 70rpx;
	height: 30rpx;
	line-height: 30rpx;
	text-align: center;
	background: #ff7234;
	border-radius: 13rpx;
	font-size: 20rpx;
	color: white;
}

.youxiabang {
	display: flex;
	flex-direction: column;
	.list {
		max-height: 460rpx;
		overflow-y: scroll;
	}
}
</style>

<template>
	<view class="page-home">
		<view class="content">
			<view class="c-title"><text class="relative">球馆信息</text></view>
			<mescroll-uni :fixed="false" ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback">
				<view class="list">
					<view class="item flex-start" v-for="item in listData" :key="item.id" @click="jumpDetail(item.id)">
						<image :src="item.room_headpic" mode="aspectFill" class="img"></image>
						<view class="flex1 right">
							<view class="title flex-space-between">
								<view class="flex-start">
									<text>{{ item.name }}</text>
								</view>
								<text class="icon-right"></text>
							</view>
							<view class="address text-ellipsis">
								<text class="icon-location"></text>
								{{ item.address }}
							</view>
							<view class="flex-space-between" style="align-items: flex-end">
								<view class="tags">
									<text class="tag" v-for="(o, idx) in item.room_device" :key="idx">{{ o }}</text>
								</view>
								<button class="rbtn right-btn" @click.stop="predetermine(item.id)">预定</button>
							</view>
						</view>
					</view>
				</view>
			</mescroll-uni>
		</view>
	</view>
</template>

<script>
import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
export default {
	mixins: [MescrollMixin],
	data() {
		return {
			listData: []
		};
	},
	methods: {
		// 预定
		predetermine(id) {
			uni.navigateTo({ url: '/pages/arena/predetermine?id=' + id });
		},
		// 详情
		jumpDetail(id) {
			uni.navigateTo({ url: '/pages/arena/detail?id=' + id });
		},
		/**
		 * 接口相关
		 */
		async upCallback(page) {
			let pageNum = page.num; // 页码, 默认从1开始
			let limit = page.size; // 页长, 默认每页10条
			try {
				let { data } = await this.$api.My.ballRoom({
					pageNum,
					limit
				});
				if (!data) return this.mescroll.endErr();
				let curPageData = data.data || [];
				let curPageLen = curPageData.length;
				let totalSize = data.total;
				if (page.num == 1) this.listData = [];
				this.listData = this.listData.concat(curPageData);
				this.mescroll.endBySize(curPageLen, totalSize);
			} catch (err) {
				console.log(err);
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.page-home {
	padding-top: 20rpx;
	.content {
		position: relative;
		height: calc(100vh - 20rpx);
		padding: 10rpx 32rpx;
		overflow-y: auto;
		background: #fff;
		border-radius: 20rpx 20rpx 0 0;
		.c-title {
			position: relative;
			margin-left: 20rpx;
			font-size: 30rpx;
			color: #333;
			font-weight: bold;
			line-height: 70rpx;
			&:before {
				content: '';
				position: absolute;
				left: 0;
				bottom: 16rpx;
				width: 55rpx;
				height: 12rpx;
				background: #ff945b;
				border-radius: 6rpx;
			}
		}
		.list {
			.item {
				padding: 24rpx 20rpx 20rpx 22rpx;
				height: 190rpx;
				border: 2rpx solid rgba(254, 106, 28, 0.29);
				border-radius: 20rpx;
				margin-bottom: 18rpx;
				box-shadow: 0rpx 4rpx 4rpx 0rpx rgba(254, 106, 28, 0.22);
				background: #ffffff;

				.img {
					width: 140rpx;
					height: 140rpx;
					border-radius: 14rpx;
					margin-right: 24rpx;
				}

				.right {
					font-size: 22rpx;
					color: #666;

					.title {
						line-height: 1;
						color: #333;
						font-weight: bold;
						font-size: 34rpx;
						margin-bottom: 18rpx;
					}

					.icon-right {
						font-size: 28rpx;
					}

					.address {
						margin-bottom: 2rpx;
					}

					.tags {
						.tag {
							display: inline-block;
							line-height: 36rpx;
							border-radius: 14rpx;
							background: #ededed;
							padding: 0 19rpx;
							margin-right: 16rpx;

							&:nth-last-child(1) {
								margin-right: 0;
							}
						}
					}

					.right-btn {
						width: 114rpx;
						height: 54rpx;
						background: #fe6a1c;
						border-radius: 28rpx;
						font-size: 30rpx;
						color: #fff;
					}
				}
			}
		}
	}
}
</style>

<template>
	<view class="page-message">
		<view class="container">
			<image class="bg" :src="IMGURL + 'img/home/bg-banner.png'" mode="widthFix"></image>
			<view class="title">系统通知</view>
			<view class="list">
				<mescroll-uni :fixed="false" ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback">
					<view class="item" v-for="(item, index) in list" :key="item.id" @click="handleRead(item.id)">
						<text :class="{ msg: 'msg', read: item.state == 2 }">{{ item.content }}</text>
						<view class="time w-35 text-right">{{ item.addtime }}</view>
					</view>
				</mescroll-uni>
			</view>
		</view>
	</view>
</template>

<script>
import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
export default {
	mixins: [MescrollMixin],
	data() {
		return {
			list: []
		};
	},
	methods: {
		async upCallback(page) {
			let pageNum = page.num; // 页码, 默认从1开始
			let limit = page.size; // 页长, 默认每页10条
			try {
				let params = {
					pageNum,
					limit,
				};
				const { data } = await this.$api.Msg.index(params);
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
		async handleRead(id) {
			try {
				await this.$api.Msg.read({ id });
				this.mescroll.resetUpScroll();
			} catch (e) {
				//TODO handle the exception
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.page-message {
	position: relative;
	padding-top: 20rpx;
	height: 100vh;
	.container {
		position: relative;
		display: flex;
		flex-direction: column;
		width: 100%;
		padding: 22rpx 32rpx 0;
		height: calc(100vh - 20rpx);
		background: #fff;
		color: #333;
		font-size: 24rpx;
		.bg {
			position: absolute;
			left: 0;
			top: 52rpx;
			width: 687rpx;
			height: 995rpx;
		}
		.title {
			position: relative;
			height: 62rpx;
			line-height: 62rpx;
			font-size: 30rpx;
			font-weight: bold;
		}
		.list {
			position: relative;
			flex: 1;
			width: 100%;
			overflow-y: auto;
			line-height: 36rpx;
			.item {
				position: relative;
				display: flex;
				padding: 10rpx 0 10rpx 18rpx;
				justify-content: space-between;
				border-bottom: 2rpx solid #dedede;
				&:nth-last-child(1) {
					border-bottom: 0;
				}
				.msg {
					display: block;
					&.read {
						&:before {
							content: '';
							position: absolute;
							left: 0;
							top: 24rpx;
							width: 8rpx;
							height: 8rpx;
							background: #ff7234;
							border-radius: 50%;
						}
					}
				}
				.time {
					margin-left: 2em;
					font-size: 20rpx;
					color: #999;
				}
			}
		}
	}
}
</style>

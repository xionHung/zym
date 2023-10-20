<template>
	<PageComp title="消息" navStyle="color: #fff; background: rgb(254, 106, 28)" :hasImage="false">
		<view slot="header" class="head-bg" />
		<view class="list">
			<mescroll-uni :fixed="false" ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback">
				<view class="item flex-space-between" v-for="(item, index) in list" :key="item.id" @click="handleDetail(item)">
					<md-avatar :src="item.headpic" :sex="item.sex" />
					<view class="center">
						<view class="flex-space-between">
							<view class="title">{{ item.nickname }}</view>
							<text class="time">{{ item.updatetime }}</text>
						</view>
						<view class="flex-space-between">
							<view class="text-gray">{{ item.content }}</view>
							<text class="count" v-show="item.reply_num > 0">{{ item.reply_num }}</text>
						</view>
					</view>
				</view>
			</mescroll-uni>
		</view>
	</PageComp>
</template>

<script>
import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
export default {
	mixins: [MescrollMixin],
	data() {
		return {
			list: [],
		};
	},
	methods: {
		handleDetail(item) {
			uni.navigateTo({
				url: '/pages/home/other/badminton-circle/message-detail?info=' + JSON.stringify(item)
			});
		},
		async upCallback(page) {
			let pageNum = page.num; // 页码, 默认从1开始
			let limit = page.size; // 页长, 默认每页10条
			try {
				let params = {
					pageNum,
					limit
				};
				const { data } = await this.$api.UserCircle.message(params);
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
		}
	},
};
</script>

<style lang="scss" scoped>
.head-bg {
	width: 100%;
	height: 174rpx;
	background: rgb(254, 106, 28);
	border-radius: 0 0 380rpx 380rpx / 0 0 40rpx 40rpx;
}
.list {
	margin: 34rpx 60rpx;
	.item {
		height: 104rpx;
		border-bottom: 1rpx solid #f3f3f3;
		color: #333;
		font-size: 24rpx;
		font-weight: bold;
		&:first-child {
			border-top: 1rpx solid #f3f3f3;
		}
		.center {
			flex: 1;
			margin: 0 20rpx;
			color: #fe6a1c;
			font-size: 20rpx;
			.title {
				color: #333;
				font-size: 26rpx;
				line-height: 1;
				margin-bottom: 10rpx;
			}
		}
		.count {
			width: 24rpx;
			height: 24rpx;
			line-height: 24rpx;
			background: #ff7234;
			border-radius: 50%;
			color: white;
			font-size: 20rpx;
			text-align: center;
		}
		.time {
			color: #999;
			font-size: 18rpx;
			line-height: 1;
			margin-bottom: 12rpx;
		}
	}
}
</style>

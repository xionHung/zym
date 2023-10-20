<template>
	<PageComp title="自助中心" navStyle="color: #fff; background: rgb(254, 106, 28)" :hasImage="false">
		<view slot="header" class="head-bg">
			<md-search placeholder="问题未找到,搜索一下" class="search" @search="getList"></md-search>
		</view>
		<view class="content">
			<md-title title="常见问题"></md-title>
			<view class="list mt-40 border-top">
				<md-cell v-for="item in list" :key="item.id" @click="handleItem(item.id)">
					<template #label>
						<view class="primary-color text-cut">{{ item.title }}</view>
					</template>
				</md-cell>
			</view>
		</view>
		<!-- 意见反馈/客服 -->
		<view slot="footer" class="btn-wrapper flex">
			<view class="flex flex1 text-white flex-center" @click="handleBtn">
				<text class="iconfont icon-yijian fs-28"></text>
				<text style="line-height: 28rpx">意见反馈</text>
			</view>
			<button class="flex flex1 text-white flex-center kf-btn" open-type="contact">
				<text class="iconfont icon-kefu fs-28 mr-8"></text>
				<text style="line-height: 28rpx">客服</text>
			</button>
		</view>
		<!-- say hi modal -->
		<md-modal :show.sync="show" :hasCancel="false" confirmText="提交" title="意见反馈" @confirm="handleModal">
			<view class="wp-100 text-center">
				<input type="text" v-model="content" placeholder="请输入意见" />
			</view>
		</md-modal>
	</PageComp>
</template>

<script>
import _ from 'loadsh';
export default {
	data() {
		return {
			list: [],
			total: 0,
			show: false,
			content: ''
		};
	},
	methods: {
		handleItem(id) {
			uni.navigateTo({
				url: '/pages/mine/selfHelp/detail?id=' + id
			});
		},
		// 意见反馈
		handleBtn() {
			this.show = true;
		},
		handleModal() {
			this.feedback();
		},
		/**
		 * 接口相关
		 */
		getList: _.debounce(async function (title) {
			let _title = title || '';
			try {
				const { data } = await this.$api.Setting.helpCenter({ title: _title });
				this.list = data.data;
				this.total = data.total;
			} catch (e) {
				//TODO handle the exception
			}
		}, 500),
		// 意见反馈
		async feedback() {
			try {
				const { message } = await this.$api.Setting.feedback({ content: this.content });
				this.show = false;
				this.$toast(message);
			} catch (e) {
				//TODO handle the exception
			}
		}
	},
	onLoad(options) {
		this.getList();
	}
};
</script>

<style lang="scss" scoped>
.head-bg {
	width: 100%;
	height: 174rpx;
	background: rgb(254, 106, 28);
	border-radius: 0 0 380rpx 380rpx / 0 0 40rpx 40rpx;
}
.search {
	width: 610rpx;
	margin: 0 auto;
	/deep/ .md-search {
		background: #fe8849;
		color: #fdeadf;
		.icon-search {
			color: #fdeadf;
		}
	}
}
.content {
	padding: 35rpx 29rpx;
	.list {
		/deep/ .md-cell-label {
			width: 600rpx;
		}
	}
}

.btn-wrapper {
	width: 540rpx;
	height: 70rpx;
	background: #fe6a1c;
	box-shadow: 9rpx 9rpx 35rpx 0rpx rgba(254, 106, 28, 0.4);
	border-radius: 35rpx;
	margin: 20rpx auto 0;
	.kf-btn {
		display: block;
		padding: 0;
		margin: 0;
		border-radius: 0;
		background-color: transparent;
		font-size: 26rpx;
		&::after {
			border: none;
		}
	}
}
</style>

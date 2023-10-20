<template>
	<PageComp title="管理接龙" :isApplique="false" navStyle="background: #fff" >
		<mescroll-uni :fixed="false" ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback">
			<view class="container">
				<view class="title-box">
					<md-title title="活动基本信息"></md-title>
				</view>
				<view class="item" v-for="item in listData" :key="item.id" @click="edit(item.id, item.starttime)">
					<view class="flex-space-between title-content">
						<view>{{ item.activity_name }}</view>
						<text class="icon icon-right"></text>
					</view>
					<view class="item-main">
						<ActivityBox :item="item" />
					</view>
				</view>
			</view>
		</mescroll-uni>
	</PageComp>
</template>

<script>
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	import ActivityBox from '@/components/UIComp/Club/chainsItem.vue';
	export default {
		mixins: [MescrollMixin],
		components: {
			ActivityBox,
		},
		data() {
			return {
				listData: [],
				id: null,
			}
		},
		onLoad(options) {
			this.id = options.id;
		},
		methods: {
			async upCallback(page) {
			  let pageNum = page.num; // 页码, 默认从1开始
			  let limit = page.size; // 页长, 默认每页10条
			  try {
			    let { data } = await this.$api.Chains.getList({
			      pageNum,
			      limit,
			      club_id: this.id,
            is_manage: 1,
			    });
			    if (!data) return this.mescroll.endErr();
			    let curPageData = data.data || [];
			    let curPageLen = curPageData.length;
			    let totalSize = data.total;
			    if (page.num == 1) this.listData = [];
			    this.listData = this.listData.concat(curPageData);
			    this.mescroll.endBySize(curPageLen, totalSize);
			  } catch (err) {
			    console.log(err)
			  }
			},
			edit(id, time) {
				uni.navigateTo({
					url: '/pages/chains/chainsDetail?id=' + id + '&time=' + time + '&isManage=1',
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		margin: 0 30rpx 20rpx;
		background-color: #fff;
		border-radius: 20rpx;
		&::after {
			display: table;
			content: '';
		}
		.title-box {
			padding: 30rpx 20rpx;
			margin-top: 20rpx;
		}
		.item {
			border: 2rpx solid rgba(254,106,28,0.29);
			box-shadow: 0px 4rpx 4rpx 0px rgba(254,106,28,0.22);
			border-radius: 20rpx;
			margin-bottom: 20rpx;
			.title-content {
				height: 52rpx;
				padding: 0 20rpx;
				border-bottom: 1rpx solid #e7e7e7;
				color: #666;
				font-weight: bold;
				font-size: 26rpx;
			}
			&-main {
				padding: 20rpx;
			}
		}
	}
	::v-deep {
		.cont {
			padding-bottom: 0 !important;
			margin-bottom: 0 !important;
      border: 0 !important;
		}
	}
</style>
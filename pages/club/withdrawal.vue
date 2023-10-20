<template>
	<PageComp title=" " isArc navStyle="color: #fff; background: #fe6a1c;" bgHeight="280rpx" >
		<view slot="header" class="top-box">
			<view>{{ '待提现金额(元)' }}</view>
			<view class="remark">{{ total }}</view>
		</view>
		<view class="container">
			<mescroll-uni :fixed="false" ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback">
			<view class="flex-center title-box">{{'提现到账记录'}}</view>
				<view class="flex item" v-for="item in listData" :key="item.id">
					<view class="left flex-center">
						<text class="iconfont icon-shouru" />
					</view>
					<view class="center">{{ item.cashtime}}</view>
					<view>{{item.money}}</view>
				</view>
			</mescroll-uni>
		</view>
		<view slot="footer">
			<view class="footer-remark">{{ '账户金额次日自动提现到账' }}</view>
		</view>
	</PageComp>
</template>

<script>
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	export default {
		mixins: [MescrollMixin],
		data() {
			return {
				listData: [],
				club_id: null,
				total: 0,
			}
		},
		onLoad(options) {
			this.club_id = options.id;
			uni.setNavigationBarColor({
				frontColor: '#ffffff',
				backgroundColor: '#FE6A1C',
			});
		},
		methods: {
			async upCallback(page) {
			  let pageNum = page.num; // 页码, 默认从1开始
			  let limit = page.size; // 页长, 默认每页10条
			  let { club_id } = this;
			  try {
			    let { data } =  await this.$api.Club.cashRecord({
					pageNum,
					limit,
					club_id,
				});
			    if (!data) return this.mescroll.endErr();
				this.total = data.total;
			    let curPageData = data.data.data || [];
			    let curPageLen = curPageData.length;
			    let totalSize = data.data.total || 0; 
			    if(page.num == 1) this.listData = [];
			    this.listData = this.listData.concat(curPageData);
			    this.mescroll.endBySize(curPageLen, totalSize);
			  } catch (err) {
			    console.log(err)
			  }
			},
		}
	}
</script>

<style lang="scss" scoped>
	.title-box {
		height: 90rpx;
		font-weight: bold;
		color: #666;
		font-size: 30rpx;
		padding-top: 50rpx;
	}
	.app-warp {
		background-color: #fff;
	}
	.top-box {
		text-align: center;
		color: #fff;
		font-size: 30rpx;
		margin: 32rpx 30rpx 50rpx;
		position: relative;
		z-index: 1;
		line-height: 1;
		.remark {
			font-size: 50rpx;
			margin-top: 30rpx;
			font-weight: bold;
		}
	}
	.container {
		height: 100%;
		margin: 0 60rpx;
		.item {
			height: 104rpx;
			border-top: 1rpx solid #f3f3f3;
			color: $themeColor;
			font-size: 30rpx;
			.left {
				width: 66rpx;
				height: 66rpx;
				background: $themeColor;
				border-radius: 50%;
				color: #fff;
				.icon-shouru {
					font-size: 48rpx;
				}
			}
			.center {
				flex: 1;
				color: #666;
				margin: 0 20rpx;
				font-size: 26rpx;
			}
		}
	}
	.footer-remark {
		color: #999;
		font-size: 26rpx;
		font-weight: bold;
		margin: 20rpx 0;
		text-align: center;
	}
</style>
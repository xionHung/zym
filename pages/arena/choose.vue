<template>
		<PageComp title="活动场馆" :isApplique="false" navStyle="background: #fff" >
			<mescroll-uni :fixed="false" ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback">
				<view class="content">
					<view class="input-inner">
						<text class="icon-search"></text>
						<input type="text" class="input" placeholder-style="color:#A8A6A7;" v-model="nickname" @confirm="confirm"
							placeholder="搜索附近球馆">
					</view>
					<ArenaItem v-for="item in listData" :key="item.id" :obj="item" @select="itemSelect" />
				</view>
			</mescroll-uni>
		</PageComp>
</template>

<script>
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	import ArenaItem from '@/components/UIComp/Club/arenaItem.vue';
	export default {
		mixins: [MescrollMixin],
		components: {
			ArenaItem,
		},
		data() {
			return {
				listData: [],
				nickname: '',
				config: {},
			}
		},
		onLoad(options) {
			// 增加其他参数
			let {config} = options;
			if (!config) return;
			this.config = JSON.parse(config);
		},
		methods: {
			async upCallback(page) {
			  let pageNum = page.num; // 页码, 默认从1开始
			  let limit = page.size; // 页长, 默认每页10条
				let { nickname } = this;
			  try {
			    let { data } =  await this.$api.Room.getList({
					pageNum,
					limit,
					name: nickname,
				});
			    if (!data) return this.mescroll.endErr();
			    let curPageData = data.data || [];
			    let curPageLen = curPageData.length;
			    let totalSize = this.total = data.total; 
			    if(page.num == 1) this.listData = [];
			    this.listData = this.listData.concat(curPageData);
			    this.mescroll.endBySize(curPageLen, totalSize);
			  } catch (err) {
			    console.log(err)
			  }
			},
			confirm() {
				this.mescroll.resetUpScroll();
			},
			itemSelect(row) {
				let routes = getCurrentPages();
				let curRoute = routes[routes.length - 2];
				curRoute.$vm.arenaSelect(row, this.config);
				uni.navigateBack();
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		margin: 30rpx 0;
		padding: 0 30rpx 30rpx;
		background: #fff;
		&::before {
			content: '';
			display: table;
		}
		.input-inner {
			position: relative;
			line-height: 60rpx;
			height: 60rpx;
			background: rgba(206, 206, 206, .6);
			padding: 0 20rpx 0 56rpx;
			border-radius: 30rpx;
			font-size: 22rpx;
			margin: 20rpx 0 40rpx;
		
			.icon-search {
				font-size: 36rpx;
				position: absolute;
				left: 16rpx;
				top: 14rpx;
			}
		
			.input {
				height: 60rpx;
				line-height: 60rpx;
			}
		}
		
		.linear {
			height: 16rpx;
		}
		.item {
			height: 126rpx;
			border-bottom: 1rpx solid #D8D8D8;
			font-weight: bold;
			&:last-child {
				border: 0
			}
			.conter {
				flex: 1;
				font-size: 30rpx;
				color: #333;
				margin: 0 16rpx;
				.label {
					height: 34rpx;
					border: 1rpx solid #2793E1;
					border-radius: 10rpx;
					font-size: 22rpx;
					padding: 0 16rpx;
					color: #2793E1;
					&.label-box {
						color: $themeColor;
						border-color: $themeColor;
						margin-left: 10rpx;
					}
				}
			}
			.right {
				color: $themeColor;
				font-weight: bold;
				font-size: 18rpx;
				text-align: right;
			}
			.btns {
				.btn {
					height: 36rpx;
					background: #999;
					border-radius: 18rpx;
					font-size: 24rpx;
					color: #FFF;
					padding: 0 20rpx;
					&~.btn {
						margin-left: 16rpx;
					}
					&.active {
						background: #FE6A1C;
						box-shadow: 2rpx 2rpx 21rpx 0px rgba(254,106,28,0.4);
					}
				}
			}
		}
	}
</style>
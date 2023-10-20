<template>
		<PageComp title="成员数据" :isApplique="false" navStyle="background: #fff" >
			<mescroll-uni :fixed="false" ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback">
				<view class="content">
					<view class="input-inner">
						<text class="icon-search"></text>
						<input type="text" class="input" placeholder-style="color:#A8A6A7;" v-model="nickname" @confirm="confirm"
							placeholder="搜索成员名称">
					</view>
					<md-title :title="'成员人数（' + total + '）'"></md-title>
					<view class="linear"></view>
					<view class="item flex" v-for="(item, index) in listData" :key="index" @click="_click(item.uid)">
						<md-avatar :width="80" :sex="item.sex" :src="item.headpic" />
						<view class="conter">
							<view class="mb-12">
								<text>{{ item.nickname }}</text>
								<md-image v-if="item.type === 3" src="img/club/bz.png" :width="70" :height="22" />
								<md-image v-if="item.type === 2" src="img/club/gly.png" :width="70" :height="22" />
							</view>
							<view class="flex">
								<view class="label flex-center">{{ item.level }}</view>
								<view class="label label-box flex-center" v-for="(j, k) in item.label" :key="j">{{ j }}</view>
							</view>
						</view>
						<view class="right">
							<view v-if="item.total_price">{{item.total_price}}</view>
							<view v-if="item.total_count">{{item.total_count}}</view>
						</view>
					</view>
				</view>
			</mescroll-uni>
		</PageComp>
</template>

<script>
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	export default {
		mixins: [MescrollMixin],
		data() {
			return {
				listData: [],
				nickname: '',
				club_id: null,
				total: 0,
			}
		},
		onLoad(options) {
			this.club_id = options.id;
		},
		methods: {
			async upCallback(page) {
			  let pageNum = page.num; // 页码, 默认从1开始
			  let limit = page.size; // 页长, 默认每页10条
				let { nickname, club_id } = this;
			  try {
			    let { data } =  await this.$api.Club.member({
					pageNum,
					limit,
					nickname,
					club_id,
					is_count_money: 1,
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
			_click(id) {
				uni.navigateTo({
					url: '/pages/mine/person/person?user_id=' + id
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		margin: 30rpx 0;
		padding: 0 30rpx;
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
<template>
	<PageComp title="加入申请" :isApplique="false" navStyle="background: #fff" >
		<mescroll-uni :fixed="false" ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback">
			<view class="content" v-if="listData.length">
				<view class="item flex" v-for="item in listData" :key="item.uid" @click="_click(item.uid)">
					<md-avatar :width="80" :sex="item.sex" :src="item.headpic" />
					<view class="center">
						<view>
							<text>{{ item.nickname }}</text>
						</view>
						<view class="flex">
							<view class="label flex-center">{{ item.level }}</view>
						</view>
					</view>
					<view class="flex" v-if="item.status == 1">
						<view class="btn" @click.stop="submit(item.id, 3)">{{ '拒绝' }}</view>
						<view class="btn active"  @click.stop="submit(item.id, 2)">{{ '同意' }}</view>
					</view>
					<view class="remark" v-else>{{item.status == 2? '已通过': '已拒绝'}}</view>
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
				club_id: null,
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
			    let { data } =  await this.$api.Club.message({
					pageNum,
					limit,
					club_id,
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
			async submit(id, status) {
				await this.$api.Club.isAgree({id, status});
				this.$toast(status == 2? '已同意': '已拒绝');
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
		background: #FFFFFF;
		box-shadow: 0px 5rpx 13rpx 0px rgba(189,189,189,0.3);
		border-radius: 10rpx;
		padding: 0 20rpx;
		margin: 30rpx;
		.item {
			height: 126rpx;
			border-bottom: 1rpx solid #d8d8d8;
			&:last-child {
				border-bottom: 0;
			}
			.center {
				flex: 1;
				font-size: 30rpx;
				font-weight: bold;
				color: #333;
				margin: 0 16rpx;
				.label {
					margin-top: 14rpx;
					height: 34rpx;
					border: 1rpx solid #2793E1;
					border-radius: 10rpx;
					font-size: 22rpx;
					padding: 0 16rpx;
					color: #2793E1;
				}
			}
			.btn {
				width: 90rpx;
				height: 36rpx;
				text-align: center;
				line-height: 36rpx;
				background: #999;
				border-radius: 18rpx;
				color: #fff;
				font-weight: bold;
				font-size: 24rpx;
				&.active {
					background: $themeColor;
					box-shadow: 2rpx 2rpx 21rpx 0px rgba(254,106,28,0.4);
					margin-left: 14rpx;
				}
			}
			.remark {
				font-size: 24rpx;
				color: #999;
			}
		}
	}
</style>
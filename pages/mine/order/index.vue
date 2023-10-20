<template>
	<view class="order">
		<view class="tabs">
			<view v-for="(item, index) in items" :key="item.value" @click="handleTab(index)" :class="{ tabPane: 'tabPane', active: item.active }">
				<text>{{ item.label }}</text>
			</view>
		</view>
		<!-- 搜索 -->
		<view class="bg-white">
			<md-search placeholder="搜索订单" @search="handleSearch"></md-search>
		</view>
		<view class="content">
			<mescroll-uni :fixed="false" ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback">
				<view class="card br-16 pa-20 mb-20" v-for="item in listData" :key="item.id" @click="handleJump(item)">
					<view class="flex flex-between">
						<view class="flex">
							<view class="top-title text-cut">{{ item.title }}</view>
							<text class="icon-right ml-8"></text>
						</view>
						<view class="primary-color">{{ item.status_name }}</view>
					</view>
					<view>
						<!-- 球馆预定 -->
						<template v-if="item.order_type == 1">
							<view class="flex mb-8">
								<text class="icon iconfont icon-changguan mr-8"></text>
								<text class="text-gray fs-24">{{ item.room_name }}</text>
							</view>
							<view class="flex flex-between">
								<view class="flex">
									<text class="icon icon-clock mr-8"></text>
									<text class="text-gray fs-24">{{ item.time }}</text>
								</view>
								<view>{{ item.order_num }}</view>
							</view>
						</template>
						<!-- 购买羽盟卡 -->
						<template v-else-if="item.order_type == 3">
							<view class="flex mb-8">
								<text class="mr-8">订单编号：</text>
								<text class="text-gray fs-24">{{ item.order_no }}</text>
							</view>
							<view class="flex mb-8">
								<text class="mr-8">购买数量：</text>
								<text class="text-gray fs-24">{{ item.card_num }}张</text>
							</view>
							<view class="flex">
								<view class="flex">
									<text class="mr-8">有效期至：</text>
									<text class="text-gray fs-24">{{ item.card_endtime }}</text>
								</view>
								<view>{{ item.order_num }}</view>
							</view>
						</template>
						<!-- 球馆卡充值 -->
						<template v-else-if="item.order_type == 4">
							<view class="flex mb-8">
								<text class="mr-8">订单编号：</text>
								<text class="text-gray fs-24">{{ item.order_no }}</text>
							</view>
							<view class="flex flex-between">
								<view class="flex">
									<text class="mr-8">金额抵扣：</text>
									<text class="text-gray fs-24">{{ item.recharge }}</text>
								</view>
								<view>{{ item.order_num }}</view>
							</view>
						</template>
						<template v-else>
							<view class="flex mb-8">
								<text class="icon iconfont icon-changguan mr-8"></text>
								<text class="text-gray fs-24">{{ item.room_name }}</text>
							</view>
							<view class="flex mb-8">
								<text class="icon icon-clock mr-8"></text>
								<text class="text-gray fs-24">{{ item.time }}</text>
							</view>
							<view class="flex flex-between">
								<view class="flex">
									<text class="icon iconfont icon-yonghu mr-8"></text>
									<text class="text-gray fs-24">{{ item.sign_name }}</text>
								</view>
								<view>{{ item.order_num }}</view>
							</view>
						</template>
						<view class="flex flex-between">
							<view class="flex flex-col">
								<view class="flex mt-8 flex-top-self">
									<text class="fs-24">共计：</text>
									<text class="text-price primary-color">{{ item.money }}</text>
								</view>
								<view class="fs-24">{{ item.addtime }}</view>
							</view>
							<view class="flex">
								<view class="primary-color mr-20 aaActive" v-if="item.order_type == 5">AA活动</view>
								<!-- 操作按钮 -->
								<view v-if="item.action_name" @click.stop="handleBtn(item)">
									<md-button :disabled="item.action_status == 0">{{ item.action_name }}</md-button>
								</view>
							</view>
						</view>
					</view>
				</view>
			</mescroll-uni>
		</view>
	</view>
</template>

<script>
import _ from 'lodash';
import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
export default {
	mixins: [MescrollMixin],
	data() {
		return {
			title: '',
			status: undefined,
			items: [
				{
					label: '全部',
					value: '0',
					active: true
				},
				{
					label: '进行中',
					value: '1'
				},
				{
					label: '已完成',
					value: '2'
				},
				{
					label: '已取消',
					value: '3'
				}
			],
			listData: []
		};
	},
	methods: {
		handleTab(index) {
			const _list = [...this.items];
			this.items = _list.map((item, i) => {
				if (i === index) {
					return {
						...item,
						active: true
					};
				}
				return {
					...item,
					active: false
				};
			});
			this.status = this.items[index].value;
			// 接口渲染
			this.mescroll.resetUpScroll(true);
		},
		// 搜索回调
		handleSearch: _.debounce(function (title) {
			this.title = title;
			this.mescroll.resetUpScroll(true);
		}, 1000),
		// 跳转页面
		handleJump(item) {
			const { order_type, room_id, activity_id } = item;
			if (order_type == 1) {
				// order_type 为1 球馆预订，可以跳转到球馆预订页面，room_id球馆id
				uni.navigateTo({
					url: '/pages/arena/predetermine?id=' + room_id
				});
			} else if (order_type == 2) {
				// order_type 为2 俱乐部接龙，可以跳转到球馆接龙活动页面，activity_id接龙活动id
				uni.navigateTo({
					url: '/pages/chains/chainsDetail?id=' + activity_id + '&time=' + item.starttime
				});
			} else if ([3, 4].includes(order_type)) {
				// order_type 为3 购买羽盟卡和4球馆卡充值，可以跳转到我的卡券页面
				uni.navigateTo({
					url: '/pages/mine/coupon/coupon'
				});
			} else if (order_type == 5) {
				// order_type 为 5aa支付，可以跳转到我的aa支付页面，activity_id接龙活动id
				uni.navigateTo({
					url: '/pages/chains/payment?id=' + activity_id
				});
			}
		},
		handleBtn(item) {
			const { action_name, activity_id, id } = item;
			if (action_name === '取消报名') {
				uni.showModal({
					content: '请确认是否取消报名？',
					success: (res) => {
						if (res.confirm) {
							this.cancelClubActivity(activity_id);
						}
					}
				});
			} else if (action_name === '取消预订') {
				uni.showModal({
					content: '请确认是否取消预订？',
					success: (res) => {
						if (res.confirm) {
							this.cancelRoom(id);
						}
					}
				});
			}
		},
		// 分页回调
		async upCallback(page) {
			let pageNum = page.num; // 页码, 默认从1开始
			let limit = page.size; // 页长, 默认每页10条
			try {
				let { data } = await this.getList({
					pageNum,
					limit,
					status: this.status == '0' ? undefined : this.status,
					title: this.title
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
		},
		/**
		 * 接口相关
		 */
		// 获取订单列表
		async getList(params) {
			try {
				const res = await this.$api.Order.index(params);
				return res;
			} catch (e) {
				//TODO handle the exception
			}
			return {};
		},
		// 取消接龙报名
		async cancelClubActivity(activity_id) {
			try {
				const { message } = await this.$api.Chains.cancel({ activity_id });
				this.$toast(message);
				this.mescroll.resetUpScroll(true);
			} catch (e) {
				//TODO handle the exception
			}
		},
		// 取消预定
		async cancelRoom(id) {
			try {
				const { message } = await this.$api.Room.RoomBookingCancel({ id });
				this.$toast(message);
				this.mescroll.resetUpScroll(true);
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

<style scoped lang="scss">
.aaActive {
	font-style: italic;
}
.order {
	height: 100vh;
	display: flex;
	flex-direction: column;
	.tabs {
		background-color: white;
		display: flex;
		align-items: center;

		.tabPane {
			flex: 1;
			height: 80upx;
			line-height: 80upx;
			text-align: center;

			text {
				position: relative;
				z-index: 0;
				font-size: 30upx;
			}

			&.active {
				font-weight: bold;

				text {
					&::after {
						content: '';
						display: block;
						position: absolute;
						z-index: -1;
						bottom: 4upx;
						left: 0;
						right: 0;
						width: 100%;
						height: 6upx;
						background-color: $themeColor;
						border-radius: 6upx;
					}
				}
			}
		}
	}

	.bg-white {
		background-color: white;
	}

	.content {
		flex: 1;
		padding: 20rpx 36rpx;
		overflow-y: scroll;

		.card {
			background-color: white;
			.top-title {
				max-width: 400rpx;
			}

			.icon {
				width: 24upx;
				height: 24upx;
			}
		}
	}
}
</style>

<template>
	<PageComp title="结算情况" isArc navStyle="color: #fff; background: #fe6a1c;" bgHeight="280rpx">
		<md-divider :height="194" slot="header" />
		<mescroll-uni :fixed="false" ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback">
			<view class="container">
				<view class="items" v-for="item in listData" :key="item.id" @click="_click(item)">
					<view class="top flex">
						<text>{{ item.name }}</text>
						<text class="icon icon-right ml-10"></text>
						<text class="iconfont icon-xiangshang-fill"></text>
						<view class="status" @click.stop="jump(item)">{{ statusFormate(item.settle_status) }}</view>
					</view>
					<view class="bottom flex">
						<view class="left">
							<text>{{ '收入' }}</text>
							<text class="numer">{{ '￥' + item.income }}</text>
						</view>
						<view class="line"></view>
						<view class="right" @click.stop="check(item)" :class="{ remark: item.settle_status == 1 }">
							<view v-if="item.settle_status != 1">
								<text>{{ '支出' }}</text>
								<text class="numer">{{ '￥' + item.outcome }}</text>
							</view>
							<text v-else>{{ '支出登记' }}</text>
						</view>
					</view>
				</view>
			</view>
		</mescroll-uni>
		<md-b-dialog title="支出登记" :show.sync="recordShow" @confirm="submit">
			<view class="record">
				<view class="record-main flex">
					<text>{{ '¥' }}</text>
					<input v-model="form.money" type="number" />
					<text class="remark">{{ '(元)' }}</text>
				</view>
				<md-textarea v-model="form.remark" placeholder="请输入备注" />
			</view>
		</md-b-dialog>
	</PageComp>
</template>

<script>
import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
export default {
	mixins: [MescrollMixin],
	data() {
		return {
			listData: [],
			club_id: null,
			recordShow: false,
			form: {
				type: 2,
				money: 0,
				remark: '',
				activity_id: null
			}
		};
	},
	onLoad(options) {
		this.club_id = options.id;
		uni.setNavigationBarColor({
			frontColor: '#ffffff',
			backgroundColor: '#FE6A1C'
		});
	},
	methods: {
		async upCallback(page) {
			let pageNum = page.num; // 页码, 默认从1开始
			let limit = page.size; // 页长, 默认每页10条
			let { club_id } = this;
			try {
				let { data } = await this.$api.Settle.index({
					pageNum,
					limit,
					club_id
				});
				if (!data) return this.mescroll.endErr();
				// this.total = data.total;
				let curPageData = data.data || [];
				let curPageLen = curPageData.length;
				let totalSize = data.total || 0;
				if (page.num == 1) this.listData = [];
				this.listData = this.listData.concat(curPageData);
				this.mescroll.endBySize(curPageLen, totalSize);
			} catch (err) {
				console.log(err);
			}
		},
		statusFormate(settle_status) {
			return ['', '待结算', 'AA结算中', 'AA结算'][settle_status];
		},
		jump(row) {
			let settle_status = row.settle_status;
			if (!settle_status) return;
			if (settle_status == 1) {
				uni.navigateTo({
					url: '/pages/chains/settlement?id=' + row.id
				});
				return;
			}
			uni.navigateTo({
				url: '/pages/chains/paymentDetails?id=' + row.id
			});
		},
		_click(row) {
			uni.navigateTo({
				url: '/pages/club/settlementDetails?id=' + row.id + '&title=' + row.name + '&income=' + row.income + '&outcome=' + row.outcome
			});
		},
		check(row) {
			// if (row.settle_status != 1) return;
			this.form.activity_id = row.id;
			this.recordShow = true;
		},
		async submit() {
			let { money, type, activity_id, remark } = this.form;
			if (!money) return uni.showToast({ icon: 'none', title: '请输入金额' });
			await this.$api.Settle.addPay({ money, type, remark, activity_id });
			this.$toast('登记成功');
			this.recordShow = false;
			this.form = {
				type: 2,
				money: 0,
				remark,
				activity_id: null
			};
			this.mescroll.resetUpScroll();
		}
	}
};
</script>

<style lang="scss" scoped>
.container {
	margin: 0 30rpx;
	.items {
		margin-bottom: 20rpx;
		.top {
			height: 74rpx;
			position: relative;
			font-size: 30rpx;
			color: #333;
			font-weight: bold;
			padding-left: 30rpx;
			.status {
				right: 98rpx;
				position: absolute;
				font-weight: normal;
				color: $themeColor;
				font-size: 26rpx;
			}
			.icon-xiangshang-fill {
				color: $themeColor;
				position: absolute;
				left: 44rpx;
				bottom: -8rpx;
			}
		}
		.bottom {
			height: 92rpx;
			background: #ffffff;
			box-shadow: 5rpx 5rpx 13rpx 0px rgba(254, 106, 28, 0.1);
			border-radius: 10rpx;
			font-size: 30rpx;
			padding: 0 30rpx;
			font-weight: bold;
			.numer {
				font-size: 40rpx;
			}
			.line {
				width: 1rpx;
				height: 40rpx;
				background: #d9d9d9;
				margin: 0 30rpx;
				flex: none;
			}
			.right,
			.left {
				flex: 1;
				color: #2cd96d;
				&.left {
					color: $themeColor;
				}
				&.remark {
					color: #999;
					font-size: 30rpx;
					text-align: center;
					font-weight: normal;
				}
			}
		}
	}
}
.record {
	&-main {
		color: $themeColor;
		padding-bottom: 14rpx;
		border-bottom: 1rpx solid #f3f3f3;
		font-size: 36rpx;
		height: 80rpx;
		margin-top: 40rpx;
		input {
			height: 100%;
			text-align: left;
			margin: 0 20rpx;
			font-size: 60rpx;
		}
		.remark {
			color: #999;
			font-size: 24rpx;
		}
	}
}
::v-deep {
	.md-textarea {
		height: 160rpx;
		margin: 30rpx 0;
		overflow: hidden;
	}
}
</style>

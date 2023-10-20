<template>
	<PageComp title="AA结算" :isApplique="false" navStyle="background: #fff" >
		<view class="box-car">
			<md-title title="活动支出" />
			<view class="box-container">
				<view class="flex">
					<view class="label">{{ pay[pay_aa] }}</view>
					<view class="price">
						<input v-model="total" type="number">
					</view>
				</view>
			</view>
		</view>
		<view class="box-car">
			<md-title title="AA人员" />
			<view class="box-container">
				<view class="remark">{{ '活动成员'+ listData.length + '人，收费成员 ' + selectList.length + '人' }}</view>
				<view class="flex personal-box" v-for="item in listData" :key="item.id" @click="selectData(item)">
					<md-avatar :width="64" :sex="item.sex" :src="item.headpic" />
					<view class="ml-10">
						<view class="title">{{ item.nickname }}</view>
						<view class="label">{{ item.strength + item.group }}</view>
					</view>
					<text class="icon-yes-fill" :class="{active: isCheck(item.id)}"></text>
				</view>
			</view>
		</view>
		<view class="footer-box" slot="footer">
			<view class="remark">
				<text>{{ '人均费用' }}</text>
				<text class="ml-18 mr-66">{{ '男¥' + renjun }}</text>
				<text>{{ '女¥' + renjun }}</text>
			</view>
			<view class="btns flex-space-between">
				<view class="flex" @click="allChange">
					<text class="icon-yes-fill" :class="{active: allSelect}"></text>
					<text>{{ '全选' }}</text>
				</view>
				<view class="btn flex-center" @click="submit">{{ '确认结算¥' + total }}</view>
			</view>
		</view>
	</PageComp>
</template>

<script>
	export default {
		data() {
			return {
				selectList: [],
				listData: [],
				id: null,
				pay_aa: 1,
				total: 0,
				pay: {
					1: '活动支出',
					2: '用球支出',
					3: '其他支出',
				},
				allSelect: false,
			}
		},
		computed: {
			renjun() {
				if (!this.total || !this.selectList.length) return 0;
				let data = this.selectList.reduce((pre, cur) => {
					let remark = !cur.remark? 0: parseFloat(cur.remark);
					return pre += (1 + remark);
				}, 0);
				return (this.total / data).toFixed(2);
			}
		},
		onLoad(options) {
			this.id = options.id;
			this.init();
		},
		methods: {
			async init() {
				let { data } = await this.$api.Settle.aaList({activity_id: this.id});
				this.listData = data.data;
				this.pay_aa = data.pay_aa;
			},
			async submit() {
				if (!this.total) return this.$toast('请输入支出金额');
				if (!this.selectList.length) return this.$toast('请选择人员');
				let obj ={
					activity_id: this.id,
					ids: this.selectList.map(el => el.id).toString(),
					money: this.total,
				}
				await this.$api.Settle.add(obj);
				uni.navigateTo({
					url: '/pages/chains/paymentDetails?id=' + this.id,
				})
			},
			isCheck(id) {
				return this.selectList.some(el => el.id === id);
			},
			selectData(row) {
				if (this.isCheck(row.id)) {
					this.selectList = this.selectList.filter(el => el.id != row.id);
				} else {
					this.selectList.push(row);
				}
				if (this.selectList.length  === this.listData.length) {
					this.allSelect = true;
				} else {
					this.allSelect = false;
				}
			},
			allChange() {
				this.allSelect = !this.allSelect;
				if (!this.allSelect) return this.selectList = [];
				this.selectList = this.listData;
			}
		},
	}
</script>

<style lang="scss" scoped>
	.box-car {
		margin-top: 20rpx;
		background-color: #fff;
		padding: 20rpx 50rpx;
		color: #333;
		.box-container {
			padding-left: 38rpx;
			margin-top: 34rpx;
			& > view {
				margin-bottom: 24rpx;
				.label {
					font-size: 24rpx;
					margin-right: 18rpx;
				}
				.price {
					width: 328rpx;
					height: 46rpx;
					font-size: 36rpx;
					font-weight: bold;
					flex: none;
					display: flex;
					align-items: center;
					padding-left: 10rpx;
					border-bottom: 1rpx solid #E5E5E5;
				}
			}
			.personal-box {
				position: relative;
				.title {
					font-size: 22rpx;
					font-weight: bold;
				}
				.label {
					height: 24rpx;
					line-height: 24rpx;
					display: inline-block;
					background-color: $themeColor;
					border-radius: 10rpx;
					font-size: 16rpx;
					font-weight: bold;
					color: #fff;
					padding: 0 10rpx;
				}
				.icon-yes-fill {
					font-size: 32rpx;
					color: #999;
					position: absolute;
					left: -48rpx;
					top: calc(50% - 16rpx);
					&.active {
						color: $themeColor;
					}
				}
			}
		}
	}
	.footer-box {
		height: 220rpx;
		background: #FFFFFF;
		box-shadow: 9rpx 9rpx 35rpx 0px rgba(254,106,28,0.4);
		.remark {
			padding-top: 40rpx;
			padding-left: 77rpx;
			font-size: 26rpx;
			color: #333;
			font-weight: bold;
		}
		.btns {
			margin: 44rpx 30rpx 0;
			.icon-yes-fill {
				font-size: 32rpx;
				color: #999;
				margin-right: 10rpx;
				&.active {
					color: $themeColor;
				}
			}
			.btn {
				width: 481rpx;
				height: 76rpx;
				background: #FE6A1C;
				box-shadow: 9rpx 9rpx 35rpx 0px rgba(254,106,28,0.4);
				border-radius: 38rpx;
				font-size: 30rpx;
				color: #fff;
				font-weight: bold;
			}
		}
	}
</style>
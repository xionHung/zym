<template>
	<PageComp title="收支详情" isArc navStyle="color: #fff; background: #fe6a1c;" bgHeight="260rpx" >
		<view slot="header" class="top-box">
			<view class="title-box">
				<text>{{ title }}</text>
				<text class="icon icon-right"></text>
			</view>
			<view class="remark">
				<view class="left flex" @click="typeChange(1)">
					<text class="mr-20">{{'收入'}}</text>
					<text class="number">{{'¥' + income}}</text>
				</view>
				<view class="line"></view>
				<view class="right flex" @click="typeChange(2)">
					<text class="mr-20">{{'支出'}}</text>
					<text class="number">{{'¥' + outcome}}</text>
				</view>
			</view>
			<view class="three">
				<text>{{'共计' + total + '笔' + titleFormate}}</text>
			</view>
		</view>
		<view class="container">
			<mescroll-uni :fixed="false" ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback">
				<view class="flex item" v-for="item in listData" :key="item.id">
					<view class="left flex-center" :class="{green: type === 2, hui: item.status == 2}">
						<text class="iconfont" :class="type === 1? 'icon-shouru': 'icon-zhichu'" />
					</view>
					<view class="center">
						<text>{{ item.title}}</text>
					</view>
					<view>
						<text>{{type === 1?'+': '-'}}</text>
						<text>{{item.money}}</text>
					</view>
				</view>
			</mescroll-uni>
		</view>
	</PageComp>
</template>

<script>
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	export default {
		mixins: [MescrollMixin],
		data() {
			return {
				month: null,
				type: 1,
				time: null,
				listData: [],
				club_id: null,
				title: '',
				total: 0,
				income: 0,
				outcome: 0,
			}
		},
		computed: {
			titleFormate() {
				return this.type === 1? '收入': '支出';
			},
		},
		onLoad(options) {
			let { id, title, income, outcome } = options;
			this.club_id = id;
			this.title = title;
			this.income = income;
			this.outcome = outcome;
			uni.setNavigationBarColor({
				frontColor: '#ffffff',
				backgroundColor: '#FE6A1C',
			});
		},
		methods: {
			async upCallback() {
				let { club_id } = this;
				this.listData = [];
				this.total = 0;
			  try {
			    let { data } =  await this.$api.Settle.balanceRecord({
					type: this.type,
					activity_id: this.club_id,
				});
				if (!data.length) return this.mescroll.endBySize(0, 0);
				this.total = data.length;
			    this.listData = data;
			    this.mescroll.endBySize(1, 1);
			  } catch (err) {
			    console.log(err)
			  }
			},
			typeChange(type) {
				if (this.type === type) return;
				this.type = type;
				this.mescroll.resetUpScroll();
			},
			timeChange() {
				this.timeShow = true;
			},
			confirm(res) {
				this.month = res;
				this.time = new Date(res).valueOf();
				this.mescroll.resetUpScroll();
			},
			async submit() {
				console.log(this.form);
				let {money, type, remark} = this.form;
				if (!money) return uni.showToast({icon: 'none', title: '请输入金额'});
				await this.$api.Club.addPay({money,type, remark, club_id: this.club_id});
				this.recordShow = false;
				this.form = {
					type: 1,
					money: 0,
					remark,
				};
				this.mescroll.resetUpScroll();
			}
		}
	}
</script>

<style lang="scss" scoped>
	.app-warp {
		background-color: #fff;
	}
	.top-box {
		color: #fff;
		font-size: 30rpx;
		margin: 32rpx 30rpx 0;
		position: relative;
		z-index: 1;
		line-height: 1;
		.title-box {
			font-size: 30rpx;
			font-weight: bold;
			margin-bottom: 30rpx;
			padding-left: 20rpx;
		}
		.remark {
			height: 92rpx;
			padding: 0 20rpx;
			background: #FFFFFF;
			box-shadow: 5rpx 5rpx 13rpx 0px rgba(254,106,28,0.1);
			border-radius: 10rpx;
			display: flex;
			align-items: center;
			font-size: 30rpx;
			font-weight: bold;
			.left {
				flex: 1;
				color: $themeColor;
			}
			.right {
				flex: 1;
				color: #37B773;
			}
			.line {
				background-color: #D9D9D9;
				width: 1rpx;
				height: 40rpx;
				margin-right: 40rpx;
			}
			.number {
				font-size: 50rpx;
			}
		}
		.three {
			height: 75rpx;
			line-height: 75rpx;
			color: #333;
			font-size: 26rpx;
			border-bottom: 1rpx solid #F3F3F3;
			margin: 0 30rpx;
		}
	}
	.container {
		height: 100%;
		margin: 0 60rpx;
		.item {
			height: 104rpx;
			border-bottom: 1rpx solid #f3f3f3;
			color: $themeColor;
			font-size: 30rpx;
			.left {
				width: 66rpx;
				height: 66rpx;
				background: $themeColor;
				border-radius: 50%;
				color: #fff;
				&.green {
					background: #37B773;
				}
				&.hui {
					background: #999;
				}
				.iconfont {
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
	.record {
		.btns {
			width: 130rpx;
			height: 56rpx;
			line-height: 56rpx;
			font-size: 30rpx;
			font-weight: bold;
			color: #FFFFFF;
			text-align: center;
			border-radius: 28rpx;
			background-color: #999;
			&.active {
				background-color: $themeColor;
			}
		}
		&-main {
			color: $themeColor;
			padding-bottom: 14rpx;
			border-bottom: 1rpx solid #F3F3F3;
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
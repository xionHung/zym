<template>
	<PageComp title="资金明细" isArc navStyle="color: #fff; background: #fe6a1c;" bgHeight="280rpx" >
		<view slot="header" class="top-box">
			<view class="title-box">
				<text @click="timeChange">{{ monthFormate + '月' }}</text>
				<text class="iconfont icon-xiangshang-fill"></text>
			</view>
			<view class="remark">
				<view class="left" @click="typeChange(1)">
					<view class="number">{{'¥' + expenditure}}</view>
					<view>{{'收入（元）'}}</view>
				</view>
				<view class="line"></view>
				<view class="right" @click="typeChange(2)">
					<view class="number">{{'¥' + dis_price}}</view>
					<view>{{'支出（元）'}}</view>
				</view>
			</view>
			<view class="second flex-space-between">
				<view class="title">{{'手动记账'}}</view>
				<view class="flex">
					<view class="circle flex-center" @click="recordShow = true">	
						<text class="iconfont icon-edit"></text>
					</view>
				</view>
			</view>
			<view class="three">
				<text>{{'共计' + total + '笔' + titleFormate}}</text>
			</view>
		</view>
		<view class="container">
			<mescroll-uni :fixed="false" ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback">
				<view class="flex item" v-for="item in listData" :key="item.id">
					<view class="left flex-center" :class="{green: type === 2}">
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
		<md-time-picker title="资金明细月份" :level="2" :value="month" :show.sync="timeShow" @confirm="confirm" format="{y}-{m}-{d}" />
		<md-b-dialog title="手动记账" :show.sync="recordShow" @confirm="submit">
			<view class="record">
				<view class="flex-space-between">
					<view class="btns" :class="{active: form.type === 1}" @click="form.type = 1">{{'收入'}}</view>
					<view class="btns" :class="{active: form.type === 2}" @click="form.type = 2">{{'支出'}}</view>
				</view>
				<view class="record-main flex">
					<text>{{ '¥' }}</text>
					<input v-model="form.money" type="number" />
					<text class="remark">{{'(元)'}}</text>
				</view>
				<md-textarea v-model="form.remark" placeholder="请输入备注" />
			</view>
		</md-b-dialog>
	</PageComp>
</template>

<script>
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	import { parseTime } from '@/utils/tools.js';
	export default {
		mixins: [MescrollMixin],
		data() {
			return {
				month: null,
				type: 1,
				time: null,
				listData: [],
				club_id: null,
				total: 0,
				expenditure: 0,
				dis_price: 0,
				timeShow: false,
				recordShow: false,
				form: {
					type: 1,
					money: 0,
					remark: '',
				}
			}
		},
		computed: {
			titleFormate() {
				return this.type === 1? '收入': '支出';
			},
			monthFormate() {
				return new Date(this.month).getMonth() + 1;
			}
		},
		onLoad(options) {
			this.club_id = options.id;
			this.month = parseTime(Date.now(), '{y}-{m}') + '-01';
			this.time = new Date(this.month).valueOf();
		},
		methods: {
			async upCallback(page) {
				let { club_id } = this;
			  try {
			    let { data } =  await this.$api.Club.balanceRecord({
					type: this.type,
					time: this.time / 1000,
					club_id,
				});
				if (!data) return this.mescroll.endErr();
          this.expenditure = this.type === 1? data.total: data.dis_price;
          this.dis_price = this.type === 1? data.dis_price: data.total;
			    let curPageData = data.data || [];
			    let curPageLen = curPageData.length;
			    this.total =  curPageLen || 0; 
			    if(page.num == 1) this.listData = [];
			    this.listData = this.listData.concat(curPageData);
			    this.mescroll.endBySize(curPageLen, curPageLen);
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
				let {money, type, remark} = this.form;
				if (!money) return uni.showToast({icon: 'none', title: '请输入金额'});
				await this.$api.Club.addPay({money,type, remark, club_id: this.club_id});
        this.$toast('添加成功');
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
			text-align: center;
			font-size: 40rpx;
			font-weight: bold;
			margin-bottom: 40rpx;
			.icon-xiangshang-fill {
				display: inline-block;
				transform: rotateZ(180deg);
			}
		}
		.remark {
			padding: 40rpx;
			background: #FFFFFF;
			box-shadow: 5rpx 5rpx 13rpx 0px rgba(254,106,28,0.1);
			border-radius: 10rpx;
			display: flex;
			align-items: center;
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
				height: 92rpx;
				margin-right: 50rpx;
			}
			.number {
				font-size: 50rpx;
				margin-bottom: 40rpx;
			}
		}
		.second {
			height: 120rpx;
			background: #FFFFFF;
			box-shadow: 5rpx 5rpx 13rpx 0px rgba(254,106,28,0.1);
			border-radius: 10rpx;
			padding: 0 40rpx;
			margin-top: 20rpx;
			.title {
				color: #999;
				font-size: 30rpx;
			}
			.circle {
				width: 44rpx;
				height: 44rpx;
				background-color: $themeColor;
				border-radius: 50%;
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
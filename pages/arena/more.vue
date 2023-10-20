<template>
	<PageComp title="场馆详情" :isApplique="false" navStyle="background-color: #fff">
		<view class="card">
			<view class="title">
				<view class="text">{{ '营业时间' }}</view>
			</view>
			<view class="item flex-center" v-for="(item, index) in form.business_time" :key="index">
				<view>{{ item }}</view>
			</view>
		</view>
		<view class="card">
			<view class="title">
				<view class="text">{{ '场馆设施' }}</view>
			</view>
			<view class="item flex-center">
				<view class="label">{{ '地板' }}</view>
				<text class="iconfont icon-diban" />
				<view>{{ form.floor }}</view>
			</view>
			<view class="item flex-center">
				<view class="label">{{ '灯光' }}</view>
				<view class="others">
					<view class="box" v-if="form.room_device.top_light == 1">
						<text class="iconfont icon-xidingdeng" />
						<view>{{ '顶灯' }}</view>
					</view>
					<view class="box" v-if="form.room_device.side_light == 1">
						<text class="iconfont icon-pro_luminaire_03_emergency_light" />
						<view>{{ '侧灯' }}</view>
					</view>
				</view>
			</view>
			<view class="item flex-center" v-if="form.room_device.park == 1">
				<view class="label">{{ '停车' }}</view>
				<text class="iconfont icon-tingchewei" />
				<view>
					<text>{{ '停车位' }}</text>
					<text>{{ '充足' }}</text>
					<text>{{ '(' + form.parking_num + ')' }}</text>
				</view>
			</view>
			<view class="item flex-center other">
				<view class="label">{{ '其他' }}</view>
				<view class="others">
					<view class="flex-center" v-if="form.room_device.air == 1">
						<text class="iconfont icon-kongdiao" />
						<view>{{'空调'}}</view>
					</view>
					<view class="flex-center" v-if="form.room_device.wifi == 1">
						<text class="iconfont icon-WIFI" />
						<view>{{'Wi-Fi'}}</view>
					</view>
					<view class="flex-center" v-if="form.room_device.shower == 1">
						<text class="iconfont icon-linyu" />
						<view>{{'淋浴'}}</view>
					</view>
					<view class="flex-center" v-if="form.room_device.toilet == 1">
						<text class="iconfont icon-xishoujian" />
						<view>{{'洗手间'}}</view>
					</view>
					<view class="flex-center" v-if="form.room_device.room == 1">
						<text class="iconfont icon-gengyishi" />
						<view>{{'更衣室'}}</view>
					</view>
					<view class="flex-center" v-if="form.room_device.locker == 1">
						<text class="iconfont icon-yigui" />
						<view>{{'储物柜'}}</view>
					</view>
					<view class="flex-center" v-if="form.room_device.smoking == 1">
						<text class="iconfont icon-xiyanqu" />
						<view>{{'吸烟区'}}</view>
					</view>
					<view class="flex-center" v-if="form.room_device.power == 1">
						<text class="iconfont icon-battery-2-charge-fill" />
						<view>{{'充电宝'}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="card">
			<view class="title">
				<view class="text">{{ '服务情况' }}</view>
			</view>
			<view class="item flex-center">
				<view class="label" v-if="form.room_service.threading == 1">{{ '穿线' }}</view>
				<view v-if="form.room_service.water == 1">{{ '水和饮料' }}</view>
			</view>
			<view class="item flex-center">
				<view class="label" v-if="form.room_service.ball == 1">{{ '羽毛球' }}</view>
				<view v-if="form.room_service.train == 1">{{ '培训' }}</view>
			</view>
		</view>
	</PageComp>
</template>

<script>
	export default {
		data() {
			return {
				form: {}
			}
		},
		onLoad(options) {
			this.getInfo(options.id);
		},
		methods: {
			async getInfo(id) {
				let { data } = await this.$api.Room.detail({id});
				console.log(data);
				this.form = data;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.iconfont {
		font-size: 28rpx;
		color: $themeColor;
		margin-right: 28rpx;
	}
	.card {
		background: #FFFFFF;
		box-shadow: 0px 4rpx 4rpx 0px rgba(153,153,153,0.11);
		border-radius: 20rpx;
		margin: 20rpx 30rpx;
		padding: 0 20rpx ;
		color: #666;
		font-size: 22rpx;
		&::after {
			content: '';
			display: table;
		}
		.title {
			font-size: 30rpx;
			color: #333;
			font-weight: bold;
			line-height: 1;
			padding: 30rpx 0 28rpx 0;
			position: relative;
			&::before {
				content: '';
				width: 56rpx;
				height: 12rpx;
				background-color: #FF945B;
				border-radius: 6rpx;
				position: absolute;
				bottom: 24rpx;
				left: 0;
			}
			.text {
				position: relative;
				z-index: 1;
			}
		}
		.item {
			justify-content: flex-start;
			margin-left: 30rpx;
			line-height: 1;
			margin-bottom: 30rpx;
			.others {
				flex: 1;
				display: grid;
				grid-template-columns: repeat(2, 1fr);
				row-gap: 30rpx;
				.flex-center {
					justify-content: flex-start;
				}
			}
			.box {
				display: flex;
				flex: 1;
			}
			&.other {
				align-items: flex-start;
			}
		}
		.label {
			width: 176rpx;
			flex: none;
		}
		.brock {
			width: 20rpx;
			height: 20rpx;
			background-color: #FF945B;
			margin-right: 28rpx;
		}
	}
</style>
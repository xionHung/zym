<template>
	<view class="cont" @click="_click(item)">
		<view class="line flex-space-between">
			<view class="flex-start">
				<text class="iconfont icon-changguan mr-8"></text>
				<text>{{ item.room_name }} | {{ item.distance }}</text>
			</view>
			<text class="money" :class="status[item.status].class">{{ item.unit_price }}</text>
		</view>
		<view class="line flex-start">
			<text class="icon-clock mr-8"></text>
			<text class="time">{{ item.time }}</text>
		</view>
		<view class="line flex-start">
			<text class="iconfont icon-yonghu mr-8"></text>
			<text class="time">{{ item.sign_name }}</text>
		</view>
		<view class="line flex-start">
			<text class="iconfont icon-zuanshi mr-8"></text>
			<text class="time">{{ item.level_desc }}</text>
		</view>
		<view class="bottom flex-space-between">
			<view class="flex-start">
				<template v-if="item.room_device && item.room_device.length">
					<text class="tag" v-for="(o, ti) in item.room_device" :key="ti">{{ o }}</text>
				</template>
			</view>
			<view class="flex-start">
				<view class="act-type">{{ item.pay_aa.name }}</view>
				<button class="rbtn apply-btn" :class="status[item.status].class" @click.stop="handleClickItem(item)">
					{{ item.status_name }}
				</button>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		item: {
			type: Object,
			default: () => {}
		}
	},
	data() {
		return {
			status: {
				0: {
					class: 'cancel',
					button: '已取消'
				},
				1: {
					class: 'start',
					button: '一键报名'
				},
				2: {
					class: 'end',
					button: '已结束'
				}
			}
		};
	},
	methods: {
		handleClickItem(item) {
			this.$emit('predetermine', item);
		},
		_click(item) {
			this.$emit('click', item);
		}
	}
};
</script>

<style lang="scss" scoped>
.cont {
	line-height: 44rpx;
	font-size: 22rpx;
	color: #666;
	padding-bottom: 24rpx;
	margin-bottom: 16rpx;
  border-bottom: 1rpx solid #e7e7e7;

	.icon {
		width: 24rpx;
		height: 24rpx;
		margin-right: 8rpx;
	}

	.money {
		font-size: 30rpx;
		color: $themeColor;
		margin-right: 40rpx;

		&.end,
		&.cancel {
			color: #999999;
		}
	}

	.bottom {
		margin-top: 10rpx;
	}

	.more-btn {
		width: 34rpx;
		height: 34rpx;
		border-radius: 50%;
		background: #f0f2f5;
		margin-right: 10rpx;
		color: #ccc;
	}

	.tag {
		height: 38rpx;
		border: 1px solid #fe6a1c;
		border-radius: 19rpx;
		padding: 0 12rpx;
		margin-right: 10rpx;
		color: #fe6a1c;
		line-height: 38rpx;
	}

	.act-type {
		font-size: 26rpx;
		font-weight: bold;
		line-height: 50rpx;
		color: #fe6a1c;
		font-style: italic;
		margin-right: 26rpx;
	}
}
.apply-btn {
	width: 140rpx;
	height: 50rpx;
	border-radius: 25rpx;
	background: #fe6a1c;
	color: #fff;
	font-size: 24rpx;

	&.cancel,
	&.end {
		background: #999;
	}
}
</style>

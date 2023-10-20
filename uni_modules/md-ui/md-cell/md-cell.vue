<template>
	<view
		:class="{
			'md-cell': 'md-cell',
			flex: 'flex',
			'flex-between': 'flex-between',
			'border-bottom': hasBottomBorder
		}"
		@click="click"
	>
		<view class="md-cell-label w-30 text-cut">
			<slot name="label">
				<text>{{ label }}</text>
				<text class="requried ml-10" v-if="required">{{ '*' }}</text>
			</slot>
		</view>
		<view class="flex1 flex text-cut">
			<view class="md-cell-value ml-20 flex1 flex flex-end text-cut">
				<slot name="value">{{ value }}</slot>
			</view>
			<slot name="right">
				<text class="icon-right ml-42"></text>
			</slot>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		label: String,
		value: String,
		hasBottomBorder: {
			type: Boolean,
			default: true
		},
		required: Boolean
	},
	methods: {
		click() {
			this.$emit('click');
		}
	}
};
</script>

<style scoped lang="scss">
.md-cell {
	height: 80rpx;
	line-height: 80rpx;
	font-size: 24rpx;
	font-weight: bold;
	.md-cell-label {
		color: #666666;
	}
	.md-cell-value {
		color: #999999;
	}
	.requried {
		color: $themeColor;
	}
}
</style>

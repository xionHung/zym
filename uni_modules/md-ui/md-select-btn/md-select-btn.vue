<template>
	<view class="md-select-btn flex">
		<view class="item flex" :class="{active: isActive(item[config.value])}" v-for="(item, index) in list" :key="index" @click="_click(item[config.value])">
			<text class="icon-yes1" v-if="isLeftIcon && isActive(item[config.value])"></text>
			<text>{{ item[config.label] }}</text>
			<text class="icon-yes1" v-if="isRightIcon && isActive(item[config.value])"></text>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			value: [Array, Number, String],
			list: Array,
			config: {
				type: Object,
				default: () => {
					return {
						label: 'label',
						value: 'value'
					}
				},
			},
			isLeftIcon: Boolean,
			isRightIcon: Boolean,
			mode: {
				type: String,
				default: () => 'check' //radio 单选 check 多选
			}
		},
		methods: {
			isActive(val) {
				if (this.mode === 'check') return this.value.includes(val);
				return this.value === val;
			},
			_click(id) {
				if (this.mode === 'check') {
					let array = [];
					if (this.isActive(id)) {
						array = this.value.filter(el => el !== id);
					} else {
						array = this.value.concat([id]);
					}
					this.$emit('input', array);
					this.$emit('change', array);
					return;
				}
				if (id === this.value) return;
				this.$emit('input', id);
				this.$emit('change', this.list.find(el => el[this.config.value] === id));
			}
		}
	}
</script>

<style lang="scss" scoped>
	.md-select-btn {
		flex-wrap: wrap;
		.item {
			height: 60rpx;
			padding: 0 20rpx;
			border-radius: 20rpx;
			background: #D2D2D2;
			color: #fff;
			font-size: 26rpx;
			font-weight: bold;
			margin-right: 18rpx;
			&:last-child {
				margin-right: 0;
			}
			&.active {
				background-color: $themeColor;
			}
		}
	}
</style>
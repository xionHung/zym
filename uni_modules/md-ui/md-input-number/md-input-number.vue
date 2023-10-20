<template>
	<view class="md-input-number flex" :class="{active: !isBack}">
		<view class="left" @click="leftClick" v-if="!disabled">
			<text class="icon-minus"></text>
		</view>
		<view class="center flex-center">
			<text v-if="unit">{{unit}}</text>
			<input :disabled="disabled" style="width: 50rpx; text-align: center;" v-model="valueNumber" type="number" @change="inputChange">
		</view>
		<view class="right" @click="rightClick" v-if="!disabled">
			<text class="icon-plus"></text>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			value: {
				type: Number,
				default: () => 0,
			},
			unit: String,
			minValue: {
				type: Number,
				default: () => 0,
			},
			maxValue: {
				type: Number,
				default: () => 99,
			},
			step: {
				type: Number,
				default: () => 1,
			},
			// 是否开启颜色
			isBack: Boolean,
			disabled: Boolean,
		},
		computed: {
			valueNumber: {
				get() {
					return this.value;
				},
				set(val) {
					this.$emit('input', val);
				}
			}
		},
		methods: {
			leftClick() {
				if (this.valueNumber <= this.minValue) {
					this.valueNumber = this.minValue;
				} else {
					this.valueNumber -= this.step;
					setTimeout(() => {
						this.$emit('change', this.valueNumber);
						this.$emit('leftChange', this.valueNumber);
					}, 10)
				}
			},
			rightClick() {
				if (this.maxValue <= this.valueNumber){
					this.valueNumber = this.maxValue;
				} else {
					this.valueNumber += this.step;
					setTimeout(() => {
						this.$emit('change', this.valueNumber);
						this.$emit('rightChange', this.valueNumber);
					}, 10)
				}
			},
			inputChange(e) {
				let value = e.detail.value;
				if (!value) return this.valueNumber = 0;
				let num = Number(value);
				if (this.maxValue <= num){
					num = this.maxValue;
				} else if(num <= this.minValue) {
					num = this.minValue;
				}
				this.valueNumber = num;
				setTimeout(() => {
					this.$emit('change', this.valueNumber);
				}, 10)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.md-input-number {
		height: 50rpx;
		border-radius: 10rpx;
		font-size: 32rpx;
		color: $themeColor;
		font-weight: bold;
		&.active {
			background-color: #FFE7DA;
		}
		.left,
		.right {
			width: 50rpx;
			flex: none;
			text-align: center;
			line-height: 50rpx;
		}
		.center {
			padding: 0 18rpx;
			height: 40rpx;
			background-color: #fff;
			border-radius: 10rpx;
			border: 1rpx solid $themeColor;
		}
	}
</style>
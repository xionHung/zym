<template>
	<view class="md-textarea">
		<textarea v-model="textValue" class="area" :placeholder="placeholder" placeholder-class="place-name" :disabled="disabled" :maxlength="maxlength"></textarea>
	</view>
</template>

<script>
export default {
	props: {
		value: String,
		placeholder: String,
		disabled: Boolean,
		maxlength: {
			type: Number,
			default: () => -1
		}
	},
	computed: {
		textValue: {
			get() {
				return this.value;
			},
			set(val) {
				this.$emit('input', val);
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.md-textarea {
	padding: 20rpx;
	background: #fff8f4;
	border-radius: 10px;
	.place-name {
		font-size: 22rpx;
		color: #666;
	}
	.area {
		color: #333;
		font-size: 24rpx;
		text-align: left;
	}
}
</style>

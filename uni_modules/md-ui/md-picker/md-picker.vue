<template>
	<picker-view :value="current" indicator-style="height: 65rpx;" @change="bindChange" class="md-picker-view" id="picker">
		<picker-view-column>
			<view class="item flex-center" :class="{active: current[0] === index}" v-for="(item, index) in list" :key="index">{{ item[config.label] }}</view>
		</picker-view-column>
	</picker-view>
</template>

<script>
export default {
	props: {
		list: {
			type: Array,
			default: () => []
		},
		config: {
			type: Object,
			default: () => {
				return {
					label: 'label',
					value: 'value'
				};
			}
		}
	},
	data() {
		return {
			current: []
		};
	},
	created() {
		this.$emit('picker', this.list[0]);
	},
	methods: {
		bindChange(e) {
			const [val] = e.detail.value;
			this.current = e.detail.value;
			console.log(this.current);
			this.$emit('picker', this.list[val]);
		}
	}
};
</script>

<style scoped lang="scss">
.md-picker-view {
	height: 325rpx;
	.item {
		&.active {
			font-size: 32rpx;
			color: $themeColor;
		}
	}
}
</style>

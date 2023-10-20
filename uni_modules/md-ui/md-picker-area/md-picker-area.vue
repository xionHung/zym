<template>
	<picker-view :value="current" indicator-style="height: 65rpx;" @change="bindChange" class="md-picker-view" id="picker">
		<picker-view-column>
			<view data-col="0" @touchend="bindTouchEnd" class="item flex-center" :class="{active: current[0] === index}" v-for="(item, index) in province" :key="index">{{ item.label }}</view>
		</picker-view-column>
		<picker-view-column v-if="[2, 3].includes(level)">
			<view data-col="1" @touchend="bindTouchEnd" class="item flex-center" :class="{active: current[1] === index}" v-for="(item, index) in city" :key="index">{{ item.label }}</view>
		</picker-view-column>
		<picker-view-column v-if="level == 3">
			<view data-col="2" @touchend="bindTouchEnd" class="item flex-center" :class="{active: current[2] === index}" v-for="(item, index) in area" :key="index">{{ item.label }}</view>
		</picker-view-column>
	</picker-view>
</template>

<script>
import area from './area.js';
export default {
	props: {
		level: {
			type: Number,
			default: 2
		}
	},
	data() {
		return {
			current: [],
			province: area,
			city: area[0].children,
			area: area[0].children[0].children,
			pickers: []
		};
	},
	created() {
		let _current = [];
		if (this.level == 1) {
			this.current = [0];
			_current = [{ label: '北京市', value: '110000' }];
		} else if (this.level == 2) {
			this.current = [0, 0];
			_current = [
				{ label: '北京市', value: '110000' },
				{ label: '北京市', value: '110100' }
			];
		} else if (this.level == 3) {
			this.current = [0, 0, 0];
			_current = [
				{ label: '北京市', value: '110000' },
				{ label: '北京市', value: '110100' },
				{ label: '东城区', value: '110101' }
			];
		}
		this.$emit('picker', _current);
	},
	methods: {
		bindChange(e) {
			const val = e.detail.value;
			this.current = val;
			const { value, label } = area[val[0]];
			this.pickers[0] = { value, label };
			if ([2, 3].includes(this.level)) {
				this.city = area[val[0]].children;
				const { value, label } = area[val[0]].children[val[1]];
				this.pickers[1] = { value, label };
			}
			if (this.level == 3) {
				this.area = area[val[0]].children[val[1]].children;
				const { value, label } = area[val[0]].children[val[1]].children[val[2]];
				this.pickers[2] = { value, label };
			}
			this.$emit('picker', this.pickers);
		},
		// 每项的touchend事件,用来处理重置位置问题
		bindTouchEnd(e) {
			const { col } = e.target.dataset;
			const _current = this.current;
			if (col === '0') {
				if (this.level == 2) {
					// 重置位子
					this.current = [_current[0], 0];
				} else if (this.level == 3) {
					// 重置位子
					this.current = [_current[0], 0, 0];
				}
			} else if (col === '1') {
				if (this.level == 3) {
					// 重置位子
					this.current = [_current[0], _current[1], 0];
				}
			}
		},
	}
};
</script>

<style scoped lang="scss">
.md-picker-view {
	height: 325rpx;
	.item {
		&.active {
			color: $themeColor;
		}
	}
}
</style>

<template>
	<view class="md-picker-aera-time">
		<view class="title-box">
			<view class="label flex-center" :class="{active: dataIndex === index}" v-for="(item, index) in list" :key="index" @click="_click(index)">
				<view>{{item}}</view>
				<view class="value">{{valueArray[index]}}</view>
			</view>
		</view>
		<picker-view v-model="current" indicator-style="height: 65rpx;" @change="bindChange" class="picker-view" id="picker-aear-time">
			<picker-view-column>
				<view data-col="0" @touchend="bindTouchEnd" class="item flex-center" :class="{active: current[0] === index}" v-for="(item, index) in TimeList" :key="index">{{ item.label }}</view>
			</picker-view-column>
			<picker-view-column>
				<view data-col="1" @touchend="bindTouchEnd" class="item flex-center" :class="{active: current[1] === index}" v-for="(item, index) in secondList" :key="index">{{ item.label }}</view>
			</picker-view-column>
		</picker-view>
	</view>
</template>

<script>
	import { TimeList } from './config.js';
	export default {
		props: {
			value: String,
			list: {
				type: Array,
				default: () => []
			}
		},
		data() {
			return {
				current: [0, 0],
				TimeList: TimeList.filter(el => el.value !== 24),
				secondList: TimeList.filter(el => el.value > 0),
				dataIndex: 0,
			}
		},
		computed: {
			valueArray: {
				get() {
					if (!this.value) return this.list.map(el => '');
					return this.value.split(',');
				},
				set(val) {
					this.$emit('input', val.toString());
				}
			}
		},
		methods: {
			bindChange(e) {
				const val = e.detail.value;
				this.current = val;
				this.secondList = TimeList.filter(el => el.value > TimeList[val[0]].value);
				// 每次改变都设立值
				this.valueArray[this.dataIndex] = TimeList[val[0]].text + '-' + this.secondList[val[1]].text;
				this.$emit('picker', this.valueArray.toString());
			},
			bindTouchEnd(e) {
				const { col } = e.target.dataset;
				const _current = this.current;
				if (col === '0') {
					this.current = [_current[0], 0];
				}
			},
			_click(index) {
				if (this.dataIndex === index) return;
				this.dataIndex = index;
				this.current = [0 , 0];
				let value = this.valueArray[index];
				if (!value) {
					this.secondList = TimeList.filter(el => el.value > 0);
					return;
				}
				let array = value.split('-');
				TimeList.forEach((el, index) => {
					if (el.text === array[0]) {
						this.current[0] = index;
						this.secondList = TimeList.filter(item => item.value > el.value);
					}
				});
				this.secondList.forEach((el, index) => {
					if (el.text === array[1]) {
						this.current[1] = index;
					}
				});
				// this.current = [0 , 0];
				// console.log(this.valueArray[index]);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.md-picker-aera-time {
		.picker-view {
			height: 325rpx;
		}
		.title-box {
			display: flex;
			align-items: center;
			.label {
				flex: 1;
				flex-direction: column;
				font-size: 30rpx;
				color: #999;
				line-height: 1;
				&.active {
					color: $themeColor;
				}
				.value {
					height: 30rpx;
					margin-top: 10rpx;
				}
			}
		}
		.item {
			&.active {
				color: $themeColor;
			}
		}
	}
</style>
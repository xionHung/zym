<template>
	<md-b-dialog :show.sync="visiable" :title="title" @confirm="confirm">
		<picker-view v-model="list" indicator-style="height: 65rpx;" @change="bindChange" class="picker-view">
			<picker-view-column>
				<view data-col="0" @touchend="bindTouchEnd" class="item flex-center" :class="{ active: list[0] === index }" v-for="(item, index) in years" :key="index">{{ item }}</view>
			</picker-view-column>
			<picker-view-column v-if="level > 1">
				<view data-col="1" @touchend="bindTouchEnd" class="item flex-center" :class="{ active: list[1] === index }" v-for="(item, index) in MONTH" :key="index">{{ item }}</view>
			</picker-view-column>
			<picker-view-column v-if="level > 2">
				<view data-col="2" @touchend="bindTouchEnd" class="item flex-center" :class="{ active: list[2] === index }" v-for="(item, index) in days" :key="index">{{ item }}</view>
			</picker-view-column>
			<picker-view-column v-if="level > 3">
				<view data-col="3" @touchend="bindTouchEnd" class="item flex-center" :class="{ active: list[3] === index }" v-for="(item, index) in HOURS" :key="index">{{ item }}</view>
			</picker-view-column>
			<picker-view-column v-if="level > 4">
				<view data-col="4" @touchend="bindTouchEnd" class="item flex-center" :class="{ active: list[4] === index }" v-for="(item, index) in TIME" :key="index">{{ item }}</view>
			</picker-view-column>
			<picker-view-column v-if="level > 5">
				<view data-col="5" @touchend="bindTouchEnd" class="item flex-center" :class="{ active: list[5] === index }" v-for="(item, index) in TIME" :key="index">{{ item }}</view>
			</picker-view-column>
		</picker-view>
	</md-b-dialog>
</template>

<script>
import { TIME, HOURS, MONTH, DAYS } from './config.js';
import { parseTime } from '@/utils/tools.js';
import moment from 'moment';
export default {
	props: {
		value: [Number, String],
		title: String,
		show: Boolean,
		level: {
			type: Number,
			default: () => 6
		},
		startYear: {
			type: Number,
			default: 2000
		},
		endYear: {
			type: Number,
			default: 2099
		},
		format: {
			type: String,
			default: '{y}-{m}-{d} {h}:{i}:{s}'
		},
		// 是否取消默认当前时间
		cancelCurrentTime: {
			type: Boolean,
			default: () => false
		},
		// 是否取消选择当前年之后的
		isYears: {
			type: Boolean,
			default: () => false
		}
	},
	data() {
		return {
			years: [],
			days: DAYS,
			TIME,
			HOURS,
			MONTH,
			list: [],
			pickerList: '',
			Index: 0
		};
	},
	computed: {
		visiable: {
			get() {
				return this.show;
			},
			set(val) {
				this.$emit('update:show', val);
			}
		}
	},
	created() {
		this.init(this.value);
	},
	methods: {
		// 初始化
		init(val) {
			let date_time = !this.cancelCurrentTime && !val? parseTime(Date.now(), '{y}-{m}-{d} {h}:{i}:{s}'): (val || this.startYear) + '-01-01 00:00:00';
			this.pickerList = date_time;
			// 不管啥值再次转时间戳
			let time_value = new Date(date_time).valueOf();
			let year = parseTime(time_value, '{y}');
			let month = parseTime(time_value, '{m}');
			let day = parseTime(time_value, '{d}');
			let hours = parseTime(time_value, '{h}');
			let min = parseTime(time_value, '{i}');
			let second = parseTime(time_value, '{s}');
			this.years = [];
			for (let i = this.isYears?this.startYear: year; i < this.endYear; i++) {
				this.years.push(String(i));
			}
			this.days = DAYS.filter((el, index) => index < moment(year + '-' + month, 'YYYY-MM').daysInMonth());
			let _list = [
				this.getIndex(this.years, year),
				this.getIndex(MONTH, month),
				this.getIndex(this.days, day),
				this.getIndex(HOURS, hours),
				this.getIndex(TIME, min),
				this.getIndex(TIME, second)
			];
			this.$nextTick(() => {
				this.list = _list.slice(0, this.level);
				this.setValue();
			});
		},
		// 传参返回下标
		getIndex(list, val) {
			let index = 0;
			list.forEach((el, j) => {
				if (el === val) index = j;
			});
			return index;
		},
		bindChange(e) {
			const val = e.detail.value;
			this.list = val;
			if (this.Index === 1) {
				let list = JSON.parse(JSON.stringify(this.list));
				list[2] = 0;
				let array = DAYS.filter((el, index) => index < moment(this.years[this.list[0]] + '-' + MONTH[this.list[1]], 'YYYY-MM').daysInMonth());
				this.$set(this, 'list', list);
				this.$set(this, 'days', array);
			}
			this.setValue();
		},
		setValue() {
			this.pickerList = '';
			if (this.level > 0) this.pickerList = this.years[this.list[0]];
			if (this.level > 1) this.pickerList += '-' + MONTH[this.list[1]];
			if (this.level > 2) this.pickerList += '-' + this.days[this.list[2]];
			if (this.level > 3) this.pickerList += ' ' + HOURS[this.list[3]];
			if (this.level > 4) this.pickerList += ':' + TIME[this.list[4]];
			if (this.level > 5) this.pickerList += ':' + TIME[this.list[5]];
		},
		bindTouchEnd(e) {
			const { col } = e.target.dataset;
			this.Index = Number(col);
		},
		confirm() {
			this.$emit('confirm', parseTime(this.pickerList, this.format));
			this.visiable = false;
		}
	}
};
</script>

<style lang="scss" scoped>
.picker-view {
	height: 325rpx;
	.item {
		&.active {
			color: $themeColor;
		}
	}
}
</style>

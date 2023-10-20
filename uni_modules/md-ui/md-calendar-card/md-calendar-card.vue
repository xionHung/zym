<template>
	<view class="md-calendar-card">
		<view class="calendar" :class="{active: index === calendarCureent}" v-for="(calendar, index) in calendares" :key="index" @click="calendarClick(index)">
			<view>{{ calendar.week }}</view>
			<view class="number">{{ calendar.day }}</view>
		</view>
	</view>
</template>

<script>
	import moment from 'moment';
	import { dayList } from "@/utils/fileds";
	export default {
		props: {
			value: String,
		},
		data() {
			return {
				calendares: [],
				calendarCureent: 0,
			}
		},
		// mounted() {
		// 	this.getWeeks();
		// },
		methods: {
			// 获取今天到往后七天
			getWeeks(val) {
				this.calendares = [];
				let time = val.indexOf('-') > 1? val: Number(val);
				let current = moment().format('YYYY-MM-DD');
				for(let i = 0; i < 7; i++) {
					
					let week = current === moment(time).add(i, 'days').format('YYYY-MM-DD')? '今天': dayList[new Date(moment(time).add(i, 'days').format('YYYY-MM-DD')).getDay()];
					this.calendares.push({
						day: moment(time).add(i, 'days').format('DD'),
						week,
						value: new Date(moment(time).add(i, 'days').format('YYYY-MM-DD')).valueOf(),
					})
				}
				// this.reSet();
			},
			calendarClick(idx) {
				if (this.calendarCureent === idx) return;
				this.calendarCureent = idx;
				this.reSet();
			},
			reSet() {
				this.$emit('change', this.calendares[this.calendarCureent].value);
			}
		},
		watch: {
			value: {
				handler(val) {
					if (!val) return;
					this.getWeeks(val);
				},
				immediate: true,
			}
		}
	}
</script>

<style lang="scss" scoped >
	.md-calendar-card {
		background-color: #fff;
		padding: 30rpx 20rpx;
		border-radius: 20rpx;
		display: flex;
		justify-content: space-between;
		.calendar {
			width: 80rpx;
			flex: none;
			height: 100rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			color: #555;
			font-size: 22rpx;
			background: #F5F5F5;
			border-radius: 10rpx;
			overflow: hidden;
			.number {
				color: #222222;
				font-size: 34rpx;
			}
			&.active {
				color: #FE6A1C;
				background-color: #FBE5DA;
				position: relative;
				.number {
					color: #FE6A1C;
				}
				&::before {
					content: '';
					position: absolute;
					width: 60rpx;
					height: 40rpx;
					left: -30rpx;
					top: -20rpx;
					background-color: #FE6A1C;
					transform: rotateZ(-45deg);
				}
			}
		}
	}
</style>
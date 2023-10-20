<template>
	<view class="md-from-item" :class="{border: !border}">
		<view class="label" v-if="label">
			<text>{{ label }}</text>
			<text class="requried" v-if="required">{{ '*' }}</text>
		</view>
			<view v-if="isCheck" class="check-box" @click="_click">
				<slot>
					<view class="input-place" v-if="!textValue">{{ placeholder || '请选择' + label }}</view>
					<view class="value-box" v-else>{{ textValue }}</view>
				</slot>
				<text class="icon icon-right" />
			</view>
			
			<input v-else class="input" :style="inputStyle" :disabled="readOnly" v-model="textValue" :type="type" :placeholder="placeholder || '请输入' + label" placeholder-class="input-place">
		<view class="remark" v-if="remark">{{ remark }}</view>
		<md-b-dialog :show.sync="show" :title="label" @confirm="handleConfirm">
			<md-picker-area  @picker="handleArea" v-if="checkType === 'area_name'" :level="areaLevel" />
			<md-picker-aera-time v-model="textValue" :list="areaTimeLabel"  v-if="checkType === 'area_time'" @picker="handleArea" />
		</md-b-dialog>
	</view>
</template>

<script>
	export default {
		props: {
			value: String,
			label: {
				type: String,
				default: () => '',
			},
			remark: String,
			required: Boolean,
			border: {
				type: Boolean,
				default: () => false,
			},
			placeholder: {
				type: String,
				default: () => ''
			},
			type: {
				type: String,
				default: () => 'text'
			},
			isCheck: Boolean,
			checkType: String,
			areaLevel: {
				type: Number,
				default: () => 2,
			},
			areaTimeLabel: {
				type: Array,
				default: () => {
					return ['工作日'];
				}
			},
			readOnly:{
				type:Boolean,
				default:false
			},
			inputStyle:{
				type:String,
				default:""
			}
		},
		data() {
			return {
				show: false,
				checkValue: null,
			}
		},
		computed: {
			textValue: {
				get() {
					return this.value;
				},
				set(val) {
					this.$emit('input', val);
				},
			}
		},
		methods: {
			_click() {
				return;
				// this.show = true;
			},
			handleConfirm() {
				// 是否可以关闭
				switch (this.checkType) {
					case 'area_name':
					let value = '';
					this.checkValue.forEach(el => {
						value += el.label;
					})
					this.textValue = value;
					this.show = false;
					break;
					case 'area_time':
					if (this.checkValue && this.checkValue && this.checkValue.split(',').length === this.areaTimeLabel.length) {
						this.textValue = this.checkValue;
						this.show = false;
					}
					break;
				}
				this.$emit('confirm', this.checkValue);
			},
			handleArea(val) {
				this.checkValue = val;
			},
		}
	}
</script>

<style lang="scss" scoped>
	.md-from-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx 0;
		position: relative;
		&.border {
			border-bottom: 1rpx solid $border-color;
		}
		.label {
			color: #333;
			.requried {
				color: $themeColor;
				margin-left: 10rpx;
			}
		}
		.input {
			color: #333;
			font-size: 26rpx;
			border: 0;
			outline: none;
			text-align: right;
			flex: 1;
		}
		.input-place {
			color: #999;
			font-size: 26rpx;
			// font-weight: bold;
		}
		.remark {
			position: absolute;
			bottom: -22rpx;
			left: 0;
			color: #999;
			font-size: 18rpx;
			line-height: 1;
		}
		.check-box {
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: flex-end;
			.icon-right {
				font-size: 30rpx;
				color: #999;
			}
		}
	}
</style>
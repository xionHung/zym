<template>
	<view class="md-checkable-tag">
		<md-tag
			v-for="(item, index) in tags"
			:key="index"
			:color="tagColor"
			@check="(checked) => handleCheck(checked, item)"
			:checked="checkedList.map(Number).includes(item[config.value])"
		>
			{{ item[config.label] }}
		</md-tag>
	</view>
</template>

<script>
export default {
	props: {
		tagColor: {
			type: String,
			default: '#ff8a32'
		},
		tags: {
			type: Array,
			default: () => []
		},
		config: {
			type: Object,
			default: () => ({ label: 'label', value: 'value' })
		},
		checkedList: {
			type: Array,
			default: []
		}
	},
	data() {
		return {
			list: [],
			count: 0
		};
	},
	created() {
		this.count = 0;
	},
	methods: {
		handleCheck(checked, tagObj) {
			// count做一个初始化的标记
			// 当前的操作只有count为0的时候才执行
			if (this.count == 0) {
				this.list = this.tags.filter((item) => this.checkedList.map(Number).includes(item.id));
			}
			this.count += 1;
			// 选中添加
			if (checked) {
				this.list.push(tagObj);
			} else {
				// 取消剔除
				this.list = this.list.filter((item) => item[this.config.value] !== tagObj[this.config.value]);
			}
			this.$emit('input', this.list.map(item => item.id));
		}
	}
};
</script>

<style scoped lang="scss">
.md-checkable-tag {
	display: flex;
	flex-wrap: wrap;
	md-tag {
		margin-right: 20rpx;
		margin-bottom: 20rpx;
	}
}
</style>

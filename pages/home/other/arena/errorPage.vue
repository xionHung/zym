<template>
	<PageComp title="球馆报错" navStyle="background: #fff" :isApplique="false" isFooterbtn btnText="提交" @confirm="confirm">
		<view class="card">
			<md-radio v-model="form.radio" :list="list" :mode="2" />
		</view>
		<view class="card">
			<md-title title="报错详情" />
			<view class="mb-20"></view>
			<md-textarea v-model="form.content" placeholder="请输入相关正确信息，限300字。" :maxlength="300" />
		</view>
	</PageComp>
</template>

<script>
	export default {
		data() {
			return {
				form: {
					radio: '1',
					content: '',
				},
				list: [
					{ label: '信息有误', value: '1'},
					{ label: '暂停营业', value: '2'},
					{ label: '不存在', value: '3'},
					{ label: '其他', value: '4'},
				],
				id: null,
			}
		},
		onLoad(options) {
			this.id = options.id;
		},
		methods: {
			async confirm() {
				if (this.loading) return;
				const {radio, content} = this.form;
				if (!content) return this.$toast('请输入报错详情');
				let parmas = {
					title: this.list.find(el => el.value === radio).label,
					content,
					room_id: this.id,
				};
				await this.$api.Room.report(parmas);
				await this.$toast('提交成功');
				uni.navigateBack();
			}
		}
	}
</script>

<style lang="scss" scoped>
	.card {
		margin: 30rpx;
		padding: 30rpx;
	}
</style>
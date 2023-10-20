<template>
	<view class="mt-20">
		<mescroll-uni :fixed="false" ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback">
			<view class="wrapper br-10 pb-20 pl-44 pr-44 bg-white wp-100" v-for="(item, index) in list" :key="item.uid">
				<view class="flex wp-100 pt-20">
					<!-- 头像 -->
					<md-avatar width="55" class="mr-8" :src="item.headpic" :sex="item.sex" @click="handlePerson(item.uid)"></md-avatar>
					<view class="flex flex-between wp-100">
						<view class="flex1 flex flex-col flex-top">
							<view class="flex flex-between wp-100">
								<text class="fs-20 mb-4">{{ item.nickname }}</text>
							</view>
							<view class="flex flex-between fs-14 wp-100">
								<view class="flex">
									<text class="level mr-8">{{ item.level }}</text>
									<text class="position mr-8" v-for="(label, index) in item.label" :key="index">{{ label }}</text>
								</view>
							</view>
						</view>
						<!-- <view class="w-15">150m</view> -->
					</view>
				</view>
			</view>
		</mescroll-uni>
	</view>
</template>

<script>
import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
export default {
	mixins: [MescrollMixin],
	data() {
		return {
			area_name: '',
			list: []
		};
	},
	methods: {
		handlePerson(id) {
			uni.navigateTo({
				url: '/pages/mine/person/person?user_id=' + id
			});
		},
		async upCallback(page) {
			let pageNum = page.num; // 页码, 默认从1开始
			let limit = page.size; // 页长, 默认每页10条
			try {
				let params = {
					pageNum,
					limit,
					area_name: this.area_name
				};
				const { data } = await this.$api.UserCircle.near(params);
				if (!data) return this.mescroll.endErr();
				let curPageData = data.data || [];
				let curPageLen = curPageData.length;
				let totalSize = data.total;
				if (page.num == 1) this.list = [];
				this.list = this.list.concat(curPageData);
				this.mescroll.endBySize(curPageLen, totalSize);
			} catch (err) {
				console.log(err);
			}
		}
	},
	onLoad(options) {
		const { area_name } = options;
		this.area_name = area_name;
	}
};
</script>

<style scoped lang="scss">
@import '../../index.scss';
</style>

<template>
	<view class="container">
		<view class="list">
			<mescroll-uni :fixed="false" ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback">
				<view class="list-item flex br-10 bg-white pa-20 mb-10" v-for="item in list" :key="item.id">
					<!-- 头像 -->
					<md-avatar width="55" class="mr-8" :src="item.headpic" :sex="item.sex" @click="handleItemJump('/pages/mine/person/person?user_id=' + item.uid)"></md-avatar>
					<view class="flex flex-col flex-top flex-between">
						<text class="fs-20 mb-4">{{ item.nickname }}</text>
						<view class="flex">
							<text class="level mr-8">{{ item.level }}</text>
							<text class="position mr-8" v-for="(label, index) in item.label" :key="index">{{ label }}</text>
							<text class="position mr-8" v-show="item.label.length > 0">{{ item.label[0] }}</text>
						</view>
					</view>
				</view>
			</mescroll-uni>
		</view>
	</view>
</template>

<script>
import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
export default {
	mixins: [MescrollMixin],
	data() {
		return {
			list: []
		};
	},
	computed: {
		address() {
			return this.$store.state.address;
		}
	},
	methods: {
		// 游侠列表
		async upCallback(page) {
			let pageNum = page.num; // 页码, 默认从1开始
			let limit = 20; // 页长
			try {
				let params = {
					pageNum,
					limit,
					area_name: this.address.cityName || undefined
				};
				const { data } = await this.$api.UserCircle.lists(params);
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
		},
		handleItemJump(url) {
			uni.navigateTo({ url });
		}
	}
};
</script>

<style>
page {
	overflow: hidden;
}
</style>
<style lang="scss" scoped>
@import '../../index.scss';
.container {
	padding: 24rpx;
	height: 100vh;
	overflow-y: scroll;
	.list {
		height: 100%;
	}
}
</style>

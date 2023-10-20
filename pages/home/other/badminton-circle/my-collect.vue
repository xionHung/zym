<template>
	<view class="container">
		<mescroll-uni :fixed="false" ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback">
			<view class="pl-20 pr-20 pt-30" v-for="item in list" :key="item.id">
				<view class="content">
					<view class="item-top flex flex-between br-10">
						<view class="flex1 flex">
							<!-- 头像 -->
							<md-avatar :src="item.headpic" :sex="item.sex" width="55" @click="handleItemJump('/pages/mine/person/person?user_id=' + item.uid)" />
							<view class="flex1 flex flex-col flex-top ml-8">
								<view class="flex flex-between wp-100">
									<text class="fs-20 mb-4">{{ item.nickname }}</text>
									<!-- 更多按钮 -->
									<MorePop :info="item" :showList="['取消收藏', '投诉']" />
								</view>
								<view class="flex flex-between fs-14 wp-100">
									<view class="flex">
										<text class="level mr-8">{{ item.level }}</text>
										<text class="position mr-8" v-for="(label, index) in item.label" :key="index">{{ label }}</text>
									</view>
									<view class="ip">IP: {{ item.ip_name }}</view>
								</view>
							</view>
						</view>
					</view>
					<view @click="handleItemJump('/pages/mine/person/share-details?id=' + item.id)">
						<view class="fs-23 text-black mt-12 mb-18">{{ item.title }}</view>
						<!-- 图片 -->
						<view class="flex flex-between" v-if="item.image.length >= 1">
							<view class="flex1 br-10 h-52 mr-10">
								<image class="wp-100 hp-100" :src="item.image[0]" mode="aspectFill"></image>
							</view>
							<view class="flex flex-col h-52" v-if="item.image.length > 1">
								<view class="br-10 mb-10 w-25 h-25" v-for="(img, i) in item.image" :key="i" v-if="i > 0 && i < 3">
									<image class="wp-100 hp-100" :src="img" mode="aspectFill"></image>
								</view>
							</view>
						</view>
						<view class="flex flex-between mt-10 fs-24">
							<view class="flex">
								<view class="flex mr-10">
									<text class="icon-heart mr-8"></text>
									{{ item.like_num }}
								</view>
								<view class="flex mr-10">
									<text class="iconfont icon-message mr-8 fs-34"></text>
									{{ item.comment_num }}
								</view>
								<view class="flex mr-10">
									<text class="iconfont icon-fenxiang mr-8 fs-30"></text>
									{{ item.send_num }}
								</view>
							</view>
							<view>{{ item.addtime }}</view>
						</view>
					</view>
				</view>
			</view>
		</mescroll-uni>
	</view>
</template>

<script>
import MorePop from '@/pages/components/MorePop.vue';
import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
export default {
	mixins: [MescrollMixin],
	components: {
		MorePop
	},
	data() {
		return {
			list: []
		};
	},
	methods: {
		// 跳转页面
		handleItemJump(url) {
			uni.navigateTo({
				url
			});
		},
		async upCallback(page) {
			let pageNum = page.num; // 页码, 默认从1开始
			let limit = page.size; // 页长, 默认每页10条
			try {
				let params = {
					pageNum,
					limit
				};
				const { data } = await this.$api.UserCircle.collect(params);
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
	onLoad() {
		uni.$on('refresh', () => {
			this.mescroll.resetUpScroll();
		});
	},
	onUnload() {
		uni.$off('refresh');
	}
};
</script>

<style scoped>
@import '/pages/home/index.scss';
</style>

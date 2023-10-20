<template>
	<view class="container">
		<mescroll-uni :fixed="false" ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback">
			<view class="pl-20 pr-20 pt-30" v-for="(item, index) in listData" :key="item.id">
				<view class="content">
					<view class="item-top flex flex-between br-10">
						<view class="flex1 flex" @click="handleItemJump('/pages/mine/person/person?user_id=' + item.uid)">
							<!-- 头像 -->
							<md-avatar :src="item.headpic" :sex="item.sex" class="mr-8" width="55"></md-avatar>
							<view class="flex1 flex flex-col flex-top">
								<view class="flex flex-between wp-100">
									<text class="fs-20 mb-4">{{ item.nickname }}</text>
									<!-- 更多按钮 -->
									<MorePop :info="item" :showList="['删除', '转换为粉丝可见', '转换为自己可见']" />
								</view>
								<view class="flex flex-between fs-14 wp-100">
									<view class="flex">
										<text class="level mr-4">{{ item.level }}</text>
										<text class="position mr-4" v-for="(label, i) in item.label" :key="i">{{ label }}</text>
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
							<view class="flex flex-col" v-if="item.image.length > 1">
								<view class="br-10 mb-10 w-25 h-25" v-for="(img, index) in item.image" :key="index" v-if="index > 0 && index < 3">
									<image class="wp-100 hp-100" :src="img" mode="aspectFill"></image>
								</view>
							</view>
						</view>
						<view class="flex flex-between mt-10 fs-24">
							<!-- 底部操作栏 -->
							<view class="flex">
								<view class="flex mr-10">
									<text class="icon-heart mr-8"></text>
									{{ item.like_num }}
								</view>
								<view class="flex mr-10">
									<text class="iconfont icon-message mr-8 fs-34"></text>
									{{ item.comment_num || 0 }}
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
		<!-- 发布 -->
		<view class="fabu flex flex-col flex-center" @click="handleItemJump('/pages/mine/person/share-send?card_id=' + card_id)">
			<text class="iconfont icon-zhifeiji fs-40"></text>
			发布
		</view>
	</view>
</template>

<script>
import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
import MorePop from '@/pages/components/MorePop.vue';
export default {
	mixins: [MescrollMixin],
	components: {
		MorePop
	},
	data() {
		return {
			user_id: null,
			card_id: null,
			listData: [],
			total: 0
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
				let { data } = await this.getList({
					pageNum,
					limit,
					user_id: this.user_id,
					club_id: this.card_id
				});
				if (!data) return this.mescroll.endErr();
				console.log(data);
				let curPageData = data.data || [];
				let curPageLen = curPageData.length;
				let totalSize = data.total;
				if (page.num == 1) this.listData = [];
				this.listData = this.listData.concat(curPageData);
				this.mescroll.endBySize(curPageLen, totalSize);
			} catch (err) {
				console.log(err);
			}
		},
		/**
		 * 接口相关
		 */
		// 获取个人帖子列表
		async getList(params) {
			try {
				let url = this.card_id ? 'club' : 'user';
				const res = await this.$api.UserNotice[url](params);
				return res;
			} catch (e) {
				//TODO handle the exception
			}
			return {};
		},
		// 收藏
		async handleCollect(circle_id) {
			try {
				await this.$api.UserCircle.clickCollect({ circle_id });
				this.$toast('收藏成功');
			} catch (e) {
				//TODO handle the exception
			}
		}
	},
	onLoad(options) {
		const { user_id, card_id } = options;
		this.user_id = user_id;
		this.card_id = card_id;
		// 上一个页面返回刷新当前列表
		uni.$on('refresh', () => {
			this.mescroll.resetUpScroll();
		});
	},
	onUnload() {
		uni.$off('refresh');
	}
};
</script>

<style>
@import '/pages/home/index.scss';
</style>

<style scoped lang="scss">
.container {
	height: 100vh;
	.fabu {
		position: fixed;
		bottom: 37rpx;
		right: 32rpx;
		width: 110rpx;
		height: 110rpx;
		background: #fe6a1c;
		border-radius: 50%;
		color: white;
		font-size: 22rpx;
	}
}
</style>

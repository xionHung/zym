<template>
	<view class="container bg-white mt-20">
		<view class="honor pa-20 pt-30 pb-30 flex flex-col">
			<!-- title -->
			<view class="flex wp-100">
				<view class="text-black flex fw-bold ml-52">
					<text>个人荣誉/证书</text>
					<text class="iconfont icon-diyi fw-bold ml-8"></text>
				</view>
			</view>
			<!-- content -->
			<view class="wp-100 hp-100 flex flex-col flex-between">
				<mescroll-uni :fixed="false" ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback">
					<view class="honor-item flex flex-between" v-for="item in list" :key="item.id">
						<!-- 更多按钮 -->
						<MorePop class="morePop" :info="item" :showList="['删除']" type="honor" />
						<view class="pt-20 pb-20 flex flex-top mr-8 flex1">
							<view class="honor-icon mt-12">
								<image class="wp-100 hp-100" :src="IMGURL + 'img/jiangzhang.png'"></image>
							</view>
							<view class="flex1 msg ml-8">{{ item.title }}</view>
						</view>
						<view class="img" @click="handlePreview(item.img)">
							<image class="wp-100 hp-100" mode="widthFix" :src="item.img"></image>
						</view>
					</view>
				</mescroll-uni>
			</view>
		</view>
		<view class="flex flex-center mt-30">
			<md-button class="add-btn" @click="handleAdd">+ 添加荣誉</md-button>
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
			list: []
		};
	},
	methods: {
		handleAdd() {
			uni.navigateTo({
				url: '/pages/mine/person/honor-add'
			});
		},
		// 图片预览
		handlePreview(url) {
			uni.previewImage({
				urls: [url]
			});
		},
		async upCallback(page) {
			let pageNum = page.num; // 页码, 默认从1开始
			let limit = page.size; // 页长, 默认每页10条
			try {
				let params = {
					pageNum,
					limit,
					user_id: this.user_id
				};
				const { data } = await this.$api.UserDetail.personalHonor(params);
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
		const { user_id } = options;
		this.user_id = user_id;
		uni.$on('refresh', () => {
			this.mescroll.resetUpScroll();
		});
	},
  onUnload() {
    uni.$off('refresh');
  }
};
</script>

<style scoped lang="scss">
.container {
	height: calc(100vh - 20rpx);
}
.honor {
	width: 100%;
	&-item {
		width: 750rpx;
		padding: 14rpx 63rpx 14rpx 83rpx;
		position: relative;
		&:not(:last-of-type) {
			border-bottom: 1rpx solid $border-color;
		}
		.morePop {
			position: absolute;
			right: 20rpx;
			top: 10rpx;
		}
	}
	.title {
		width: 184rpx;
		height: 23rpx;
		font-size: 30rpx;
		font-family: YouSheBiaoTiHei;
		font-weight: 400;
	}
	.honor-icon {
		height: 43rpx;
		width: 33rpx;
	}
	.msg {
		line-height: 42rpx;
	}
	.img {
		width: 190rpx;
		height: 110rpx;
		border-radius: 20rpx;
		overflow: hidden;
	}
}
.add-btn {
	/deep/ .md-btn {
		width: 380rpx;
		height: 70rpx;
		background: #f7f7f7;
		border-radius: 20rpx;
		color: #333;
	}
}
</style>

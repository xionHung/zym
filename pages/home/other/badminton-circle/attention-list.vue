<template>
	<view class="container">
		<md-search placeholder="搜索用户名称" @search="handleSearch" />
		<view class="content pl-45 pr-45">
			<view class="fs-30 mb-6">{{ title ? title : '我的关注' }}({{ total }})</view>
			<view class="list">
				<mescroll-uni :fixed="false" ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback">
					<view class="row flex pt-14 pb-14 border-bottom" v-for="item in listData" :key="item.uid">
						<md-avatar :src="item.headpic" :sex="item.sex" @click="handleItemJump('/pages/mine/person/person?user_id=' + item.uid)" />
						<view class="content flex1 ml-16">
							<view class="title fs-21 mb-8">{{ item.nickname }}</view>
							<view class="tag flex">
								<view class="level mr-8">{{ item.level }}</view>
								<view class="position mr-8" v-for="label in item.label" :key="label">{{ label }}</view>
							</view>
						</view>
						<button class="primary-btn btn" v-if="title" @click="() => handleFollow(item.uid)">回关</button>
						<button style="background: #bdbdbd" class="primary-btn btn" v-else @click="() => handleDelFollow(item.uid)">已关注</button>
					</view>
				</mescroll-uni>
			</view>
		</view>
	</view>
</template>

<script>
import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
import _ from 'loadsh';
export default {
	mixins: [MescrollMixin],
	data() {
		return {
			title: '',
			nickname: undefined,
			listData: [],
			total: 0,
			uid: null,
		};
	},
	onLoad(options) {
		const { title, uid } = options;
		this.title = title;
		this.uid = uid;
		// 粉丝页面
		if (title) {
			uni.setNavigationBarTitle({ title });
		}
	},
	methods: {
		handleSearch: _.debounce(function (nickname) {
			this.nickname = nickname;
			this.mescroll.resetUpScroll();
		}, 500),
		// 取消关注
		handleDelFollow(user_id) {
			uni.showModal({
				content: '是否取消关注？',
				success: (res) => {
					if (res.confirm) {
						this.cancelFollow(user_id);
					}
				}
			});
		},
		async upCallback(page) {
			let pageNum = page.num; // 页码, 默认从1开始
			let limit = page.size; // 页长, 默认每页10条
			try {
				let res;
				let params = {
					pageNum,
					limit,
					nickname: this.nickname,
					uid: this.uid,
				};
				if (this.title) {
					res = await this.getFansList(params);
				} else {
					res = await this.getFollowList(params);
				}
				if (!res.data) return this.mescroll.endErr();
				let curPageData = res.data.data || [];
				let curPageLen = curPageData.length;
				let totalSize = res.data.total;
				this.total = totalSize;
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
		// 我的关注列表
		async getFollowList(params) {
			try {
				const res = await this.$api.UserFans.follow(params);
				return res;
			} catch (e) {
				//TODO handle the exception
			}
			return {};
		},
		// 我的粉丝列表
		async getFansList(params) {
			try {
				const res = await this.$api.UserFans.index(params);
				return res;
			} catch (e) {
				//TODO handle the exception
			}
			return {};
		},
		// 关注
		async handleFollow(user_id) {
			try {
				await this.$api.UserFans.add({ user_id });
				this.mescroll.resetUpScroll();
			} catch (e) {
				//TODO handle the exception
			}
		},
		// 取消关注
		async cancelFollow(user_id) {
			try {
				await this.$api.UserFans.delete({ user_id });
				this.mescroll.resetUpScroll();
			} catch (e) {
				//TODO handle the exception
			}
		},
		handleItemJump(url) {
			if (!url) return;
			uni.navigateTo({ url });
		}
	}
};
</script>

<style scoped lang="scss">
@import '../../index.scss';
.container {
	.primary-btn {
		&.btn {
			font-size: 24rpx;
			border-radius: 10rpx;
			font-weight: bold;
		}
	}
}
</style>

<template>
	<view class="container">
		<view class="share mt-20 pa-20 pt-30 pb-30">
			<view class="flex1 flex">
				<!-- 头像 -->
				<md-avatar
					:src="info.circle[0].headpic"
					:sex="info.circle[0].sex"
					class="mr-8"
					width="55"
					@click="handleUrl('/pages/mine/person/person?user_id=' + info.circle[0].uid)"
				></md-avatar>
				<view class="flex1 flex flex-col flex-top">
					<view class="flex flex-between wp-100">
						<text class="fs-20 mb-4">{{ info.circle[0].nickname }}</text>
						<!-- 更多按钮 -->
						<MorePop :info="info.circle[0]" :showList="userinfo.id == info.circle[0].uid ? ['删除'] : ['收藏', '投诉']" />
					</view>
					<view class="flex flex-between fs-14 wp-100">
						<view class="flex">
							<text class="level mr-8">{{ info.circle[0].level }}</text>
							<text class="position mr-8" v-for="(item, index) in info.circle[0].label" :key="item">{{ item }}</text>
						</view>
						<view class="ip">IP: {{ info.circle[0].ip_name }}</view>
					</view>
				</view>
			</view>
			<view class="fs-23 text-black mt-12 mb-18">{{ info.circle[0].title }}</view>
			<view class="wrapper">
				<!-- 图片 -->
				<view class="flex images">
					<view v-for="item in info.circle[0].image" :key="item" class="br-20 w-25 h-25" @click="handlePreview(info.circle[0].image, item)">
						<image :src="item" mode="aspectFill" class="wp-100 hp-100"></image>
					</view>
				</view>
				<!-- 操作栏 -->
				<view class="flex flex-between mt-10 fs-24">
					<view class="flex">
						<view class="flex mr-10" @click="handleAction('like')">
							<text class="icon-heart mr-8"></text>
							{{ info.circle[0].like_num }}
						</view>
						<view class="flex mr-10" @click="handleAction('comment', item, 1)">
							<text class="iconfont icon-message mr-8 fs-34"></text>
							{{ info.circle[0].comment_num || 0 }}
						</view>
						<view class="flex mr-10" @click="handleAction('send')">
							<text class="iconfont icon-fenxiang mr-8 fs-30"></text>
							{{ info.circle[0].send_num }}
						</view>
					</view>
					<view class="text-gray fs-23">{{ info.circle[0].addtime }}</view>
				</view>
				<!-- 留言板 -->
				<view class="chat-list card pa-20 mt-37" v-if="(info.comment || 0).length > 0">
					<view class="chat-item flex flex-top fs-22 pt-12 pb-12" v-for="item in info.comment" :key="item.id" @click="handleAction('comment', item, 0)">
						<md-avatar :src="item.headpic"></md-avatar>
						<view class="flex1 flex flex-col flex-top ml-10">
							<!-- 名字 -->
							<view class="wp-100 flex flex-between mb-10">
								<text class="name primary-color">{{ item.nickname }}</text>
								<text class="time text-gray fs-16">{{ item.addtime }}</text>
							</view>
							<view class="msg fs-18" v-if="item.pid > 0">
								回复
								<text class="primary-color fs-22">{{ item.pid_nickname }}</text>
								<text>：</text>
								{{ item.content }}
							</view>
							<view class="msg fs-18" v-else>{{ item.content }}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="comment_container" v-show="showCommentInput">
			<input v-model="content" type="text" confirm-type="send" class="comment_input" placeholder="评论" @blur="blurComment" @confirm="clickComment" />
		</view>
	</view>
</template>

<script>
import MorePop from '@/pages/components/MorePop.vue';
export default {
	components: { MorePop },
	data() {
		return {
			id: null,
			images: 9,
			pages: { limit: 10, pageNum: 1 },
			info: {},
			showCommentInput: false,
			pid: undefined,
			content: ''
		};
	},
	computed: {
		userinfo() {
			return this.$store.state.userInfo;
		}
	},
	methods: {
		handleUrl(url) {
			if (!url) return;
			uni.navigateTo({
				url
			});
		},
		// 图片预览
		handlePreview(urls, current) {
			uni.previewImage({
				urls,
				current
			});
		},
		handleAction(type, item, isFirst) {
			// 点赞
			if (type === 'like') {
				this.clickLike();
			}
			// 评论
			else if (type === 'comment') {
				if (isFirst || this.userinfo.id !== item.uid) {
					if (Object.keys(item || {}).length > 0) {
						this.pid = item.id;
					}
					this.showCommentInput = true;
				} else {
					// 点击自己 则询问是否删除评论
					uni.showModal({
						content: '是否删除该条评论？',
						success: (res) => {
							if (res.confirm) {
								this.deleteComment(item.id);
							}
						}
					});
				}
			}
			// 转发帖子
			else {
				this.clickShare();
			}
		},
		// 评论框失去焦点回调
		blurComment() {
			this.showCommentInput = false;
		},
		/**
		 * 接口相关
		 */
		async getDetailInfo(circle_id) {
			try {
				const res = await this.$api.UserCircle.info({ circle_id, ...this.pages });
				this.info = res.data;
			} catch (e) {
				//TODO handle the exception
			}
		},
		// 点赞
		async clickLike() {
			try {
				await this.$api.UserCircle.clickLike({ circle_id: this.id });
				this.$toast('点赞成功');
				this.getDetailInfo(this.id);
			} catch (e) {
				console.log(e);
				//TODO handle the exception
			}
		},
		// 转发帖子
		async clickShare() {
			try {
				await this.$api.UserCircle.forward({ circle_id: this.id });
				this.$toast('转发成功');
				this.getDetailInfo(this.id);
			} catch (e) {
				//TODO handle the exception
			}
		},
		// 发送评论
		async clickComment() {
			const { id, pid, content } = this;
			try {
				await this.$api.UserCircle.comment({ circle_id: id, content, pid });
				this.content = '';
				this.showCommentInput = false;
				this.$toast('发送成功');
				this.getDetailInfo(id);
			} catch (e) {
				//TODO handle the exception
			}
		},
		// 删除评论
		async deleteComment(comment_id) {
			try {
				await this.$api.UserCircle.deleteComment({ comment_id });
				this.getDetailInfo(this.id);
			} catch (e) {
				//TODO handle the exception
			}
		}
	},
	onLoad(options) {
		const { id } = options;
		this.id = id;
		this.getDetailInfo(id);

		uni.$on('refresh', () => {
			uni.navigateBack();
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
.share {
	.wrapper {
		padding-left: 100rpx;
		padding-right: 83rpx;
	}
	.images {
		width: 484rpx;
		margin-left: 25rpx;
		margin-right: 58rpx;
		display: flex;
		flex-wrap: wrap;

		& > view {
			&:not(:nth-of-type(3n)) {
				margin-right: 32rpx;
			}
			overflow: hidden;
			margin-bottom: 14rpx;
		}
	}

	.icon-more {
		position: relative;
		.tooltip {
			position: absolute;
			left: -30rpx;
			width: 54rpx;
			height: 94rpx;
			background: #ffffff;
			box-shadow: 1rpx 1rpx 9rpx 0rpx rgba(102, 102, 102, 0.27);
			border-radius: 10rpx;
			.btn {
				line-height: 47rpx;
			}
		}
	}

	.chat-list {
		.chat-item {
			&:not(:last-of-type) {
				border-bottom: 1rpx solid #e7e7e7;
			}
		}
	}
}

.comment_container {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	padding-bottom: env(safe-area-inset-bottom);
	background: white;
	box-shadow: 0rpx 5rpx 27rpx 0rpx rgba(254, 162, 113, 0.25);
	z-index: 10;

	.comment_input {
		height: 80rpx;
		background: #f3f3f3;
		border-radius: 20rpx;
		margin: 30rpx;
		padding: 0 30rpx;
	}
}
</style>

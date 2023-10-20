<template>
	<view>
		<CustomPage :title="info.nickname" bgHeight="0px" :hasImage="false">
			<template #content>
				<text style="display: block" class="text-white text-center fs-20" decode>{{ info.level }}&nbsp;&nbsp;{{ info.label.join(' ') }}</text>
				<!-- 内容区域 -->
				<view class="content mt-20 pl-30 pr-30">
					<view class="chatList">
						<mescroll-uni :fixed="false" ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback">
							<view v-for="(item, index) in list" :key="item.id" class="chatWrap mt-16 mb-16">
								<!-- 时间 -->
								<view class="text-center text-gray fs-18 mb-8">{{ item.addtime }}</view>
								<!-- 聊天内容 -->
								<view
									:class="{
										chatItem: 'chatItem',
										flex: 'flex',
										'flex-top': 'flex-top',
										'flex-rowReverse': info.uid != item.uid
									}"
								>
									<!-- info.uid 聊天的对方uid -->
									<!-- item.uid 聊天的用户id（对方或者自己） -->
									<md-avatar :src="item.headpic" @click="handlePerson(item)" />
									<view
										:class="{
											chatMsg: 'chatMsg',
											'mr-8': info.uid != item.uid,
											'ml-8': info.uid == item.uid
										}"
									>
										{{ item.content }}
									</view>
								</view>
							</view>
						</mescroll-uni>
					</view>
				</view>
			</template>
		</CustomPage>
		<view class="chatinput-container">
			<input type="text" confirm-type="send" class="chat_input" placeholder="请输入" @blur="blurComment" @confirm="confirmComment" v-model="content" />
		</view>
		<image class="cont-bg" :src="IMGURL + 'img/home/bg-banner.png'"></image>
	</view>
</template>

<script>
import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
export default {
	mixins: [MescrollMixin],
	data() {
		return {
			info: {
				label: []
			},
			list: [],
			content: ''
		};
	},
	methods: {
		// 评论框失去焦点回调
		blurComment() {
			this.content = '';
		},
		// 发送评论
		confirmComment(e) {
			const { value } = e.detail;
			this.sendMsg(value);
		},
		async upCallback(page) {
			let pageNum = page.num; // 页码, 默认从1开始
			let limit = page.size; // 页长, 默认每页10条
			try {
				let params = {
					pageNum,
					limit,
					id: this.info.id
				};
				const { data } = await this.getList(params);
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
		// 查看个人详情
		handlePerson(item) {
			uni.navigateTo({
				url: '/pages/mine/person/person?user_id=' + item.uid
			});
		},
		/**
		 * 接口相关
		 */
		async getList(params) {
			try {
				const res = await this.$api.UserCircle.chat(params);
				return res;
			} catch (e) {
				//TODO handle the exception
			}
			return {};
		},
		async sendMsg(content) {
			try {
				await this.$api.UserCircle.sendMsg({ uid: this.info.uid, content });
				this.mescroll.resetUpScroll();
			} catch (e) {
				//TODO handle the exception
			}
		}
	},
	onLoad(options) {
		const { info } = options;
		const item = JSON.parse(info);
		this.info = item;
	}
};
</script>

<style scoped lang="scss">
/deep/ .custom-page {
	.fixed-head-bg {
		height: calc(155rpx + var(--status-bar-height)) !important;
	}
}

.cont-bg {
	position: absolute;
	left: -180rpx;
	top: 180rpx;
	width: 687rpx;
	height: 995rpx;
	opacity: 0.5;
}

.chatList {
	.chatMsg {
		max-width: 378rpx;
		// min-height: 62rpx;
		margin-top: 14rpx;
		padding: 8rpx;
		background: #ffded0;
		border-radius: 10rpx 0rpx 10rpx 10rpx;
		font-weight: bold;
		line-height: 1.5;
		font-size: 18rpx;
		word-break: break-all;
	}
}

.chatinput-container {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	padding: 28rpx 0 env(safe-area-inset-bottom);
	background: white;
	box-shadow: 0rpx 5rpx 27rpx 0rpx rgba(254, 162, 113, 0.25);
	z-index: 10;

	.chat_input {
		width: 80%;
		height: 60rpx;
		background: #f3f3f3;
		border-radius: 20rpx;
		margin: 0 auto;
		padding: 0 20rpx;
	}
}
</style>

<template>
	<view class="more-btn" @click.stop="handleMore">
		<text class="icon-more"></text>
		<!-- 下拉 -->
		<view class="bg-white br-10 tooltip" v-show="open">
			<view class="fs-20 btn" v-for="item in list" :key="item" v-if="showList.includes(item)" @click.stop="handleClick(item)">{{ item }}</view>
		</view>
		<view class="mask" v-show="open"></view>
	</view>
</template>

<script>
export default {
	props: {
		info: Object, // 点击的当前对象数据
		showList: {
			type: Array,
			default: () => []
		},
		// circle | honor
		type: {
			type: String,
			default: 'circle'
		}
	},
	data() {
		return {
			list: ['收藏', '取消收藏', '投诉', '删除', '转换为粉丝可见', '转换为自己可见'],
			open: false
		};
	},
	methods: {
		handleMore() {
			this.open = !this.open;
		},
		handleClick(type) {
			// 羽乐圈相关
			if (this.type === 'circle') {
				if (type === '收藏') {
					this.clickCollect();
				} else if (type === '取消收藏') {
					this.cancelCollect();
				} else if (type === '投诉') {
					uni.navigateTo({
						url: '/pages/home/other/badminton-circle/complain?id=' + this.info.id
					});
				} else if (type === '删除') {
					this.deleteCircle();
				} else if (type === '转换为粉丝可见') {
					this.editCircle(2);
				} else if (type === '转换为自己可见') {
					this.editCircle(3);
				} else {
					console.log('more type::', type);
				}
			}
			// 荣誉相关
			else if (this.type === 'honor') {
				if (type === '删除') {
					this.deleteHonor();
				}
			}
			uni.$emit('refresh');
		},
		/**
		 * 接口相关
		 */
		// 收藏
		async clickCollect() {
			try {
				const { message } = await this.$api.UserCircle.clickCollect({ circle_id: this.info.id });
				uni.showToast({
					title: message,
					icon: 'none'
				});
				this.open = false;
			} catch (e) {
				//TODO handle the exception
			}
		},
		// 取消收藏
		async cancelCollect() {
			try {
				const { message } = await this.$api.UserCircle.cancelCollect({ collect_id: this.info.collect_id });
				uni.showToast({
					title: message,
					icon: 'none'
				});
				this.open = false;
			} catch (e) {
				//TODO handle the exception
			}
		},
		// 删除帖子
		async deleteCircle() {
			try {
				const { message } = await this.$api.UserCircle.delete({ circle_id: this.info.id });
				uni.showToast({
					title: message,
					icon: 'none'
				});
				this.open = false;
			} catch (e) {
				//TODO handle the exception
			}
		},
		// 编辑个人的帖子权限
		async editCircle(show_type) {
			try {
				const { message } = await this.$api.UserNotice.edit({ circle_id: this.info.id, show_type });
				uni.showToast({
					title: message,
					icon: 'none'
				});
				this.open = false;
			} catch (e) {
				//TODO handle the exception
			}
		},
		// 删除荣誉
		async deleteHonor() {
			try {
				const { message } = await this.$api.UserDetail.deleteHonor({ id: this.info.id });
				uni.showToast({
					title: message,
					icon: 'none'
				});
				this.open = false;
			} catch (e) {
				//TODO handle the exception
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.more-btn {
	position: relative;
	width: 170rpx;
	text-align: right;
	.tooltip {
		position: absolute;
		right: 0;
		max-width: 100%;
		height: max-content;
		padding: 0 8rpx;
		background: #ffffff;
		box-shadow: 1rpx 1rpx 9rpx 0rpx rgba(102, 102, 102, 0.27);
		border-radius: 10rpx;
		z-index: 11;
		.btn {
			line-height: 47rpx;
			text-align: center;
			&:not(:last-of-type) {
				border-bottom: 1rpx solid $border-color;
			}
		}
	}
}

.mask {
	position: fixed;
	left: 0;
	top: 0;
	height: 100vh;
	width: 100vw;
	// background-color: pink;
	z-index: 10;
	// pointer-events: none;
}
</style>

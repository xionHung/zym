<template>
	<view class="dan-container">
		<view class="flex">
			<view class="fw-bold fs-30" style="font-style: italic">段位自评</view>
			<text class="icon-order ml-8"></text>
		</view>
		<!-- 勾选列表 -->
		<view class="radio-group mt-20">
			<md-radio :mode="3" :list="list" :config="{ value: 'id' }" v-model="check">
				<template v-slot="{ item }">
					<view class="flex flex-col flex-top mr-20 pb-26 border-bottom">
						<view class="fs-30 primary-color">{{ `${item.grade}: ${item.name}` }}</view>
						<view class="mt-13 mb-19" style="color: #333">{{ item.title }}</view>
						<view class="fs-20" style="color: #666">{{ item.desc }}</view>
					</view>
				</template>
			</md-radio>
		</view>
		<view class="flex flex-center mt-62">
			<md-button class="config-btn" @click="handlePrev">确认</md-button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			list: [],
			check: null,
		};
	},
	created() {
		uni.showModal({
			title: '段位自评提示',
			content: `请务必仔细阅读后，对照自身水平进行选择。 如自身水平有突破请自主重新完成段位水平 评定，并接受广大球友监督。`,
			showCancel: false
		})
	},
	methods: {
		handlePrev() {
			const pages = getCurrentPages();
			let prevPage = pages[pages.length - 2];
			const obj = this.list.find(item => item.id === this.check);
			prevPage.$vm.getDanValue(obj);
			uni.navigateBack();
		},
		/**
		 * 接口相关
		 */
		// 段位下拉
		async getLevel() {
			try {
				const res = await this.$api.Config.level();
				this.list = res.data;
			} catch (e) {
				//TODO handle the exception
			}
		}
	},
	onLoad(options) {
		const { level } = options;
		this.check = +level;
		this.getLevel();
	}
};
</script>

<style scoped lang="scss">
.dan-container {
	padding: 40rpx 52rpx;
	margin-top: 10rpx;
	background-color: white;
	.config-btn {
		width: 300rpx;
		height: 70rpx;
		line-height: 70rpx;
		background: #fe6a1c;
		box-shadow: 9rpx 9rpx 35rpx 0rpx rgba(254, 106, 28, 0.4);
		border-radius: 35rpx;
		font-size: 30rpx;
		font-weight: bold;
		text-align: center;
	}
}
</style>

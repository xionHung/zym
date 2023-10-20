<template>
		<PageComp title="管理俱乐部" :isApplique="false" navStyle="background: #fff" >
			<view class="content">
				<view v-for="(item, index) in list" :key="index" @click="itemClick(item.url)">
					<md-image :width="140" :height="140" :src="item.icon" />
					<view class="label">{{item.label}}</view>
				</view>
			</view>
		</PageComp>
</template>

<script>
	export default {
		data() {
			return {
				list: [
					{ icon: 'manage/fbjl.png', label: '发布接龙', url: '/pages/chains/create' },
					{ icon: 'manage/gljl.png', label: '管理接龙', url: '/pages/chains/manage' },
					{ icon: 'manage/zijin.png', label: '资金明细', url: '/pages/club/fundDetails' },
					{ icon: 'manage/jiesuan.png', label: '结算情况', url: '/pages/club/settlement' },
					{ icon: 'manage/tixian.png', label: '提现', url: '/pages/club/withdrawal' },
					{ icon: 'manage/shezhi.png', label: '主页设置', url: '/pages/club/indexSetting' },
					{ icon: 'manage/cygl.png', label: '成员管理', url: '/pages/club/memberManage' },
					{ icon: 'manage/cysj.png', label: '成员数据', url: '/pages/club/memberData' },
					{ icon: 'manage/xinxi.png', label: '信息', url: '/pages/club/message' },
					{ icon: 'manage/bangzhu.png', label: '帮助', url: '/pages/mine/self-help' }
				],
				id: null,
			}
		},
		onLoad(options) {
			this.id = options.id;
		},
		methods: {
			itemClick(url) {
				if (!url) return;
				uni.navigateTo({
					url: url + '?id=' + this.id,
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		margin: 30rpx 134rpx;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		column-gap: 202rpx;
		row-gap: 36rpx;
		.label {
			color: #2B341E;
			font-weight: bold;
			font-size: 30rpx;
			text-align: center;
			margin-top: 20rpx;
		}
	}
</style>
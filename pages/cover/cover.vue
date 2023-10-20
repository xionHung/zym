<template>
	<view class="container flex-center">
		<image :src="imageUrl" mode="aspectFill"></image>
	</view>
</template>

<script>
export default {
	data() {
		return {
			imageUrl: '',
		};
	},
	async onLoad(options) {
		const token = uni.getStorageSync('token');
		if (!token) {
			await this.login();
		}
		await this.getIndex();
		setTimeout(() => {
			uni.switchTab({
				url: '/pages/home/home',
			});
		}, 3000);

		// 扫码获取的联盟编码
		if (options.code) {
			this.$store.commit('SET_UNIONCODE', options.code);
		}
	},
	methods: {
		async getIndex() {
			try {
				const res = await this.$api.User.Index();
				this.imageUrl = res.data.url;
			} catch (e) {
				//TODO handle the exception
			}
		},
		async login() {
			uni.login({
				provider: 'weixin', //使用微信登录
				success: loginRes => {
					this.$api.User.Login({ code: loginRes.code }).then(res => {
						uni.setStorageSync('token', res.data.token);
					});
				},
			});
		},
	},
};
</script>

<style>
page {
	box-sizing: initial;
}
</style>

<style lang="scss" scoped>
.container {
	height: 100vh;
	width: 100%;
	padding-bottom: 0;

	image {
		width: 100%;
		height: 100%;
	}
}
</style>

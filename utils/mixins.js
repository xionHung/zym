import Vue from 'vue';

Vue.mixin({
	data() {
		return {
			IMGURL: this.IMGURL,
		}
	},
	// computed: {
	// 	userinfo() {
	// 		return this.$store.state.userInfo;
	// 	}
	// },
	// async onShareAppMessage() {
	// 	return {
	// 		title: '中羽盟',
	// 		imageUrl: this.IMGURL + 'fenxiang.jpg',
	// 		path: '/pages/cover/cover?code=' + this.userinfo.code
	// 	};
	// },
})
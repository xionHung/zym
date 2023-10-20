<template>
	<view class="">
		<city-select @cityClick="cityClick" :formatName="formatName" :activeCity="address" :hotCity="hotCity" :obtainCitys="obtainCitys" :isSearch="true" ref="citys"></city-select>
	</view>
</template>

<script>
import citys from '@/components/city-select/citys.js';
import citySelect from '@/components/city-select/city-select';
export default {
	components: {
		citySelect
	},
	data() {
		return {
			onlyread: false,
			eventChannel: null,
			formatName: 'cityName',
			//热门城市
			hotCity: [
				{
					cityCode: '350200',
					cityName: '厦门市'
				},
				{
					cityName: '福州市',
					cityCode: '350100'
				},
				{
					cityName: '北京市',
					cityCode: '110102'
				},
				{
					cityName: '上海市',
					cityCode: '310100'
				},
				{
					cityCode: '440300',
					cityName: '深圳市'
				},
				{
					cityCode: '440100',
					cityName: '广州市'
				},
				{
					cityCode: '330100',
					cityName: '杭州市'
				}
			],
			//显示的城市数据
			obtainCitys: [
				{
					cityName: '北京市',
					cityCode: '110102'
				}
			]
		};
	},
	mounted() {
		this.obtainCitys = citys;
	},
	onLoad(e) {
		if (e.onlyread) {
			this.onlyread = true;
			// #ifdef APP-NVUE
			this.eventChannel = this.$scope.eventChannel; // 兼容APP-NVUE
			// #endif
			// #ifndef APP-NVUE
			this.eventChannel = this.getOpenerEventChannel();
			// #endif
		}
	},
	computed: {
		address() {
			return this.$store.state.address;
		}
	},
	methods: {
		cityClick(item) {
			// console.log(item);
			let data = {
				cityName: item.cityName,
				cityCode: item.cityCode
			};
			if (this.onlyread) {
				this.eventChannel.emit('setCity', {
					data
				});
			} else {
				// this.$store.commit('SET_ADDRESS', data);
				this.$store.dispatch('saveUserInfo', data);
			}
			uni.navigateBack();
		}
	}
};
</script>

<style lang="scss" scoped></style>

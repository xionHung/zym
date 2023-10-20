import Vue from "vue"
import Vuex from "vuex"
import api from '@/api/apiUrl.js'
import getters from './getters.js'
import {
	getLocation
} from "@/utils/tools";

Vue.use(Vuex)

const state = {
	address: uni.getStorageSync('address') || {
		cityCode: '',
		cityName: '',
		latitude: '',
		longitude: '',
	},
	location: uni.getStorageSync('location') || {
		cityCode: '',
		cityName: '',
		latitude: '',
		longitude: '',
	},
	userInfo: uni.getStorageSync('userInfo') || {
		headImgUrl: '',
		nickName: '',
	},
	version: '', // 当前版本号
	editorHtml: '',
	unionCode: '',
}

const mutations = {
	// 更新版本号
	SET_VERSION(state, payload) {
		state.version = payload
	},
	// 存储用户信息
	SET_USER(state, data) {
		uni.setStorageSync('userInfo', data);
		state.userInfo = data;
	},
	// 设置地址
	SET_ADDRESS(state, data) {
		uni.setStorageSync('address', data);
		state.address = data;
	},
	SET_LOCATION(state, data) {
		uni.setStorageSync('location', data);
		state.location = data;
	},
	SET_EDITOR(state, data) {
		state.editorHtml = data;
	},
	// 扫码的联盟编号 用来 创建俱乐部 和 入驻球馆 分销用
	SET_UNIONCODE(state, data) {
		uni.setStorageSync('unionCode', data);
		state.unionCode = data;
	}
}

const actions = {
	// 获取用户信息
	// cityReset暂时只做定位入参 cityCode, cityName
	getUserInfo({
		commit
	}, cityReset) {
		return new Promise((resolve, reject) => {
			if (!uni.getStorageSync('token')) return reject();
			api.User.Info().then(res => {
				if (res.code === 200) {
					let data = res.data;
					let userInfo = this.state.userInfo;
					for (let p in data) {
						userInfo[p] = data[p];
					}
					commit('SET_USER', userInfo);
					// 存入上一次保存的地址
					if (userInfo.city || (cityReset && cityReset.cityName)) {
						commit('SET_ADDRESS', {
							cityName: userInfo.city,
							...cityReset
						})
					}
					resolve(userInfo);
				} else {
					reject(res.msg);
				}
			})
		})
	},
	// 保存用户信息
	async saveUserInfo({
		dispatch
	}, reset) {
		const {
			cityName,
			cityCode
		} = reset;
		try {
			await api.User.setting({
				city: cityName,
				...reset,
			});

			// 刷新用户信息接口
			// 处理定位地址
			dispatch('getUserInfo', {
				cityName,
				cityCode
			});
		} catch (e) {
			//TODO handle the exception
			Promise.reject(e);
		}
	},
	// async getLocation({
	// 	commit
	// }, isSync) {
	// 	return new Promise(async (resolve, reject) => {
	// 		console.log(isSync, 23333)
	// 		const address = await getLocation(false);
	// 		// console.log(address);
	// 		Vue.prototype.$qqmapsdk.reverseGeocoder({
	// 			location: {
	// 				latitude: address.latitude,
	// 				longitude: address.longitude,
	// 			},
	// 			success: (res) => {
	// 				let d = res.result.ad_info;
	// 				let obj = {
	// 					cityName: d.city,
	// 					cityCode: d.adcode,
	// 					latitude: d.location.lat,
	// 					longitude: d.location.lng
	// 				}
	// 				commit('SET_LOCATION', obj)
	// 				if (isSync || !this.state.address.cityName) commit('SET_ADDRESS', obj)
	// 				resolve();
	// 			},
	// 			fail: (err) => {
	// 				console.log(err)
	// 				reject();
	// 			}
	// 		})
	// 	})
	// },
}
const modulesFiles = require.context('./modules', true, /\.js$/);
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
	const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
	const value = modulesFiles(modulePath)
	modules[moduleName] = value.default
	return modules
}, {})

const store = new Vuex.Store({
	state,
	mutations,
	actions,
	modules,
	getters: getters
})

export default store
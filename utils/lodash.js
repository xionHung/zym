import config from "@/configs/"
import cloneDeep from 'lodash/cloneDeep'
import throttle from 'lodash/throttle'
import debounce from 'lodash/debounce'
import isEmpty from 'lodash/isEmpty'
import moment from 'moment'
import store from '@/store'
import { showToast, login } from "@/utils/tools"
import api from '@/api/apiUrl.js'
import { pathToBase64 } from 'image-tools'
import Vue from 'vue'
// let timer = null
// 封装枚举类型转化

export const getHeadImg = img => img || config.appDefaultHeadImg

export const getCityCode = (code) => {
	return code.substr(0, 4) + '00'
}
export const getProvinceCode = (code) => {
	return code.substr(0, 2) + '0000'
}

// 时间格式化
export const formatTime = (time, reg = 'YYYY-MM-DD') => {
	if (!time) return '';
	let t = time;
	if (typeof t === 'string') {
		t = new Date(String(time).replace(/-/g, '/'))
	}
	return moment(t).format(reg)
}

// export const debounce = function(fun,wait) {
// 	var t;
// 	return function () {
// 			if (t) {
// 					clearTimeout(t);
// 			}
// 			t = setTimeout(function () {
// 					fun();
// 			}, wait);
// 	}
// }

// 根据当前时间计算时间跨度
export const countTimeByNow = val => {
	try {
		if (!val) return ''
		const now = new Date().getTime()
		const time = new Date(formatTime(new Date(String(val).replace(/-/g, '/')), 'YYYY/MM/DD HH:mm:ss')).getTime()
		const oneMin = 1000 * 60
		const oneHour = 1000 * 60 * 60
		const oneDay = 1000 * 60 * 60 * 24
		const oneWeek = oneDay * 7
		const oneMonth = oneDay * 30
		const oneYear = oneDay * 365
		// 计算相差
		const days = ((now - time) / oneDay).toFixed(1) * 1
		const allSecs = now - time
		let num = 0

		const __countFn = val => {
			num = val ? Math.floor(allSecs / val) : 0
			return num
		}

		if (__countFn(oneYear) >= 1) return `${num} 年前`
		else if (__countFn(oneMonth) >= 1) return `${num} 月前`
		else if (__countFn(oneWeek) >= 1) return `${num} 周前`
		else if (__countFn(oneDay) >= 1) return `${num} 天前`
		else if (__countFn(oneHour) >= 1) return `${num} 小时前`
		else if (__countFn(oneMin) >= 0) return `${num || 1} 分钟前`
	} catch (e) {
		console.log(e)
	}
}


// 获取星期几
export const getDays = time => {
	let days = {
		0: '日',
		1: '一',
		2: '二',
		3: '三',
		4: '四',
		5: '五',
		6: '六',
	}
	return time ? `星期${days[new Date(moment(time).format('YYYY-MM-DD')).getDay()]}` : ''
}

// 封装uni消息弹窗
export const Message = (options, duration = 1000) => {
	if (typeof options === 'string') {
		options = {
			title: options,
			icon: 'none',
			duration
		}
	}
	options.mask = true
	uni.showToast(options)
}
['info', 'success', 'loading'].forEach(val => {
	Message[val] = title => {
		Message({
			title,
			icon: val === 'info' ? 'none' : val,
			duration: 1000
		})
	}
})

// 网络监听
export const Network = {
	on: () => {
		uni.setStorageSync('isConnect', 0)
		uni.getNetworkType({
			success: function(res) {
				if (res.networkType !== 'none') {
					uni.setStorageSync('isConnect', 1)
					return
				}
				Message.info({
					title: '您目前处于断网状态',
					duration: 1500
				})
			}
		})
		uni.onNetworkStatusChange(function(res) {
			uni.setStorageSync('isConnect', res.isConnected ? 1 : 0)
			if (res.networkType === 'none') {
				Message.info({
					title: '您目前处于断网状态',
					duration: 1500
				})
			}
		})
	}
}
export const imgtobase = (url) => {
	let path = pathToBase64(url).then(async (base64) => {
		let fileName = '123.' + base64.substring(base64.indexOf("/") + 1, base64.indexOf(";"))
		uni.showLoading({
			title: '上传中',
		})
		let { data: res } = await api.Upload.base64({
			fileBase64: base64,
			folder: 'image',
			fileName
		})

		if (res.code !== 0) return Message(res.msg);
		console.log(res);
		uni.hideLoading()
		return res.result
	})
	return path
}
export const CheckVersion = () => {
	// 热更新
	const handleHotUpdate = (tempFilePath) => {
		plus.runtime.install(tempFilePath, {
			force: false
		}, function() {
			Message('更新完成，即将重启')
			setTimeout(() => plus.runtime.restart(), 1500)
		}, function(e) {
			console.log(e);
		})
	}
	// 整包升级
	const handleAllUpdate = (version, downloadUrl) => {
		plus.runtime.openURL(downloadUrl)
	}
	const now = new Date().getTime()
	let nextShowUpdateTime = uni.getStorageSync('nextShowUpdate')
	// 如果标记的下次提醒时间大于现在，那么无需提醒
	if (nextShowUpdateTime && nextShowUpdateTime >= now) return
	let deviceCode = uni.getSystemInfoSync().platform === 'android' ? 0 : 1
	plus.runtime.getProperty(plus.runtime.appid, widgetInfo => {
		let nowBuildNoIdx = widgetInfo.version.indexOf('.')
		store.commit('SET_VERSION', widgetInfo.version)
		let noList = widgetInfo.version.split('.')
		noList.splice(nowBuildNoIdx, 0, '.')
		uni.request({
			url: 'http://mwapi.wanxiaocar.com/api/app/CheckNewVersion',
			method: 'POST',
			data: {
				deviceCode,
				version: widgetInfo.version,
				nowBuildNo: parseFloat(noList.join(''))
			},
			success: (result) => {
				let data = result.data.result
				if (!data) return false
				// const { buildNoStr: version, downloadUrl, updateCode } = data
				store.commit('SET_UPGRADE_DATA', { ...data })
				uni.navigateTo({
					url: '/pages/index/upgrade-page'
				})
			}
		})
	})
}

// 消息推送

export const InitPush = () => {
	const jyJPush = uni.requireNativePlugin('JY-JPush')
	jyJPush.android_init(res => {
		// if (timer) {
		// 	clearTimeout(timer)
		// 	timer = null
		// }
		// timer = setTimeout(() => {
		// 	jyJPush.setJYJPushAlias(
		// 	  { userAlias: 'shuiwuAlias' },
		// 	aliasResult => {
		// 		uni.showToast({
		// 		  icon: 'none',
		// 		  title: JSON.stringify(aliasResult),
		// 		  duration: 3000
		// 		})
		// 	})
		// }, 15000)
		// 获取注册id
		setTimeout(() => {
			pushId(jyJPush)
		}, 5000)
	})
	// 监听消息推送
	// jyJPush.addJYJPushReceiveNotificationListener(result => {
	// 	uni.showToast({
	// 		icon: 'none',
	// 		title: 'rec' + JSON.stringify(result)
	// 	})
	// 	console.log('收到了' + JSON.stringify(result));
	// })

	// 监听消息点击
	jyJPush.addJYJPushReceiveOpenNotificationListener(result => {
		uni.navigateTo({
			url: '/pages/message/notice',
		})
	})
}

// 提交推送id
const pushId = (jyJPush) => {
	jyJPush.getRegistrationID(
		//  返回的数据会有registrationID，errorCode
		getRegistrRes => {
			const { errorCode, registrationID } = getRegistrRes
			// uni.showToast({
			// 	icon: 'none',
			// 	title: JSON.stringify(getRegistrRes),
			// 	duration: 5000
			// })
			if (parseInt(errorCode) !== 0) {
				uni.showToast({
					icon: 'none',
					title: '消息推送初始化失败',
					duration: 3000
				})
			} else {
				console.log(registrationID);
				// api.User.setJPushRegistrationId({
				// 	jPushRegistrationId: registrationID,
				// 	userAlias: 'shuiwuAlias'
				// })
			}
		})
}
export const isLogin = () => {
	if (!store.state.userInfo.token) {
		login(null, true);
		return false;
	}
	return true;
}
// 封装uni的加载中弹窗
export const Loading = {
	show: title => {
		uni.showLoading({
			title,
			mask: true
		})
	},
	hide: () => uni.hideLoading()
}
export const qiao = async (friend, type = '123', conent, sucCallback) => {
	let user = uni.getStorageSync('user')
	let params = {
		id: friend.userId,
	}
	if (conent) params.conent = conent;
	let { data: res } = await api.User.beatUser(params)
	let text = type === '123' ? '敲敲' : '礼物'
	let str = type === '123' ? '123' : '礼物'
	if (!res.result && type === '123') {
		if (res.code === 50) {
			store.commit('SET_USERMODAL', 'Modal')
		} else {
			Message(res.msg, 2000);
		}
		return;
	}
	let body = type === '123' ? user.nickName + '敲了敲你' : `${user.nickName}赠送了${friend.num}个${friend.giftName}`
	const { giftName, giftPicture, num } = friend
	let order = { type: str, text, ...user, giftName, giftPicture, num }
	console.log(friend);
	let textMessage = Vue.prototype.goEasy.im.createCustomMessage({
		type: 'order',
		payload: order,
		to: {
			id: friend.userId,
			type: Vue.prototype.GoEasy.IM_SCENE.PRIVATE,
			data: {
				name: friend.nickName,
				avatar: friend.headImg,
				focusState: friend.focusState,
				...friend,
			},
		},
		notification: {
			title: type === '123' ? '敲敲' : '礼物',
			body: body
		}
	});
	let toId = textMessage.to.id
	let imService = getApp().globalData.imService;
	let localHistory = imService.getPrivateMessages(toId);
	localHistory.push(textMessage);
	Vue.prototype.goEasy.im.sendMessage({
		message: textMessage,
		onSuccess: async (message) => {
			console.log(friend);
			console.log("发送成功.", message);
			if (sucCallback) sucCallback();
			let str = type === '123' ? `你敲了敲${friend.nickName}` : `你赠送了${friend.num}个${friend.giftName}`
			Message(str)
		},
		onFailed: function(error) {
			console.log("发送失败:", error);
		}
	});
}

const simpleNum = (num) => {
	let r = Number(num);
	if (r >= 1000000) {
		r = (r / 1000000).toFixed(1) + 'm';
	} else if (r >= 10000) {
		r = (r / 10000).toFixed(1) + 'w';
	} else if (r >= 1000) {
		r = (r / 1000).toFixed(1) + 'k';
	}
	r = String(r).replace(/\.0/, '')
	return r;
}

const lodash = Object.freeze({
	getHeadImg,
	getCityCode,
	getProvinceCode,
	formatTime,
	countTimeByNow,
	getDays,
	cloneDeep,
	debounce,
	throttle,
	isEmpty,
	Message,
	imgtobase,
	isLogin,
	qiao,
	simpleNum
})

export default {
	install(Vue) {
		Vue.prototype._ = lodash
		Vue.prototype.$message = Message
		Vue.prototype.$showToast = showToast
		Vue.prototype.$loading = Loading
	}
}
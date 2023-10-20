import store from '@/store'
import api from '@/api/apiUrl.js'
// import { request } from "../api/request";

var loginReq = null;
// 调用登录
export const login = async () => {
	return new Promise(async (resolve, reject) => {
		let code = await tryLogin();
		// console.log(code, 'code------')
		// return;
		uni.showLoading();
		let res = await api.User.Login({
			code,
		});
		uni.hideLoading();
		console.log(res, 23333)
		if (res) {
			let userInfo = res.result;
			store.commit('SET_USER', userInfo);
			uni.setStorageSync('token', userInfo.token)
			resolve(userInfo.token)
		} else {
			reject(res.msg);
		}
	})
}
export const reLoin = function(resolve_p) {
	if (loginReq) {
		return new Promise(resolve => {
			loginReq.then(res => {
				resolve_p(res);
				loginReq = null;
			})
		})
	} else {
		loginReq = new Promise(async (resolve, reject) => {
			tryLogin((r) => {
				quickLogin(r)
			});
		})
	}
}

export const quickLogin = async (code) => {
	const res = await request({
		url: '/ApiWeChantUser/QuickLogin',
		data: {
			code
		},
		notGetToken: true,
		notShowToast: true
	})
	store.commit('SET_USER', res.code === 0 ? res.result : {});
}

export const tryLogin = (callback) => {
	return new Promise((resolve, reject) => {
		uni.login({
			success: e => {
				uni.setStorageSync('login_code', e.code);
				callback && callback(e.code);
				resolve(e.code)
			},
			fail: err => {
				showToast(err.msg);
				console.log(err);
				reject(err.msg);
			}
		})
	})
}

// 更新token
export const getToken = (skip) => {
	return new Promise(async resolve => {
		let userInfo = store.state.userInfo;
		// console.log(userInfo, '-----------')
		if (!skip && userInfo.token) {
			return resolve(userInfo.token);
		}
		// if (!skip && userInfo.token && userInfo.expireTime) {
		//   let eTime = new Date(userInfo.expireTime).getTime(),
		//     sTime = new Date().getTime();
		//   if (eTime > sTime) {
		//     return resolve(userInfo.token);
		//   }
		// }
		if (skip === 2) {
			await reLoin(resolve);
		} else {
			await login(resolve);
		}
	})
}

// 浮窗提醒
export const showToast = (msg, duration = 2000) => {
	uni.showToast({
		title: msg,
		icon: 'none',
		duration,
	})
}
export const hideLongNum = (val, s = 3, e = 3) => {
	let str = String(val);
	return str.substr(0, s) + '******' + str.substr(e * -1, e)
}

// 判断地址位置是否授权，否则弹出设置
export const getWXUserLocation = () => {
	return new Promise((resolve, reject) => {
		uni.getSetting({
			success(res) {
				console.log(res.authSetting)
				// res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
				// res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
				// res.authSetting['scope.userLocation'] == true    表示 地理位置授权
				if (res.authSetting['scope.userLocation'] != undefined && res.authSetting[
					'scope.userLocation'] != true) {
					uni.showModal({
						title: '请求授权当前位置',
						content: '需要获取您的地理位置，请确认授权',
						success: function(r) {
							if (r.cancel) {
								showToast('拒绝授权');
							} else if (r.confirm) {
								uni.openSetting({
									success: function(dataAu) {
										if (dataAu.authSetting[
											"scope.userLocation"] ==
											true) {
											showToast('授权成功');
											//再次授权，调用wx.getLocation的API
											getLocation().then(glRes => resolve(glRes));

										} else {
											showToast('授权失败');
										}
									}
								})
							}
						}
					})
				} else if (res.authSetting['scope.userLocation'] == undefined) {
					//调用wx.getLocation的API
					getLocation().then(glRes => resolve(glRes));
				} else {
					//调用wx.getLocation的API
					getLocation().then(glRes => resolve(glRes));
				}
			},
			fail(err) {
				reject(err)
			}
		})
	})
}

export const getLocation = (isSaveLocation = true) => {
	return new Promise((resolve, reject) => {
		uni.getLocation({
			type: 'wgs84',
			isHighAccuracy: true,
			geocode: true,
			success: (res) => {
				// 是否需要保存位置信息
				if (isSaveLocation) {
					const { latitude, longitude } = res;
					store.dispatch('saveUserInfo', { latitude, longitude });
				}
				resolve(res);
			},
			fail: (err) => {
				reject();
				console.log(err);
			}
		})
	})
}

// 获取用户授权
export const getUserProfile = (options = {}) => {
	return new Promise((resolve, reject) => {
		let userInfo = uni.getStorageSync('userInfo') || {};
		if (userInfo.nickname != '游客') {
			resolve(userInfo);
			return;
		}
		wx.getUserProfile({
			desc: options.desc || '注册、登录小程序',
			success: (r) => {
				console.log(r, '获取用户授权');
				// uni.setStorageSync('userInfo', userInfo);
				// store.commit('SET_USER', userInfo);
				resolve(r)
			},
			fail: err => {
				reject(err)
			}
		})
	})
}

// 微信支付
export const wxPayment = (orderInfo) => {
	return new Promise((resolve, reject) => {
		uni.getProvider({
			service: 'payment',
			success: function(res) {
				console.log(res.provider)
				if (~res.provider.indexOf('wxpay')) {
					uni.requestPayment({
						"provider": "wxpay", //固定值为"wxpay"
						// "orderInfo": orderInfo,
						...orderInfo,
						timeStamp: String(orderInfo.timeStamp),
						success: function(res) {
							showToast("支付成功~");
							resolve(res)
						},
						fail: function(err) {
							console.log('支付失败:' + JSON.stringify(err));
							showToast('支付失败~')
							reject(err);
						}
					});
				}
			}
		});
	})
}

// 答案转化
export const getAnswer = (answer = 0) => {
	if (answer <= 0) return [];
	let r2 = answer.toString(2).split('').reverse();
	let res = [];
	for (let i = 0; i < r2.length; i++) {
		if (r2[i] === '1') {
			res.push(Math.pow(2, i))
		}
	}
	return res;
}
/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
	if (arguments.length === 0 || !time) {
		return null
	}
	const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
	let date
	if (typeof time === 'object') {
		date = time
	} else {
		if ((typeof time === 'string')) {
			if ((/^[0-9]+$/.test(time))) {
				// support "1548221490638"
				time = parseInt(time)
			} else {
				// support safari
				// https://stackoverflow.com/questions/4310953/invalid-date-in-safari
				time = time.replace(new RegExp(/-/gm), '/')
			}
		}

		if ((typeof time === 'number') && (time.toString().length === 10)) {
			time = time * 1000
		}
		date = new Date(time)
	}
	const formatObj = {
		y: date.getFullYear(),
		m: date.getMonth() + 1,
		d: date.getDate(),
		h: date.getHours(),
		i: date.getMinutes(),
		s: date.getSeconds(),
		a: date.getDay()
	}
	const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
		const value = formatObj[key]
		// Note: getDay() returns 0 on Sunday
		if (key === 'a') {
			return ['日', '一', '二', '三', '四', '五', '六'][value]
		}
		return value.toString().padStart(2, '0')
	})
	return time_str
}

export const toastFun = title => {
	return new Promise(solove => {
		uni.showToast({
			icon: 'none',
			title,
		});
		let time = setTimeout(() => {
			clearTimeout(time);
			solove();
		}, 1000);
	})
}

// 对象转路径参数
export const ObjToPathParams = (data) => {
	let _result = [];
	for (let key in data) {
		let value = data[key];
		if (value.constructor == Array) {
			value.forEach(function(_value) {
				_result.push(key + "=" + _value);
			});
		} else {
			_result.push(key + '=' + value);
		}
	}
	return _result.join('&');
}

import {
	Message
} from "@/utils/lodash.js"
import appConfig from "@/configs/"

function request({
	url,
	...options
}) {
	const token = uni.getStorageSync('token');

	const config = {
		timeout: 50000,
		dataType: 'json',
		header: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		// 其他配置项
		...options,
		// 接口地址
		url: appConfig.baseUrl + url,
	}

	// 权限
	if (token) {
		config.header['x-token'] = token
	}

	return new Promise((resolve, reject) => {
		uni.request(config).then(response => {
				const [_, res] = response
				if (res.statusCode == 200) {
					const {
						code,
						message
					} = res.data;
					if (code !== 200) {
						// token校验失败! token不存在!
						if ((code === 400 && message.startsWith('token')) || code === 401) {
							handleNoPower(message);
							return;
						} else {
							Message(message);
							reject(res.data);
						}
					} else {
						resolve(res.data)
					}
				} else {
					uni.showToast({
						icon: 'none',
						duration: 1500,
						mask: true,
						title: `${res.statusCode}状态错误`
					})
					return;
				}
			})
			.catch(error => {
				console.error(`接口-${url}::`, error);
				uni.showToast({
					icon: 'none',
					duration: 1500,
					mask: true,
					title: '请求出错！'
				})
				uni.hideLoading();
				const [err] = error
				reject(err)
			})
	})
}

// token 失效或无效
function handleNoPower(message) {
	Message.info(message || '登录信息已过期，请重新登录');
	uni.clearStorageSync();
	uni.redirectTo({
		url: '/pages/cover/cover'
	})
}

export default {
	get: ({
		data,
		...options
	}) => request({
		data: (data ? JSON.parse(JSON.stringify(data)) : {}),
		...options,
		method: 'GET',
	}),
	post: ({
		data,
		...options
	}) => request({
		data: (data ? JSON.parse(JSON.stringify(data)) : {}),
		...options,
		method: 'POST',
	}),
}
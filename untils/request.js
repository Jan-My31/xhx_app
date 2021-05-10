import {
	BASE_HOSTS,
	STORAGE_USER_TOKEN_KEY,
	STORAGE_USER_INFO_KEY
} from 'common/config.js';


const LOGINSUCCESS = 10001, // 登录成功
	LOGINFAIL = 10002, // 登录失败
	REQUESTSUCCESS = 10003, // 请求成功
	REQUESTFAIL = 10004, // 请求失败
	USERLOGINED = 10005, // 用户已登录
	VALIDATAFAIL = 10006, // 验证失败
	USERNOTLOGIN = 10008; // 用户未登录

const login = function(_self, res) {
	// 将当前页的登录信息改为true
	_self.isLogin = true;
	// 设置当前页的用户信息
	_self.userInfo = res.data.userinfo

	// 保存保存到 Storage 缓存
	uni.setStorage({
		key: 'ISLOGIN',
		data: true
	})

	// 保存 sessionid 到 Storage 缓存
	if(res.data.sessionid) {
		uni.setStorage({
			key: STORAGE_USER_TOKEN_KEY,
			data: res.data.sessionid,
			success: function() {
				delete res.data.sessionid
			}
		})
	}

	// 保存用户信息到 Storage 缓存
	uni.setStorage({
		key: STORAGE_USER_INFO_KEY,
		data: res.data.userinfo,
		success: function() {
			delete res.data.userinfo
		}
	})
}

const logout = function(_self, msg = null) {
	_self.isLogin = false;
	_self.userInfo = {};

	// 删除用户凭证
	uni.removeStorage({
		key: STORAGE_USER_TOKEN_KEY
	})

	// 删除用户登录信息
	uni.removeStorage({
		key: STORAGE_USER_INFO_KEY
	})

	// 设置为未登录
	uni.setStorage({
		key: 'ISLOGIN',
		data: false
	})

	if (msg) {
		uni.showToast({
			icon: 'none',
			title: msg,
			duration: 2000
		})
	}
}

const request = function(options) {
	// 完善请求地址
	if (options.baseurl) {
		options.url = options.baseurl + options.api;
	} else {
		options.url = BASE_HOSTS + options.api;
	}
	// 请求头
	options.header = {
		'Content-Type': 'application/x-www-form-urlencoded',
		'X-Token': uni.getStorageSync(STORAGE_USER_TOKEN_KEY),
	}
	// 公共处理返回函数
	options.complete = function(response) {
		if (response.hasOwnProperty('data')) {
			// 判断回调值中是否有 data 属性来判断是否请求成功

			let res = response.data, // 后端返回数据
				_self = options.self; // 调用页的 this 对象

			// 公共处理登录成功
			if (res.code == LOGINSUCCESS) {
				login(_self, res)
			} else if (res.code == LOGINFAIL) {
				logout(_self, res.msg)
			}else if (res.code == VALIDATAFAIL) {
				// 将错误信息想合为字符串类型以: key: value ... 字符串
				let errormsg = ''
				for (let key in content.data) {
					errormsg += key + ':' + content.data[key]
				}
				res.errormsg = errormsg
			}

			if (response.statusCode == 200) {
				// 执行请求成功函数
				try {
					options.then(res)
				}catch(e) {}
			} else {
				// 执行请求失败函数
				try {
					options.err(res)
				}catch(e) {}
			}
		} else {
			// 请求失败
			uni.showToast({
				icon: 'none',
				title: '网络连接错误',
				duration: 2000
			})
			// options.err(response)
		}
	}
	return uni.request(options)
}



export {
	request,
	logout
}

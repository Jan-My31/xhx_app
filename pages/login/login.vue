<template>
	<form class='loginView' @submit="bindLogin">

		<view class="input-view">
			<view class="label-view">
				<text class="label">账户</text>
			</view>
			<input class="input" type="text" placeholder="请输入登录账户" name="nameValue" />
		</view>
		<view class="input-view">
			<view class="label-view">
				<text class="label">密码</text>
			</view>
			<input class="input" password placeholder="请输入登录密码" name="passwordValue" />
		</view>
		<view class="button-view">
			<button type="primary" :loading="loading" class="login" formType="submit">登录</button>
		</view>
	</form>
</template>

<script>
	import {
		mapMutations
	} from 'vuex';

	export default {
		data() {
			return {
				loading: false
			}
		},
		methods: {
			bindLogin(e) {
				console.log(e);
				this.loading = true;
				let name = e.detail.value.nameValue,
					password = e.detail.value.passwordValue;

				// if (!/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(name)) {
				// this.loading = false;
				// uni.showModal({
				// content: "请输入正确邮箱",
				// showCancel: false
				// })
				// return;
				// }

				if (password.length < 6) {
					this.loading = false;
					uni.showModal({
						content: "密码大于5位",
						showCancel: false
					})
					return;
				}

				uni.request({
						url: "http://www.xinhuaxing.vip:8999/up/users/",
						header: {
							"Content-Type": "application/x-www-form-urlencoded",
						},
						data: {
							"username": name,
							"password": password,
						},
						method: "POST",
                    success: (e) => {
						console.log(66,e)
                        if (e.data.code == 1001) {
                            uni.showModal({
                                content: e.data.msg,
                                showCancel: false
                            });
                            return;
                        }
                        if (e.data.code === 1000) {
                            this.login(e.data);
       //                      uni.showToast({
							// 	content:"登录成功",
							// 	duration:1000,
							// });
							uni.navigateTo(
							{
								url: "/pages/news/index"
							});
                        } else {
                            uni.showModal({
                                content: e.data.msg,
                                showCancel: false
                            })
                        }
                    },
                    fail: (e) => {
                        uni.showModal({
                            content: "请求失败，请重试！",
                            showCancel: false
                        })
                    },
                    complete: () => {
                        this.loading = false;
                    }
                })
            },
            ...mapMutations(['login'])
        }
    }
</script>

<style>
	view {
		display: flex;
	}

	.loginView {
		display: flex;
		flex: 1;
		flex-direction: column;
		width: 750upx;
		padding-top: 30upx;
	}

	.input-view {
		border-bottom-style: solid;
		border-bottom-width: 3upx;
		border-bottom-color: #ddd;
		background-color: #fff;
		flex-direction: row;
		width: 750upx;
		padding: 20upx 20upx;
		box-sizing: border-box;
	}

	.label-view {
		width: 100upx;
		height: 60upx;
		align-items: center;
		margin-right: 30upx;
	}

	.label {
		flex: 1;
		line-height: 60upx;
		font-size: 34upx;
		color: #555;
		text-align: left;
	}

	.input {
		flex: 1;
		height: 60upx;
		font-size: 34upx;
		align-items: center;
	}

	.button-view {
		width: 750upx;
		margin-top: 50upx;
		padding: 0 20upx;
		box-sizing: border-box;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	button {
		width: 710upx;
		height: 80upx;
		line-height: 80upx;
		text-align: center;
		font-size: 34upx;
		margin-bottom: 30upx;
	}

	button.register {
		margin-top: 30upx;
		color: #ff80ab;
		background-color: #fff;
		border-color: #ff80ab;
		border-width: 2upx;
	}

	/* .register.hover,
    .login.hover {
        opacity: 0.6;
    } */
	.getPassword {
		color: #888888;
	}
</style>

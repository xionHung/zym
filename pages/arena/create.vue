<template>
	<PageComp :title="list[current]" isArc navStyle="color: #fff; background: #FE6A1C" bgHeight="280rpx">
		<view slot="header" class="top-box">
			<md-steps :current="current" :list="list" />
			<view class="remark">{{ '提示信息：请准确填写场馆信息、认证、联系方式，场馆入驻 提交后需要1-3天进行人工审核，请注意短信提醒！' }}</view>
		</view>
		<view class="container">
			<view v-show="!current">
				<md-from-item v-model="form.name" label="场馆名称" />
				<md-divider :height="30" />
				<view @click="handleOpen('area_name', '场馆地址')">
					<md-from-item v-model="form.area" isCheck label="场馆地址" />
				</view>
				<md-divider :height="30" />
				<md-from-item v-model="form.address" label=" " placeholder="详细地址" />
				<md-divider :height="30" />
				<view @click="handleOpen('area_time', '营业时间')">
					<md-from-item v-model="form.business_time" isCheck label="营业时间" :areaTimeLabel="['工作日', '周末']">
						<view class="custom-item">
							<view>
								<view class="label">{{ '工作日' }}</view>
								<view>{{ timeFormate(form.business_time, 0) }}</view>
							</view>
							<view>
								<view class="label">{{ '周末' }}</view>
								<view>{{ timeFormate(form.business_time, 1) }}</view>
							</view>
						</view>
					</md-from-item>
				</view>
				<md-divider :height="30" />
				<md-from-item v-model="form.site_num" type="number" label="场地数量" placeholder="片" />
				<view class="item">
					<view class="title">{{ '上传场馆门口照片' }}</view>
					<view class="flex">
						<md-upload-image v-model="form.room_pic" mode="square" typeName="room" borderColor="#999" />
						<view class="remark">{{ '照片需清晰' }}</view>
					</view>
				</view>
				<view class="item no-border">
					<view class="title">{{ '上传场馆环境照片' }}</view>
					<view class="flex">
						<md-upload-image v-model="form.inner_room_pic" mode="square" typeName="room" borderColor="#999" />
						<view class="remark">{{ '照片需清晰' }}</view>
					</view>
				</view>
			</view>
			<view v-show="current == 1">
				<view class="item">
					<view class="title">{{ '营业执照' }}</view>
					<view class="flex">
						<md-upload-image v-model="form.licens_pic" mode="square" typeName="room" borderColor="#999" />
						<view class="remark">{{ '照片需清晰' }}</view>
					</view>
				</view>
				<view class="item no-border">
					<view class="title">{{ '身份证' }}</view>
					<view class="flex">
						<md-upload-image v-model="form.id_card_pic" mode="square" typeName="room" borderColor="#999" />
						<view class="item-divider"></view>
						<md-upload-image v-model="form.id_card_back_pic" mode="square" typeName="room" borderColor="#999" />
					</view>
					<view class="remark id-card">{{ '为保障账户安全，收款提现需完成实名认证' }}</view>
				</view>
			</view>
			<view v-show="isSubmit">
				<md-from-item v-model="form.username" label="馆长名称" />
				<md-divider :height="30" />
				<md-from-item v-model="form.mobile" type="number" label="联系电话" />
			</view>
		</view>
		<view slot="footer">
			<view class="yuedu" v-if="current == 2">
				<text class="icon icon-yes-fill" :class="{ active: isCheck }" @click="isCheck = !isCheck"></text>
				<text @click="isCheck = !isCheck">{{ '我已阅读并同意' }}</text>
				<text class="active" @click="remark(1)">{{ '《隐私政策》' }}</text>
				<text>{{ '、' }}</text>
				<text class="active" @click="remark(2)">{{ '《用户协议》' }}</text>
				<text>{{ '、' }}</text>
				<text class="active" @click="remark(3)">{{ '《提现服务协议》' }}</text>
			</view>
			<view class="btns">
				<view class="btn" @click="submit(current + 1)">{{ '保存草稿' }}</view>
				<view class="btn active" @click="submit(isSubmit ? '4' : null)">{{ isSubmit ? '立即入驻' : '下一步' }}</view>
			</view>
			<!-- 弹窗 -->
			<md-b-dialog :show.sync="show" :title="dialogTitle" @confirm="handleConfirm">
				<md-picker-area @picker="handleArea" v-if="checkType === 'area_name'" :level="3" />
				<md-picker-aera-time v-model="textValue" :list="areaTimeLabel" v-if="checkType === 'area_time'" @picker="handleArea" />
			</md-b-dialog>
		</view>
	</PageComp>
</template>

<script>
export default {
	data() {
		return {
			current: 0,
			list: ['场馆信息', '场馆认证', '联系人'],
			id: undefined,
			form: {
				name: '',
				area: '',
				address: '',
				business_time: '',
				username: '',
				mobile: '',
				area_name: '',
				inner_room_pic: '',
				licens_pic: '',
				id_card_pic: '',
				id_card_back_pic: ''
			},
			show: false,
			checkValue: null,
			checkType: '',
			areaTimeLabel: ['工作日', '周末'],
			dialogTitle: '',
			isCheck: false
		};
	},
	computed: {
		isSubmit() {
			return this.current === this.list.length - 1;
		}
	},
	methods: {
		async submit(step = null) {
			let { name, area_name, area, business_time, site_num, room_pic, inner_room_pic, licens_pic, id_card_pic, id_card_back_pic, username, mobile, address } = this.form;
			if (this.current === 0) {
				if (!name) return uni.showToast({ icon: 'none', title: '请输入场馆名称' });
				if (!area) return uni.showToast({ icon: 'none', title: '请选择场馆地址' });
				if (!address) return this.$toast('请输入详细地址');
				if (!business_time) return uni.showToast({ icon: 'none', title: '请选择营业时间' });
				if (!site_num) return uni.showToast({ icon: 'none', title: '请输入场地数量' });
				if (!room_pic) return uni.showToast({ icon: 'none', title: '请上传场馆门口照片' });
				if (!inner_room_pic) return uni.showToast({ icon: 'none', title: '请上传场馆环境照片' });
			}
			if (this.current === 1) {
				if (!licens_pic) return uni.showToast({ icon: 'none', title: '请上传营业执照' });
				if (!id_card_pic) return uni.showToast({ icon: 'none', title: '请上传身份证正面' });
				if (!id_card_back_pic) return uni.showToast({ icon: 'none', title: '请上传身份证背面' });
			}
			if (this.current === 2) {
				if (!username) return uni.showToast({ icon: 'none', title: '请输入馆长名称' });
				if (!mobile) return uni.showToast({ icon: 'none', title: '请输入联系电话' });
			}
			if (!this.isSubmit && !step) {
				this.current++;
			} else {
				if (!this.isCheck && this.isSubmit) return this.$toast('请勾选协议');
				let parmas = {
					step: step || '4',
					name,
					area_name,
					business_time,
					site_num,
					room_pic,
					inner_room_pic,
					licens_pic,
					id_card_pic,
					id_card_back_pic,
					username,
					mobile,
					address,
					room_id: this.id,
					code: uni.getStorageSync('unionCode')
				};
				try {
					let { message } = await this.$api.Room.register(parmas);
					await this.$toast(message);
					if (step == 4) uni.navigateBack();
				} catch (e) {
					//TODO handle the exception
				}
			}
		},
		// 弹窗相关
		handleOpen(type, dialogTitle) {
			this.show = true;
			this.checkType = type;
			this.dialogTitle = dialogTitle;
		},
		handleConfirm() {
			// 是否可以关闭
			switch (this.checkType) {
				case 'area_name':
					let value = '';
					this.checkValue.forEach((el) => {
						value += el.label;
					});
					this.form.area = value;
					this.show = false;
					this.form.area_name = this.checkValue.map((el) => el.label).toString();
					break;
				case 'area_time':
					if (this.checkValue && this.checkValue && this.checkValue.split(',').length === this.areaTimeLabel.length) {
						this.form.business_time = this.checkValue;
						this.show = false;
					}
					break;
			}
		},
		handleArea(val) {
			this.checkValue = val;
		},
		timeFormate(value, index) {
			if (!value) return;
			return value.split(',')[index];
		},
		remark(type) {
			uni.navigateTo({
				url: '/pages/mine/settings/detail?type=' + type
			});
		},
		// 获取草稿
		async getPreview() {
			let { data } = await this.$api.Room.getRegister();
			let { area_name } = data;
			let area = '';
			area_name.split(',').map((el) => (area += el));
			this.form = {
				...data,
				area
			};
			console.log(data);
		}
	},
	onLoad(options) {
		const { id } = options;
		this.id = id;
		this.getPreview();
		uni.setNavigationBarColor({
			frontColor: '#ffffff',
			backgroundColor: '#FE6A1C'
		});
	}
};
</script>

<style lang="scss" scoped>
.app-warp {
	background-color: #fff;
}
.top-box {
	background: #ffffff;
	box-shadow: 5rpx 5rpx 13rpx 0px rgba(254, 106, 28, 0.1);
	border-radius: 10rpx;
	margin: 110rpx 30rpx 50rpx;
	padding: 36rpx;
	// position: relative;
	z-index: 1;
	.remark {
		color: $themeColor;
		font-size: 22rpx;
		line-height: 33rpx;
		margin-top: 30rpx;
	}
}
.container {
	margin: 0 44rpx 0 64rpx;
	.item {
		padding-bottom: 40rpx;
		border-bottom: 1rpx solid #e5e5e5;
		&.no-border {
			border: 0;
		}
		.title {
			height: 64rpx;
			line-height: 64rpx;
			color: #333;
			font-size: 26rpx;
			font-weight: bold;
		}
		.flex {
			margin: 0 16rpx;
			.item-divider {
				width: 53rpx;
				flex: none;
			}
		}
		.remark {
			color: #999;
			font-size: 22rpx;
			margin-left: 50rpx;
			font-weight: bold;
			&.id-card {
				margin-left: 16rpx;
				margin-top: 30rpx;
			}
		}
	}
}
.btns {
	margin: 0 43rpx 30rpx;
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	column-gap: 24rpx;
	.btn {
		color: #fff;
		font-size: 30rpx;
		height: 76rpx;
		line-height: 76rpx;
		text-align: center;
		background-color: #bcbcbc;
		border-radius: 35rpx;
		&.active {
			background: #fe6a1c;
			box-shadow: 9rpx 9rpx 35rpx 0px rgba(254, 106, 28, 0.4);
		}
	}
}
.custom-item {
	flex: 1;
	display: flex;
	align-items: center;
	margin-left: 30rpx;
	& > view {
		flex: 1;
		display: flex;
		align-items: center;
		.label {
			font-size: 26rpx;
			color: #333;
			font-weight: bold;
			flex: none;
			margin-right: 10rpx;
		}
	}
}
.yuedu {
	margin-bottom: 20rpx;
	color: #333;
	font-size: 18rpx;
	font-weight: bold;
	text-align: center;
	.icon-yes-fill {
		color: #999;
		margin-right: 24rpx;
	}
	.active {
		color: $themeColor;
	}
}
</style>

<template>
	<view>
		<PageComp title="接龙详情">
			<view class="content">
				<md-calendar-card :value="time" @change="calendarChange" />
				<scroll-view class="competition-box" :scroll-x="true">
					<view class="items">
						<view class="item flex-center" :class="{ active: item.id === form.id }" v-for="(item, index) in form.other_activity" :key="index" @click="getChainsDetail(item.id)">
							<text class="icon-yes1"></text>
							<view class="fw-bold">{{ item.name }}</view>
							<view class="time flex">
								<text class="icon-clock"></text>
								<view class="ml-4">{{ item.time }}</view>
							</view>
							<view>
								<text class="fw-bold">{{ item.num }}</text>
							</view>
						</view>
					</view>
				</scroll-view>
				<view class="card info-panel" v-if="isShow">
					<view class="flex">
						<view class="label">
							<text class="text">{{ '场馆：' }}</text>
						</view>
						<view class="flex-space-between">
							<text>{{ form.room_name }}</text>
							<view class="btn flex-center">
								<text class="icon-location"></text>
								<text class="ml-6" @click="openLocation(form.latitude, form.longitude, form.room_name)">{{ '导航' }}</text>
							</view>
						</view>
					</view>
					<view class="flex">
						<view class="label">
							<text class="text">{{ '组织者：' }}</text>
						</view>
						<view class="flex-space-between">
							<text>{{ form.main_user }}</text>
							<view class="btn flex-center">
								<text class="icon-phone-fill"></text>
								<text class="ml-6" @click="makePhoneCall(form.room_mobile)">{{ '电话' }}</text>
							</view>
						</view>
					</view>
					<view class="flex">
						<view class="label">
							<text class="text">{{ '费用：' }}</text>
							<text class="remark">{{ '(活动开始前 ' + form.cancel_hours + '小时可取消报名)' }}</text>
						</view>
						<view class="labels">
							<view class="item mr-26 flex-center">{{ '男' + form.men + '元' }}</view>
							<view class="item flex-center">{{ '女' + form.women + '元' }}</view>
						</view>
					</view>
				</view>
				<view class="num-show-panel flex-space-between" v-if="isShow">
					<view class="left flex">
						<view>{{ '已报名(' + form.num + ')' }}</view>
						<view class="ml-30" v-if="form.is_replace_num">{{ '候补(' + form.is_replace_num + '人)' }}</view>
					</view>
					<text :class="personalShow ? 'icon-down' : 'icon-up'" @click="personalClick"></text>
				</view>
				<view class="personal-box" v-if="personalShow">
					<view class="row flex" v-for="item in personalList" :key="item.id">
						<md-avatar :src="item.headpic" :sex="item.sex" :width="64" />
						<view class="center">
							<view class="flex">
								<text>{{ item.nickname }}</text>
								<text class="fs-30">{{ item.remark }}</text>
								<text v-if="item.remark" class="fs-30" :class="item.sign_sex == 1 ? 'icon-man' : 'icon-woman'"></text>
							</view>
							<view class="label">{{ item.strength + item.group }}</view>
						</view>
						<view class="right">
							<view class="time">{{ item.addtime }}</view>
							<view>{{ item.money }}</view>
						</view>
					</view>
				</view>
				<view class="predetermine" v-if="isShow">
					<view v-for="(item, index) in sorceData" :key="index">
						<view
							class="item"
							v-for="(j, k) in item.list"
							:key="k"
							@click="changeSite(j, index, k)"
							:class="{ active: j.type === 1 && (j.id == changeData.site_id || j.id == changeData.exchange_site_id) }"
						>
							<PersonalBox v-if="j.type === 1" :obj="j" />
						</view>
						<view class="item remark flex-center">{{ item.title }}</view>
					</view>
				</view>
				<view class="remark-panel flex" v-if="isShow">{{ '分场说明：' + form.place_desc }}</view>
				<md-panel title="活动说明" v-if="isShow">
					<view class="activity-remark">{{ form.desc }}</view>
				</md-panel>
				<view class="pt-20" v-if="isShow"></view>
				<md-panel title="发表留言" v-if="isShow" @click="show = true">
					<view class="message-panel">
						<view class="item" v-for="(item, index) in form.word" :key="index">
							<view class="flex">
								<md-avatar :sex="item.sex" :width="48" :src="item.headpic" />
								<view class="right">
									<text>{{ item.nickname }}</text>
									<view class="label">{{ item.level }}</view>
								</view>
							</view>
							<view>{{ item.content }}</view>
						</view>
					</view>
				</md-panel>
				<view class="pt-20" v-if="isShow"></view>
			</view>
			<view class="footer-panel" slot="footer">
				<md-b-dialog title="发表留言" :show.sync="show" @confirm="wordConfirm">
					<md-textarea v-model="content" placeholder="请输入留言内容" />
					<view class="pt-20"></view>
				</md-b-dialog>
				<view class="flex-space-between" v-if="isShow && form.status != 4">
					<view class="is-agree">
						<text class="icon icon-yes-fill" @click="check = !check" :class="{ active: check }"></text>
						<text @click="check = !check">{{ '我已阅读并同意' }}</text>
						<text class="active" @click="remark(5)">{{ '《免责条款》' }}</text>
					</view>
					<view class="btn flex-center" @click="submit">
						<view class="fs-30">{{ btnFormate(form.status) }}</view>
						<view class="mt-12" v-if="form.status == 1">
							<text>{{ '报名截止时间：' }}</text>
							<text>{{ diffTime }}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="position-box flex-center" @click="remark(6)">{{ '接龙说明' }}</view>
			<view class="position-chains" v-if="isManage && form.activity_status == 1">
				<view class="position-chains-box flex-center" @click="showManage = !showManage">
					<text>{{ '管理' }}</text>
					<!-- <br /> -->
					<text>{{ '接龙' }}</text>
				</view>
				<view class="extends-box" v-if="showManage">
					<view @click="edit">{{ '编辑活动' }}</view>
					<view @click="cancel">{{ '取消活动' }}</view>
					<view style="letter-spacing: 6rpx" @click="jump">{{ '俱乐部管理' }}</view>
				</view>
			</view>
			<md-modal :show.sync="cancelDialog" @confirm="cancelDialogConfirm">
				<view class="cancel-remark" v-if="form.status == 3">{{ '已过取消报名退款截止时间 可取消报名但无法退款' }}</view>
				<view class="cancel-remark-red">{{ '请确认是否取消报名' }}</view>
			</md-modal>
		</PageComp>
		<canvas canvas-id="shareCanvas" :style="'position: fixed; width: 100%; height: ' + (Math.floor(sysInfo.screenWidth / 2.63) + (50 / 2.63) * 4 + 54) + 'px;'"></canvas>
	</view>
</template>

<script>
import PersonalBox from './components/personal.vue';
import { ObjToPathParams } from '@/utils/tools.js';
export default {
	components: {
		PersonalBox,
	},
	data() {
		return {
			options: {}, // 传进页面的参数
			list: [],
			sorceData: [],
			changeData: {
				site_id: '',
				exchange_site_id: '',
			},
			check: false,
			form: {},
			show: false,
			content: '',
			id: null,
			time: '',
			isManage: false,
			showManage: false,
			diffTime: '',
			down_time: true,
			cancelDialog: false,
			timeDown: null,
			personalList: [],
			personalShow: false,
			sysInfo: {}, // 系统信息
			canvasImg: '',
		};
	},
	computed: {
		isShow() {
			return JSON.stringify(this.form) != '{}';
		},
	},
	async onLoad(options) {
		let { id, time, isManage, code } = options;
		this.options = options;
		this.id = id;
		this.time = new Date(time).valueOf();
		this.isManage = isManage ? true : false;
		const _info = await this.getChainsDetail(id);

		// 开启分享
		wx.showShareMenu({
			withShareTicket: true,
			menus: ['shareAppMessage', 'shareTimeline'],
		});

		// 获取系统的高度,宽度和像素比例
		uni.getSystemInfo({
			success: res => {
				this.sysInfo = res;
			},
		});
		// this.getShareImage(_info);

		// 扫码获取的联盟编码
		if (code) {
			this.$store.commit('SET_UNIONCODE', code);
		}
	},
	methods: {
		calendarChange(val) {
			this.getChainsList(val / 1000);
		},
		btnFormate(status) {
			let name = '';
			switch (status) {
				case 1:
					name = '立即报名';
					break;
				case 2:
				case 3:
					name = '取消报名';
					break;
				case 5:
					name = '候补报名';
					break;
			}
			return name;
		},
		// 获取接龙列表
		async getChainsList(time) {
			let { data } = await this.$api.Chains.getList({ time });
			this.list = data.data || [];
			if (!this.list.length) return (this.form = {});
			this.getChainsDetail(this.list[0].id);
		},
		// 获取接龙详情
		async getChainsDetail(activity_id) {
			this.sorceData = [];
			this.down_time = false;
			clearTimeout(this.timeDown);
			this.timeDown = null;
			this.form = {};
			let { data } = await this.$api.Chains.info({ activity_id });
			this.form = data;
			this.sorceData = data.site_number.map((el, index) => {
				let type = [];
				let personal = data.user_site.filter(item => item.site_number === el);
				for (let i = 1; i <= 6; i++) {
					let obj = {
						type: 0,
					};
					if (personal.some(j => j.sort == i)) {
						obj = {
							type: 1,
							...personal.find(j => j.sort == i),
						};
					}
					type.push(obj);
				}
				return { title: el, list: type };
			});
			if (data.status == 1 || data.status == 5) {
				this.down_time = true;
				this.downTime(data.sign_end_time);
			}
			this.getPeronal();
			return data;
		},
		submit() {
			if (this.form.status === 2 || this.form.status === 3) {
				this.cancelDialog = true;
				return;
			}
			if (!this.check) return this.$toast('请先同意免责条款');
			uni.navigateTo({
				url: '/pages/chains/application?id=' + this.form.id,
			});
		},
		async wordConfirm() {
			if (!this.content) return this.$toast('请输入留言内容');
			await this.$api.Chains.leaveWord({ activity_id: this.form.id, content: this.content });
			this.$toast('发布成功');
			this.show = false;
			this.getChainsDetail(this.form.id);
			this.content = '';
		},
		async changeSite(row) {
			if (!row.type || !this.isManage) return;
			if (!this.changeData.site_id) return (this.changeData.site_id = row.id);
			if (this.changeData.site_id === row.id) return (this.changeData.site_id = '');
			this.changeData.exchange_site_id = row.id;
			this.changeData.activity_id = this.form.id;
			await this.$api.Chains.exchange(this.changeData);
			this.changeData = {
				site_id: '',
				exchange_site_id: '',
			};
			this.getChainsDetail(this.form.id);
			this.$toast('交换成功');
		},
		// 拨打电话
		makePhoneCall(phoneNumber) {
			uni.makePhoneCall({ phoneNumber });
		},
		openLocation(latitude, longitude, name) {
			uni.openLocation({
				latitude: Number(latitude),
				longitude: Number(longitude),
				name,
			});
		},
		edit() {
			this.showManage = false;
			uni.navigateTo({
				url: '/pages/chains/create?id=' + this.form.club_id + '&chains_id=' + this.form.id,
			});
		},
		jump() {
			this.showManage = false;
			uni.navigateTo({
				url: '/pages/club/manage?id=' + this.form.club_id,
			});
		},
		remark(type) {
			uni.navigateTo({
				url: '/pages/mine/settings/detail?type=' + type,
			});
		},
		async cancel() {
			await this.$api.Chains.cancelActivity({ activity_id: this.form.id });
			this.getChainsList(this.time / 1000);
			this.showManage = false;
		},
		// 倒计时
		downTime(endTime) {
			if (!this.down_time) return;
			this.timeDown = setTimeout(() => {
				clearTimeout(this.timeDown);
				this.timeDown = null;
				let value = Date.parse(endTime) / 1000 - Date.parse(new Date()) / 1000;
				this.diffTime = this.showTime(value);
				if (value <= 0 || !this.down_time) return;
				this.downTime(endTime);
			}, 1000);
		},
		showTime(val) {
			if (val < 60) return this.sliceZero(val) + '秒';
			if (val < 60 * 60) {
				let min_total = this.sliceZero(Math.floor(val / 60));
				let sec = this.sliceZero(Math.floor(val % 60));
				return min_total + '分' + sec + '秒';
			}
			let hours = this.sliceZero(Math.floor(val / 3600));
			let m = this.sliceZero(Math.floor((val / 60) % 60));
			let s = this.sliceZero(Math.floor(val % 60));
			return hours + '小时' + m + '分' + s + '秒';
		},
		// 不足60补0
		sliceZero(time) {
			return time < 10 ? '0' + time : time;
		},
		// 取消报名
		async cancelDialogConfirm() {
			await this.$api.Chains.cancel({ activity_id: this.form.id });
			this.$toast('取消成功');
			this.cancelDialog = false;
			this.getChainsDetail(this.form.id);
		},
		// 获取已报名人员
		async getPeronal() {
			let { data } = await this.$api.Chains.signUser({ activity_id: this.form.id });
			this.personalList = data;
			this.personalShow = false;
		},
		personalClick() {
			if (!this.personalList.length) return;
			this.personalShow = !this.personalShow;
		},
		// 画图片
		async getCanvasImaage(imgUrl) {
			return new Promise((resolve, reject) => {
				uni.downloadFile({
					url: this.IMGURL + imgUrl,
					success: function (res) {
						resolve(res.tempFilePath);
					},
					fail: function (err) {
						reject(err);
					},
				});
			});
		},
		// 获取分享的画图
		async getShareImage(info) {
			const { sysInfo } = this;
			const ctx = uni.createCanvasContext('shareCanvas', this);
			const pixel = 2.63;
			const imgWidth = sysInfo.screenWidth;
			const imgHeight = Number((imgWidth / pixel).toFixed(2));
			const fs = 50 / pixel;
			const levelTopTextHeight = imgHeight + 10;
			const imgLeftX = 8;

			return new Promise(async (resolve, reject) => {
				const bgPath = await this.getCanvasImaage('jielong.jpg');
				ctx.drawImage(bgPath, 0, 0, imgWidth, imgHeight);
				ctx.setFillStyle('#666');
				ctx.setFontSize(fs);
				// 男女费用
				const price = await this.getCanvasImaage('img/club/price.png');
				ctx.drawImage(price, imgLeftX, imgHeight - 6 + fs, fs, fs);
				ctx.fillText(`男￥${info.men} 女￥${info.women}`, fs + imgLeftX * 2, levelTopTextHeight + fs);
				// 球馆名称
				const address = await this.getCanvasImaage('img/club/address.png');
				ctx.drawImage(address, imgLeftX, imgHeight + 2 + fs * 2, fs, fs);
				ctx.fillText(`${info.room_name}`, fs + imgLeftX * 2, levelTopTextHeight + 8 + fs * 2);
				// 09/10 周日 19：30~22：00
				const time = await this.getCanvasImaage('img/club/time.png');
				ctx.drawImage(time, imgLeftX, imgHeight + 10 + fs * 3, fs, fs);
				ctx.fillText(`${info.time}`, fs + imgLeftX * 2, levelTopTextHeight + 16 + fs * 3);
				// 已报名:9/36
				const sign = await this.getCanvasImaage('img/club/sign.png');
				ctx.drawImage(sign, imgLeftX, imgHeight + 18 + fs * 4, fs, fs);
				ctx.fillText(`已报名：${info.num}`, fs + imgLeftX * 2, levelTopTextHeight + 24 + fs * 4);
				ctx.draw();
				uni.canvasToTempFilePath({
					x: 0,
					y: 0,
					canvasId: 'shareCanvas',
					success: function (r) {
						resolve(r.tempFilePath);
					},
					fail: function (err) {
						reject(err);
					},
				});
			});
		},
	},
	onUnload() {
		this.downTime = false;
		clearTimeout(this.timeDown);
		this.timeDown = null;
	},
	async onShareAppMessage() {
		const { form, options } = this;
		const path = await this.getShareImage(form);
		const userInfo = uni.getStorageSync('userInfo');
		const paramsStr = ObjToPathParams({ ...options, code: userInfo.code });
		return {
			title: form.activity_name,
			imageUrl: path,
			//如果有参数的情况可以写path
			path: '/pages/chains/chainsDetail?' + paramsStr,
		};
	},
};
</script>

<style lang="scss" scoped>
.content {
	margin: 0 30rpx;
	.competition-box {
		width: 100%;
		margin: 20rpx 0;
		.items {
			display: flex;
			.item {
				width: 218rpx;
				padding: 20rpx 0;
				flex: none;
				margin-right: 18rpx;
				flex-direction: column;
				background-color: #fff;
				border-radius: 20rpx;
				position: relative;
				color: #222;
				font-size: 24rpx;
				border: 3rpx solid #fff;
				&:last-child {
					margin-right: 0;
				}
				.time {
					padding: 4rpx 12rpx;
					background: #ebeaea;
					border-radius: 14rpx;
					margin: 12rpx 0;
				}
				.fw-bold {
					text-align: center;
				}
				.icon-yes1 {
					display: none;
					position: absolute;
					left: 8rpx;
					top: 8rpx;
					color: #ec6826;
				}
				&.active {
					border-color: #fbe5da;
					.icon-yes1 {
						display: inline-block;
					}
					.time {
						background: #fbe5da;
						color: #ec6826;
					}
				}
			}
		}
	}
	.info-panel {
		padding: 30rpx;
		.flex {
			color: #333;
			font-size: 24rpx;
			margin-bottom: 30rpx;
			.label {
				position: relative;
				&::before {
					content: '';
					width: 90%;
					height: 12rpx;
					position: absolute;
					left: -6rpx;
					bottom: 0;
					background-color: #fbe5da;
					transform: perspective(8rpx) rotateX(10deg);
				}
				.text {
					position: relative;
					z-index: 1;
					color: #222;
					font-weight: bold;
				}
				& ~ view {
					flex: 1;
				}
				.remark {
					color: #999;
					font-size: 20rpx;
					position: absolute;
					bottom: -36rpx;
					width: max-content;
					left: 0;
					font-weight: bold;
				}
			}
			.btn {
				height: 34rpx;
				padding: 0 20rpx;
				color: #fe6a1c;
				background-color: #fbe5da;
				border-radius: 18rpx;
				font-size: 20rpx;
			}
			.labels {
				flex: 1;
				display: flex;
				.item {
					height: 30rpx;
					padding: 0 18rpx;
					color: #333;
					background-color: #ebeaea;
					border-radius: 16rpx;
					font-size: 20rpx;
				}
			}
		}
	}
	.num-show-panel {
		height: 80rpx;
		color: #fe6a1c;
		background: #fed9c5;
		border: 2rpx solid #fd8e60;
		border-radius: 20rpx;
		padding: 0 30rpx;
		font-size: 26rpx;
		margin: 20rpx 0;
		.icon-down {
			font-size: 36rpx;
		}
	}
	.predetermine {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		column-gap: 14rpx;
		.item {
			height: 60rpx;
			border: 1rpx solid #e8e8e8;
			background-color: #f2f2f2;
			margin-bottom: 12rpx;
			border-radius: 10rpx;
			&.remark {
				background-color: #fff;
				border-color: #fff;
				color: #333;
				font-size: 22rpx;
				font-weight: bold;
			}
			&.active {
				border-color: #2793e1;
			}
		}
	}
	.remark-panel {
		height: 60rpx;
		background: #ffffff;
		border-radius: 10rpx;
		padding: 0 18rpx;
		color: #222;
		font-size: 22rpx;
		font-weight: bold;
		margin-bottom: 30rpx;
	}
	.activity-remark {
		font-size: 22rpx;
		font-weight: 500;
		color: #333333;
		line-height: 30rpx;
	}
	.message-panel {
		.item {
			padding: 10rpx 0;
			font-size: 22rpx;
			font-weight: 500;
			color: #333333;
			line-height: 30rpx;
			border-top: 1rpx solid #d8d8d8;
			.right {
				font-size: 18rpx;
				color: #333;
				margin-left: 8rpx;
				.label {
					font-size: 13rpx;
					padding: 4rpx 10rpx;
					border: 1rpx solid #2793e1;
					border-radius: 10px;
					color: #2793e1;
					margin-top: 4rpx;
					line-height: 1;
					text-align: center;
				}
			}
		}
	}
}
.footer-panel {
	margin: 20rpx 30rpx;
	.btn {
		flex: none;
		width: 340rpx;
		height: 88rpx;
		background: #fe6a1c;
		box-shadow: 9rpx 9rpx 35rpx 0px rgba(254, 106, 28, 0.4);
		border-radius: 44rpx;
		flex-direction: column;
		font-size: 18rpx;
		color: #fff;
		line-height: 1;
	}
}
.position-box {
	height: 70rpx;
	position: fixed;
	bottom: 200rpx;
	right: 40rpx;
	background: #ffffff;
	border: 2rpx solid #ec6826;
	border-radius: 25rpx;
	padding: 0 30rpx;
	color: #ec6826;
}
.position-chains {
	position: fixed;
	bottom: 280rpx;
	right: 40rpx;
	&-box {
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		color: #fff;
		background-color: $themeColor;
		font-size: 30rpx;
		font-weight: bold;
		flex-direction: column;
		position: relative;
		z-index: 1;
	}
	.extends-box {
		width: 90rpx;
		height: 230rpx;
		text-align: center;
		position: absolute;
		background-color: #ffa474;
		font-size: 18rpx;
		color: #fff;
		border-radius: 40rpx 40rpx 0 0;
		bottom: 100rpx;
		left: 15rpx;
		& > view {
			margin-top: 30rpx;
		}
	}
}
.choose-box {
	margin-bottom: 30rpx;
	.item {
		height: 88rpx;
		border-bottom: 1rpx solid #e5e5e5;
		&:last-child {
			border: 0;
		}
		.label {
			color: #333;
			font-size: 26rpx;
			margin-right: 30rpx;
		}
		.remark {
			color: $color999;
			font-size: 20rpx;
		}
	}
}
.cancel-remark {
	text-align: center;
	color: #666;
	font-size: 30rpx;
	line-height: 44rpx;
	margin-bottom: 50rpx;
	font-weight: bold;
}
.cancel-remark-red {
	font-weight: bold;
	color: #ff3f3f;
	font-size: 30rpx;
	margin-bottom: 50rpx;
	text-align: center;
}
.is-agree {
	color: #222;
	font-size: 24rpx;
	.icon-yes-fill {
		color: #999;
	}
	.active {
		color: $themeColor;
	}
}
.personal-box {
	margin: 0 40rpx 40rpx;
	.row {
		height: 100rpx;
		border-bottom: 1rpx solid #d8d8d8;
		&:last-child {
			border: 0;
		}
		.center {
			flex: 1;
			font-size: 22rpx;
			color: #333;
			margin: 0 12rpx;
			.label {
				display: inline-block;
				font-size: 16rpx;
				font-weight: bold;
				padding: 0 14rpx;
				color: #fff;
				height: 24rpx;
				line-height: 24rpx;
				background: $themeColor;
				border-radius: 20rpx;
			}
			.icon-woman {
				color: $red;
			}
			.icon-man {
				color: #2793e1;
			}
		}
		.right {
			font-size: 16rpx;
			color: #666;
			font-weight: bold;
			line-height: 1;
			text-align: right;
			.time {
				color: #999;
				font-size: 18rpx;
				margin-bottom: 16rpx;
			}
		}
	}
}
</style>

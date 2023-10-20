<template>
	<PageComp :title="form.id ? '编辑接龙' : '发布接龙'" :isApplique="false" navStyle="background: #fff">
		<view class="card">
			<md-title title="接龙信息" />
			<view class="item">
				<view class="left">
					<text class="label">{{ '活动名称' }}</text>
				</view>
				<view class="right">
					<input class="input-box" v-model="form.name" placeholder="日期+周几+羽球活动报名" type="text" placeholder-style="fontSize: 20rpx; color: #999;" :disabled="isEdit" />
					<text class="icon icon-right" v-show="!isEdit" />
				</view>
			</view>
			<view class="item">
				<view class="left">
					<text class="label">{{ '活动开始时间' }}</text>
				</view>
				<view class="right" @click="starttimeClick">
					<view class="input-box">{{ form.start }}</view>
					<text class="icon icon-right" v-show="!isEdit" />
				</view>
			</view>
			<view class="item">
				<view class="left">
					<text class="label">{{ '活动时长' }}</text>
				</view>
				<view class="right" @click="hoursClick">
					<view class="input-box">{{ form.hours_name }}</view>
					<text class="icon icon-right" v-show="!isEdit" />
				</view>
			</view>
			<view class="item">
				<view class="left">
					<text class="label">{{ '活动场馆' }}</text>
				</view>
				<view class="right">
					<input class="input-box" v-model="form.room_name" placeholder="请选择或者输入" type="text" placeholder-style="fontSize: 20rpx; color: #999;" :disabled="isEdit" />
					<!-- <view class="input-box">{{form.room_name}}</view> -->
					<text class="icon icon-right" v-show="!isEdit" @click="jump('/pages/arena/choose')" />
				</view>
			</view>
			<view class="item">
				<view class="left">
					<text class="label">{{ '活动人数' }}</text>
					<text class="remark">{{ '(最多6人一片场地)' }}</text>
				</view>
				<view class="right">
					<md-input-number v-model="form.people_num" isBack @change="numChange" />
				</view>
			</view>
			<view class="item">
				<view class="left">
					<text class="label">{{ '组别' }}</text>
				</view>
				<view class="right" @click="!isEdit && resetConfig('组别', 'group')">
					<view class="input-box">{{ form.group_name }}</view>
					<text class="icon icon-right" v-show="!isEdit" />
				</view>
			</view>
			<view class="item">
				<view class="left">
					<text class="label">{{ '水平' }}</text>
				</view>
				<view class="right" @click="!isEdit && resetConfig('水平', 'strength')">
					<view class="input-box">{{ form.strength_name }}</view>
					<text class="icon icon-right" v-show="!isEdit" />
				</view>
			</view>
			<view class="item">
				<view class="left">
					<text class="label">{{ '固定报名人员' }}</text>
				</view>
				<view class="right" @click="jump('/pages/club/choose?id=' + this.id + '&config=' + JSON.stringify({ type: 'fix' }))">
					<view class="input-box">{{ form.fix_uid_name }}</view>
					<text class="icon icon-right" v-show="!isEdit" />
				</view>
			</view>
			<view class="item">
				<view class="left">
					<text class="label">{{ '组织者' }}</text>
				</view>
				<view class="right" @click="jump('/pages/club/choose?id=' + this.id + '&config=' + JSON.stringify({ type: 'main' }))">
					<view class="input-box">{{ form.main_uid_name }}</view>
					<!-- <input class="input-box" placeholder="俱乐部部长名称+手机号码" type="text" placeholder-style="fontSize: 20rpx; color: #999;"> -->
					<text class="icon icon-right" v-show="!isEdit" />
				</view>
			</view>
			<view class="item block">
				<view class="left">
					<text class="label">{{ '活动说明' }}</text>
				</view>
				<view class="right">
					<md-textarea v-model="form.desc" placeholder="请从这里输入描述" />
				</view>
			</view>
		</view>

		<view class="card">
			<md-title title="接龙费用" />
			<view class="item">
				<view class="left">
					<text class="label">{{ '男' }}</text>
				</view>
				<view class="right">
					<md-input-number :disabled="isEdit" v-model="form.men" isBack unit="¥" />
				</view>
			</view>
			<view class="item">
				<view class="left">
					<text class="label">{{ '女' }}</text>
				</view>
				<view class="right">
					<md-input-number :disabled="isEdit" v-model="form.women" isBack unit="¥" />
				</view>
			</view>
			<view class="item">
				<view class="left">
					<text class="label">{{ '付款方式' }}</text>
				</view>
			</view>
			<view class="item">
				<view class="left">
					<text class="label indentation">{{ '微信' }}</text>
				</view>
				<view class="right">
					<md-radio-circle v-model="form.weixin" disabled />
				</view>
			</view>
			<md-radio v-model="form.pay_aa" :list="payList" :mode="1" :disabled="isEdit">
				<view slot-scope="{ data }">
					<md-radio-circle v-model="data" />
				</view>
			</md-radio>
		</view>

		<view class="card">
			<md-title title="其他设置" />
			<view class="item block">
				<view class="left">
					<text class="label">{{ '场地选择' }}</text>
				</view>
				<view class="right">
					<view class="aear-choose">
						<view class="main">
							<view class="levels" v-for="(item, index) in aearList" :key="index">
								<view class="level" v-for="j in 6" :key="j"></view>
								<view class="level">
									<input class="input-content" v-model="item.title" type="text" maxlength="4" />
								</view>
							</view>
						</view>
						<view class="remark flex">
							<text>{{ '分场说明：' }}</text>
							<input v-model="form.place_desc" type="text" placeholder="请输入分场说明" />
						</view>
					</view>
				</view>
			</view>
			<view class="item">
				<view class="left">
					<text class="label">{{ '可开始报名时间' }}</text>
				</view>
				<view class="right" @click="signSatrtTimeShow = true">
					<view class="input-box">{{ form.sign_start }}</view>
					<text class="icon icon-right" />
				</view>
			</view>
			<view class="item">
				<view class="left">
					<text class="label">{{ '报名截止时间' }}</text>
				</view>
				<view class="right" @click="signEndTimeShow = true">
					<view class="input-box">{{ form.sign_end }}</view>
					<text class="icon icon-right" />
				</view>
			</view>
			<view class="item">
				<view class="left">
					<text class="label">{{ '取消报名退款截止时间' }}</text>
				</view>
				<view class="right" @click="resetConfig('取消报名退款截止时间', 'close')">
					<view class="input-box" v-if="form.cancel_hours">{{ form.cancel_hours + '小时' }}</view>
					<text class="icon icon-right" />
				</view>
			</view>
			<view class="item">
				<view class="left">
					<text class="label">{{ '允许俱乐部之外的人报名' }}</text>
				</view>
				<view class="right">
					<md-radio-circle v-model="form.is_member" />
				</view>
			</view>
			<view class="item">
				<view class="left">
					<text class="label">{{ '报名段位要求' }}</text>
				</view>
				<view class="right" @click="resetConfig('报名段位要求', 'level')">
					<view class="input-box">{{ form.level_name }}</view>
					<text class="icon icon-right" />
				</view>
			</view>
		</view>
		<view slot="footer">
			<!-- 活动开始时间 -->
			<md-time-picker title="活动开始时间" :value="form.start" :show.sync="satrtTimeShow" @confirm="satrtConfirm" />
			<!-- 报名开始时间 -->
			<md-time-picker title="报名开始时间" :value="form.sign_start_time" :show.sync="signSatrtTimeShow" @confirm="signSatrtTimeConfirm" />
			<!-- 报名截止时间 -->
			<md-time-picker title="报名截止时间" :value="form.sign_end_time" :show.sync="signEndTimeShow" @confirm="signEndTimeConfirm" />
			<!-- 活动时长等组合共用弹窗 -->
			<md-b-dialog :show.sync="show" :title="title" @confirm="confirm">
				<md-picker v-if="type === 'hours'" :value="form.hours" :list="hoursList" @picker="hourPick" />
				<md-select-btn v-if="type === 'group'" v-model="form.group" :list="groupList" @change="hourPick" isRightIcon />
				<md-select-btn v-if="type === 'strength'" v-model="form.strength" :list="strengthList" @change="hourPick" isRightIcon />
				<view class="level-box" v-if="type === 'level'">
					<view class="row flex-space-between">
						<view>{{ '1.全部可报' }}</view>
						<md-radio-circle v-model="form.level" />
					</view>
					<view class="row flex">
						<view>{{ '2.根据需求勾选' }}</view>
						<view>
							<text>{{ '段位说明' }}</text>
							<text class="level-box-remark">{{ '(最低报名段位)' }}</text>
						</view>
					</view>
					<md-select-btn :list="levelList" @change="hourPick" v-model="form.level_value" mode="radio" isRightIcon :config="{ label: 'grade', value: 'id' }" />
				</view>
				<view class="close-box flex-center" v-if="type === 'close'">
					<text>{{ '活动开始前' }}</text>
					<input class="input-content" v-model="form.close_hours" type="number" />
					<text>{{ '小时' }}</text>
					<text class="fs-18">{{ '(默认0.5小时前开始)' }}</text>
				</view>
			</md-b-dialog>
			<view class="footer-content">
				<view class="left" @click="form.is_cycle_activity = !form.is_cycle_activity">
					<text class="icon icon-yes-fill" :class="{ active: !form.is_cycle_activity }"></text>
					<text>{{ '周期性活动选择' }}</text>
				</view>
				<view class="btn flex-center" @click="submit">{{ form.id ? '编辑接龙' : '发布接龙' }}</view>
			</view>
		</view>
	</PageComp>
</template>

<script>
export default {
	data() {
		return {
			id: null,
			form: {
				start: '',
				hours: '',
				room_name: '',
				starttime: null,
				people_num: 0,
				men: 0,
				women: 0,
				group_name: '',
				group: [],
				strength: [],
				pay_aa: 0,
				pay_type: '1',
				weixin: true,
				is_member: false,
				is_cycle_activity: false,
				sign_start: '',
				sign_end: '',
				cancel_hours: 0.5,
				close_hours: 0.5,
				level_name: '',
				level_value: '',
				level: false,
				fix_uid: '',
				fix_uid_name: '',
				main_uid: '',
				main_uid_name: '',
				desc: '',
			},
			title: '',
			type: '',
			satrtTimeShow: false,
			signSatrtTimeShow: false,
			signEndTimeShow: false,
			show: false,
			hoursList: [
				{ label: '0.5小时', value: '0.5' },
				{ label: '1小时', value: '1' },
				{ label: '1.5小时', value: '1.5' },
				{ label: '2小时', value: '2' },
				{ label: '2.5小时', value: '2.5' },
				{ label: '3小时', value: '3' },
				{ label: '3.5小时', value: '3.5' },
				{ label: '4小时', value: '4' },
				{ label: '4.5小时', value: '4.5' },
				{ label: '5小时', value: '5' },
				{ label: '5.5小时', value: '5.5' },
				{ label: '6小时', value: '6' },
				{ label: '6.5小时', value: '6.5' },
				{ label: '7小时', value: '7' },
				{ label: '7.5小时', value: '7.5' },
				{ label: '8小时', value: '8' },
				{ label: '8.5小时', value: '8.5' },
				{ label: '9小时', value: '9' },
				{ label: '9.5小时', value: '9.5' },
				{ label: '10小时', value: '10' },
				{ label: '10.5小时', value: '10.5' },
				{ label: '11小时', value: '11' },
				{ label: '11.5小时', value: '11.5' },
				{ label: '12小时', value: '12' },
			],
			checkValue: null,
			// 数组字段集合
			groupList: [
				{ label: '男单', value: '男单' },
				{ label: '男双', value: '男双' },
				{ label: '女单', value: '女单' },
				{ label: '女双', value: '女双' },
				{ label: '混双', value: '混双' },
			],
			strengthList: [
				{ label: '普通', value: '普通' },
				{ label: '熟练', value: '熟练' },
				{ label: '激烈', value: '激烈' },
				{ label: '竞技', value: '竞技' },
			],
			payList: [
				{ label: '不aa活动', value: 0 },
				{ label: 'aa活动', value: 1 },
				{ label: '球费aa', value: 2 },
				{ label: '其他aa', value: 3 },
			],
			aearList: [],
			levelList: [],
		};
	},
	computed: {
		isEdit() {
			return !!this.form.id;
		},
	},
	async onLoad(options) {
		let { id, chains_id } = options;
		this.id = id;
		await this.getDesc();
		await this.getLevel();
		if (chains_id) {
			this.init(chains_id);
		}
	},
	methods: {
		numChange(val) {
			this.aearList = [];
			let num = !val ? 0 : Math.ceil(val / 6);
			for (let i = 0; i < num; i++) {
				this.aearList.push({ title: i + 1 + '号场' });
			}
		},
		satrtConfirm(res) {
			this.form.start = res;
			this.form.starttime = new Date(res).valueOf() / 1000;
		},
		signSatrtTimeConfirm(res) {
			this.form.sign_start = res;
			this.form.sign_start_time = new Date(res).valueOf() / 1000;
		},
		signEndTimeConfirm(res) {
			this.form.sign_end = res;
			this.form.sign_end_time = new Date(res).valueOf() / 1000;
		},
		jump(url) {
			if (this.isEdit) return;
			uni.navigateTo({ url });
		},
		arenaSelect(row) {
			this.form.room_name = row.name;
			this.form.room_id = row.id;
		},
		personalSelect(list, config) {
			this.form[config.type + '_uid_name'] = list.map(el => el.nickname).toString();
			this.form[config.type + '_uid'] = list.map(el => el.uid).toString();
		},
		confirm() {
			if (this.checkValue) {
				if (this.type === 'hours') {
					this.form.hours = this.checkValue.value;
					this.form.hours_name = this.checkValue.label;
				}
				if (this.type === 'group') {
					this.form.group = this.checkValue;
					this.form.group_name = this.checkValue.toString();
				}
				if (this.type === 'strength') {
					this.form.strength = this.checkValue;
					this.form.strength_name = this.checkValue.toString();
				}
				if (this.type === 'level') {
					this.form.level_name = this.form.level ? '全部' : this.checkValue.grade;
					this.form.level_value = this.checkValue.id;
				}
			}
			if (this.type === 'close') {
				this.form.cancel_hours = this.form.close_hours;
			}
			this.show = false;
		},
		hoursClick() {
			if (this.isEdit) return;
			this.resetConfig('活动时长', 'hours');
		},
		resetConfig(title, type) {
			this.title = title;
			this.type = type;
			this.show = true;
			this.checkValue = null;
			this.form.close_hours = this.form.cancel_hours;
		},
		hourPick(row) {
			this.checkValue = row;
		},
		// 获取活动说明和分场说明
		async getDesc() {
			let { data } = await this.$api.Chains.getDesc({ club_id: this.id });
			this.form.desc = data.activity_desc;
			this.form.place_desc = data.place_desc;
		},
		// 获取段位
		async getLevel() {
			let { data } = await this.$api.Config.level();
			this.levelList = data;
		},
		async submit() {
			let {
				id,
				name,
				starttime,
				hours,
				room_id,
				room_name,
				people_num,
				group_name,
				strength_name,
				fix_uid,
				is_member,
				cancel_hours,
				sign_start_time,
				sign_end_time,
				main_uid,
				desc,
				place_desc,
				men,
				women,
				pay_type,
				pay_aa,
				level,
				level_value,
				is_cycle_activity,
			} = this.form;
			let parmas = {
				club_id: this.id,
				activity_id: id,
				name,
				starttime,
				hours,
				room_id,
				room_name,
				people_num,
				group: group_name,
				strength: strength_name,
				fix_uid,
				main_uid,
				desc,
				site_number: this.aearList.map(el => el.title).toString(),
				place_desc,
				men,
				women,
				pay_type,
				pay_aa,
				sign_start_time,
				sign_end_time,
				cancel_hours,
				is_member: is_member ? '2' : '1',
				is_cycle_activity: is_cycle_activity ? '1' : '2',
				level: level ? '0' : level_value,
			};
			let url = id ? 'edit' : 'add';
			await this.$api.Chains[url](parmas);
			await this.$toast(id ? '编辑成功' : '创建成功');
			uni.navigateBack();
		},
		async init(activity_id) {
			let { data } = await this.$api.Chains.info({ activity_id });
			let {
				id,
				activity_name,
				hours,
				men,
				women,
				place_desc,
				starttime,
				desc,
				room_id,
				room_name,
				num,
				group,
				level,
				is_member,
				pay_type,
				pay_aa,
				strength,
				sign_end_time,
				main_uid,
				main_user,
				fix_uid,
				fix_user,
				sign_start_time,
				cancel_hours,
				is_cycle_activity,
				site_number,
			} = data;
			this.form = {
				id,
				name: activity_name,
				start: starttime,
				starttime: new Date(starttime).valueOf() / 1000,
				hours: parseFloat(hours),
				hours_name: hours,
				men: parseFloat(men),
				women: parseFloat(women),
				place_desc,
				desc,
				room_id,
				room_name,
				people_num: parseFloat(num.split('/')[1]),
				group: group.toString(),
				group_name: group.toString(),
				strength: strength.toString(),
				strength_name: strength.toString(),
				sign_end: sign_end_time,
				sign_end_time: new Date(sign_end_time).valueOf() / 1000,
				sign_start: sign_start_time,
				sign_start_time: new Date(sign_start_time).valueOf() / 1000,
				main_uid: main_uid.toString(),
				main_uid_name: main_user.toString(),
				fix_uid: fix_uid.toString(),
				fix_uid_name: fix_user.toString(),
				weixin: true,
				pay_aa,
				pay_type,
				cancel_hours: parseFloat(cancel_hours),
				level: level ? false : true,
				level_value: level,
				level_name: !level ? '全部' : this.levelList.find(el => el.id === level).name,
				is_cycle_activity: is_cycle_activity == 1 ? true : false,
				is_member: is_member == 2 ? true : false,
			};
			this.aearList = site_number.map(el => {
				return { title: el };
			});
		},
		starttimeClick() {
			if (this.isEdit) return;
			this.satrtTimeShow = true;
		},
	},
};
</script>

<style lang="scss" scoped>
.card {
	background: #ffffff;
	box-shadow: 0px 4rpx 4rpx 0px rgba(153, 153, 153, 0.11);
	border-radius: 20rpx;
	margin: 30rpx;
	padding: 30rpx 40rpx 20rpx 20rpx;
	.item {
		min-height: 80rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1rpx solid #d8d8d8;
		color: #999;
		&.block {
			display: block;
		}
		.left {
			font-size: 20rpx;
			height: 80rpx;
			line-height: 80rpx;
			.label {
				color: #666;
				font-size: 24rpx;
				font-weight: bold;
				margin-right: 16rpx;
				&.indentation {
					padding-left: 24rpx;
				}
			}
		}
		.right {
			flex: 1;
			display: flex;
			justify-content: flex-end;
			align-items: center;
			font-size: 24rpx;
			.icon-right {
				font-size: 32rpx;
			}
			.input-box {
				color: #666;
				flex: 1;
				text-align: right;
				margin-right: 16rpx;
			}
			.aear-choose {
				width: 100%;
				border: 1rpx solid #dedede;
				border-radius: 10rpx;
				color: #666;
				font-size: 24rpx;
				margin: 0 0 30rpx 24rpx;
				overflow: hidden;
				.remark {
					padding: 16rpx 20rpx;
				}
				.main {
					background-color: #fff8f4;
					display: grid;
					grid-template-columns: repeat(4, 1fr);
					column-gap: 15rpx;
					.levels {
						background-color: #fff;
						margin-bottom: 16rpx;
						border-left: 1rpx solid #dedede;
						border-right: 1rpx solid #dedede;
						.level {
							height: 56rpx;
							border-bottom: 1rpx solid #dedede;
							.input-content {
								text-align: center;
							}
						}
						&:nth-child(1) {
							border-left: 0;
						}
						&:nth-child(4) {
							border-right: 0;
						}
					}
				}
			}
		}
		&:last-child {
			border: 0;
		}
	}
}
.footer-content {
	margin: 30rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 30rpx;
	font-weight: bold;
	color: $themeColor;
	.btn {
		width: 340rpx;
		height: 88rpx;
		background: #fe6a1c;
		box-shadow: 9rpx 9rpx 35rpx 0px rgba(254, 106, 28, 0.4);
		border-radius: 44rpx;
		color: #ffffff;
	}
	.left {
		.icon-yes-fill {
			margin-right: 18rpx;
			font-size: 22rpx;
			&.active {
				color: #999;
			}
		}
	}
}
.level-box {
	.row {
		height: 80rpx;
		color: #666;
		font-size: 24rpx;
		font-weight: bold;
	}
	&-remark {
		color: #999;
		font-size: 18rpx;
		margin-left: 10rpx;
	}
}
.close-box {
	height: 300rpx;
	font-size: 30rpx;
	color: #666;
	font-weight: bold;
	.input-content {
		text-align: center;
		width: 100rpx;
		font-size: 46rpx;
		color: $themeColor;
		border-bottom: 1rpx solid #999;
		margin: 0 8rpx;
	}
}
::v-deep {
	.md-select-btn {
		height: 300rpx;
	}
	.md-radio {
		.items {
			margin-bottom: 0 !important;
			border-bottom: 1rpx solid #d8d8d8;
			&:last-child {
				border: 0;
			}
			.item {
				height: 80rpx;
				color: #666;
				font-size: 24rpx;
				font-weight: bold;
			}
		}
	}
}
</style>

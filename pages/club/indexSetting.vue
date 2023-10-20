<template>
	<view class="container">
		<view class="card">
			<md-cell label="logo设置">
				<template #value>
					<md-upload-image v-model="info.club_headpic" typeName="club" mode="circle" width="66"></md-upload-image>
				</template>
			</md-cell>
			<md-cell label="俱乐部背景图">
				<template #value>
					<md-upload-image v-model="info.club_back_pic" typeName="club" mode="other" >
						<view class="custom-image flex-center">
							<image
							  class="circle-icon"
							  v-if="info.club_back_pic"
							  :src="info.club_back_pic"
							  mode="aspectFill"
							/>
							 <text v-else class="icon icon-plus-fill fs-30"></text>
						</view>
					</md-upload-image>
				</template>
			</md-cell>
			<md-cell label="俱乐部名称">
				<template #value>
					<input v-model="info.name" class="text-right" />
				</template>
			</md-cell>
			<md-cell label="活动日" @click="handleClick('activity_time', '活动日')" :value="acDataMa(info.activity_time)"></md-cell>
			<md-cell label="成立时间" @click="timeShow = true" :value="info.buildday"></md-cell>
			<md-cell label="俱乐部介绍" @click="editorClick('desc')" />
			<md-cell label="申请设置" @click="handleClick('join_type', '申请设置')" :value="joinType(info.join_type)"></md-cell>
			<md-cell label="转让俱乐部" @click="handleClick('change_user', '转让俱乐部')"></md-cell>
			<md-cell label="启用羽盟卡">
				<template #right>
					<md-radio-circle v-model="info.is_union_card" />
				</template>
			</md-cell>
			<md-cell label="俱乐部公告" @click="editorClick('notice')" />
			<md-cell label="活动场馆" @click="handleOpen('/pages/arena/choose?config=' + JSON.stringify({ key: 'ac_room' }))" :value="info.ac_room_name"></md-cell>
			<md-cell label="分场说明" @click="handleClick('place_desc', '分场说明')" :value="info.place_desc"></md-cell>
			<md-cell label="常住球馆" @click="handleOpen('/pages/arena/choose?config=' + JSON.stringify({ key: 'in_room' }))" :value="info.in_room_name"></md-cell>
			<md-cell label="接龙活动说明" :hasBottomBorder="false" @click="handleClick('activity_desc', '接龙活动说明')" :value="info.activity_desc" />
		</view>
		<!-- 保存按钮 -->
		<view class="mt-40 text-center">
			<md-button type="white" class="save-btn" @click="handleSave">保存</md-button>
		</view>
		<!-- 弹窗 -->
		<md-b-dialog :show.sync="show" :title="title" @confirm="handleConfirm" :confirmText="type === 'change_user' ? '转让' : '确定'">
			<view class="modal-wrapper">
				<!-- 活动日 -->
				<view class="activity_time flex" v-if="type === 'activity_time'">
					<view v-for="item in actDay" :key="item.value" :class="{ item: 'item', active: info.activity_time.includes(item.value) }" @click="handleActDay(item.value)">
						{{ item.label }}
					</view>
				</view>
				<view v-if="type === 'join_type'">
					<md-radio :list="setting" v-model="info.join_type" mode="3" class="wp-100 setting">
						<template v-slot="{ item }">
							<view class="text-left setting-item">{{ item.value + '.' + item.label }}</view>
						</template>
					</md-radio>
				</view>
				<view v-if="type === 'change_user'" class="flex flex-col flex-top changeUser">
					<view class="item" v-for="item in changeUserMsg" :key="item">{{ item }}</view>
					<view class="item flex">
						<text>受让人手机号：</text>
						<input v-model="mobile" placeholder="请输入受让人手机号" />
					</view>
				</view>
				<md-textarea v-if="type === 'place_desc'" v-model="info.place_desc" class="dialog-textarea" placeholder="请输入分场说明"></md-textarea>
				<md-textarea v-if="type === 'activity_desc'" v-model="info.activity_desc" class="dialog-textarea" placeholder="接龙活动说明" />
			</view>
		</md-b-dialog>
		<!-- 成立时间 -->
		<md-time-picker cancelCurrentTime title="成立时间" :value="info.buildday" :level="3" :show.sync="timeShow" @confirm="timeConfirm" format="{y}-{m}-{d}" />
	</view>
</template>

<script>
import { parseTime } from '@/utils/tools.js';
export default {
	data() {
		return {
			id: null,
			info: {
				in_room_name: '',
				ac_room_name: ''
			},
			type: '', // 当前选中的cell类型
			title: '',
			show: false,
			// 活动日
			actDay: [
				{ label: '一', value: '1' },
				{ label: '二', value: '2' },
				{ label: '三', value: '3' },
				{ label: '四', value: '4' },
				{ label: '五', value: '5' },
				{ label: '六', value: '6' },
				{ label: '日', value: '7' }
			],
			// 申请设置
			setting: [
				{ label: '验证加入', value: 1 },
				{ label: '允许任何人加入', value: 2 },
				{ label: '报名活动自动加入', value: 3 }
			],
			// 成立时间
			timeShow: false,
			// 转让说明
			changeUserMsg: [
				'1.转让对象必须为中羽盟小程序授权的手机号用户',
				'2.转让后，原俱乐部部长及管理员自动转为普通成员',
				'3.转让后保留俱乐部所以数据，包含资金、成员等',
				'4.转让引起的任何争议由双方协商解决'
			],
			mobile: ''
		};
	},
	methods: {
		// 跳转链接
		handleOpen(url) {
			if (!url) return;
			uni.navigateTo({
				url
			});
		},
		handleClick(type, title) {
			if (type === 'buildtime') {
				this.timeShow = true;
			} else {
				this.type = type;
				this.title = title;
				this.show = true;
			}
		},
		handleConfirm() {
			const { type, maps } = this;
			if (type === 'change_user') {
				this.changeUserClub();
			}
			this.show = false;
		},
		// 活动日
		handleActDay(val) {
			const s = this.info.activity_time;
			if (!s.includes(val)) {
				if (!s) {
					this.info.activity_time += val;
				} else {
					this.info.activity_time += ',' + val;
				}
			} else {
				this.info.activity_time = this.info.activity_time
					.split(',')
					.filter((item) => item !== val)
					.join();
			}
		},
		// 成立时间
		timeConfirm(time) {
			this.info.buildday = time;
			this.timeShow = false;
		},
		joinType(type) {
			if (!type) return '';
			return this.setting.find(el => el.value == type).label;
		},
		acDataMa(day) {
			if (!day) return '';
			return this.actDay.filter(el => day.split(',').includes(el.value)).map(el => el.label).toString();
		},
    editorChange(html, key) {
      this.info[key] = html;
    },
	editorClick(key) {
		this.$store.commit('SET_EDITOR', this.info[key]);
		uni.navigateTo({
			url: '/pages/editor/index?key=' + key,
		})
	},
		/**
		 * 接口相关
		 */
		// 获取俱乐部详情
		async getInfo(club_id) {
			try {
				const res = await this.$api.Club.home({ club_id });
				let {is_union_card, buildtime} = res.data;
				this.info = {
					...res.data,
					is_union_card: is_union_card == 1? true: false,
					buildday: !buildtime? '': parseTime(buildtime * 1000, '{y}-{m}-{d}'),
				}
				} catch (e) {
				//TODO handle the exception
			}
		},
		// 保存俱乐部信息
		async handleSave() {
			const { club_headpic, name, activity_time, buildday, desc, notice, join_type, is_union_card, in_room_id, ac_room_id, place_desc, club_back_pic, activity_desc } = this.info;
			const params = {
				club_id: this.id,
				club_headpic,
				name,
				activity_time,
				buildtime: parseInt(new Date(buildday).getTime() / 1000),
				desc,
				notice,
				join_type,
				is_union_card: is_union_card? 1: 2,
				in_room_id,
				ac_room_id,
				place_desc,
				club_back_pic,
				activity_desc
			};
			try {
				const { message } = await this.$api.Club.setting(params);
				this.$toast(message);
				this.getInfo(this.id);
			} catch (e) {
				//TODO handle the exception
			}
		},
		// 转让俱乐部
		async changeUserClub() {
			const { id, mobile } = this;
			try {
				const { message } = await this.$api.Club.changeUser({ club_id: id, mobile });
				uni.showModal({
					content: message,
					showCancel: false,
					success: (res) => {
						if (res.confirm) {
							uni.redirectTo({
								url: '/pages/home/other/solitaire'
							});
						}
					}
				});
			} catch (e) {
				//TODO handle the exception
			}
		},
		arenaSelect(row, config) {
			this.info[config.key + '_name'] = row.name;
			this.info[config.key + '_id'] = row.id;
		}
	},
	onLoad(options) {
		const { id } = options;
		this.id = id;
		this.getInfo(id);
	}
};
</script>

<style scoped lang="scss">
.container {
	padding: 27rpx 31rpx;
	.card {
		padding: 7rpx 31rpx;
	}
	.save-btn {
		/deep/ .md-btn {
			width: 380rpx;
			height: 70rpx;
			line-height: 70rpx;
			text-align: center;
			border-radius: 20rpx;
		}
	}
	.dialog-textarea {
		/deep/ .me-textarea {
			margin-bottom: 20rpx;
		}
	}
	.modal-wrapper {
		margin: 70rpx 0 140rpx;
	}
	// 活动日
	.activity_time {
		.item {
			width: 77rpx;
			height: 71rpx;
			line-height: 71rpx;
			background: #e8e8e8;
			border-radius: 10rpx;
			font-size: 34rpx;
			font-weight: bold;
			color: #333333;
			text-align: center;
			&.active {
				background: #ec6826;
				color: white;
			}
			&:not(:last-of-type) {
				margin-right: 16rpx;
			}
		}
	}
	// 申请设置
	.setting {
		/deep/ .md-radio {
			.items {
				&:not(:last-of-type) {
					border-bottom: 1rpx solid $border-color;
				}
			}
		}
		&-item {
			padding: 20rpx 0;
			font-size: 26rpx;
			font-weight: bold;
		}
	}
}

// 转让说明
.changeUser {
	.item {
		padding: 28rpx;
		width: 100%;
		text-align: left;
		&:not(:last-of-type) {
			border-bottom: 1rpx solid $border-color;
		}
	}
}
.custom-image {
	width: 130rpx;
	height: 54rpx;
	border: 1rpx dashed #dedede;
	background: #f1f1f1;
	border-radius: 10rpx;
	overflow: hidden;
	.circle-icon {
	  width: 100%;
	  height: 100%;
	}
}
</style>

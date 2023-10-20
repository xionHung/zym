<template>
	<view class="container">
		<view class="card">
			<md-cell label="头像">
				<template #value>
					<md-upload-image v-model="info.headpic" typeName="user" mode="circle" width="66"></md-upload-image>
				</template>
			</md-cell>
			<md-cell label="昵称">
				<template #value>
					<input v-model="info.nickname" class="text-right" />
				</template>
			</md-cell>
			<md-cell label="性别" @click="handleClick('gender', '性别')" :value="info.sex == 1 ? '男' : '女'"></md-cell>
			<md-cell label="段位自评" @click="handleClick('level', '段位自评')" :value="info.level_name"></md-cell>
			<md-cell label="羽球箴言" @click="handleClick('desc', '羽球箴言')" :value="info.desc"></md-cell>
			<!-- 兵器：racket, 球线：ball_line, 磅数：pounds -->
			<md-cell label="兵器" @click="handleClick('racket', '兵器')" :value="info.racket"></md-cell>
			<md-cell label="球龄" @click="handleClick('ball_age', '球龄')" :value="info.ball_age"></md-cell>
			<md-cell label="年龄段" @click="handleClick('age_group', '年龄段')" :value="info.age_group"></md-cell>
			<md-cell label="城市" @click="handleClick('area_name', '城市')" :value="info.area_name"></md-cell>
			<md-cell label="其他标签" :hasBottomBorder="false" @click="handleClick('label', '其他标签')"></md-cell>
			<!-- 标签 -->
			<view class="tags">
				<!-- 橘色：#ff8a32 蓝色：#13B1FF 紫色：#E959F9 绿色：#23DCC2 红色：#FF5459 -->
				<md-checkable-tag v-model="info.label" :tags="labelList" :config="{ label: 'name', value: 'id' }" :checkedList="checkedList"></md-checkable-tag>
			</view>
		</view>
		<!-- 保存按钮 -->
		<view class="mt-40 text-center">
			<md-button type="white" class="save-btn" @click="handleSave">保存</md-button>
		</view>
		<!-- 弹窗 -->
		<md-b-dialog :show.sync="show" :title="typeName" @confirm="handleConfirm">
			<md-picker-area v-if="type === 'area_name'" @picker="handleArea"></md-picker-area>
			<md-picker v-if="type === 'age_group'" :list="ages" @picker="handlePicker"></md-picker>
			<md-picker v-if="type === 'ball_age'" :list="ballAgelist" @picker="handlePicker"></md-picker>
			<md-picker v-if="type === 'gender'" :list="genders" @picker="handlePicker"></md-picker>
			<md-textarea v-if="type === 'desc'" v-model="info.desc" class="dialog-textarea" placeholder="请输入羽球箴言"></md-textarea>
			<view v-if="type === 'racket'" class="racket-items flex flex-col flex-between hp-100 pl-53 pr-78 pb-40">
				<view class="wp-100 item flex flex-between">
					<text>兵器</text>
					<view class="valuebox">
						<input type="text" v-model="info.racket" class="pl-30 pr-30" />
					</view>
				</view>
				<view class="wp-100 item flex flex-between">
					<text>球线</text>
					<view class="valuebox">
						<input type="text" v-model="info.ball_line" class="pl-30 pr-30" />
					</view>
				</view>
				<view class="wp-100 item flex flex-between">
					<text>磅数</text>
					<view class="valuebox" style="position: relative">
						<input type="text" v-model="info.pounds" class="pl-30 pr-30" />
						<text class="fs-20" style="position: absolute; bottom: 0; right: 10rpx; color: #818181">磅</text>
					</view>
				</view>
			</view>
		</md-b-dialog>
	</view>
</template>

<script>
export default {
	data() {
		return {
			labelList: [],
			show: false,
			type: '',
			typeName: '',
			info: {},
			maps: {}, // 各枚举集合
			genders: [
				{ label: '男', value: 1 },
				{ label: '女', value: 2 }
			],
			ages: [
				{ label: '60后', value: '60后' },
				{ label: '70后', value: '70后' },
				{ label: '80后', value: '80后' },
				{ label: '90后', value: '90后' },
				{ label: '00后', value: '00后' },
				{ label: '10后', value: '10后' }
			],
			ballAges: 30,
			checkedList: []
		};
	},
	computed: {
		ballAgelist() {
			const list = [];
			for (let i = 1; i <= this.ballAges; i++) {
				list.push({ label: i + '年', value: i });
			}
			return list;
		}
	},
	methods: {
		handleClick(type, title) {
			if (!['label', 'level'].includes(type)) {
				this.type = type;
				this.typeName = title;
				this.show = true;
			} else {
				if (type === 'level') {
					uni.navigateTo({
						url: '/pages/mine/person/dan?level=' + this.info.level
					});
				}
			}
		},
		handleArea(area) {
			this.maps = { area };
		},
		handlePicker(val) {
			const { type } = this;
			if (type === 'age_group') {
				this.maps = { ...this.maps, ages: val };
			} else if (type === 'ball_age') {
				this.maps = { ...this.maps, ballAges: val };
			} else if (type === 'gender') {
				this.maps = { ...this.maps, genders: val };
			}
		},
		handleConfirm() {
			const { type, maps } = this;
			// 城市
			if (type === 'area_name') {
				this.info = { ...this.info, area_name: maps.area.map((item) => item.label).join() };
			}
			// 年龄段
			else if (type === 'age_group') {
				this.info = { ...this.info, age_group: maps.ages.value };
			}
			// 球龄
			else if (type === 'ball_age') {
				this.info = { ...this.info, ball_age: maps.ballAges.value };
			}
			// 性别
			else if (type === 'gender') {
				this.info = { ...this.info, sex: maps.genders.value };
			}
			this.show = false;
		},
		// 获取段位
		getDanValue(val) {
			this.info = { ...this.info, level: val.id, level_name: val.name };
		},
		// 提交保存
		handleSave() {
			this.infoSetting();
		},
		/**
		 * 接口相关
		 */
		// 获取用户信息
		async getUserInfo() {
			try {
				const res = await this.$api.User.Info();
				uni.setStorageSync('userInfo', res.data);
				this.info = res.data;
			} catch (e) {
				//TODO handle the exception
			}
		},
		// 保存
		async infoSetting() {
			// 入参
			const { nickname, headpic, sex, level, desc, label, ball_age, age_group, area_name, racket, ball_line, pounds } = this.info;
			const params = {
				nickname,
				headpic,
				sex,
				level,
				desc,
				label,
				ball_age,
				age_group,
				area_name,
				racket,
				ball_line,
				pounds
			};
			try {
				await this.$api.User.setting({ ...params });
				uni.showModal({
					content: '保存成功',
					showCancel: false,
					success: function (res) {
						if (res.confirm) {
							this.getUserInfo();
						}
					}.bind(this)
				});
			} catch (e) {
				console.log(e);
				//TODO handle the exception
			}
		},
		// 标签下拉
		async getLabel() {
			try {
				const res = await this.$api.Config.label();
				this.labelList = res.data;
			} catch (e) {
				//TODO handle the exception
			}
		}
	},
	onLoad() {
		this.getLabel();
		const _info = uni.getStorageSync('userInfo');
		this.info = _info;
		this.checkedList = typeof _info.label != 'string' ? _info.label : (_info.label || '').split(',');
	}
};
</script>

<style scoped lang="scss">
.container {
	padding: 27rpx 31rpx;
	.card {
		padding: 7rpx 31rpx;
		.tags {
			padding: 0 0 50rpx;
			.md-tag {
				margin-bottom: 20rpx;
				&:not(:first-of-type) {
					margin-left: 20rpx;
				}
			}
		}
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
	.racket-items {
		width: 460rpx;
		margin: 0 auto;
		font-size: 30rpx;
		.item {
			&:not(:last-of-type) {
				margin-bottom: 20rpx;
			}
		}
		.valuebox {
			width: 220rpx;
			height: 50rpx;
			line-height: 50rpx;
			background: #eeeeee;
			border-radius: 10rpx;
			text-align: center;
			color: #ff5500;
			padding: 0 10rpx;
		}
	}
}
</style>

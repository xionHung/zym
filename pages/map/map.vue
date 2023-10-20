<template>
	<view class="page-map">
		<!-- 地图 -->
		<map
			id="myMap"
			style="width: 100%; height: 100vh"
			:latitude="location.latitude"
			:longitude="location.longitude"
			:markers="markers"
			:show-location="true"
			@markertap.stop="markertap"
			@regionchange.stop="regionchange"
		/>
		<!-- 回到当前位置 -->
		<view class="btns">
			<button @click="moveTargetCenterLocation" class="rbtn location-btn flex-center" type="primary">
				<image class="loc-icon" :src="IMGURL + 'img/map/re-location.png'"></image>
			</button>
		</view>
		<!-- 搜索 -->
		<view class="search flex">
			<!-- 位置 -->
			<view class="addr flex flex-col">
				<text class="addr-icon iconfont icon-location-fill" @click="toPath('/pages/home/other/check-city')"></text>
				<view>{{ address.cityName ? address.cityName.replace('市', '') : '未定位' }}</view>
			</view>
			<!-- 搜索栏 -->
			<md-search @search="handleSearch" placeholder="搜索球馆"></md-search>
		</view>
		<!-- 球馆 -->
		<view v-show="id" class="bottomRoomInfo">
			<view class="flex">
				<image class="image" :src="roomInfo.room_headpic" mode="aspectFill" />
				<view class="content flex flex-col flex-top flex-between">
					<view class="title flex">
						<text>{{ roomInfo.name }}</text>
						<!-- 联盟 -->
						<image v-if="roomInfo.is_vip == 1" class="union-icon" :src="IMGURL + 'img/club/union.png'" mode="heightFix" />
					</view>
					<view class="label flex">
						<view class="tag" v-for="tag in roomInfo.room_device" :key="tag">{{ tag }}</view>
					</view>
					<view class="distance">{{ roomInfo.distance }}</view>
				</view>
			</view>
			<view class="detail wp-100 text-right">
				<view v-if="roomInfo.is_register == 1" class="btn" @click="toPath('/pages/arena/detail?id=' + roomInfo.id, true)">订场|详情</view>
				<view v-else class="btn" @click="_click">加V认证入驻</view>
			</view>
		</view>
	</view>
</template>

<script>
import { getWXUserLocation } from '@/utils/tools';
import _ from 'loadsh';
export default {
	data() {
		return {
			id: null, // 使用 marker点击事件 需要填写id
			name: '', // 搜索的名称
			location: {
				latitude: null,
				longitude: null,
			},
			markers: [],
			roomList: [], // 当前附近的球馆列表
			roomInfo: {}, // 球馆信息
		};
	},
	computed: {
		address() {
			return this.$store.state.address;
		},
		userinfo() {
			return this.$store.state.userInfo;
		},
	},
	mounted() {
		this.mapCtx = uni.createMapContext('myMap');
	},
	onLoad() {
		// 用户没有绑定手机号，跳转手机授权界面
		this.hasAuthMobile();
	},
	async onShow() {
		const { latitude, longitude } = this.userinfo;
		if (!latitude) {
			// 地理位置授权
			const { latitude, longitude } = await getWXUserLocation();
			this.location = { latitude, longitude };
		} else {
			this.location = { latitude, longitude };
		}
		// 回到当前位置
		this.$nextTick(() => {
			this.mapCtx.moveToLocation();
		});
		this.getRoomList();
	},
	methods: {
		// 判断是否手机授权了
		hasAuthMobile() {
			// 用户没有入住个人信息,跳转我的信息页面进行填写资料
			if (this.userinfo.state == -1) {
				uni.navigateTo({
					url: '/pages/mine/person/create',
				});
				return;
			}
		},
		toPath(url, isFlag) {
			if (!url) return;
			// 用户没有绑定手机号，跳转手机授权界面
			isFlag && this.hasAuthMobile();
			uni.navigateTo({
				url,
			});
		},
		// 移动到当前经纬度位置
		moveTargetCenterLocation({ latitude, longitude }) {
			// 没有入参的情况下
			if (!longitude) {
				// 移动到当前定位的中心区域位置
				this.mapCtx.moveToLocation();
			} else {
				// 移动到入参的中心区域位置
				this.mapCtx.moveToLocation({
					latitude: Number(latitude),
					longitude: Number(longitude),
				});
			}
		},
		// 搜索
		handleSearch: _.debounce(async function (name) {
			this.name = name;
			const obj = await this.getRoomList({ name });
			this.moveTargetCenterLocation(obj);
		}, 500),
		// 点击market回调
		markertap(r) {
			const { markerId } = r.detail;
			this.id = markerId;
			this.roomInfo = this.roomList.find(item => item.id == markerId);
			let { latitude, longitude } = this.roomInfo;
			this.location = { latitude: Number(latitude), longitude: Number(longitude) };
		},
		_click() {
			// 用户没有绑定手机号，跳转手机授权界面
			this.hasAuthMobile();
			if (!!this.userinfo.has_room) return this.$toast('已有球馆，请到首页系统消息中查看账号');
			uni.navigateTo({
				url: '/pages/arena/create?id=' + this.roomInfo.id,
			});
		},
		// 地图视野发生变化时触发
		regionchange: _.debounce(function (e) {
			if (e.causedBy === 'drag') {
				const { latitude, longitude } = e.detail.centerLocation;
				this.location = { latitude, longitude };
				this.getRoomList({ latitude, longitude });
			}
		}, 1500),
		// 点击地图时触发
		// handleMap(e) {
		// 	console.log('handleMap::', e);
		// },
		/**
		 * 接口相关
		 */
		// 获取附近球馆
		async getRoomList(params) {
			const { location } = this;
			try {
				const { data } = await this.$api.Room.getList({ ...location, ...params, pageNum: 1 });
				this.roomList = data.data;
				this.$nextTick(() => {
					this.markers = data.data.map(item => {
						return {
							id: item.id,
							callout: {
								content: item.name,
								display: 'ALWAYS',
							},
							title: item.name,
							width: 50,
							height: 55,
							// joinCluster: true,
							latitude: Number(item.latitude),
							longitude: Number(item.longitude),
							iconPath: this.IMGURL + `img/map/${item.is_register == 1 ? 'makers' : 'makers-gray'}.png`,
						};
					});
				});
				// 存在搜索名称的情况,抛出第一个选项
				if (params.name) {
					return data.data[0];
				}
			} catch (e) {
				//TODO handle the exception
			}
			return {};
		},
	},
};
</script>

<style lang="scss" scoped>
.page-map {
	position: relative;
	.union-icon {
		height: 32rpx;
		margin-left: 6rpx;
	}
	// height: calc(100vh - env(safe-area-inset-bottom));
	.btns {
		position: fixed;
		bottom: 370rpx;
		right: 50rpx;

		.location-btn {
			width: 70rpx;
			height: 70rpx;
			border-radius: 50%;
			background: #fff;
		}

		.loc-icon {
			width: 44rpx;
			height: 44rpx;
		}
	}

	.search {
		position: absolute;
		top: 20rpx;
		left: 30rpx;
		width: 689rpx;
		padding: 30rpx;
		background: #ffffff;
		border-radius: 20rpx;
		.addr {
			height: 61rpx;
			font-size: 24rpx;
			font-weight: bold;
			color: #333333;
			&-icon {
				width: 27rpx;
				height: 34rpx;
				font-size: 34rpx;
				color: #333333;
			}
		}
		/deep/ md-search {
			flex: 1;
		}
	}

	.bottomRoomInfo {
		position: absolute;
		bottom: 20rpx;
		left: 30rpx;
		width: 689rpx;
		height: 240rpx;
		background: #ffffff;
		box-shadow: 0rpx 4rpx 4rpx 0rpx rgba(102, 102, 102, 0.22);
		border-radius: 10rpx;
		padding: 23rpx 24rpx 19rpx;
		.image {
			width: 150rpx;
			height: 132rpx;
			background: #000000;
			border-radius: 20rpx;
			margin-right: 24rpx;
		}
		.content {
			height: 132rpx;
			.title {
				font-size: 34rpx;
				font-weight: bold;
				color: #333333;
				line-height: 31rpx;
			}
			.label {
				.tag {
					width: 81rpx;
					height: 35rpx;
					line-height: 35rpx;
					background: #ededed;
					border-radius: 14rpx;
					font-size: 22rpx;
					font-weight: bold;
					color: #666666;
					text-align: center;
					&:not(:last-of-type) {
						margin-right: 16rpx;
					}
				}
			}
			.distance {
				font-size: 22rpx;
				font-weight: bold;
				color: #666666;
				line-height: 31rpx;
			}
		}
		.detail {
			margin-top: 9rpx;
			display: flex;
			justify-content: flex-end;
			.btn {
				min-width: 188rpx;
				height: 63rpx;
				line-height: 63rpx;
				text-align: center;
				background: #ec6826;
				border-radius: 28rpx;
				font-size: 30rpx;
				font-weight: bold;
				color: #ffffff;
				padding: 0 30rpx;
			}
		}
	}
}
</style>

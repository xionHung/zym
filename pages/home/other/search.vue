<template>
	<view class="search">
		<md-search @search="handleSearch"></md-search>
		<!-- 用户 -->
		<view class="search-card" v-if="info.user.length > 0">
			<view class="title flex">
				<text class="icon-broker primary-color"></text>
				<text class="fw-bold ml-8">用户</text>
			</view>
			<view class="content">
				<view class="item flex" v-for="(item, index) in info.user" :key="item.id">
					<md-avatar :width="63" :src="item.headpic" :sex="item.sex" @click="handleOpen('/pages/mine/person/person?user_id=' + item.id)"></md-avatar>
					<view class="flex flex-col hp-100 flex-between ml-10">
						<text class="fw-bold flex-top-self fs-21">{{ item.nickname }}</text>
						<view class="flex">
							<text class="level mr-8">{{ item.level }}</text>
							<text class="position mr-8" v-for="label in item.label" :key="label">{{ label }}</text>
						</view>
					</view>
				</view>
			</view>
			<!-- 更多 -->
			<view class="more" v-if="info.user.length > 3">
				<view class="flex flex-center" @click="handleOpen('/pages/home/other/arena')">
					<text>更多用户</text>
					<text class="icon-right"></text>
				</view>
			</view>
		</view>
		<!-- 俱乐部 -->
		<view class="search-card" v-if="info.club.length > 0">
			<view class="title flex">
				<text class="iconfont icon-changguan primary-color"></text>
				<text class="fw-bold ml-8">俱乐部</text>
			</view>
			<view class="content">
				<view class="item flex" v-for="item in info.club" :key="item.id" @click="handleOpen('/pages/club/index?id=' + item.id)">
					<md-avatar :width="63" :src="item.club_headpic"></md-avatar>
					<view class="flex flex-col hp-100 flex-between ml-10">
						<view class="flex fw-bold flex-top-self fs-23">
							<text>{{ item.name }}</text>
							<text class="fs-16 text-gray">({{ item.count || 0 }}人)</text>
							<image v-if="item.is_vip == 1" class="h-5 ml-8" :src="IMGURL + 'img/club/union.png'" mode="heightFix" />
						</view>
						<view class="flex flex-top-self">
							<text class="iconfont icon-star primary-color fs-16" v-for="item in item.activity_level" :key="item"></text>
						</view>
					</view>
				</view>
			</view>
			<!-- 更多 -->
			<view class="more" v-if="info.club.length > 3">
				<view class="flex flex-center" @click="handleOpen('/pages/home/other/solitaire')">
					<text>更多俱乐部</text>
					<text class="icon-right"></text>
				</view>
			</view>
		</view>
		<!-- 球馆 -->
		<view class="search-card" v-if="info.room.length > 0">
			<view class="title flex">
				<text class="iconfont icon-changguan primary-color"></text>
				<text class="fw-bold ml-8">球馆</text>
			</view>
			<view class="content">
				<view class="item flex" v-for="item in info.room" :key="item.id" @click="handleOpen('/pages/arena/detail?id=' + item.id)">
					<md-avatar :width="63" :src="item.room_headpic"></md-avatar>
					<view class="flex flex-col hp-100 flex-between ml-10">
						<view class="flex fw-bold flex-top-self fs-23">
							<text>{{ item.name }}</text>
							<!-- <text class="fs-16 text-gray">({{ item.count || 0 }}人)</text>
							<image v-if="item.is_vip == 1" class="h-5 ml-8" :src="IMGURL + 'img/club/union.png'" mode="heightFix" /> -->
						</view>
						<!-- <view class="flex flex-top-self">
							<text class="iconfont icon-star primary-color fs-16" v-for="item in item.activity_level" :key="item"></text>
						</view> -->
					</view>
				</view>
			</view>
			<!-- 更多 -->
			<view class="more" v-if="info.room.length > 3">
				<view class="flex flex-center" @click="handleOpen('/pages/home/other/arena')">
					<text>更多球馆</text>
					<text class="icon-right"></text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import _ from 'loadsh';
export default {
	data() {
		return {
			info: {
				user: [],
				club: [],
				room: [],
			},
			pages: { limit: 3, pageNum: 1 }
		};
	},
	methods: {
		handleOpen(url) {
			uni.navigateTo({
				url
			})
		},
		// 点击搜索回调
		handleSearch: _.debounce(function (title) {
			this.getList(title);
		}, 500),
		/**
		 * 接口相关
		 */
		async getList(title) {
			try {
				const { data } = await this.$api.My.search({ type: 0, title, ...this.pages });
				this.info = data;
			} catch (e) {
				//TODO handle the exception
			}
		}
	},
	onLoad(options) {
		this.getList();
	}
};
</script>
<style>
@import '@/pages/home/index.scss';
</style>
<style lang="scss" scoped>
.search {
	height: 100vh;
	width: 100%;
	background-color: #f7f7f7;
	&-card {
		width: 100%;
		background: linear-gradient(0deg, rgba(255, 255, 255, 0.78) 75%, rgba(255, 210, 186, 0.71) 100%);
		box-shadow: 0rpx 4rpx 4rpx 0rpx rgba(153, 153, 153, 0.11);
		border-radius: 20rpx;
		padding: 20rpx 30rpx;
		&:not(:first-of-type) {
			margin-top: 20rpx;
		}
		.content {
			padding: 0 41rpx;
			.item {
				height: 91rpx;
				padding: 14rpx 0;
				border-bottom: 1rpx solid $border-color;
			}
		}
		.more {
			margin: 19rpx auto 0;
		}
	}
}
</style>

<template>
	<view class="page-home" :style="{overflow:showChooseTeam?'hidden':'auto'}">
		<view class="banner-container">
			<HomeBanner height="260rpx" :isInner="true" />
		</view>
		<view class="flex ">
			<view @click="choose(item)" :class="curTabValue==item.value?'item activeItem':'item'" v-for="item in tabList"
				:key="item.value">{{item.title}}</view>
		</view>
		<template v-if="curTabValue==0">
			<view class="content bg mgt20">
				<view class="title">2023年潮州市第三届“贵州大曲杯”羽毛球邀
					请赛邀请赛</view>
				<view class="flex items">
					<text class="iconfont icon-shijian"></text>
					<view class="label">比赛时间:</view>
					<view class="labelV">2023/09/25-2023/09/28</view>
				</view>
				<view class="flex items">
					<text class="iconfont icon-didian"></text>
					<view class="label">比赛地点:</view>
					<view class="labelV">2023/09/25-2023/09/28</view>
				</view>
				<view class="flex items">
					<text class="iconfont icon-jiage"></text>
					<view class="label">报名费用:</view>
					<view class="labelV">2023/09/25-2023/09/28</view>
				</view>
				<view class="flex items" style="align-items: initial;">
					<text class="iconfont icon-shijian"></text>
					<view class="label">报名时间:</view>
					<view class="labelV">
						<view>2023/09/25-2023/09/28</view>
						<view>2023/09/25-2023/09/28</view>
					</view>
			
				</view>
				<view class="flex items">
					<text class="iconfont icon-shijian"></text>
					<view class="label">公示时间:</view>
					<view class="labelV">2023/09/25-2023/09/28</view>
				</view>
				<view class="flex items">
					<text class="iconfont icon-shijian"></text>
					<view class="label">抽签时间:</view>
					<view class="labelV">2023/09/25-2023/09/28</view>
				</view>
			</view>
			<view class="notice">
				<view class="top flex">
					<image src="../../static/image/notice.png" mode=""></image>
					<view class="mgl20 fz32">公告</view>
				</view>
				<view class="bottom">
					飞儿球馆，成立于2008年10月，长期运动人员30-50人，目的在于推广羽毛球运动，为广大羽毛球爱好者提供一个融洽而稳定的以球会友、交流球艺、增进友谊、共同进步的园地，推动本地业余羽毛球运动的普及和竞技水平的提高。
				</view>
			</view>
			<!-- 帖子详情 -->
			<view class="flex flex-between wp-100 mgt30"
				@click="handleItemJump('/pages/mine/person/yudong-life?user_id=' + user_id)">
				<view class="text-black flex fw-bold">
					<text>精彩分享</text>
			
				</view>
			</view>
			<view class="content pl-50 pt-40">
				<!-- 跳转帖子详情 -->
				<view class="item-top flex flex-between br-10">
					<view class="flex1 flex">
						<!-- 头像 -->
						<md-avatar width="55" class="mr-8" src="https://picsum.photos/200/300"></md-avatar>
						<view class="flex1 flex flex-col flex-top">
							<view class="flex flex-between wp-100">
								<text class="fs-20 mb-4">微信用户</text>
							</view>
							<view class="flex flex-between fs-14 wp-100">
								<view class="flex">
									<text class="level mr-8">小妖精</text>
									<text class="position mr-8">教练</text>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view>
					<view class="fs-23 text-black text-cut mt-12 mb-18">title</view>
					<!-- 图片 -->
					<view class="flex flex-between">
						<view class="flex1 br-10 h-52 mr-10">
							<image class="wp-100 hp-100" src="https://picsum.photos/200/300" mode="aspectFill"></image>
						</view>
						<view class="flex flex-col">
							<view class="br-10 mb-10 w-25 h-25">
								<image class="wp-100 hp-100" src="https://picsum.photos/200/300" mode="aspectFill"></image>
							</view>
						</view>
					</view>
					<view class="flex flex-between mt-10 fs-24">
						<view class="flex">
							<view class="flex mr-10">
								<text class="icon-heart mr-8"></text>
								100
							</view>
							<view class="flex mr-10">
								<text class="iconfont icon-message mr-8 fs-34"></text>
								100
							</view>
							<view class="flex mr-10">
								<text class="iconfont icon-fenxiang mr-8 fs-30"></text>
								100
							</view>
						</view>
						<view>12分钟前</view>
					</view>
				</view>
			</view>
			<view class="pics"><text>精彩</text><text>相册</text> </view>
			<view class="flex btns">
				<navigator url="" class="btn">个人报名</navigator>
				<navigator url="" class="btn">领队报名</navigator>
			</view>
		</template>
		<md-modal :show.sync="showChooseTeam" titleCenter hideButton title="选择战队" :hasCancel="false" >
			<scroll-view scroll-y="true" style="height: 150rpx;">
				<view class="chooseteam">
					<view class="teamItem" @click.stop="chooseType(item)" v-for="item in teamList"
						:key="item.value">
						<view :class="item.id==curTeamId?'name nameActive':'name'"><text
								class="flex1">{{item.title}}</text> <text v-if="item.id==curTeamId"
								class="iconfont icon-gouxuan"></text></view>
					</view>
					
				</view>
			</scroll-view>
			
				<view class="popBtn" style="margin-top: 57rpx;">创建战队</view>
				
		</md-modal>
	</view>
</template>

<script>
	import HomeBanner from "@/components/home-banner.vue";
	import MorePop from '@/pages/components/MorePop.vue';
	export default {
		components: {
			HomeBanner,
			MorePop
		},
		data() {
			return {
				showChooseTeam:true,
				curTabValue: 0,
				curTeamId:1,
				teamList:[
					{
						title:"test",
						id:1
					},{
						title:"test",
						id:1
					},{
						title:"test",
						id:1
					},{
						title:"test",
						id:1
					},{
						title:"test",
						id:1
					},{
						title:"test",
						id:1
					},{
						title:"test",
						id:1
					},{
						title:"test",
						id:1
					},{
						title:"test",
						id:1
					},{
						title:"test",
						id:1
					},{
						title:"test",
						id:1
					},
				],
				tabList: [{
						title: "首页",
						value: 0
					},
					{
						title: "规程",
						value: 1
					},
					{
						title: "选手",
						value: 2
					},
					{
						title: "秩序册",
						value: 3
					},
					{
						title: "赛况",
						value: 4
					},
					{
						title: "成绩册",
						value: 5
					},
				]
			}
		},
		methods: {
			choose(item) {

			}
		}
	}
</script>

<style lang="scss">
	@import '@/pages/home/index.scss';

	page {

		background: rgba(247, 247, 247, 0.39);
	}

	.page-home {
		display: flex;
		flex-direction: column;
		padding: 0 30rpx;
		padding-bottom: 88rpx;
	}

	.banner-container {
		margin-bottom: 30rpx;
	}

	.item {
		padding: 10rpx 20rpx;
		margin-right: 28rpx;
		border-radius: 6rpx;
		color: #666666;
		font-size: 22rpx;

		background: rgba(228, 225, 224, 0.39);
	}

	.item:last-child {
		margin-right: 0;
	}

	.activeItem {

		color: #FE6A1C;
		background: rgba(255, 202, 174, 0.39);
	}
	.bg{
		background-size: cover;
		background-image: url(https://api.unicamp.cn/uploads/room/game/ssbj.png) ;
		border-radius: 10rpx !important;
	}
	.content {
		padding: 30rpx;
		border-radius: 6rpx;
		
		.items {
			margin-bottom: 20rpx;
		}

		.title {
			height: 90rpx;
			font-size: 32rpx;
			font-family: PingFang SC;
			font-weight: bold;
			line-height: 45rpx;
			color: #000000;
			opacity: 1;
			margin-bottom: 30rpx;
		}

		.icon-shijian,
		.icon-jiage,
		.icon-didian {
			color: #999999;
			font-size: 28rpx;
			margin-right: 12rpx;
		}

		.label {
			font-size: 26rpx;
			color: #999;
			margin-right: 10rpx;
		}

		.labelV {
			font-size: 26rpx;
			color: #333;
		}
	}

	.notice {
		border-radius: 20rpx;
		background: #fff;

		.top {
			padding: 20rpx 30rpx;
			font-size: 32rpx;
			border-bottom: 2rpx solid #c1c1c1;

			image {
				width: 58rpx;
				height: 58rpx;
			}
		}

		.bottom {
			padding: 30rpx;
			font-size: 24rpx;
			color: #999;
			line-height: 30rpx;
		}
	}

	.pics {
		position: fixed;
		right: 30rpx;
		bottom: 118rpx;
		width: 120rpx;
		height: 120rpx;
		background: rgba(255, 255, 255, 0.39);
		box-shadow: 0rpx 3rpx 12rpx rgba(254, 106, 28, 0.4);
		border-radius: 50%;
		opacity: 1;

		color: #FE6A1C;
		font-size: 28rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		letter-spacing: 2rpx;
	}

	.btn {
		flex: 1;
		text-align: center;

		height: 88rpx;
		line-height: 88rpx;
		background: rgba(255, 255, 255, 1);

		color: #FE6A1C;
		font-size: 30rpx;
	}

	.btn:nth-child(2) {

		background: rgba(254, 106, 28, 1);
		color: #fff;
	}

	.btns {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
	}
	.chooseteam{
		height: 370rpx;
		overflow: visible;
		.teamItem {
			padding: 20rpx;
			font-size: 26rpx;
			display: flex;
			align-items: center;
			margin-right: 0;
			width: 100%;
			.icon-gouxuan{
				color: #FE6A1C;
			}
			.name {
				flex: 1;
				display: flex;
				align-items: center;
		
			}
		
		}
		
	}
	.popBtn{
		width: 416rpx;
		height: 68rpx;
		line-height: 68rpx;
		
		background: rgba(254,106,28,1);
		box-shadow: 1rpx 1rpx 15rpx #FE6A1C;
		opacity: 1;
		text-align: center;
		font-size: 28rpx;
		color: #fff;
		border-radius: 34rpx;
	}
</style>
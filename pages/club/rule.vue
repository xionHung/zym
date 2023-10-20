<template>
	<PageComp title="活跃度规则" :isApplique="false" navStyle="background: #fff" >
		<view class="top">
			<view class="title">{{ '俱乐部当前活跃度' }}</view>
			<view class="top-content flex-center">
				<md-star :number="activityLevel" :width="34" />
				<view class="active">{{ '成员活跃' }}</view>
				<view>{{ '近30天活跃值' + activityValue }}</view>
			</view>
		</view>
		<view class="bottom">
			<view class="title">{{ '俱乐部活跃度规则' }}</view>
			<view class="content">
				<view class="main-title">{{'一.俱乐部活跃度说明'}}</view>
				<view class="su-title active">{{ '俱乐部活跃度表示俱乐部近30天在中羽盟平台上的活跃程度。' }}</view>
				<view class="su-title active">{{ '俱乐部成员每报名完成一次活动，活跃值+1/人，取活动不加分。' }}</view>
				<view class="su-title active">{{ '活跃值每天24时更新' }}</view>
			</view>
			<view class="content">
				<view class="main-title">{{'二.活跃度与活跃值对照表:'}}</view>
				<view class="su-title">{{ '俱乐部活跃值达到对应升级门槛，即立即升级。' }}</view>
				<view class="table-box">
					<view class="flex head">
						<view class="first">{{ '等级' }}</view>
						<view class="second">{{ '升级临界值' }}</view>
					</view>
					<view class="flex" v-for="(item, index) in list" :key="index">
						<view class="first">
							<md-star :number="item.level" :width="32" isFill />
						</view>
						<view class="second">{{item.value}}</view>
					</view>
				</view>
			</view>
		</view>
	</PageComp>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
				activityValue: 0,
				activityLevel: 0,
			}
		},
		onLoad(options) {
			this.activityLevel = options.level;
			this.activityValue = options.value;
			this.init();
		},
		methods: {	
			async init() {
				let { data } = await this.$api.Config.activityLevel();
				this.list = data.map(el => {
					return {
						level: el.id + 1,
						value: el.name,
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	::v-deep {
		.app-container {
			background: #FFF4EE;
			display: flex;
			flex-direction: column;
		}
	}
	.top {
		height: 286rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin: 0 30rpx;
		font-weight: bold;
		.title {
			color: #333;
			font-size: 30rpx;
		}
		&-content {
			flex-direction: column;
			color: #999;
			font-size: 22rpx;
			margin-top: 34rpx;
			.active {
				color: $themeColor;
				font-size: 26rpx;
				line-height: 1;
				margin: 16rpx 0;
			}
		}
	}
	.bottom {
		flex: 1;
		background: #FFFFFF;
		box-shadow: 0px 4rpx 4rpx 0px rgba(153,153,153,0.11);
		border-radius: 30rpx 30rpx 0px 0px;
		padding: 0 30rpx;
		.title {
			color: #333;
			line-height: 1;
			text-align: center;
			margin: 37rpx 0 52rpx 0;
			font-weight: bold;
			font-size: 32rpx;
		}
		.content {
			margin-bottom: 40rpx;
			.main-title {
				color: #333;
				font-weight: bold;
				font-size: 24rpx;
				line-height: 1;
			}
			.su-title {
				font-size: 22rpx;
				font-weight: 500;
				color: #666666;
				line-height: 1;
				margin-top: 20rpx;
				position: relative;
				padding-left: 24rpx;
				&.active {
					&::before {
						content: '';
						width: 6rpx;
						height: 6rpx;
						border-radius: 50%;
						background-color: $themeColor;
						position: absolute;
						left: 12rpx;
						top: calc(50% - 4rpx);
					}
				}
			}
		}
		.table-box {
			border-radius: 20rpx;
			border: 1rpx solid #B83F00;
			margin: 30rpx 40rpx;
			font-size: 28rpx;
			color: #333;
			overflow: hidden;
			& > .flex {
				border-bottom: 1rpx solid #B83F00;
				&:last-child {
					border-bottom: 0;
				}
			}
			.first {
				width: 256rpx;
				flex: none;
				text-align: center;
				padding-left: 30rpx;
			}
			.head {
				color: #fff;
				background-color: $themeColor;
				height: 66rpx;
				.first {
					padding-left: 0;
				}
			}
		
			.second {
				height: 66rpx;
				line-height: 66rpx;
				border-left: 1rpx solid #B83F00;
				text-align: center;
				flex: 1;
			}
		}
	}
	
</style>
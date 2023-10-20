<template>
	<view class="content">
		<md-title title="个人" />
		<template v-for="item in list">
			<view class="itemGroup">
				<view class="flex label">
					<text>{{item.name}}</text>
					<text class="mgl10 desc">({{item.desc}})</text>
				</view>
				<view class="flexCls-wrap">
					<view class="btnItem" v-for="item in item.list">{{item}}</view>
					
				</view>
				
			</view>
		</template>
		<md-title title="团体" />
		<template v-for="item in list">
			<view class="itemGroup">
				
				<view class="flexCls-wrap">
					<view class="btnItem" v-for="item in item.list">
						<view>甲组</view>
					<view class="desc">(20-30岁组)</view></view>
					
				</view>
				
			</view>
		</template>
	</view>
</template>

<script>
	export default{
		data(){
			return {
				list:[{
					name:"甲组",
					desc:"20",
					list:["男单","男单","男单","男单","男单","男单","男单","男单","男单","男单","男单","男单",]
				},
				{
					name:"甲组",
					desc:"20",
					list:["男单","男单","男单","男单","男单","男单","男单","男单","男单","男单","男单","男单",]
				},
				]
			}
		}
	}
</script>

<style lang="scss">
	.content {
		margin-top: 30rpx;
		background: rgba(255, 255, 255, 1);
		border-radius: 30rpx 30rpx 0rpx 0rpx;
		padding: 30rpx;

		.itemGroup {
			margin-top: 30rpx;
			.label {
			margin-bottom: 20rpx;
				font-size: 26rpx;
				color: #999999;
			}

			.desc {
				font-size: 20rpx;
			}
			.btnItem{
				padding: 11rpx 33rpx;
				background:#E4E1E0;
				border-radius: 6rpx;
				margin-right: 30rpx;
				color: #666666;
				margin-bottom: 20rpx;
				text-align: center;
				font-size: 26rpx;
				.desc{
					font-size: 20rpx;
				}
			}
			.active{
				color: #FE6A1C;
				background: #FFCAAE;
			}
		}
	}
</style>
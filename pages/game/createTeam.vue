<template>
	<CustomPage title="创建战队" leftStyle="color:#333" navStyle="background: #fff;" bgHeight="0" leftIconColor="#333" titleColor="#333">
		<view slot="content" >
			<view class="title" >
				2023年潮州市第三届“贵州大曲杯”羽毛球邀请赛邀请赛
			</view>
			<view class="mgt20 card">
					<md-title title="队伍信息" />
					<view class="containerJ">
						<md-from-item label="战队名称" v-model="name"  required placeholder="请输入战队名称"  />
						<md-from-item label="领队姓名" textValue="咱队" required placeholder="请输入领队姓名" />
						<md-from-item label="领队电话" border textValue="咱队" required placeholder="请输入领队电话" />
					</view>
					
			</view>
			<view class="btn" @click="submit">创建战队</view>
		</view>
		
	</CustomPage>
</template>

<script>
	export default{
		data(){
			return {
				name:"aaa"
			}
		}
	}
</script>

<style lang="scss">
	page{
		
background: rgba(247,247,247,1);
	}
	.page-container{
		padding: 0 30rpx;
	}
	.title{
		font-size: 32rpx;
		font-family: PingFang SC;
		font-weight: bold;
		line-height: 45rpx;
		color: #333333;
	}
	.card{
		border-radius: 10rpx;
		background: #fff;
		padding: 30rpx 20rpx 0 20rpx;
		.containerJ{
			margin-top: 20rpx;
		}
		
	}
	.btn{
		width: 416rpx;
		height: 88rpx;
		background: rgba(254,106,28,1);
		box-shadow: 1rpx 1rpx 15rpx #FE6A1C;
		opacity: 1;
		border-radius: 44rpx;
		color: #fff;
		text-align: center;
		line-height: 88rpx;
		margin: 121rpx auto;
	}
	
</style>
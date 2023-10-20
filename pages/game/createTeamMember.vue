<template>
	<CustomPage title="添加队员" leftStyle="color:#333" navStyle="background: #fff;" bgHeight="0" leftIconColor="#333"
		titleColor="#333">
		<view slot="content">
			<view class="title">
				2023年潮州市第三届“贵州大曲杯”羽毛球邀请赛邀请赛
			</view>
			<view class="mgt20 card" style="padding: 0 20rpx;">
					<md-from-item label="战队名称" v-model="name" readOnly border/>
			</view>
			<!-- 队员信息 -->
			<view class="mgt20 card">
				<md-title title="队伍信息" />
				<view class="containerJ"> 
					<md-from-item label="姓名" required v-model="name"  />
					<view class="md-from-item border">
						<view class="label">
							<text>性别</text>
							<text class="requried" >{{ '*' }}</text>
						</view>
						<picker mode="selector" :range="sexs" >
							<view class="check-box" @click="_click">
								<view class="input-place">请选择 </view>
								<text class="icon icon-right" />
							</view>
						</picker>
					</view>
					<md-from-item label="手机号码 " required  v-model="name"  />
					<view class="item">
						<view class="title">{{ '上传个人免冠照' }}<text class="requried" >{{ '*' }}</text></view>
						<view class="flex">
							<md-upload-image width="120" height="134" v-model="form.room_pic" mode="square" typeName="room" borderColor="#999" />
							<view class="remark">请勿上传身份证，使用正面清晰照即可</view>
						</view>
					</view>
					<!--  -->
					<view class="md-from-item border">
						<view class="label">
							<text>证件类型</text>
							<text class="requried" >{{ '*' }}</text>
						</view>
						<picker mode="selector" :range="sexs" >
							<view class="check-box" @click="_click">
								<view class="input-place">请选择 </view>
								<text class="icon icon-right" />
							</view>
						</picker>
					</view>
					<md-from-item label="证件号码 " required  v-model="name"  />
					<view class="item">
						<view class="title flexCls" style="margin-bottom: 20rpx;">证明资料<text class="requried" >{{ '*' }}</text>
							<view style="color: #999;font-size: 22rpx;width: 427rpx;">(最多五张)三选一：1.厦门身份证、2.厦门医社保、3.厦门企业主证明</view>
						</view>
						<view class="flex">
							<md-upload-image  v-model="form.room_pic" mode="square" typeName="room" borderColor="#999" />
						</view>
					</view>
					<!-- 风险承诺书 -->
					<view class="md-from-item border">
						<view class="label">
							<text>风险承诺书</text>
							<text class="requried" >{{ '*' }}</text>
						</view>
							<view class="check-box" @click="_click">
								<view class="input-place">点击签字 </view>
								<text class="icon icon-right" />
							</view>
					</view>
					<!-- 身高 -->
					<view class="md-from-item border">
							
							<view class="label flexCls" style="margin-bottom: 20rpx;"><text>身高</text><text class="requried" >{{ '*' }}</text>
								<view style="color: #999;font-size: 22rpx;width: 427rpx;">(未选择则默认男175，女165)</view>
							</view>
						<picker mode="selector" :range="sexs" >
							<view class="check-box" @click="_click">
								<view class="input-place">请选择 </view>
								<text class="icon icon-right" />
							</view>
						</picker>
					</view>
					<!-- 运动员类型 -->
					<view class="md-from-item border">
						<view class="label">
							<text>运动员类型</text>
							
						</view>
						<picker mode="selector" :range="sexs" >
							<view class="check-box" @click="_click">
								<view class="input-place">请选择 </view>
								<text class="icon icon-right" />
							</view>
						</picker>
					</view>
				</view>
			
			</view>
			<view class="btn" @click="submit">保存并继续</view>
		</view>
	</CustomPage>
</template>

<script>
	export default{
		data(){
			return {
				sexs:["男","女"]
			}
		}
	}
</script>

<style lang="scss">
	@import "./game.scss";
	.item {
		padding-bottom: 40rpx;
		border-bottom: 1rpx solid #e5e5e5;
		&.no-border {
			border: 0;
		}
		.title {
			// height: 64rpx;
			// line-height: 64rpx;
			color: #333;
			font-size: 26rpx;
			
			font-weight: normal !important;
		}
		.flex {
			margin: 0 16rpx;
			.item-divider {
				width: 53rpx;
				flex: none;
			}
		}
		.remark {
			color: #999;
			font-size: 22rpx;
			margin-left: 20rpx;
			font-weight: bold;
			&.id-card {
				margin-left: 16rpx;
				margin-top: 30rpx;
			}
		}
	}
	.requried{
		color: $themeColor;
	}
</style>
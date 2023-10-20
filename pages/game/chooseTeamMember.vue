<template>
	<view class="content">
		<view class="title">甲组-混双，请选择2人</view>
		<view class="list cardPerson flexCls-wrap">
			<view class="itemPerson mgt30" v-for="item in userList" @click="choose(item)">
				<view class="header">
					<image src="https://picsum.photos/200/300" mode="" class="headerImage"></image>
					<template  v-if="item.checked">
						<text class="del icon-gx iconfont"></text>
						<text class="number" >{{item.index}}</text>
					</template>
					
				</view>
				<!-- 名字信息 -->
				<view class="personInfo">
					<view>郑美琪</view>
					<view>女(22岁)</view>
				</view>
			</view>
		</view>
		<view class="flexCls-center btnsJ">
			<view class="btnJ">取消</view>
			<view class="btnJ">提交支付</view>
		</view>
	</view>
</template>
 
<script>
	export default{
		data(){
			return {
				userList:[{
					name:"test",
					checked:false,
					desc:"男(30)岁",
					index:null
				},{
					name:"test",
					checked:false,
					desc:"男(30)岁",
					index:null
				},{
					name:"test",
					checked:false,
					desc:"男(30)岁",
					index:null
				},{
					name:"test",
					checked:false,
					desc:"男(30)岁",
					index:null
				},{
					name:"test",
					checked:false,
					desc:"男(30)岁",
					index:null
				},{
					name:"test",
					checked:false,
					desc:"男(30)岁",
					index:null
				},{
					name:"test",
					checked:false,
					desc:"男(30)岁",
					index:null
				},],
				curIndex:1
			}
		},
		methods:{
			choose(item){
				item.checked=!item.checked;
				let oldIndex=item.index
				if(item.checked){
					item.index = this.curIndex;
					this.curIndex++
					
				}else{
					
					item.index =null
					this.curIndex--
				}
				
				for(let user of this.userList){
					
					if(oldIndex<user.index&&!item.checked){
						console.log(item.index,user.index)
						user.index-=1;
					}
				}
				
			}
		}
	}
</script>

<style lang="scss">
	@import "./game.scss";
	page{
		background: #fff;
		padding-bottom: 90rpx;
	}
	.content{
		background: #fff;
	}
	.title {
		padding: 20rpx 30rpx;
		color: #666666;
		font-size: 26rpx;
		background: #e8e8e8;
	}
	.del{
		color: #FE6A1C !important;
	}
	.list{
		background: rgba(255, 255, 255, 1);
		border-radius: 30rpx 30rpx 0rpx 0rpx;
		padding: 30rpx 60rpx;
	}
	.itemPerson{
		margin-top: 0;
		margin-right: 53rpx;
	}
	.number{
		position:absolute;
		right: 0;
		bottom: 0;
		width: 29rpx;
		height: 28rpx;
		border-radius: 50%;
		border: 1px solid #fff;
		background-color: #DB3434;
		font-size: 20rpx;
		color: #fff;
		text-align: center;
		line-height: 28rpx;
	}
	.btnsJ{
		position: fixed;
		justify-content: space-around;
		bottom: 30rpx;
		left: 0;
		width: 100%;
	}
	.btnJ{
		width: 320rpx;
		height: 88rpx;
		border: 1px solid #FE6A1C;
		opacity: 1;
		border-radius: 44rpx;
		line-height: 88rpx;
		text-align: center;
		color: #FE6A1C;
	}
	
	.btnJ:nth-child(2){
		background-color: #FE6A1C;
		color: #fff;
	}
</style>
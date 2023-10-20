<template>
	<view class="collapseBox">
		<view class="flex top" :class="{bor_b:show}" @click="toggle">
			<view class="flex1 flex ">
				<view class="title">{{title}}</view>
				<view class="desc">{{desc}}</view>
			</view>
			<view>
				<slot name="value">{{value}}</slot>
				<text class="icon-right " :class="{rotate:show}"></text>
			</view>
		</view>
		<view v-show="show">
			<slot></slot>
		</view>
		
	</view>
</template>

<script>
	export default{
		props:{
			showArrow:{
				type:Boolean,
				default:true
			},
			title:String,
			desc:String,
			value:String
		},
		data(){
			return {
				show:false
			}
		},
		methods:{
			toggle(){
				this.show=!this.show
			}
		}
	}
</script>

<style lang="scss">
	.collapseBox{
		
		background: #fff;
		.top{
			
			padding: 20rpx;
		}
		.bor_b{
			border-bottom: 1px solid #D8D8D8;
		}
		.title{
			font-size: 26rpx;
			color: #666;
		}
		.desc{
			font-size: 22rpx;
			color: #999;
			margin-left: 10rpx;
		}
		.icon-right{
			color: #000;
			transform: rotate(0deg);
			display: block;
			transition: all .5s;
		}
		.rotate{
			transform: rotate(90deg);
			display: block;
			transition: all .5s;
		}
	}
</style>
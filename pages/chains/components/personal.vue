<template>
	<view class="personal-box">
		<md-avatar :sex="obj.sex" :width="48" :src="obj.headpic" />
		<view class="right">
			<view>
				<text>{{ obj.nickname }}</text>
				<text>{{obj.remark}}</text>
        <text v-if="obj.remark" :class="obj.sign_sex == 1 ? 'icon-man' : 'icon-woman'"></text>
			</view>
			<view class="label flex-center">{{ obj.strength + obj.group }}</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			obj: {
				type: Object,
				default: () => {
          return {
            headpic: '',
          }
        }
			},
		}
	}
</script>

<style lang="scss" scoped>
	.personal-box {
		width: 100%;
		height: 100%;
		background-color: #FE7F3D;
		border-radius: 10rpx;
		display: flex;
		align-items: center;
		padding: 10rpx;
		.right {
			color: #fff;
			font-size: 14rpx;
			font-weight: bold;
			margin-left: 8rpx;
			.label {
				height: 18rpx;
				padding: 0 10rpx;
				border-radius: 10rpx;
				color: #FE6A1C;
				margin-top: 6rpx;
				background-color: #F7F7F7;
			}
		}
    .icon-woman {
      color: $red;
    }
    .icon-man {
      color: #2793e1;
    }
	}
</style>
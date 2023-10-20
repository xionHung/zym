<template>
	<CustomPage title="报名管理" leftStyle="color:#333" navStyle="background: #fff;" bgHeight="0" leftIconColor="#333"
		titleColor="#333">
		<view slot="content">
			<view class="title">
				2023年潮州市第三届“贵州大曲杯”羽毛球邀请赛邀请赛
			</view>
			<!-- 队伍信息 -->
			<view class="mgt20 card">
				<md-title title="队伍信息" />
				<view class="containerJ"> 
					<md-from-item label="战队名称" v-model="name" readOnly />
					<md-from-item label="领队姓名" v-model="name" readOnly />
					<md-from-item label="领队电话" border v-model="name" readOnly />
				</view>

			</view>
			<!-- 报名信息 -->
			
			<view class="mgt20 card">
				<md-title title="报名" />
				<view class="containerJ">
					<view class="md-from-item border">
						<view class="label">
							<text>添加队员</text>
						</view>
						<view class="check-box" @click="_click">
							<view class="input-place">请添加 </view>
							<text class="icon icon-right" />
						</view>
					</view>
					<md-from-item label="选择组别" v-model="name" isCheck readOnly placeholder="请选择" />
					<view class="md-from-item border">
						<view class="label">
							<text>已报组别</text>
							<text>(更换参赛选手)</text>
						</view>
						<view class="check-box" @click="_click">
							<view class="value-box">0组</view>
							<text class="icon icon-right" />
						</view>
						
					</view>
					<!-- 已报组别展开 -->
					<view class="cardPerson">
						<view class="flex">
							<view class="flex1">甲组-双打</view>
							<text class="icon icon-yes-fill" :class="{ active: true }" ></text>
						</view>
						<view class="flexCls-wrap border">
							<view class="itemPerson mgt30" v-for="item in userList">
								<view class="header">
									<image src="https://picsum.photos/200/300" mode="" class="headerImage"></image>
									<!-- 删除掉显示 -->
									<view class="mask"></view>
									<text class="plus icon-fabusaishi iconfont" ></text>
									<!-- 未删除的 -->
									<text class="del icon-sc iconfont" ></text>
								</view>
								<!-- 名字信息 -->
								<view class="personInfo">
									<view>郑美琪</view>
									<view>女(22岁)</view>
								</view>
							</view>
						</view>
						
					</view>
				</view>

			</view>
			
			<!-- 报名费 -->
			<view class="mgt20 card">
				<md-title title="报名费" />
				<view class="containerJ">
					<md-from-item label="报名费" border v-model="name" readOnly />
					<md-from-item label="已报名" inputStyle="color:#DB3434" border v-model="name" readOnly />
				</view>
			
			</view>
			<!-- 队员信息 -->
			<view class="cardPerson ">
				<view class="flexCls-wrap border">
					<view class="itemPerson mgt30" v-for="item in userList">
						<view class="header">
							<image src="https://picsum.photos/200/300" mode="" class="headerImage"></image>
						</view>
						<!-- 名字信息 -->
						<view class="personInfo">
							<view>郑美琪</view>
							<view>女(22岁)</view>
						</view>
					</view>
					<!-- 添加按钮 -->
					<view class="itemPerson mgt30" >
						<view class="header">
							<view style="background: #DCDCDC;" class="headerImage"></view>
							<text class="plus icon-fabusaishi iconfont" ></text>
						</view>
						
					</view>
				</view>
			</view>
			
			<view class="btn" @click="submit">创建战队</view>
		</view>

	</CustomPage>
</template>

<script>
	export default {
		data() {
			return {
				name: "1111",
				userList:[2,2,2,2,2,2,2]
			}
		}
	}
</script>

<style lang="scss">
	@import "./game.scss";

</style>
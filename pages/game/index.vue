<template>
	<view class="page-home">
		<CustomPage title="赛事" style="background: #fff;">
			<view class="page-container" slot="content">
				<view class="search-container flex">
					<view class="input-inner flex1 flex-start">
						<image class="icon" :src="IMGURL + 'img/icon/search.png'" mode="widthFix"></image>
						<input class="input" v-model="keyword" placeholder-style="color: #FDEADF" placeholder="搜索赛事"
							@blur="searchEvent" />
					</view>
					<view class="city flex-center " @click="goChooseCity">
						{{ address.cityName ? address.cityName.replace('市', '') : '未定位' }} <text class="icon-right"
							style="transform: rotate(90deg);display: block;"></text></view>
				</view>
				<view class="banner-container">
					<HomeBanner height="260rpx" :isInner="true" />
				</view>

				<view class="content">
					<view class="tab-container flex-space-between">
						<view class="left">
							<view class="itemPicker" @click="toggleTypePop">{{typeName}} <text
									class="iconfont icon-xiangshang-fill mgl20"
									style="transform: rotate(180deg);"></text>
								<view class="pop" v-if="showTypePop">
									<view class="item" @click.stop="chooseType(item)" v-for="item in typeList"
										:key="item.value">
										<view :class="item.value==curTypeId?'name nameActive':'name'"><text
												class="flex1">{{item.title}}</text> <text v-if="item.value==curTypeId"
												class="iconfont icon-gouxuan"></text></view>
									</view>
								</view>
							</view>
							<view class="itemPicker" @click="toggleStatusPop">{{statusName}} <text
									class="iconfont icon-xiangshang-fill mgl20"
									style="transform: rotate(180deg);"></text>
								<view class="pop" v-if="showStatusPop">

									<view class="item" @click.stop="chooseStatus(item)" v-for="item in statusList"
										:key="item.value">
										<view :class="item.value==curStatusId?'name nameActive':'name'"><text
												class="flex1">{{item.title}}</text> <text v-if="item.value==curStatusId"
												class="iconfont icon-gouxuan"></text></view>
									</view>
								</view>
							</view>
						</view>
						<button class="rbtn right-btn" @click="arenaCreate">
							<text class="icon-plus "></text> 免费发布赛事
						</button>
					</view>
					<mescroll-uni :fixed="false" ref="mescrollRef" @init="mescrollInit" @down="downCallback"
						@up="upCallback">

						<view class="list">
							<view class="item flex-start" v-for="item in listData" :key="item.id"
								@click="jumpDetail(item.id)">
								<image :src="item.room_headpic" mode="aspectFill" class="img"></image>
								<view class="flex1 right">
									<view class="title flex-space-between">
										<view class="flex-start">
											<text>{{ item.name }}</text>
											<image v-if="item.is_vip == 1" class="union-icon"
												:src="IMGURL + 'img/club/union.png'" mode="heightFix" />
										</view>

									</view>
									<view class="address flex">

										<view class="text-ellipsis">{{ item.address }}</view>

									</view>
									<view class="flex-space-between" style="align-items: flex-end">
										<view>2023/08/20-2023/08/24</view>
										<view class="status">已结束</view>
									</view>
								</view>
							</view>
						</view>
					</mescroll-uni>
				</view>
			</view>
		</CustomPage>
		<md-modal :show.sync="showApplyTip" titleCenter hideButton title="温馨提示" :hasCancel="false" >
			<view class="tip">
				<view class="mgt30">新申请用户可免费试用一次</view>
				入驻平台的球馆及俱乐部使用更优惠</view>
				<view class="apply" @click="apply">立即申请</view>
				<view class="flex mgt20">
					<text class="icon icon-yes-fill" :class="{ active: isCheck }" @click="isCheck = !isCheck"></text>
					<view style="font-size: 22rpx;">我已阅读并同意<text class="active">《赛事服务协议》</text></view>
				</view>
		</md-modal>
		<md-modal :show.sync="showApplySuccess" titleCenter hideButton title="申请成功" :hasCancel="false" warpperStyle="height:406rpx">
			<view class="flex mgt30">
				<view class="tipT flex1">账号: <text>18250530833</text> </view>
				<view class="tipT flex1">密码: <text>18250530833</text> </view>
			</view>
			<view class="mgt30 tipT flex">
				<text class="flex1">登陆网址：https://lanhuapp.
com/web/#/item/project</text>
<text class="iconfont icon-fuzhi active"></text>
			</view>
			<view class="warnT mgt30">账号及密码已发送到您的首页系统消息中</view>
			<view class="apply mgt">我知道了</view>
		</md-modal>
	</view>
</template>

<script>
	import HomeBanner from "@/components/home-banner.vue";
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	export default {
		mixins: [MescrollMixin],
		components: {
			HomeBanner,
		},
		data() {
			return {
				style:{height:'406rpx'},
				isCheck: false, 
				showApplyTip:false,
				showApplySuccess:true,
				
				keyword: "",
				current: 0,
				listData: [],
				typeList: [{
						title: "常规赛",
						value: 0
					}, {
						title: "俱乐部分级赛",
						value: 1
					},
					{
						title: "全部",
						value: null
					}
				],
				statusList: [{
						title: "比赛中",
						value: 0
					}, {
						title: "已结束",
						value: 1
					}, {
						title: "报名中",
						value: 2
					}, {
						title: "报名截止",
						value: 3
					}, {
						title: "秩序册发布",
						value: 4
					}, {
						title: "公示",
						value: 5
					},
					{
						title: "抽签",
						value: 6
					},
					{
						title: "全部",
						value: null
					},
				],
				curTypeId: null,
				curStatusId: null,
				typeName: "赛事类型",
				statusName: "赛事状态",

				showTypePop: false,
				showStatusPop: false
			};
		},
		computed: {
			hasRoom() {
				return this.$store.state.userInfo.has_room ? true : false;
			},
			address() {
				return this.$store.state.address;
			},
		},
		methods: {
			apply(){
				if(this.isCheck){
					this.$toast('请先同意赛事服务协议')
					return
				}
			},
			handleOk(){},
			goChooseCity() {
				uni.navigateTo({
					url: "/pages/home/other/check-city"
				})
			},
			toggleTypePop() {
				this.showTypePop = !this.showTypePop;

			},
			toggleStatusPop() {
				this.showStatusPop = !this.showStatusPop;

			},
			chooseType(item) {
				this.curTypeId = item.value;
				this.typeName = item.title
				this.toggleTypePop()
			},
			chooseStatus(item) {
				this.curStatusId = item.value;
				this.statusName = item.title
				this.toggleStatusPop()
			},
			async upCallback(page) {
				let pageNum = page.num; // 页码, 默认从1开始
				let limit = page.size; // 页长, 默认每页10条
				try {
					let {
						data
					} = await this.$api.Room.getList({
						pageNum,
						limit,
						area_name: this.address.cityName || undefined,
						name: this.keyword,
						is_vip: this.current,
					});
					if (!data) return this.mescroll.endErr();
					let curPageData = data.data || [];
					let curPageLen = curPageData.length;
					let totalSize = data.total;
					if (page.num == 1) this.listData = [];
					this.listData = this.listData.concat(curPageData);
					this.mescroll.endBySize(curPageLen, totalSize);
				} catch (err) {
					console.log(err);
				}
			},
			tabChange(type) {
				this.current = type;
				this.mescroll.resetUpScroll();
			},
			searchEvent() {
				this.mescroll.resetUpScroll();
			},
			// 预定
			predetermine(id) {
				uni.navigateTo({
					url: "/pages/arena/predetermine?id=" + id
				});
			},
			// 详情
			jumpDetail(id) {
				uni.navigateTo({
					url: "/pages/arena/detail?id=" + id
				});
			},
			// 创建球馆
			arenaCreate() {
				if (this.hasRoom) return this.$toast("已有球馆，请到首页系统消息中查看账号");
				uni.navigateTo({
					url: "/pages/arena/create"
				});
			},
		},
	};
</script>

<style lang="scss" scoped>
	.page-home {
		.icon-yes-fill {
			color: #999;
			margin-right: 24rpx;
		}
		.tipT{
			color: #666;
			font-size: 25rpx;
		}
			
		.warnT{
			color: #FF6060;
			font-size: 22rpx;
			text-align: center;
		}
		.mgt30{
			margin-top: 30rpx;
		}
		.active {
			color: $themeColor;
		}
		.tip{
			width: 416rpx;
			height: 75rpx;
			font-size: 26rpx;
			font-family: PingFang SC;
			font-weight: 500;
			line-height: 38rpx;
			color: #666666;
			opacity: 1;
			text-align: center;
			
		}
		
		.apply{
			width: 416rpx;
			height: 68rpx;
			background: rgba(254,106,28,1);
			box-shadow: 1rpx 1rpx 15rpx #FE6A1C;
			opacity: 1;
			border-radius: 34rpx;
			line-height: 68rpx;
			color: #fff;
			text-align: center;
			margin-top: 60rpx;
		}
		.union-icon {
			height: 32rpx;
			margin-left: 6rpx;
		}

		.page-container {
			position: relative;
			flex: 1;
			display: flex;
			flex-direction: column;
			padding: 0 30rpx;
			overflow: hidden;

			.search-container {
				flex: 0 0 60rpx;
				margin-top: 48rpx;
				height: 60rpx;
				color: #fff;
				margin-bottom: 32rpx;
				font-size: 28rpx;

				.input-inner {
					padding-left: 20rpx;
					height: 60rpx;
					margin: 0 22rpx;
					background: #fe8849;
					border-radius: 44rpx;

					.icon {
						width: 24rpx;
						height: 26rpx;
						margin-right: 20rpx;
					}

					.input {
						width: 187rpx;
						font-size: 22rpx;
					}
				}

				.city {
					padding: 15rpx 20rpx;
					background: rgba(254, 136, 73, 0.39);
					opacity: 0.6;
					border-radius: 30rpx;
				}

				.btn {
					flex-direction: column;
					font-size: 24rpx;

					.icon {
						width: 28rpx;
						height: 34rpx;
						margin-bottom: 6rpx;
					}
				}
			}

			.banner-container {
				margin-bottom: 20rpx;
			}

			.content {
				position: relative;
				flex: 1;
				overflow-y: auto;
				padding: 20rpx 0;

				.tab-container {
					padding-left: 8rpx;
					margin-bottom: 30rpx;

					.left {
						display: flex;
						font-size: 22rpx;
						color: #666;
						align-items: flex-end;

						.item {
							margin-right: 52rpx;
						}

						.itemPicker {
							padding: 15rpx 15rpx;

							background: rgba(222, 217, 214, 0.39);
							margin-right: 30rpx;
							border-radius: 30rpx;
							font-size: 26rpx;
							display: flex;
							align-items: center;
							position: relative;

							.pop {
								position: absolute;
								top: 100%;
								width: 290rpx;
								padding: 0 30rpx;
								background: #fff;

								box-shadow: 1rpx 1rpx 6rpx #FFCBAF;
								border-radius: 10rpx;
								z-index: 10;

								.pop::after {
									position: absolute;
									top: 00px;
									left: 20rpx;
									display: block;
									content: 'xxxx';
									border: solid 20px;
									border-color: #fff #fff transparent transparent;
									transform: rotate(-45deg);
									box-shadow: 2px -2px 2px #FFCBAF;
									z-index: 11;
								}

								.item {
									padding: 20rpx;
									font-size: 26rpx;
									display: flex;
									align-items: center;
									margin-right: 0;
									width: 100%;

									.name {
										flex: 1;
										display: flex;
										align-items: center;

									}

									.nameActive {
										color: #FE6A1C;
									}
								}
							}
						}

						.active {
							color: $themeColor;
							font-size: 36rpx;
							font-weight: bold;
						}
					}

					.right-btn {
						width: 222rpx;
						height: 60rpx;
						background: rgba(255, 202, 174, 0.6);
						border-radius: 30rpx;
						color: #ff5800;
						font-size: 26rpx;
					}
				}

				.list {
					.item {
						padding: 30rpx;
						height: 198rpx;
						border: 2rpx solid rgba(254, 106, 28, 0.29);
						border-radius: 20rpx;
						margin-bottom: 30rpx;

						background: rgba(247, 245, 244, 0.39);

						.img {
							flex: none;
							width: 140rpx;
							height: 140rpx;
							border-radius: 50%;
							margin-right: 24rpx;
						}

						.right {
							font-size: 22rpx;
							color: #666;
							overflow: hidden;

							.title {
								line-height: 1;
								color: #333;
								font-weight: bold;
								font-size: 28rpx;
							}

							.icon-right {
								font-size: 28rpx;
							}

							.address {
								margin-bottom: 14rpx;
								margin-top: 15rpx;
								font-size: 24rpx;
								color: #666;
							}


							.right-btn {
								width: 222rpx;
								height: 54rpx;
								background: #fe6a1c;
								border-radius: 28rpx;
								font-size: 30rpx;
								color: #fff;
							}

							.status {
								font-size: 24rpx;
							}

							.status0 {

								color: #FE6A1C;
							}

							.status1 {

								color: #999;
							}

							.status2 {

								color: #16BE8A;
							}

							.status3 {

								color: #DB3434;
							}

							.status4 {

								color: #1A74A8;
							}

							.status5 {

								color: #ACA02D;
							}

							.status6 {

								color: #8020D4;
							}
						}
					}
				}
				
			}
		
		}
	}
</style>
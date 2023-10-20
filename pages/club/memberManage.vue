<template>
	<PageComp title="成员管理" :isApplique="false" navStyle="background: #fff" >
		<mescroll-uni :fixed="false" ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback">
			<md-divider :height="30" />
			<view class="box-card">
				<md-title :title="'全部成员(' + main.length + '人)'"></md-title>
				<view class="box">
					<view class="item flex" v-for="item in main" :key="item.uid" @click="_click(item)">
						<md-avatar :width="80" :sex="item.sex" :src="item.headpic" @click.stop="personalMain(item.uid)" />
						<view class="center">
							<view>
								<text>{{ item.nickname }}</text>
								<md-image v-if="item.type === 3" src="img/club/bz.png" :width="70" :height="22" />
								<md-image v-if="item.type === 2" src="img/club/gly.png" :width="70" :height="22" />
							</view>
							<view class="flex">
								<view class="label flex-center">{{ item.level }}</view>
								<view class="label label-box flex-center" v-for="(j, k) in item.label" :key="j">{{ j }}</view>
							</view>
						</view>
						<text class="icon icon-right" />
					</view>
				</view>
			</view>
			<md-divider :height="30" />
			<view class="box-card">
				<md-title title="管理员"></md-title>
				<view class="box">
					<view class="item flex" v-for="item in member" :key="item.uid">
						<md-avatar :width="80" :sex="item.sex" :src="item.headpic" @click.stop="personalMain(item.uid)" />
						<view class="center">
							<view>
								<text>{{ item.nickname }}</text>
								<md-image v-if="item.type === 3" src="img/club/bz.png" :width="70" :height="22" />
								<md-image v-if="item.type === 2" src="img/club/gly.png" :width="70" :height="22" />
							</view>
							<view class="flex">
								<view class="label flex-center">{{ item.level }}</view>
								<view class="label label-box flex-center" v-for="(j, k) in item.label" :key="j">{{ j }}</view>
							</view>
						</view>
					</view>
					<view class="item flex-center" @click="jump('/pages/club/setMember?id=' + id)">
						<text class="icon icon-plus" />
						<text>{{ '添加管理员' }}</text>
					</view>
				</view>
				<md-divider :height="30" @click="jump('/pages/club/indexSetting?id=' + id)"/>
				<md-title title="转让俱乐部" @click="jump('/pages/club/indexSetting?id=' + id)">
					<text class="icon icon-right"></text>
				</md-title>
				<md-divider :height="30" @click="jump('/pages/club/indexSetting?id=' + id)"/>
			</view>
		</mescroll-uni>
		<md-b-dialog title="成员操作" :show.sync="show" customFooter>
			<view class="action-box">
				<view class="item border-bottom" @click="makePhoneCall">{{'拨打电话'}}</view>
				<view class="item border-bottom" @click="editName">{{'修改备注'}}</view>
				<view class="item" @click="show = false,delShow = true">{{'移出俱乐部'}}</view>
				<view class="divider"></view>
				<view class="item" @click="show = false">{{'取消'}}</view>
			</view>
		</md-b-dialog>
		<md-b-dialog title="修改备注" :show.sync="remarkShow" @confirm="remarkConfirm">
			<input class="remark-input" type="text" v-model="remark" placeholder="请输入备注" />
			<md-divider :height="40" />
		</md-b-dialog>
		<md-modal :show.sync="delShow" @confirm="delConfirm">
			<view class="del-red">{{'是否移除该成员?'}}</view>
		</md-modal>
	</PageComp>
</template>

<script>
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	export default {
		mixins: [MescrollMixin],
		data() {
			return {
				main: [],
				member: [],
				id: null,
				selectObj: {},
				show: false,
				remarkShow: false,
				remark: '',
				delShow: false,
			}
		},
		onLoad(options) {
			this.id = options.id;
		},
		methods: {
			async upCallback(page) {
			  let pageNum = page.num; // 页码, 默认从1开始
			  let limit = page.size; // 页长, 默认每页10条
			  try {
			    let { data } =  await this.$api.Club.memberManage({
					pageNum,
					limit,
					club_id: this.id,
				});
			    if (!data) return this.mescroll.endErr();
				this.member = data.admin;
			    let curPageData = data.member.data || [];
			    let curPageLen = curPageData.length;
			    let totalSize =  data.member.total; 
			    if(page.num == 1) this.main = [];
			    this.main = this.main.concat(curPageData);
			    this.mescroll.endBySize(curPageLen, totalSize);
			  } catch (err) {
			    console.log(err)
			  }
			},
			jump(url) {
				uni.navigateTo({ url });
			},
			async personalSelect(rows) {
				await this.$api.Club.addAdmin({club_id: this.id, uid: rows.map(el => el.uid).toString()});
				this.$toast('添加成功');
				this.init();
			},
			_click(item) {
				this.selectObj = item;
				this.show = true;
			},
			// 拨打电话
			makePhoneCall() {
				this.show = false;
			  uni.makePhoneCall({ phoneNumber: this.selectObj.mobile });
			},
			editName() {
				this.show = false;
        if (this.selectObj.nickname.includes(')')) {
          this.remark = this.selectObj.nickname.split('(')[1].split(')')[0];
        } else {
          this.remark = this.selectObj.nickname;
        }
				this.remarkShow = true;
			},
			async remarkConfirm() {
				await this.$api.Club.modifyName({club_id: this.id, uid: this.selectObj.uid, name: this.remark});
				await this.$toast('修改成功');
				this.mescroll.resetUpScroll();
				this.remarkShow = false;
			},
			async delConfirm() {
				await this.$api.Club.remove({club_id: this.id, uid: this.selectObj.uid});
				await this.$toast('移除成功');
				this.mescroll.resetUpScroll();
				this.delShow = false;
			},
			personalMain(user_id) {
				uni.navigateTo({
					url: '/pages/mine/person/person?user_id=' + user_id,
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.icon-right {
		font-size: 32rpx;
		color: #999;
	}
	.box-card {
		background-color: #fff;
		box-shadow: 0 5rpx 8rpx 0 rgba(216,215,215,0.36);
		border-radius: 20rpx;
		padding: 30rpx 74rpx 10rpx 44rpx;
		.box {
			margin-left: 20rpx;
			margin-top: 10rpx;
			.item {
				height: 100rpx;
				border-bottom: 1rpx solid #d8d8d8;
				&:last-child {
					border: 0;
				}
				&.flex-center {
					font-size: 26rpx;
					color: #999;
					font-weight: bold;
					border-bottom: 1rpx solid #d8d8d8;
				}
				.center {
					flex: 1;
					font-size: 30rpx;
					color: #333;
					margin: 0 16rpx;
					.label {
						height: 34rpx;
						border: 1rpx solid #2793E1;
						border-radius: 10rpx;
						font-size: 22rpx;
						padding: 0 16rpx;
						color: #2793E1;
						&.label-box {
							color: $themeColor;
							border-color: $themeColor;
							margin-left: 10rpx;
						}
					}
				}
			}
		}
	}
	.action-box {
		.item {
			height: 80rpx;
			line-height: 80rpx;
			font-size: 30rpx;
			color: #333;
		}
		.divider {
			height: 20rpx;
			background-color: #eee;
			border-radius: 6rpx;
		}
	}
	.remark-input {
		text-align: left;
		border-bottom: 1rpx solid #e8e8e8;
	}
	.del-red {
		font-weight: bold;
		color: #FF3F3F;
		font-size: 30rpx;
		margin-bottom: 50rpx;
		text-align: center;
	}
</style>
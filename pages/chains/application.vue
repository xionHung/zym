<template>
	<PageComp title="接龙报名" :isApplique="false" navStyle="background: #fff" btnText="确认报名" isFooterbtn @confirm="confirm" >
		<view class="box-car">
			<md-title title="报名人数" />
			<view class="box-container">
				<view class="item flex-space-between">
					<view class="flex">
						<text class="mr-50">{{ '男' }}</text>
						<md-input-number v-model="form.man" @rightChange="numberChange('1')" @leftChange="reduceNumber('1')" />
					</view>
					<view class="flex">
						<text class="mr-50">{{ '女' }}</text>
						<md-input-number v-model="form.woman" @rightChange="numberChange('2')" @leftChange="reduceNumber('2')"/>
					</view>
				</view>
				<view class="item flex-space-between">
					<view>
						<view>{{'多人同场'}}</view>
						<text class="remark">{{ '不满6人，同组别水平才可同场' }}</text>
					</view>
					<md-radio-circle v-model="form.is_same_field" />
				</view>
			</view>
		</view>
		<view class="box-car">
			<md-title title="支付方式" />
			<view class="box-container">
				<view class="item flex-space-between">
					<view>{{'微信支付'}}</view>
					<md-radio-circle disabled v-model="form.weixin" />
				</view>
				<view class="item flex-space-between">
					<view>{{'羽盟卡抵扣'}}</view>
					<md-radio-circle v-model="form.is_union_card" />
				</view>
				<view class="item flex-space-between">
					<view>{{'支付金额'}}</view>
					<view class="price">
						<text>{{ '¥' }}</text>
						<text class="ml-10">{{ total }}</text>
					</view>
				</view>
			</view>
		</view>
		<md-c-dialog :show.sync="show" title="报名选择" @cancel="cancel" @confirm="dialogConfirm">
			<view class="center-container">
				<view class="item">
					<view class="mb-20">{{'组别'}}</view>
					<md-select-btn v-model="group" :list="groupList" mode="radio" isRightIcon />
				</view>
				<view class="item">
					<view class="mb-20">{{'水平'}}</view>
					<md-select-btn v-model="strength" :list="strengthList" mode="radio" isRightIcon />
				</view>
			</view>
		</md-c-dialog>
	</PageComp>
</template>

<script>
	export default {
		data() {
			return {
				form: {
					man: 0,
					woman: 0,
					is_replace: '',
					user_data: [],
					
					weixin: true,
					is_same_field: false,
					is_union_card: false,
				},
				id: null,
				show: false,
				sex: '1',
				group: '',
				strength: '',
				manPrice: 0,
				womanPrice: 0,
				groupList: [],
				strengthList: [],
			}
		},
		computed: {
			total() {
				return Number(Number(this.manPrice * this.form.man + this.womanPrice * this.form.woman).toFixed(2));
			}
		},
		onLoad(options) {
			this.id = options.id;
			this.init();
		},
		methods: {
			async confirm() {
				let { user_data,is_same_field, is_replace, is_union_card } = this.form;
				if (!user_data.length) return this.$toast('请添加人数');
				let parmas = {
					activity_id: this.id,
					is_same_field: is_same_field?'1': '',
					is_union_card: is_union_card?'1': '',
					is_replace,
					user_data: this.base64Encode(JSON.stringify(user_data)),
				}
				let {data } = await this.$api.Chains.sign(parmas);
				if (data.pay_status == 1) {
				  // 唤起微信支付
				  uni.requestPayment({
				    provider: 'wxpay',
				    ...data.config,
				    timeStamp: data.config.timestamp,
				    success: () => {
				      uni.showModal({
				        content: '支付成功',
				        showCancel: false,
				        success: function(r) {
				          if (r.confirm) {
				            uni.redirectTo({
				            	url: '/pages/mine/order/index'
				            })
				          }
				        }.bind(this)
				      });
				    },
				    fail(e) {
				      console.log('requestPayment::', e);
				    }
				  });
				} else {
          this.$toast('报名成功');
          setTimeout(() => {
            let routes = getCurrentPages();
            let curRoute = routes[routes.length - 2];
            curRoute.$vm.getChainsDetail(this.id);
            uni.navigateBack();
          }, 1000);
        }
			},
			// 获取配置
			async init() {
				let {data} = await this.$api.Chains.info({activity_id: this.id});
				this.manPrice = Number(data.men);
				this.womanPrice = Number(data.women);
				if (data.status == 5) this.form.is_replace = '1';
				this.groupList = data.group.map(el => {
					return {label: el, value: el};
				});
				this.strengthList = data.strength.map(el => {
					return {label: el, value: el};
				});
			},
			reduceNumber(sex) {
				// 男生数组
				let manList = this.form.user_data.filter(el => el.sex == 1);
				// 女生数组
				let woManList = this.form.user_data.filter(el => el.sex != 1);
				if (sex == 1) {
					manList.splice(0, 1);
				} else {
					woManList.splice(0, 1);
				}
				this.form.user_data = manList.concat(woManList);
			},
			numberChange(sex) {
				this.sex = sex;
				this.show = true;
			},
			cancel() {
				this.group = '';
				this.strength = '';
				if (this.sex == 1) return this.form.man--;
				this.form.woman--;
			},
			dialogConfirm() {
				let { sex, group, strength } = this;
				if(!group) return this.$toast('请选择组别');
				if(!strength) return this.$toast('请选择水平');
				this.form.user_data.push({
					sex,
					group,
					strength,
				});
				this.show = false;
				this.group = '';
				this.strength = '';
			},
			base64Encode(str) {
			  let keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
			  let output = "";
			  let chr1, chr2, chr3, enc1, enc2, enc3, enc4;
			  let i = 0;
			  str = this.utf8Encode(str);//先将UTF-8字符串转成UTF-8编码的二进制数据
			  while (i < str.length) {
			    chr1 = str.charCodeAt(i++);
			    chr2 = str.charCodeAt(i++);
			    chr3 = str.charCodeAt(i++);
			
			    enc1 = chr1 >> 2;
			    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			    enc4 = chr3 & 63;
			
			    if (isNaN(chr2)) {
			      enc3 = enc4 = 64;
			    } else if (isNaN(chr3)) {
			      enc4 = 64;
			    }
			
			    output = output +
			      keyStr.charAt(enc1) + keyStr.charAt(enc2) +
			      keyStr.charAt(enc3) + keyStr.charAt(enc4);
			  }
			  return output;
			},
			 utf8Encode(string) {  
				 string = string.replace(/\r\n/g,"\n");  
				 var utftext = "";  
				 for (var n = 0; n < string.length; n++) {  
					 var c = string.charCodeAt(n);  
					 if (c < 128) {  
						 utftext += String.fromCharCode(c);  
					 } else if((c > 127) && (c < 2048)) {  
						 utftext += String.fromCharCode((c >> 6) | 192);  
						 utftext += String.fromCharCode((c & 63) | 128);  
					 } else {  
						 utftext += String.fromCharCode((c >> 12) | 224);  
						 utftext += String.fromCharCode(((c >> 6) & 63) | 128);  
						 utftext += String.fromCharCode((c & 63) | 128);  
					 }
				 }  
				 return utftext;  
			 }  
		}
	}
</script>

<style lang="scss" scoped>
	.box-car {
		padding: 44rpx;
		background: #FFFFFF;
		box-shadow: 0px 5rpx 8rpx 0px rgba(216,215,215,0.36);
		border-radius: 20rpx 20rpx 0px 0px;
		margin-top: 20rpx;
		.box-container {
			font-size: 30rpx;
			color: #222;
			.item {
				height: 88rpx;
				border-bottom: 1rpx solid #E5E5E5;
				&:last-child {
					border: 0;
				}
				.remark {
					color: $color999;
					font-size: 20rpx;
					line-height: 1;
				}
				.price {
					color: $themeColor;
				}
			}
		}
	}
	.center-container {
		text-align: left;
		margin-bottom: 30rpx;
		.item {
			color: #666;
			font-size: 30rpx;
			padding: 20rpx 0;
			border-bottom: 1rpx solid #e5e5e5;
		}
	}
</style>
<template>
  <PageComp title="编辑" :isApplique="false" navStyle="background: #fff" isFooterbtn btnText="完成" @confirm="confirm">
    <view slot="header" class="tool-box flex">
      <view class="item flex-center" @click="upload"><text class="icon-image fs-32" /></view>
      <view class="item flex-center" @click="htmlSet('header', 'H2')" ><text class="iconfont icon-h2 fs-32" /></view>
      <view class="item flex-center" @click="htmlSet('header', 'H3')" ><text class="iconfont icon-h3 fs-32" /></view>
      <view class="item flex-center" @click="htmlSet('fontWeight', 'bold')" ><text class="iconfont icon-B fs-32" /></view>
      <view class="item flex-center" @click="htmlSet('fontStyle', 'oblique')"><text class="iconfont icon-I fs-32" /></view>
      <view class="item flex-center" @click="htmlSet('underline', '')" ><text class="iconfont icon-U fs-32" /></view>
      <view class="item flex-center" @click="htmlSet('align', 'center')" ><text class="iconfont icon-align-center fs-32" /></view>
      <view class="item flex-center" @click="htmlSet('list', 'ordered')"><text class="iconfont icon-ol fs-32" /></view>
      <view class="item flex-center" @click="htmlSet('list', 'bullet')"><text class="iconfont icon-ul fs-32" /></view>
    </view>
    <editor id="editor" class="ql-container" placeholder="请输入"  @ready="onEditorReady" show-img-size show-img-toolbar show-img-resize />
  </PageComp>
</template>
<script>
import config from '@/configs';
export default {
  data() {
    return {
      editorCtx: null,
      activeIcon: '',
      key: '',
      active: [],
    }
  },
  computed: {
	editorHtml() {
		return this.$store.state.editorHtml;
	}  
  },
  onLoad(options) {
    let {key} = options;
    this.key = key;
  },
  methods: {
    onEditorReady() {
      uni.createSelectorQuery().select('#editor').context((res) => {
        this.editorCtx = res.context;
        this.editorCtx.setContents({
          html: this.editorHtml,
        });
      }).exec()
    },
    upload() {
      uni.chooseMedia({
        count: this.count,
        mediaType: ['image'],
        sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], //从相册选择或者拍照
        success: ({ tempFiles }) => {
          for (let i = 0; i < tempFiles.length; i++) {
            this.uploadImage(tempFiles[i]);
          }
        }
      });
    },
    uploadImage(file) {
      uni.showLoading({
        title: '上传中...'
      });
      // 返回上传的状态
      uni.uploadFile({
        url: config.baseUrl + '/Config/uploadImg',
        filePath: file.tempFilePath,
        name: 'image[]',
        header: {
          'x-token': uni.getStorageSync('token'),
          'content-type': 'multipart/form-data'
        },
        // 入参
        formData: {
          type: 'text'
        },
        success: (uploadFileRes) => {
          let data = JSON.parse(uploadFileRes.data);
          this.editorCtx.insertImage({
            src: data.data.image[0],
          });
        },
        fail: (err) => {
          uni.showToast({
            title: '上传图片失败，请稍候再试！',
            duration: 1000,
            icon: 'none'
          });
        },
        complete: () => {
          uni.hideLoading();
        }
      });
    },
    htmlSet(name, value) {
      this.editorCtx.format(name, value);
      // if (value == 'H3' || value == 'H2') {
      //   if (this.isActive(value)) return this.active = this.active.filter(el => el != 'H3' && el != 'H2');
      //   this.active = this.active.filter(el => el != 'H3' && el != 'H2');
      //   this.active.push(value);
      // }
      // if (this.isActive(value))  return this.active = this.active.filter(el => el != value);
      // this.active.push(value);
    },
    async confirm() {
      let editor = await this.editorCtx.getContents();
      let text = editor.html;
      let routes = getCurrentPages();
      let curRoute = routes[routes.length - 2];
      curRoute.$vm.editorChange(text, this.key);
      uni.navigateBack();
    },
    isActive(type) {
      return this.active.includes(type);
    }
  }
}
</script>
<style lang="scss" scoped>
.ql-container {
  width: 100%;
  height: 100%;
  background: #FFFFFF;
  box-shadow: 0px 4rpx 4rpx 0px rgba(153,153,153,0.11);
  padding: 20rpx;
}
.tool-box {
  height: 80rpx;
  background: #FFEFE6;
  .item {
    flex: 1;
    &.active {
      color: $themeColor;
    }
  }
}
</style>
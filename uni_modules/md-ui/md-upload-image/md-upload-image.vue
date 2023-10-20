<template>
  <view class="md-upload-image">
    <!-- 判断是否为头像类 -->
    <view
      v-if="mode === 'circle'"
      :style="circleStyle"
      class="circle-box"
      @click="chooseImage"
    >
      <slot>
        <view class="circle-avatar flex-center" v-if="!fileSrc.length">
          <image
            :src="IMGURL + 'img/home/bg-banner.png'"
            class="icon-bg"
            mode="widthFix"
          />
        </view>
      </slot>
      <image
        class="circle-icon br-p50"
        v-for="(item, index) in fileSrc"
        :key="index"
        :src="item"
        mode="aspectFill"
      />
    </view>
    <view v-else-if="mode === 'square'" class="square-box">
      <view class="flex square-container">
        <view
          class="square-item"
          :style="squareStyle"
          v-for="(item, index) in fileSrc"
          :key="index"
        >
          <!-- 刪除按鈕 -->
          <view class="close-btn" @click="handleDel(index)" v-if="showDelete">
            <text class="icon-close"></text>
          </view>
          <image class="circle-icon" :src="item" mode="aspectFill" />
        </view>
        <view @click="chooseImage" v-if="fileSrc.length !== count">
          <slot>
            <view class="square flex-center" :style="squareStyle">
              <text class="icon icon-plus-fill"></text>
            </view>
          </slot>
        </view>
      </view>
    </view>
    <view v-else @click="chooseImage">
      <!-- <image :src="fileSrc" :class="{'wp-100':'wp-100', 'hp-100': 'hp-100', 'br-p50': circle }" mode="aspectFit" /> -->
      <slot>上传图片</slot>
    </view>
  </view>
</template>

<script>
import config from '@/configs';
export default {
  props: {
    // 非必填项，主要做默认图片显示处理
    value: String,
    // 上传的接口地址 必填 eg: /upload/image
    uploadUrl: String,
    // 图片的最大上传数量 选填
    count: {
      type: Number,
      default: 1
    },
    // 什么模式 circle  square
    mode: {
      type: String,
      default: () => 'circle'
    },
    // 宽度
    width: {
      type: Number,
      default: () => 210
    },
    // 高度
    height: {
      type: Number,
      default: () => 134
    },
    // 边框颜色
    borderColor: {
      type: String,
      default: () => '#fff'
    },
    typeName: String, //类型 user：用户相关上传 room：球馆相关上传 club：俱乐部相关上传， notice：娱乐圈帖子相关上传
    // 自动上传
    autoUpload: {
      type: Boolean,
      default: false
    },
    circle: {
      type: Boolean,
      default: false
    },
    disabled: Boolean,
    showDelete: {
      type: Boolean,
      default: true,
    }
  },
  computed: {
    fileSrc: {
      get() {
        if (!this.value) return [];
        return this.value.split(',');
      },
      set(val) {
        this.$emit('input', val.toString());
        this.$emit('upload', val.toString());
      }
    },
    circleStyle() {
      return `width: ${this.width}rpx; height: ${this.width}rpx;border-color: ${this.borderColor}; `;
    },
    squareStyle() {
    	return `width: ${this.width}rpx; height: ${this.height}rpx;border-color: ${this.borderColor}; `;
    },
  },
  methods: {
    chooseImage() {
      if (this.disabled) return;
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
      const uploadTask = uni.uploadFile({
        url: config.baseUrl + '/Config/uploadImg',
        filePath: file.tempFilePath,
        name: 'image[]',
        header: {
          'x-token': uni.getStorageSync('token'),
          'content-type': 'multipart/form-data'
        },
        // 入参
        formData: {
          type: this.typeName
        },
        success: (uploadFileRes) => {
          let data = JSON.parse(uploadFileRes.data);
          if (data.code !== 200) return uni.showToast({ icon: 'none', title: data.message });
          if (this.count === 1) return (this.fileSrc = data.data.image);
          this.fileSrc = [...this.fileSrc, data.data.image[0]];
        },
        fail: (err) => {
          // console.error('上传接口报错了:: ', err);
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

      // 监听上传进度
      uploadTask.onProgressUpdate((res) => {
        // console.log('上传进度::', res.progress);
        // console.log('已经上传的数据长度::', res.totalBytesSent);
        // console.log('预期需要上传的数据总长度::', res.totalBytesExpectedToSend);

        // 停止任务 这个看需求加判断
        // uploadTask.abort();
      });
    },
    // 删除图片
    handleDel(idx) {
      const _list = this.fileSrc
      _list.splice(idx, 1);
      this.fileSrc = _list;
    },
  }
};
</script>

<style scoped lang="scss">
.md-upload-image {
  flex: none;
  .circle-icon {
    width: 100%;
    height: 100%;
  }
  .circle-box {
    border-radius: 50%;
    overflow: hidden;
    border: 6rpx solid;
    .circle-avatar {
      width: 100%;
      height: 100%;
      background-color: #f5f5f5;
      .icon-bg {
        width: 66rpx;
        height: 74rpx;
      }
    }
  }
  .square-box {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .square {
      border: 1rpx dashed;
      background: #f1f1f1;
      border-radius: 10rpx;
      position: relative;
      z-index: 1;
      .icon-plus-fill {
        font-size: 60rpx;
        color: #c0c0c0;
      }
    }
    .square-container {
      flex-wrap: wrap;
      .square-item {
        border-radius: 10rpx;
        overflow: hidden;
        border: 1rpx dashed;
        margin-bottom: 20rpx;
        &:not(:nth-of-type(3n)) {
          margin-right: 20rpx;
        }
        .circle-icon {
          width: 100%;
          height: 100%;
        }
        // 刪除按鈕
        position: relative;
        .close-btn {
          position: absolute;
          right: -4rpx;
          top: -4rpx;
          color: white;
          width: 26rpx;
          height: 26rpx;
          line-height: 26rpx;
          text-align: center;
          background: #333333;
          opacity: 0.66;
          border-radius: 20rpx;
          font-size: 18rpx;
          padding-top: 4rpx;
          padding-right: 4rpx;
          cursor: pointer;
          z-index: 1;
        }
      }
    }
  }
}
</style>

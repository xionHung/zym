<template>
  <view class="md-radio">
    <view class="default-class" v-if="!mode">
      <view class="items" v-for="(item, index) in list" :key="index">
        <view class="item" @click="_click(item[config.value])">
          <view
            class="circle flex-center"
            :style="
              textValue === item[config.value] ? circleActiveStyle : circleStyle
            "
          >
            <image
              v-show="textValue === item[config.value]"
              class="icon"
              :src="IMGURL + 'img/arena/radio_gou.png'"
              mode="aspectFill"
            />
          </view>
          <view>{{ item[config.label] || item }}</view>
        </view>
      </view>
    </view>
    <view class="first-class" v-if="mode === 1">
      <view
        class="items"
        v-for="(item, index) in list"
        :key="index"
        @click="_click(item[config.value])"
      >
        <view class="item">
          <view>{{ item[config.label] || item }}</view>
					<slot :data="textValue === item[config.value]">
						<view
							class="circle flex-center"
							:style="
								textValue === item[config.value] ? circleActiveStyle : circleStyle
							"
						>
							<image
								v-show="textValue === item[config.value]"
								class="icon"
								:src="IMGURL + 'img/arena/radio_gou.png'"
								mode="aspectFill"
							/>
						</view>
					</slot>
        </view>
      </view>
    </view>
    <view class="second-class" v-if="mode === 2">
      <view class="items" v-for="(item, index) in list" :key="index">
        <view class="item" @click="_click(item[config.value])">
          <view
            class="circle flex-center"
            :style="
              textValue === item[config.value] ? circleActiveStyle : circleStyle
            "
          >
            <image
              v-show="textValue === item[config.value]"
              class="icon"
              :src="IMGURL + 'img/arena/radio_gou.png'"
              mode="aspectFill"
            />
          </view>
          <view>{{ item[config.label] || item }}</view>
        </view>
      </view>
    </view>
    <!-- 自定义label展示 通过插槽形式 -->
    <view class="first-class" v-if="mode === 3">
      <view
        class="items"
        v-for="(item, index) in list"
        :key="index"
        @click="_click(item[config.value])"
      >
        <view class="item">
          <view class="flex1">
            <!-- 循环的数据往外暴露，通过slotProps接收 -->
            <slot :item="item"></slot>
          </view>
          <view
            class="circle flex-center"
            :style="
              textValue === item[config.value] ? circleActiveStyle : circleStyle
            "
          >
            <image
              v-show="textValue === item[config.value]"
              class="icon"
              :src="IMGURL + 'img/arena/radio_gou.png'"
              mode="aspectFill"
            />
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    value: [String, Number],
    mode: {
      type: Number,
      default: () => 0 //0：都在同行 1: 一行一个 2：一行两个
    },
    list: {
      type: Array,
      default: () => []
    },
    config: {
      type: Object,
      default: () => {
        return {
          label: 'label',
          value: 'value'
        };
      }
    },
    // 圆圈宽度
    width: {
      type: Number,
      default: () => 24
    },
    // 选中颜色
    activeColor: {
      type: String,
      default: () => '#FF7234'
    },
    // 是否可以取消
    isCancel: {
      type: Boolean,
      default: () => false
    },
	disabled: Boolean,
  },
  computed: {
    circleStyle() {
      return `width: ${this.width}rpx; height: ${this.width}rpx; background: #fff; border-color: #666`;
    },
    circleActiveStyle() {
      return `width: ${this.width}rpx; height: ${this.width}rpx; background: ${this.activeColor}; border-color: ${this.activeColor}`;
    },
	textValue: {
		get() {
			return this.value;
		},
		set(val) {
			this.$emit('input', val);
		}
	}
  },
  methods: {
    _click(val) {
	  if (this.disabled) return;
      this.$emit('change', val);
      this.$emit('input', this.isCancel && this.textValue === val ? '' : val);
    }
  }
};
</script>

<style lang="scss" scoped>
.md-radio {
  width: 100%;
  color: #666;
  font-size: 22rpx;
  .default-class {
    display: flex;
    .items {
      margin-right: 30rpx;
      &:last-child {
        margin-right: 0;
      }
    }
  }
  .item {
    display: flex;
    align-items: center;
  }
  .circle {
    border-radius: 50%;
    border: 1px solid;
    margin-right: 20rpx;
    .icon {
      width: 16rpx;
      height: 12rpx;
    }
  }
  .second-class {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    row-gap: 40rpx;
  }
  .first-class {
    .items {
      margin-bottom: 26rpx;
      &:last-child {
        margin-bottom: 0;
      }
      .item {
        justify-content: space-between;
      }
    }
  }
}
</style>

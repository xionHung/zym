const provider = {
  data() {
    return {
      p_platform: '',
      providerList: [{
        name: '支付宝', id: 'alipay', payMethod: 1, loading: false
      }],
    }
  },
  created() {
    const pPlatform = uni.getSystemInfoSync().platform
    // this.p_platform = platform;
    if (pPlatform === 'android') {
      this.initProvider();
    }
  },
  methods: {
    async getProvider() {
      let [error, res] = await uni.showActionSheet({
        itemList: this.providerList.map(o => o.name)
      })
      if (error) return false;
      let pro = this.providerList[res.tapIndex]
      return { pro }
    },
    initProvider() {
      uni.getProvider({
        service: 'payment',
        success: (e) => {
          let providerList = [];
          e.provider.map((value) => {
            switch (value) {
              case 'alipay':
                providerList.push({
                  name: '支付宝',
                  id: value,
                  payMethod: 1,
                  loading: false
                });
                break;
              case 'wxpay':
                providerList.push({
                  name: '微信',
                  id: value,
                  payMethod: 2,
                  loading: false
                });
                break;
              default:
                break;
            }
          })
          if (providerList.findIndex(o => o.id === 'alipay') === -1) {
            providerList.push({ name: '支付宝', id: 'alipay', payMethod: 1, loading: false })
          }
          this.providerList = providerList;
        }
      })
    }
  }
}
export default provider;
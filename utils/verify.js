const verify = {
  isName: function (name) {
    //英文点和句号点替换成中间点
    name = name.replace(/\.|。/g, "·");
    var pattern = /^([\u4e00-\u9fa5]+·{0,1}[\u4e00-\u9fa5]+)$/;
    if (pattern.length > 14) return false;
    return pattern.test(name.trim());
  },
  isID: function (id) {
    if (id.length != 18) return false;
    var idCard_base = id.substr(0, 17),
        verify_code = id.substr(17, 1);
    var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
        verify_code_list = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2', 'x'];
    var total = 0;
    for (var i = 0; i < 17; i++) {
        var index = i;
        total += idCard_base.substr(index, 1) * factor[index];
    }
    var mod = total % 11;
    return verify_code == verify_code_list[mod] ? true : false;
  },
  isPhone: function (phone) {
    var pattern = /^1[3456789]\d{9}$/;
    return pattern.test(phone);
  },
  isEmail: function (email) {
    var pattern = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-z]{2,4})+$/;
    return pattern.test(email);
  }
}
export default verify
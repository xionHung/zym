import request from './'
const {
	post,
	get,
} = request

const Common = {
	get_ad: () => get({ url: '/Config/get_ad' }), // 首页banner
	get_inner_ad: () => get({ url: '/Config/get_inner_ad' }), // 内页banner
}

// 配置相关
const Config = {
	level: () => get({ url: '/Config/level' }), // 获取段位下拉
	label: () => get({ url: '/Config/label' }), // 获取标签下拉
	activityLevel: () => get({ url: '/Config/activityLevel' }), // 获取标签下拉
	complaint: () => get({ url: '/Config/complaint' }), // 投诉类型下拉
	group: () => get({ url: '/Config/group' }), // 获取接龙组别配置
	/**
	 * 分页搜索 用户 | 俱乐部 | 球馆
	 * @param {string} page 小程序页面路径
	 * @param {string} check_path true 或者 false
	 * @param {string} scene 携带参数，例如：a=2
	 * @param {string} env_version 要打开的小程序版本。正式版为 “release”，体验版为 “trial”，开发版为 “develop”。默认是正式版。
	 */
	getCode: (data) => post({ url: '/Config/getCode', data }),
}

// 我的相关
const My = {
	index: () => get({ url: '/My/index' }),  // 我的/首页共用接口
	/**
	 * 分页搜索 用户 | 俱乐部 | 球馆
	 * @param {string} title 搜索内容
	 * @param {string} type 类型默认0搜索全部，查看用户或俱乐部更多时传参 ，type=1查看更多用户，分页下拉搜索 type=2查看更多俱乐部，分页下拉搜索 type=3查看更多球馆，分页下拉搜索
	 * @param {string} limit 列表用的分页，一页多少条
	 * @param {string} pageNum 列表用的分页，第几页
	 */
	search: (data) => get({ url: '/My/search', data }),  // 首页搜索
	play: () => get({ url: '/My/play' }),  // 我的本月场次列表
	pay: () => get({ url: '/My/pay' }),  // 我的本月消费列表
	/**
	 * 添加其他支出
	 * @param {string} pay_money 支出金额
	 * @param {string} remark 备注
	 */
	addPay: (data) => post({ url: '/My/addPay', data }),
	/**
	 * 我的球馆列表（打过球的球馆）
	 * @param {string} limit 列表用的分页，一页多少条
	 * @param {string} pageNum 列表用的分页，第几页
	 */
	ballRoom: (data) => get({ url: '/My/ballRoom', data }),
	/**
	 * 我的俱乐部列表）
	 * @param {string} limit 列表用的分页，一页多少条
	 * @param {string} pageNum 列表用的分页，第几页
	 */
	club: (data) => get({ url: '/My/club', data }),
	distribute: () => get({ url: '/My/distribute' }), // 我的帮分销
	addDistribute: () => post({ url: '/My/addDistribute' }), // 申请成为分销员
	cashDistribute: () => post({ url: '/My/cashDistribute' }), // 分销提现
}

const UserPoint = {
	/**
	 * 打球积分列表列表
	 * @param {string} limit 列表用的分页，一页多少条
	 * @param {string} pageNum 列表用的分页，第几页
	 */
	index: (data) => get({ url: '/UserPoint/index', data }),
}

// 用户相关
const User = {
	/**
	 * 登录
	 * @param {string} code 微信code码
	 */
	Login: (data) => post({ url: '/User/login', data }),
	Index: () => get({ url: '/User/index' }),  // 启动页背景图
	Info: () => get({ url: '/User/info' }), // 获取用户信息
	/**
	 * 入驻-个人信息保存
	 * @param {string} nickname 昵称
	 * @param {string} sex 性别 1男2女
	 * @param {string} level 段位id
	 * @param {string} headpic 头像
	 */
	save: (data) => post({ url: '/User/save', data }),
	/**
	 * 授权保存手机号
	 * @param {string} code 授权的微信手机号code码
	 */
	saveMobile: (data) => post({ url: '/User/saveMobile', data }),
	/**
	 * 授权信息保存接口，后端获取用户头像，昵称，性别等
	 * @param {string} iv 微信授权信息里的iv
	 * @param {string} encrypt_data 微信授权信息里的encrypt_data
	 */
	save_auth: (data) => post({ url: '/User/save_auth', data }),
	/**
	 * 获取个人主页详情
	 * @param {string} user_id 用户id
	 */
	home: (data) => get({ url: '/User/home', data }),
	/**
	 * 个人资料信息保存
	 * @param {string} nickname 昵称
	 * @param {string} sex 性别 1男 2女
	 * @param {string} level 段位id，段位列表接口获取
	 * @param {string} headpic 头像
	 * @param {string} user_back_pic 个人主页背景图
	 * @param {string} desc	箴言
	 * @param {string} label 标签id，多个逗号分割，标签列表接口获取
	 * @param {string} ball_age 球龄
	 * @param {string} age_group 年龄段
	 * @param {string} area_name 省市区，逗号分割
	 * @param {string} racket 兵器
	 * @param {string} ball_line 球线
	 * @param {string} pounds 磅数
	 * @param {string} latitude 经度
	 * @param {string} longitude 纬度
	 */
	setting: (data) => post({ url: '/User/setting', data }),
}
// 球馆
const Room = {
	getList: (data) => get({ url: '/Room/index', data }), //获取球馆列表
	home: (data) => get({ url: '/Room/home', data }), //球馆主页详情
	detail: (data) => get({ url: '/Room/detail', data }), //获取球馆更多详情
	enterClub: (data) => get({ url: '/Room/enterClub', data }), //获取球馆入驻的俱乐部列表
	report: (data) => post({ url: '/Room/report', data }), //球馆报错接口
	register: (data) => post({ url: '/Room/register', data }), //球馆认证接口
	RoomBookingIndex: (data) => get({ url: '/RoomBooking/index', data }), //预订页面接口
	RoomBookingAdd: (data) => post({ url: '/RoomBooking/add', data }), //创建预订订单
	/**
	 * 取消预订订单
	 * @param {string} id 订单id
	 */
	RoomBookingCancel: (data) => post({ url: '/RoomBooking/cancel', data }),
	getRegister: (data) => get({ url: '/Room/getRegister', data }),//获取球馆入驻的草稿信息
}
// 接龙
const Chains = {
	getList: (data) => get({ url: '/ClubActivity/index', data }), //获取接龙列表
	getDesc: (data) => get({ url: '/ClubActivity/getDesc', data }), //获取默认的活动说明和分场说明
	add: (data) => post({ url: '/ClubActivity/add', data }), //发布接龙
	info: (data) => get({ url: '/ClubActivity/info', data }), //接龙详情
	edit: (data) => post({ url: '/ClubActivity/edit', data }), //编辑接龙活动
	sign: (data) => post({ url: '/ClubActivity/sign', data }), //接龙报名
	signUser: (data) => get({ url: '/ClubActivity/signUser', data }), //已报名的用户列表
	cancel: (data) => post({ url: '/ClubActivity/cancel', data }), //取消报名
	cancelActivity: (data) => post({ url: '/ClubActivity/cancelActivity', data }), //取消接龙活动
	leaveWord: (data) => post({ url: '/ClubActivity/leaveWord', data }), //发表留言
	exchange: (data) => post({ url: '/ClubActivity/exchange', data }), //交换场地位置
	signUser: (data) => get({ url: '/ClubActivity/signUser', data }), //已报名的用户列表
}
// 俱乐部
const Club = {
	getList: (data) => get({ url: '/Club/index', data }), //获取俱乐部列表
	home: (data) => get({ url: '/Club/home', data }), //俱乐部主页详情
	member: (data) => get({ url: '/Club/member', data }), //俱乐部成员列表
	register: (data) => post({ url: '/Club/register', data }), //创建俱乐部
	cashRecord: (data) => post({ url: '/Club/cashRecord', data }), //俱乐部提现记录
	balanceRecord: (data) => post({ url: '/Club/balanceRecord', data }), //俱乐部资金明细
	addPay: (data) => post({ url: '/Club/addPay', data }), //手动记账
	join: (data) => post({ url: '/Club/join', data }), //加入俱乐部
	memberManage: (data) => get({ url: '/Club/memberManage', data }), //加入俱乐部
	addAdmin: (data) => post({ url: '/Club/addAdmin', data }), //添加俱乐部管理员
	modifyName: (data) => post({ url: '/Club/modifyName', data }), //修改俱乐部成员备注
	remove: (data) => post({ url: '/Club/remove', data }), //移出俱乐部
	message: (data) => get({ url: '/Club/message', data }), //申请加入消息列表
	isAgree: (data) => post({ url: '/Club/isAgree', data }), //是否同意加入
	/**
	 * 俱乐部资料信息保存
	 * @param {string} club_id 俱乐部id
	 * @param {string} club_headpic 俱乐部头像
	 * @param {string} club_back_pic 俱乐部背景
	 * @param {string} name 俱乐部名称
	 * @param {string} activity_time 活动日 1-7，数字多个逗号分割
	 * @param {string} buildtime 成立时间，时间戳
	 * @param {string} desc	介绍
	 * @param {string} notice 公告
	 * @param {string} join_type 申请加入类型 1验证加入 2所有人 3报名自动加入
	 * @param {string} is_union_card 是否启用羽盟卡 1是 2否
	 * @param {string} in_room_id 常驻的球馆id
	 * @param {string} ac_room_id 活动球馆id
	 * @param {string} place_desc 分场说
	 */
	setting: (data) => post({ url: '/Club/setting', data }),
	/**
	 * 转让俱乐部
	 * @param {string} club_id 俱乐部id
	 * @param {string} mobile 转让手机号
	 */
	changeUser: (data) => post({ url: '/Club/changeUser', data }),
}

// 个人和俱乐部羽动人生相关
const UserNotice = {
	/**
	 * 个人和俱乐部发帖
	 * @param {string} card_id 俱乐部id，个人发帖不用传，俱乐部发帖必传
	 * @param {string} title 内容
	 * @param {string} image 多张图片逗号隔开
	 * @param {string} type 是否同步羽乐圈 1是 2否
	 */
	add: (data) => post({ url: '/UserNotice/add', data }),
	/**
	 * 获取个人帖子列
	 * @param {string} user_id 用户id
	 * @param {string} limit 列表用的分页，一页多少条
	 * @param {string} pageNum 列表用的分页，第几页
	 */
	user: (data) => post({ url: '/UserNotice/user', data }),
	club: (data) => get({ url: '/UserNotice/club', data }),
	/**
	 * 编辑个人的帖子权限
	 * @param {string} circle_id 个人帖子id
	 * @param {string} show_type 1所有人可见 2粉丝可见 3仅自己可见
	 */
	edit: (data) => post({ url: '/UserNotice/edit', data }),
}

// 卡券相关
const Card = {
	getList: () => get({ url: '/Card/index' }), // 我的卡券列表
	getUnionCard: () => get({ url: '/Card/unionCard' }), // 羽盟卡购买详情
	unionCardBuy: () => post({ url: '/Card/unionCardBuy' }), // 购买羽盟卡
	/**
	 * 羽盟卡交易明细
	 * @param {string} limit 列表用的分页，一页多少条
	 * @param {string} pageNum 列表用的分页，第几页
	 */
	unionCardBill: (data) => get({ url: '/Card/unionCardBill', data }),
	/**
	 * 球馆充值详情
	 * @param {string} room_id 球馆id
	 * @param {string} type 球馆预定界面用 传1
	 */
	getRoomCard: (data) => get({ url: '/Card/roomCard', data }),
	/**
	 * 球馆卡充值
	 * @param {string} room_id 球馆id
	 * @param {string} rule_id 充值规则id，充值详情接口获取
	 */
	roomCardBuy: (data) => post({ url: '/Card/roomCardBuy', data }),
	/**
	 * 球馆充值卡交易明细
	 * @param {string} limit 列表用的分页，一页多少条
	 * @param {string} pageNum 列表用的分页，第几页
	 */
	roomCardBill: (data) => get({ url: '/Card/roomCardBill', data }),
}

// 羽乐圈相关
const UserCircle = {
	/**
	 * 游侠榜列表
	 * @param {string} area_name 微信获取地理位置，市名称，如厦门
	 * @param {string} limit 列表用的分页，一页多少条
	 * @param {string} pageNum 列表用的分页，第几页
	 */
	lists: (data) => get({ url: '/UserCircle/lists', data }),
	/**
	 * 附近球友列表
	 * @param {string} area_name 微信获取地理位置，市名称，如厦门
	 * @param {string} limit 列表用的分页，一页多少条
	 * @param {string} pageNum 列表用的分页，第几页
	 */
	near: (data) => get({ url: '/UserCircle/near', data }),
	/**
	 * 羽乐圈帖子列表
	 * @param {string} limit 列表用的分页，一页多少条
	 * @param {string} pageNum 列表用的分页，第几页
	 */
	index: (data) => get({ url: '/UserCircle/index', data }),
	/**
	 * 我的收藏列表
	 * @param {string} limit 列表用的分页，一页多少条
	 * @param {string} pageNum 列表用的分页，第几页
	 */
	collect: (data) => get({ url: '/UserCircle/collect', data }),
	/**
	 * 我的点赞列表
	 * @param {string} limit 列表用的分页，一页多少条
	 * @param {string} pageNum 列表用的分页，第几页
	 */
	like: (data) => get({ url: '/UserCircle/like', data }),
	/**
	 * 羽乐圈消息列表
	 * @param {string} limit 列表用的分页，一页多少条
	 * @param {string} pageNum 列表用的分页，第几页
	 */
	message: (data) => get({ url: '/UserCircle/message', data }),
	/**
	 * 羽乐圈消息聊天详情列表
	 * @param {string} id 消息id，消息列表获取
	 * @param {string} limit 列表用的分页，一页多少条
	 * @param {string} pageNum 列表用的分页，第几页
	 */
	chat: (data) => get({ url: '/UserCircle/chat', data }),
	newCount: () => get({ url: '/UserCircle/newCount' }), // 新增粉丝和消息数量接口
	/**
	 * 打招呼/回复消息口
	 * @param {string} uid 用户id
	 * @param {string} content 内容
	 */
	sendMsg: (data) => post({ url: '/UserCircle/sendMsg', data }),
	/**
	 * 投诉帖子
	 * @param {string} circle_id 帖子id
	 * @param {string} type 投诉类型 id
	 */
	complaint: (data) => post({ url: '/UserCircle/complaint', data }),
	/**
	 * 贴子详情和评论
	 * @param {string} circle_id 帖子id
	 * @param {string} limit 列表用的分页，一页多少条
	 * @param {string} pageNum 列表用的分页，第几页
	 */
	info: (data) => get({ url: '/UserCircle/info', data }),
	/**
	 * 羽乐圈发帖
	 * @param {string} title 内容
	 * @param {string} image 多张图片用逗号隔开
	 */
	add: (data) => post({ url: '/UserCircle/add', data }),
	/**
	 * 点击收藏
	 * @param {string} circle_id 帖子id
	 */
	clickCollect: (data) => post({ url: '/UserCircle/clickCollect', data }),
	/**
	 * 取消收藏
	 * @param {string} collect_id 收藏id
	 */
	cancelCollect: (data) => post({ url: '/UserCircle/cancelCollect', data }),
	/**
	 * 点击点赞
	 * @param {string} circle_id 帖子id
	 */
	clickLike: (data) => post({ url: '/UserCircle/clickLike', data }),
	/**
	 * 取消点赞
	 * @param {string} like_id 点赞id
	 */
	cancelLike: (data) => post({ url: '/UserCircle/cancelLike', data }),
	/**
	 * 转发帖子
	 * @param {string} circle_id 帖子id
	 */
	forward: (data) => post({ url: '/UserCircle/forward', data }),
	/**
	 * 删除帖子
	 * @param {string} circle_id 帖子id
	 */
	delete: (data) => post({ url: '/UserCircle/delete', data }),
	/**
	 * 添加评论
	 * @param {string} circle_id 帖子id
	 * @param {string} content 评论内容
	 * @param {string} pid 评论id
	 */
	comment: (data) => post({ url: '/UserCircle/comment', data }),
	/**
	 * 删除评论
	 * @param {string} comment_id 评论id
	 */
	deleteComment: (data) => post({ url: '/UserCircle/deleteComment', data }),
}

// 关注和粉丝相关
const UserFans = {
	/**
	 * 我的粉丝列表
	 * @param {string} nickname 昵称（搜索用）
	 * @param {string} limit 列表用的分页，一页多少条
	 * @param {string} pageNum 列表用的分页，第几页
	 */
	index: (data) => get({ url: '/UserFans/index', data }),
	/**
	 * 我的关注列表
	 * @param {string} nickname 昵称（搜索用）
	 * @param {string} limit 列表用的分页，一页多少条
	 * @param {string} pageNum 列表用的分页，第几页
	 */
	follow: (data) => get({ url: '/UserFans/follow', data }),
	/**
	 * 添加关注
	 * @param {string} user_id 用户id
	 */
	add: (data) => post({ url: '/UserFans/add', data }),
	/**
	 * 取消关注
	 * @param {string} user_id 用户id
	 */
	delete: (data) => post({ url: '/UserFans/delete', data }),

}

// 订单相关
const Order = {
	/**
	 * 订单列表
	 * @param {string} title 搜索订单
	 * @param {string} status 订单状态 1进行中 2已完成 3已取消 默认不传全部
	 * @param {string} limit 列表用的分页，一页多少条
	 * @param {string} pageNum 列表用的分页，第几页
	 */
	index: (data) => get({ url: '/Order/index', data }),
}

// 个人荣誉
const UserDetail = {
	/**
	 * 个人荣誉证书列表
	 * @param {string} user_id 用户id
	 * @param {string} limit 列表用的分页，一页多少条
	 * @param {string} pageNum 列表用的分页，第几页
	 */
	personalHonor: (data) => get({ url: '/UserDetail/personalHonor', data }),
	/**
	 * 添加个人荣誉
	 * @param {string} title 标题
	 * @param {string} img 图片
	 * @param {string} fileField 图片流对应的 key
	 * @param {string} filePath 图片地址
	 */
	addHonor: (data) => post({ url: '/UserDetail/addHonor', data }),
	/**
	 * 删除个人荣誉
	 * @param {string} id 荣誉id
	 */
	deleteHonor: (data) => post({ url: '/UserDetail/deleteHonor', data }), // 删除个人荣誉
}

// 消息相关
const Msg = {
	/**
	 * 我的消息列表
	 * @param {string} limit 列表用的分页，一页多少条
	 * @param {string} pageNum 列表用的分页，第几页
	 */
	index: (data) => get({ url: '/Message/index', data }),
	/**
	 * 消息已读操作
	 * @param {string} id 消息id
	 */
	read: (data) => post({ url: '/Message/read', data }),
}

// 设置相关
const Setting = {
	/**
	 * 自助中心列表
	 * @param {string} title 标题搜索
	 * @param {string} limit 列表用的分页，一页多少条
	 * @param {string} pageNum 列表用的分页，第几页
	 */
	helpCenter: (data) => get({ url: '/Setting/helpCenter', data }),
	/**
	 * 自助中心详情
	 * @param {string} id 帮助中心文章id
	 */
	helpInfo: (data) => get({ url: '/Setting/helpInfo', data }),
	/**
	 * 意见反馈
	 * @param {string} content 反馈内容
	 */
	feedback: (data) => post({ url: '/Setting/feedback', data }),
	/**
	 * 设置内容
	 * @param {string} type 1：隐政策 2：用户协议 3：提现服务协议 4：联系我们 5：接龙免责条款 6:接龙周期活动说明
	 */
	content: (data) => get({ url: '/Setting/content', data }),
}
// 结算
const Settle = {
	index: (data) => get({ url: '/Settle/index', data }), //结算情况
	balanceRecord: (data) => get({ url: '/Settle/balanceRecord', data }), //支出收入列表
	aaList: (data) => get({ url: '/Settle/aaList', data }), //AA结算页面
	addPay: (data) => post({ url: '/Settle/addPay', data }), //支出登记
	add: (data) => post({ url: '/Settle/add', data }), //确认结算
	detail: (data) => get({ url: '/Settle/detail', data }), //收款明细
	remind: (data) => post({ url: '/Settle/remind', data }), //提醒收款
	aaPay: (data) => get({ url: '/Settle/aaPay', data }), //AA付款页面
	pay: (data) => post({ url: '/Settle/pay', data }), //AA微信支付
}

export default {
	Common,
	Config,
	My,
	UserPoint,
	User,
	Room,
	Chains,
	Club,
	UserNotice,
	Card,
	UserCircle,
	UserFans,
	Order,
	UserDetail,
	Msg,
	Setting,
	Settle,
}

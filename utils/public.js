let publicMethods = {}

publicMethods.previewImage = (imgs, idx) => {
	let urls = imgs,
			current = idx;
	if(typeof urls === 'string') {
		urls = [urls];
	}
	if(current === undefined) current = 0;
	uni.previewImage({
		urls: urls.map(o => {
			let hasBig = publicMethods.getQuery(o, 'b');
			if(hasBig == 1) {
				let r = '';
				let _i = o.lastIndexOf('.');
				if(_i > 0) {
					r = o.substr(0, _i) + '_big' + o.substr(_i);
				}
				return r;
			} else {
				return o;
			}
		}),
		current,
	})
}
publicMethods.getQuery = (str, key) => {
	let hasParams = str.lastIndexOf('?');
	if(hasParams === -1) return '';
	let q = str.substr(hasParams + 1).split('&');
	let params = {};
	q.forEach(item => {
		let r = item.split('=');
		params[r[0]] = r[1];
	})
	return key === undefined ? params : params[key];
}
export default publicMethods
// const SlsHelper = require('./index.js');
import Sls
const slsHelper = new SlsHelper({
	host: 'cn-hangzhou.log.aliyuncs.com',
	project: 'rys-test',
	logstore: 'sls-alysls-track-base',
	time:5,
	count: 3
});
let a = 1;
setInterval(() => {
	slsHelper.send({a: a + ''});
	a++;
}, 1000);
setTimeout(() => {
	console.log('fafa');
}, 900000000);

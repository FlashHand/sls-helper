import axios from 'axios';
axios.interceptors.request.use(config => {
	console.log(config.data);
	return config;
});
interface SLSOption {
	host: string;
	project: string;
	logstore: string;
	time?: number;
	count?: number;
}

class SlsHelper {
	host: string;
	project: string;
	logstore: string;
	time: number = 5;//延迟发送
	count: number = 30;//队列上限
	queue: any[] = [];
	timer: null | ReturnType<typeof setTimeout> = null;

	get endpoint() {
		return `https://${this.project}.${this.host}/logstores/${this.logstore}/track`;
	}

	resetTimer() {
		clearTimeout(this.timer as ReturnType<typeof setTimeout>);
		this.timer = null;
		this.queue = [];
	}

	constructor(option: SLSOption) {
		this.host = option.host;
		this.project = option.project;
		this.logstore = option.logstore;
		this.time = option.time || 5;
		this.count = option.count || 3;
	}

	requestTrack() {
		const requestQueue = this.queue;
		const body = {
			__logs__: requestQueue
		}
		console.log('post',this.queue, body);
		try{
			console.log(this.endpoint,body);
			axios.post(this.endpoint, body, {
				// baseURL:this.endpoint,
				headers: {
					Accept: '*/*',
					'Content-Type': 'application/json',
					'x-log-apiversion': '0.6.0',
					'x-log-bodyrawsize': 1
				}
			}).then(res=>{
			}).catch(e=>{
				console.log(e.message);
			});
		}catch (e){
			console.log(e);
		}
		this.resetTimer();
	}

	send(log: any) {
		if (this.timer) {
			if (this.queue.length >= this.count) {
				this.requestTrack();
				this.queue.push(log);
			} else {
				this.queue.push(log);
			}
		} else {
			this.queue.push(log);
			this.timer = setTimeout(() => {
				this.requestTrack();
			}, this.time*1000);
		}
	}
}

export default SlsHelper;

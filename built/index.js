"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("axios"));
class SlsHelper {
    constructor(option) {
        this.time = 5; //延迟发送
        this.count = 30; //队列上限
        this.queue = [];
        this.timer = null;
        this.host = option.host;
        this.project = option.project;
        this.logstore = option.logstore;
        this.time = option.time || 5;
        this.count = option.count || 3;
    }
    get endpoint() {
        return `https://${this.project}.${this.host}/logstores/${this.logstore}/track`;
    }
    resetTimer() {
        clearTimeout(this.timer);
        this.timer = null;
        this.queue = [];
    }
    requestTrack() {
        const requestQueue = this.queue;
        const body = {
            __logs__: requestQueue
        };
        try {
            axios_1.default.post(this.endpoint, body, {
                // baseURL:this.endpoint,
                headers: {
                    Accept: '*/*',
                    'Content-Type': 'application/json',
                    'x-log-apiversion': '0.6.0',
                    'x-log-bodyrawsize': 1
                }
            }).then(res => {
            }).catch(e => {
                console.log(e.message, e.response);
            });
        }
        catch (e) {
            console.log(e);
        }
        this.resetTimer();
    }
    push(log) {
        Object.keys(log).forEach(key => {
            if (typeof log[key] !== 'string') {
                log[key] = JSON.stringify(log[key]);
            }
        });
        this.queue.push(log);
    }
    send(log) {
        if (this.timer) {
            if (this.queue.length >= this.count) {
                this.requestTrack();
                this.push(log);
            }
            else {
                this.push(log);
            }
        }
        else {
            this.push(log);
            this.timer = setTimeout(() => {
                this.requestTrack();
            }, this.time * 1000);
        }
    }
}
exports.default = SlsHelper;
//# sourceMappingURL=index.js.map
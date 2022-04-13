"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
// @ts-ignore
const index_ts_1 = tslib_1.__importDefault(require("./index.ts"));
const slsHelper = new index_ts_1.default({
    host: 'cn-hangzhou.log.aliyuncs.com',
    project: 'terminal-log-prod',
    logstore: 'mp-qyz',
    time: 5,
    count: 3
});
slsHelper.send({ a: 'a' });

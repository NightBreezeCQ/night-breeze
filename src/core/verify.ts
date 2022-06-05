

import { BreezeApi } from "@/type";

export function apiVerify(breezeApis: BreezeApi[], controllers: { [key: string]: (a, b) => Promise<any> },) {
    let verifyPath = {};
    let verifyOperationId = {};

    Object.keys(controllers).forEach(data => {
        if (!verifyOperationId[data]) {
            verifyOperationId[data] = controllers[data];
        } else {
            throw `handler：${data} 重复`;
        }
    });

    for (const breezeApi of breezeApis) {
        const { path, method, operationId } = breezeApi;
        if (!verifyPath[path]) {
            verifyPath[path] = {};
        }
        if (!verifyPath[path][method]) {
            verifyPath[path][method] = operationId;
            if (!controllers[operationId]) {
                throw `地址：${path}的请求方式${method} operationId：${operationId} 不存在`;
            }
        } else {
            throw `地址：${path}的请求方式：${method} 已经存在`;
        }

    }

}
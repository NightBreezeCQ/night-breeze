import * as joi from "joi";
import { BreezeApi } from "@/type";
import { bearAuth } from "@/middlewares/bearAuth";

let api: BreezeApi[] = [
    {
        path: "/auth/register/username",
        method: "POST",
        summary: "账号注册",
        description: "账号注册",
        operationId: "registerUsername",
        middlewares: [],
        req: {
            body: {
                username: joi.string().required().description("用户账号"),
                password: joi.string().required().description("用户密码"),
            }
        },
        res: {
            "200": {
                accessToken: joi.string().description("用户凭证"),
                tokenType: joi.string().description("验证类型"),
                expiresIn: joi.number().description("过期时间"),
                id: joi.number().description("id"),
                username: joi.string().description("账号"),
                nickname: joi.string().description("昵称"),
            }
        }
    },
    {
        path: "/auth/login/password",
        method: "POST",
        summary: "密码登录",
        description: "密码登录",
        operationId: "authoginByPassword",
        middlewares: [],
        req: {
            body: {
                username: joi.string().required().description("用户账号"),
                password: joi.string().required().description("用户密码"),
            }
        },
        res: {
            "200": {
                accessToken: joi.string().description("用户凭证"),
                tokenType: joi.string().description("验证类型"),
                expiresIn: joi.number().description("过期时间"),
                id: joi.number().description("id"),
                username: joi.string().description("账号"),
                nickname: joi.string().description("昵称"),
            }
        }
    },
    {
        path: "/user/info",
        method: "get",
        summary: "用户详情",
        description: "用户详情",
        operationId: "userInfo",
        middlewares: [bearAuth],
        req: {
            query: {
            }
        },
        res: {
            "200": {
                id: joi.number().description("id"),
                username: joi.string().description("账号"),
                nickname: joi.string().description("昵称"),
            }
        }
    },
];

export default api;
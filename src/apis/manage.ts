
import * as joi from "joi";
import { BreezeApi } from "@/type";
import { bearManageAuth } from "@/middlewares/bearAuth";

let apiManage: BreezeApi[] = [
  {
    path: "/auth/login/password",
    method: "POST",
    summary: "管理员密码登录",
    description: "管理员密码登录",
    operationId: "loginByPassword",
    middlewares: [],
    req: {
      body: {
        username: joi.string().required().description("管理员账号"),
        password: joi.string().required().description("管理员密码"),
      },
    },
    res: {
      200: {
        code: joi.number().description("状态码 200 成功"),
        msg: joi.string().description("状态消息"),
        data: joi.object({
          token: joi.string().description("用户凭证"),
        }),
      },
    },
  },
  {
    path: "/user/list",
    method: "get",
    summary: "获取用户列表",
    description: "获取用户列表",
    operationId: "userList",
    middlewares: [bearManageAuth],
    req: {
      query: {
        userId: joi.number().description("用户id"),
      },
    },
    res: {
      200: {
        code: joi.number().description("状态码 200 成功"),
        msg: joi.string().description("状态消息"),
        data: joi.object({
          id: joi.number().description("用户id"),
        }),
      },
    },
  },
];

export default apiManage;

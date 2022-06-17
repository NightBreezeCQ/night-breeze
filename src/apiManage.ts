
import * as joi from "joi";
import { BreezeApi } from "@/type";

let apiManage: BreezeApi[] = [
  {
    path: "/admin/login/pssword",
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
];

export default apiManage;

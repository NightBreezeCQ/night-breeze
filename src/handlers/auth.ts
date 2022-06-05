
import { Handler, typeApi } from "@/type";
import { User } from "@/models";
import { errs } from "@/common";
import * as bcrypt from "bcryptjs";
import settings from "@/settings";

export const authoginByPassword: Handler<typeApi.AuthoginByPasswordReq> = async (req, ctx) => {
    ctx.body = "TO IMPLEMENTED";
    const { username, password } = req.body;
    let user = await User.findOne({ where: { username } })
    if (!user) {
        throw errs.ErrMessage.toError({ message: "账号密码有误" })
    }
    let pwdV = await bcrypt.compare(password, user.password);
    if (!pwdV) {
        throw errs.ErrMessage.toError({ message: "账号密码有误" })
    }

    ctx.body = user.getLoginResult()
};


export const registerUsername: Handler<typeApi.RegisterUsernameReq> = async (req, ctx) => {
    const { username, password } = req.body;
    let user = await User.findOne({ where: { username } })
    if (user) {
        throw errs.ErrMessage.toError({ message: "用户已经存在" })
    }
    const hash = await bcrypt.hashSync(password, settings.passwordSaltRounds);
    let newUser = await User.create({ username, password: hash })
    ctx.body = newUser.getLoginResult()
};

import { Handler, typeClient } from "@/type";
import { User } from "@/models";

export const userInfo: Handler<typeClient.UserInfoReq> = async (req, ctx) => {
  const { userId } = ctx.state.auth;
  let user = await User.findOne({ where: { id: userId }, attributes: User.userInfo });
  ctx.body = user;
};

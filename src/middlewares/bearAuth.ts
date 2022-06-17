import { logger, errs } from "@/common";
import Koa from "koa";
import * as jwt from "jsonwebtoken";
import settings from "@/settings";

export function bearAuth() {
  return async (ctx: Koa.Context, next: Koa.Next) => {
    let data: any = {};
    let key = "auth";
    const authorization = ctx.headers.authorization;
    if (!authorization) {
      throw errs.ErrAuth.toError();
    }
    const [schema, token] = authorization.split(" ");

    if (!/^Bearer$/i.test(schema) || !token) {
      throw errs.ErrAuthToken.toError();
    }
    try {
      data = jwt.verify(token, settings.tokenSecret);
    } catch (err) {
      throw errs.ErrAuthToken.toError();
    }

    ctx.state[key] = data;

    await next();
  };
}

export function bearManageAuth() {
  return async (ctx: Koa.Context, next: Koa.Next) => {
    let key = "authM";
    const authorization = ctx.headers.authorization;
    if (!authorization) {
      throw errs.ErrAuth.toError();
    }

    const [schema, token] = authorization.split(" ");
    if (!/^Bearer$/i.test(schema) || !token) {
      throw errs.ErrAuthToken.toError();
    }

    let data: any;
    try {
      data = jwt.verify(token, settings.tokenSecret);
    } catch (err) {
      throw errs.ErrAuthToken.toError();
    }

    ctx.state[key] = data;
    await next();
  };
}

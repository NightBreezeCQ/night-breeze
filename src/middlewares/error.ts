import { errs, logger } from "@/common";
import Koa from "koa";
import * as _ from "lodash";
import { HttpError } from "@/common/errs";
import envConfig from "@/config/envConfig";

export default function error() {
  return async (ctx: Koa.Context, next: Koa.Next) => {
    try {
      await next();
      if (typeof ctx.response.body === "undefined") {
        ctx.status = 404;
        ctx.body = errs.ErrNotFound.toJson();
        return;
      }
    } catch (err) {
      if (err instanceof HttpError) {
        if (err.status >= 500) {
          logger.error(err.message);
        }
        ctx.status = err.status;
        ctx.body = err.toJSON();
        return;
      }
      logger.error(err.message);
      ctx.status = 500;
      if (envConfig.prod) {
        ctx.body = errs.ErrInternal.toJson({ message: "server error" });
      } else {
        ctx.body = errs.ErrInternal.toJson({ message: err.message });
      }
    }
  };
}

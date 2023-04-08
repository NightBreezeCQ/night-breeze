import "./bootstrap";

import * as Koa from "koa";
import * as path from "path";

import error from "@/middlewares/error";
import * as helmet from "koa-helmet";
import * as bodyParser from "koa-bodyparser";
import * as cors from "@koa/cors";
import api from "@/apis/client";
import apiManage from "@/apis/manage";
import handlers from "@/handlers";

import handlersManage from "@/handlersManage";
import runRouter from "@/core/runServer";
import { logger } from "@/common";
import * as koaStatic from "koa-static-router";

const app = new Koa();
app.use(
  koaStatic({
    dir: "resources", // 文档路径
    router: "/document", // 路由命名
  }),
);
app.use(cors({
  origin: "*",
  allowHeaders: "*",
}));
app.use(helmet());
app.use(error());

app.use(
  bodyParser({
    enableTypes: ["json", "form", "xml"],
  }),
);

runRouter(app, [
  {
    prefix: "/c", breezeApis: api, handlers: handlers,
  },
  {
    prefix: "/m", breezeApis: apiManage, handlers: handlersManage,
  },
], after);

async function after() {
  logger.debug("服务启动");
}

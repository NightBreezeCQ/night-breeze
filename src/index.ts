import "./bootstrap";

import settings from "@/settings";
import * as Koa from "koa";
import * as path from "path";

import error from "@/middlewares/error";
import * as helmet from "koa-helmet";
import * as bodyParser from "koa-bodyparser";
import * as cors from "@koa/cors";
import api from "@/api";
import apiManage from "@/apiManage";

import handlers from "@/handlers";
import handlersManage from "@/handlersManage";
import runRouter from "@/core/runServer";
import { logger } from "@/common";
import * as koaStatic from "koa-static";

const app = new Koa();
const staticPath = "../resources";
app.use(koaStatic(
  path.join(__dirname, staticPath),
));
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
    prefix: "/c", breezeApis: api, handles: handlers,
  },
  {
    prefix: "/m", breezeApis: apiManage, handles: handlersManage,
  },
], after);

async function after() {
  logger.debug("服务启动");
}

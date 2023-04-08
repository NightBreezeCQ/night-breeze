import * as joi from "joi";
import j2s from "joi-to-swagger";
import * as path from "path";
import * as Koa from "koa";
import * as verify from "./verify";
import * as fs from "fs";
import envConfig from "@/config/envConfig";
import { Handler, BreezeApi } from "@/type";
import * as Router from "@koa/router";
import { errs, logger } from "@/common";
const { port = 3000, host, swaggerConfig } = envConfig;

const swaggerConfigDefault = {
  swagger: "2.0",
  info: {
    title: "接口文档",
    description: "swagger default",
    version: "1.0.0",
  },
  host: "127.0.0.1:3000",
  // basePath: "/v1",
  schemes: ["http", "https"],
  produces: ["application/json"],
  security: [
    { bearerAuth: [] },
  ],
};

type RunRouter = {
  prefix: string,
  breezeApis: BreezeApi[],
  // handles: { [key: string]: (a, b) => Promise<any> } = {},
  handlers: any,
};

async function runServer(
  app: Koa,
  RunApis: RunRouter[],
  after: any,
) {
  const router = new Router();
  let swaggers = {};
  RunApis.forEach(RunApi => {
    const { breezeApis, handlers, prefix } = RunApi;
    verify.apiVerify(breezeApis, handlers); // 验证接口是否重复 处理方法是否重复
    swaggers[prefix] = {
      ...swaggerConfigDefault,
      paths: {},
    };

    breezeApis.forEach(item => {
      let { path, summary = "概要", middlewares = [], description = "备注", operationId, req, res, docShow = true } = item;
      const { query, body, params } = req;
      let apiPath = prefix + path;
      const respBody = res["200"];
      let tag = path.split("/")[1];
      const methodLower = item.method.toLowerCase();

      if (docShow) { // 是否显示文档
        if (!swaggers[prefix].paths[apiPath]) {
          swaggers[prefix].paths[apiPath] = {};
        }
        swaggers[prefix].paths[apiPath][methodLower] = {
          summary,
          description,
          operationId,
          parameters: [],
          tags: [tag],
          security: [],
          responses: {
            200: {
              description: "successful",
            },
          },
        };
        if (middlewares.length > 0) {
          swaggers[prefix].paths[apiPath][methodLower].security.push("bearerAuth");
          const s = {};
          s["in"] = "header";
          s["name"] = "authorization";
          s["type"] = "sting";
          s["description"] = "用户鉴权";
          swaggers[prefix].paths[apiPath][methodLower].parameters.push(s);
        }

        if (params) {
          Object.keys(params).forEach(key => {
            const { swagger: s } = j2s(params[key]);
            s["in"] = "path";
            s["name"] = key;
            swaggers[prefix].paths[apiPath][methodLower].parameters.push(s);
          });
        }

        if (query) {
          Object.keys(query).forEach(key => {
            const { swagger: s } = j2s(query[key]);
            s["in"] = "query";
            s["name"] = key;
            swaggers[prefix].paths[apiPath][methodLower].parameters.push(s);
          });
        }

        if (body) {
          let bodySchema = joi.object(body);
          const { swagger: s } = j2s(bodySchema);
          swaggers[prefix].paths[apiPath][methodLower].parameters.push({
            in: "body",
            name: "body",
            schema: s,
          });
        }

        if (respBody) {
          let respBodySchema = joi.object(respBody);
          const { swagger: s } = j2s(respBodySchema);
          swaggers[prefix].paths[apiPath][methodLower].responses["200"]["schema"] = s;
        }
      }

      let koaPath = path.replace(/}/g, "");
      koaPath = koaPath.replace(/{/g, ":");
      // router[prefix + method](path, ...middlewares, async (ctx: Koa.Context) => {
      let ps: any[] = [apiPath];
      if (middlewares.length > 0) {
        for (const middleware of middlewares) {
          ps.push(middleware());
        }
      }
      ps.push(async (ctx: Koa.Context) => {
        const { request, params } = ctx;
        const { query, body } = request;

        const paramsRule = item.req.params;
        const queryRule = item.req.query;
        const bodyRule = item.req.body;

        if (paramsRule) {
          let paramsSchema = joi.object(paramsRule);
          let validateResult = paramsSchema.validate(params);
          if (validateResult.error) {
            throw errs.ErrValidation.toError({ message: validateResult.error.message });
          }
        }
        if (queryRule) {
          let querySchema = joi.object(queryRule);
          let validateResult = querySchema.validate(query);
          if (validateResult.error) {
            throw errs.ErrValidation.toError({ message: validateResult.error.message });
          }
        }

        if (bodyRule) {
          let bodySchema = joi.object(bodyRule);
          let validateResult = bodySchema.validate(body);
          if (validateResult.error) {
            throw errs.ErrValidation.toError({ message: validateResult.error.message });
          }
        }

        try {
          if (handlers[operationId]) {
            let handler = handlers[operationId];
            const result = await handler(request, ctx);
            if (result) ctx.body = result;
          }
        } catch (error) {
          console.log(error);
          throw error;
        }
      });

      router[methodLower](...ps);
    });

    swaggers[prefix] = { ...swaggers[prefix], ...swaggerConfig };
    // app.use(swaggerPath, express.static(path.join(__dirname, "../../swagger")));

    // console.info(`document you can click: http://${swaggerConfig.host}${swaggerPath}`);

    router.get(prefix + "/_/swagger.json", (ctx) => {
      ctx.body = swaggers[prefix];
    });
    logger.debug("文档访问地址:", prefix + "/_/swagger.json");
  });

  app.use(router.routes()).use(router.allowedMethods());
  app.listen(port, `${host}`, after);
  // let swaggerUrlFile = `let swaggerUrl = "${swaggerPath}/json"`;
  // fs.writeFileSync(path.join(__dirname, "../../swagger/url.js"), swaggerUrlFile);
}

export default runServer;

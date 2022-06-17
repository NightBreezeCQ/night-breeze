import * as Koa from "koa";
import * as typeApi from "@/typeApi";
import * as typeApiManage from "@/typeApiManage";
import { Context, Next } from "koa";
import { Schema } from "joi";

export type Handler<T> = (req: T, ctx: Koa.ParameterizedContext<KoaContextState>) => Promise<any>;

export interface KoaContextState extends Koa.DefaultState {
  auth?: {
    id: number;
    userId: number;
    phone: string;
    name: string;
  }
  authM?: {
    id: number;
    username: string;
    role: string;
  }
}

type Method = "get" | "post" | "put" | "delete" | "GET" | "POST" | "PUT" | "DELETE";

interface BreezeApiReq {
  params?: {
    [key: string]: Schema
  };
  query?: {
    [key: string]: Schema
  };
  body?: {
    [key: string]: Schema
  };
}
interface BreezeApiRes {
  "200": {
    [key: string]: Schema
  };
}

type Middleware = () => (ctx: Context, next: Next) => Promise<void>;

export type BreezeApi = {
  path: string;
  method: Method;
  summary: string;
  description?: string;
  operationId: string;
  middlewares?: Middleware[];
  docShow?: boolean;
  req?: BreezeApiReq;
  res?: BreezeApiRes;
};

export { typeApi, typeApiManage };


import * as _ from "lodash";
import envConfig from "@/envConfig";
import { Options } from "sequelize";

export type SequelizeConfig = {
  database: string;
  username: string;
  password: string;
  options?: Options;
};

const settings = {
  app: "Night-Breeze",
  host: "0.0.0.0",
  port: 3000,
  prod: false,
  tokenSecret: "Night-Breeze",
  passwordSaltRounds: 10,
  tokenExpiresIn: 30 * 24 * 60 * 60, // 30天
  swaggerConfig: {},
  redisConfig: {
    port: 6379, // Redis port
    host: "0.0.0.0", // Redis host
    password: "password",
    db: 0, // Defaults to 0
  },
  sequelizeConfig: {
    database: "database",
    username: "root",
    password: "password",
    options: {
      dialect: "mysql",
      host: "0.0.0.0",
      timezone: "+08:00",
      logging: true,
      define: {
        timestamps: true,
        freezeTableName: true,
      },
    },
  } as SequelizeConfig,
  logger: {
    dir: "logs",
    level: "debug",
  },
};

_.merge(settings, envConfig);

export default settings;

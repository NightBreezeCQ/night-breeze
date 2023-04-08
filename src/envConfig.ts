import * as _ from "lodash";
import { Options } from "sequelize";
import * as fs from "fs";
import * as path from "path";

export type SequelizeConfig = {
  database: string;
  username: string;
  password: string;
  options?: Options;
};

const envConfig = {
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
      logging: console.log,
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

function mergeJson(data: any, file: string) {
  file = path.resolve(process.env.CONFIG_DIR || process.cwd(), file);
  try {
    const content = fs.readFileSync(file, "utf8");
    _.merge(data, JSON.parse(content));
  } catch (err) {
    console.log(err);
  }
}

mergeJson(envConfig, "src/config/envConfig.json");
export default envConfig;

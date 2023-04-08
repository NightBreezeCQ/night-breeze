import { configure, getLogger, Logger } from "log4js";
import * as path from "path";
import envConfig from "@/config/envConfig";

const logDir = path.join(__dirname, `../../${envConfig.logger.dir}`);
configure({
  appenders: {
    log: {
      type: "stdout",
      filename: logDir + "/log",
      pattern: "yyyy-MM-dd.log",
      alwaysIncludePattern: true,
      backups: 3,
    },
    files: {
      type: "file",
      filename: logDir + "/log",
      pattern: "yyyy-MM-dd.log",
      alwaysIncludePattern: true,
      backups: 3,
    },
  },
  categories: {
    default: { appenders: ["log", "files"], level: envConfig.logger.level },

  },

});

const logger = getLogger();

export default logger;

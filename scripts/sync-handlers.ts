// require("ts-node").register();
require("../src/bootstrap");

import { pascalCase } from 'change-case';

const fs = require("fs");
const path = require("path");

const _ = require("lodash");

const METHODS = ["get", "put", "delete", "post", "options"];

const [apiFile, handlersName] = process.argv.slice(2);
if (!apiFile || !handlersName) {
  console.log("Usage: node ./sync-handlers.js <jsona-file> <handlers-name>");
  process.exit();
}
const api = require(`../src/${apiFile}`);

const handlers = require(path.join(__dirname, "../src", handlersName));

const operationIds = api.default.map(v => v.operationId);

const missOperationIds = _.difference(operationIds, _.keys(handlers.default));
let typeApi = `type${pascalCase(apiFile)}`
let todoContent = `import { Handler, ${typeApi} } from "@/type";\n`;
todoContent += missOperationIds.map(id => toOperation(id)).join("");

fs.writeFileSync(path.join(__dirname, "../src", handlersName, "__todo__.ts"), todoContent, "utf8");

function toOperation(operationId) {
  return `\nexport const ${operationId}: Handler<${typeApi}.${pascalCase(operationId)}Req> = async (req, ctx) => {
  ctx.body = "TO IMPLEMENTED";
};\n`;
}

function getOperationIds(spec) {
  const result = [];
  for (const path in spec.paths) {
    const pathItem = spec.paths[path];
    for (const method of METHODS) {
      const operation = pathItem[method];
      if (operation) {
        result.push(operation.operationId);
      }
    }
  }
  return result;
}

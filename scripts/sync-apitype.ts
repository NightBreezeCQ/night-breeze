require("../src/bootstrap");

import * as fs from "fs";
import * as path from "path";
import { joiToInterface } from 'joi-to-interface';
import * as joi from "joi";
import { pascalCase } from 'change-case';
const [apiFile] = process.argv.slice(2);
if (!apiFile) {
  console.log("Usage: ts-node ./sync-apiType.js <api-file>");
  process.exit();
}
const api = require(`../src/apis/${apiFile}`);
// import api from `../src/apis/${apiFile}`;

async function main() {
  let data = ""
  for (const item of api.default) {
    const { req = {}, operationId } = item
    const { params, query, body } = req
    let typeName = pascalCase(operationId) + "Req";
    let typeAttrs = joi.object({
      params: joi.object(params),
      query: joi.object(query),
      body: joi.object(body)
    })
    console.log(item)
    const idInterface = await joiToInterface({ [typeName]: typeAttrs });
    data += idInterface + "\n"
  }
  console.log(data)
  fs.writeFileSync(path.resolve(__dirname, `../src/type${pascalCase(apiFile)}.ts`), data, "utf8");
  process.exit()
}

main()

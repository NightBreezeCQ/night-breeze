import { Sequelize, Options } from "sequelize";
import settings from "@/settings";
import { load } from "@/models";

export type Args = {
  database: string;
  username: string;
  password: string;
  options?: Options;
};

export class Service extends Sequelize {
  public readonly args: Args;
  constructor(args: Args) {
    const { database, username, password, options } = args;
    super(database, username, password, options);
    this.args = args;
  }
}
const srv = new Service(settings.sequelizeConfig);
load(srv);

export default srv;

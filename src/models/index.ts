import { Sequelize } from "sequelize";

import User from "./User";

export function load(sequelize: Sequelize) {
  User.bootstrap(sequelize);
  User.associate();
}

export {
  User,
};

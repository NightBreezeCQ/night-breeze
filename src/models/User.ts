import { Sequelize, Model, DataTypes, NOW } from "sequelize";
import settings from "@/settings";
import * as jwt from "jsonwebtoken";

interface UserAttributes {
  // AutoGenIntefaceAttrBegin {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  username?: string;
  password?: string;
  nickname?: string;
  // } AutoGenIntefaceAttrEnd
}

export default class User extends Model<UserAttributes, Partial<UserAttributes>> {
  // AutoGenModelAttrsBegin {
  public id: number;
  public createdAt: Date;
  public updatedAt: Date;
  public username: string;
  public password: string;
  public nickname: string;
  // } AutoGenModelAttrsEnd

  public static bootstrap(sequelize: Sequelize) {
    User.init(
      {
        // AutoGenColumnDefsBegin {
        id: {
          type: DataTypes.BIGINT().UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        createdAt: {
          type: DataTypes.DATE(),
          defaultValue: NOW,
        },
        updatedAt: {
          type: DataTypes.DATE(),
          defaultValue: NOW,
        },
        username: {
          type: DataTypes.STRING(20),
          allowNull: false,
          defaultValue: "",
        },
        password: {
          type: DataTypes.STRING(255),
          allowNull: false,
          defaultValue: "",
        },
        nickname: {
          type: DataTypes.STRING(20),
          allowNull: false,
          defaultValue: "",
        },
        // } AutoGenColumnDefsEnd
      },
      {
        sequelize,
        tableName: "user",
        timestamps: true,
      },
    );
  }
  public static associate() {
  }

  public static userInfo = ["id", "username", "nickname"]

  public getLoginResult() {
    const accessToken = this.getAuthToken();
    const result = {
      accessToken: accessToken,
      tokenType: "Bearer",
      expiresIn: settings.tokenExpiresIn,
      id: this.id,
      username: this.username,
      nickname: this.nickname,
    };
    return result;
  }

  public getAuthToken() {
    const { tokenSecret, tokenExpiresIn } = settings
    const token = jwt.sign(
      {
        id: this.id,
        userId: this.id,
        username: this.username,
        nickname: this.nickname,
      },
      tokenSecret,
      {
        expiresIn: tokenExpiresIn,
      },
    );
    return token;
  }
}

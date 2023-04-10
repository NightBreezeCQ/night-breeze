export interface RegisterUsernameReq {
  params?: {};
  query?: {};
  body?: {
    /**
     * 用户账号
     */
    username: string;
    /**
     * 用户密码
     */
    password: string;
  };
}

export interface LoginByPasswordReq {
  params?: {};
  query?: {};
  body?: {
    /**
     * 用户账号
     */
    username: string;
    /**
     * 用户密码
     */
    password: string;
  };
}

export interface UserInfoReq {
  params?: {};
  query?: {};
  body?: {};
}


export interface LoginByPasswordReq {
  params?: {};
  query?: {};
  body?: {
    /**
     * 管理员账号
     */
    username: string;
    /**
     * 管理员密码
     */
    password: string;
  };
}

export interface UserListReq {
  params?: {};
  query?: {
    /**
     * 用户id
     */
    userId?: number;
  };
  body?: {};
}

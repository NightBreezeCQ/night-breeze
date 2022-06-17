const ErrCodes = {
  ErrInternal: {
    status: 500,
    message: "${message}",
  },
  ErrValidation: {
    status: 400,
    message: "${message}",
  },
  ErrAuth: {
    status: 401,
    message: "登录已过期,请重新登录",
  },
  ErrAuthToken: {
    status: 401,
    message: "登录已过期,请重新登录",
  },
  ErrMessage: {
    status: 405,
    message: "${message}",
  },
  ErrNotFound: {
    status: 404,
    message: "无效的资源地址",
  },
};

export default ErrCodes;

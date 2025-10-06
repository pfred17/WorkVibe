// errorCodes.js
module.exports = {
  NOT_FOUND: {
    message: "Not found",
    statusCode: 404,
  },
  UNAUTHORIZED: {
    message: "Unauthorized",
    statusCode: 401,
  },
  FORBIDDEN: {
    message: "Forbidden",
    statusCode: 403,
  },
  BAD_REQUEST: {
    message: "Bad request",
    statusCode: 400,
  },
  INTERNAL_ERROR: {
    message: "Internal server error",
    statusCode: 500,
  },
};

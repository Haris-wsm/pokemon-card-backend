module.exports = function (err, req, res, next) {
  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    ok: false,
    status_code: statusCode,
    message: err.message,
    validation: err?.validation,
  });
};

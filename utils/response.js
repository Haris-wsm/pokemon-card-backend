exports.responseSuccess = function (res, msg, status, data) {
  res.send({
    ok: true,
    status_code: status || 200,
    message: msg,
    data: data,
    length: data?.length,
  });
};

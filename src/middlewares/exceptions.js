const exceptions = (err, req, res, next) => {
  // TODO 공통 Exception 코드를 작성 해주세요

  const status = err.status || 500;
  const message = err.message;
  const error = {
    status,
    message,
  };
  res.status(status).send({
    success: false,
    response: null,
    error,
  });

  next();
};
export default exceptions;

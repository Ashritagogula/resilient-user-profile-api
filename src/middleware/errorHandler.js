const errorHandler = (err, req, res, next) => {
  console.error("Global Error Handler:", err);

  const errorCode = err.errorCode || "SERVER_ERROR";
  const message = err.message || "Internal server error";
  const status = err.statusCode || 500;

  res.status(status).json({
    errorCode,
    message,
    details: err.details || []
  });
};

module.exports = errorHandler;

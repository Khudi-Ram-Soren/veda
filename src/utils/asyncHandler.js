const asyncHandler = async (handlerFn) => {
  return (req, res, next) => {
    Promise.resolve(handlerFn(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler };

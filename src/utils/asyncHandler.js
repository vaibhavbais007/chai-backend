// Promise Syntaxx
const asyncHandler = async (requestHandler) => {
  (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next))
    .catch((err) => {
      next(err)
    })
  }
}

export { asyncHandler }

//      Async Await Syntax
// const asyncHandler = (fn) => async (req, res, next) => {
//   try {
//     await fn(req, res, next);
//   } catch(err) {
//     res.status(err.code || 500).json({
//       success: 'failed',
//       message: err.message
//     })
//   }
// }
// const ErrorMiddleware=(err,req,res,next)=>{
//     err.statusCode=err.statusCode || "Internel server Error "
//     res.status(err.statusCode).json({
//         sucess:false,
//         message:err.message
//     })
// }
// export default ErrorMiddleware

const ErrorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
  
    err.message = err.message || "Internal Server Error";
  
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  };
  
  export default ErrorMiddleware;
  
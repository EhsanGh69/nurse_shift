const multer = require("multer");

exports.notFoundErrorHandler = (req, res, next) => {
    return res.status(404).json({
      error: {
        message: "404 | Not Found!",
      },
    });
}

exports.serverErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: "حجم فایل بیش از حد مجاز است" });
  }
  if (err.message === 'File type is not valid') {
      return res.status(400).json({ message: "نوع فایل نامعتبر می باشد" });
  }
   
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(status).json({ error: message });
}
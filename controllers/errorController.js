exports.triggerError = (req, res, next) => {
    throw new Error("This is a test 500 error!")
  }
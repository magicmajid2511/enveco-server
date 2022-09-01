// !TODO - still need to check if auth is done via sessions or not
module.exports = (req, res, next) => {
  // checks if the user is logged in when trying to access a specific page
  if (!req.body.username) {
    return res
      .status(403)
      .json({ errorMessage: "You must be logged in to see this page" });
  }
  next();
};

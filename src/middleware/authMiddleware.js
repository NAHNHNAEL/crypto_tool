export const isAuthenticated = (req, res, next) => {
  // Check if user is logged in
    if (req.session.user) {
      // If user is logged in, call next middleware
      next();
    } else {
      // If user is not logged in, redirect to login page
      res.redirect('/user/login');
    }
}

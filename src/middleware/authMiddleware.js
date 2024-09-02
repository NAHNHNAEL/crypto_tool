export const isAuthenticatedUser = (req, res, next) => {
  // Check if user is logged in
  if (req.session.user) {
    // If user is logged in, call next middleware
    next();
  } else {
    // If user is not logged in, redirect to login page
    res.redirect('/user/login');
  }
}

export const isAuthenticatedAdmin = (req, res, next) => {
  // Check if admin is logged in
  if (req.session.admin) {
    // If admin is logged in, call next middleware
    next();
  } else {
    // If admin is not logged in, redirect to login page
    res.redirect('/admin/login');
  }
}

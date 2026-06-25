export function requireAuth (req, res, next) {
    if(!req.session.userId) {
        return res.redirect ("/auth/login");
    }
    next(); //this means "user is logged in, continue to the protected route"
}
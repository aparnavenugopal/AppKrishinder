const AdminAuth = (req, res, next) => {
    console.log('you are in admin auth');
    const isAdmin = 'xyz';
    const token = 'xyz' === isAdmin;
    if (token) {
        next();
    } else {
        res.send('You are not authorized to access this route');
    }
}

module.exports = AdminAuth;
const UserController = require("../controllers/UserController");

const verifyPermission = (permissions) => {
    return async (req, res, next) => {
        const userId = parseInt(req.cookies['user-id']);
        const userRole = await UserController.selectUserRole(userId);

        if(permissions.includes(userRole)) {
            return next();
        } else {
            return res.status(401).json({error: "Unauthorized"});
        }  
    }
}

module.exports = { verifyPermission };
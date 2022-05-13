const { verify } = require("jsonwebtoken");
require('dotenv').config();

const validateToken = (req, res, next) => {
    const accessToken = req.cookies["access-token"];

    if (!accessToken) {
        return res.status(401).json({error: "User not authenticated!"});
    }

    try {
        const validToken = verify(accessToken, process.env.JWT_SECRET);

        if (validToken) {   
            res.authenticated = true;
            return next();
        }
    } catch (err) {
        console.log(err);
        return res.status(401).json({error: err});
    }
}

module.exports = { validateToken }
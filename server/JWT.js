const { sign, verify } = require("jsonwebtoken");

const createTokens = (user) => {
    const accessToken = sign({username: user['username'], id: user['id'] }, "secretsecret");

    return accessToken;
}

const validateToken = (req, res, next) => {
    const accessToken = req.cookies["access-token"];
    console.debug("Token:", accessToken);

    if (!accessToken) {
        return res.status(401).json({error: "User not authenticated!"});
    }

    try {
        const validToken = verify(accessToken, "secretsecret");

        if (validToken) {   
            res.authenticated = true;
            return next();
        }
    } catch (err) {
        return res.status(401).json({error: err});
    }
}

module.exports = { createTokens, validateToken };
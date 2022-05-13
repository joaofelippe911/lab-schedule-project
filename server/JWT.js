const { sign } = require("jsonwebtoken");
require('dotenv').config();
const createTokens = (user) => {
    const accessToken = sign({username: user['username'], id: user['id'] }, process.env.JWT_SECRET);

    return accessToken;
}

module.exports = { createTokens };
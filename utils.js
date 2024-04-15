const JWT = require("jsonwebtoken");

function generateToken(id, email) {
    return JWT.sign({
        id, email,
    }, process.env.JWT_SECRET, { expiresIn: '24h' });
}

module.exports = generateToken()
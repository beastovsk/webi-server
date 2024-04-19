const JWT = require("jsonwebtoken");

const generateToken = ({ id, email }) => {
	return JWT.sign(
		{
			id,
			email,
		},
		process.env.JWT_SECRET,
		{ expiresIn: "24h" }
	);
};

module.exports = generateToken;

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: "webisupagency@gmail.com",
		pass: "Calvin6448",
	},
});

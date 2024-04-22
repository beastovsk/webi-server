const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'coctencoflez@gmail.com',
        pass: 'Calvin6448'
    }
});


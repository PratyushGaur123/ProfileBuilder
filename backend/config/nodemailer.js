const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.PROFILE_GOOGLE_EMAIL,
        pass: process.env.PROFILE_GOOGLE_APP_PASSWORD,
        clientId: process.env.PROFILE_GOOGLE_CLIENT_ID,
        clientSecret: process.env.PROFILE_GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.PROFILE_GOOGLE_REFRESH_TOKEN
    }
});

const renderTemplate = function(data, relativePath){
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname, '../views/mailers', relativePath),
        data,
        function(err, template){
            if(err){
                console.log('Error in rendering the template: ', err);
                return;
            }
            mailHTML = template;
        }
    )
    return mailHTML;
}

module.exports = {
    transporter,
    renderTemplate
}
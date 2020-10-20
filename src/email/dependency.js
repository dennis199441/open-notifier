const { sgMail } = require('../utils/client.sendgrid');
const { awsSesClient } = require('../utils/client.aws');

const EmailService = require("./email.service");
const emailService = new EmailService(awsSesClient);

module.exports = {
    emailService
};

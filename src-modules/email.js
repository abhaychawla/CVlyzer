// Send Grid for sending emails
const sgMail = require('@sendgrid/mail');

// Environment Configuration
const config = require('../config/config');

sgMail.setApiKey(config.sendgridApiKey);

function sendEmails(sender, recipients, email) {
    let recipientEmails = [];

    for (const recipient of recipients) {
        recipientEmails.push({
            name: recipient.name,
            email: recipient.email
        });
    }

    const message = {
        to: recipientEmails,
        from: {
            name: sender.name,
            email: sender.email
        },
        subject: email.subject,
        text: email.description
    };

    sgMail.sendMultiple(message);
}

module.exports = {
    sendEmails: sendEmails
};

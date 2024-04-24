const sgMail = require("@sendgrid/mail");

sgMail.setApiKey("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");
//we registered to sendgrid.com =>elgun.ezmemmedov@gmail.com ile
const sendSGMail = async ({ to, sender, subject, html, attachments = [], text }) => {
    const from = "shreyanshshah242@gmail.com";
    // text: text,
    const msg = { to, from, subject, html, attachments }
    try {
        return sgMail.send(msg);
    } catch (error) {
        console.log(error);
    }
};

exports.sendEmail = async (args) => {
    if (!process.env.NODE_ENV === "development") {
        return Promise.resolve();
    } else {
        return sendSGMail(args);
    }
};
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SG_KEY);
//we registered to sendgrid.com =>elgun.ezmemmedov@gmail.com ile
const sendSGMail = async ({ to, sender, subject, html, attachments, text }) => {
    console.log({ to, sender, subject, html, attachments, text });

    try {
        const from = "shreyanshshah242@gmail.com";
        // text: text,
        const msg = { to, from, subject, html, attachments }
        console.log({msg});
        
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
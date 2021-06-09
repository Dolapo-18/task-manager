const mailgun = require("mailgun-js");

const mg = mailgun({ 
    apiKey: process.env.MAILGUN_API_KEY, 
    domain: process.env.MAILGUN_DOMAIN 
});


//send welcoming email to new user
const sendWelcomeEmail = (email, name) => {
    const data = {
        from: 'Excited User <me@samples.mailgun.org>',
        to: email,
        subject: 'Thanks for signing up!',
        text: `Welcome to the Task Manager app, ${name}`
    }

    mg.messages().send(data, function (error, body) {
        //console.log(body);
    });
}

//send cancellation email to deleted user
const sendCancelationEmail = (email, name) => {
    const data = {
        from: 'Excited User <me@samples.mailgun.org>',
        to: email,
        subject: `Goodbye ${name}`,
        text: `Thanks for the time spent with us, ${name}`
    }

    mg.messages().send(data, function (error, body) {
        //console.log(body);
    });
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}
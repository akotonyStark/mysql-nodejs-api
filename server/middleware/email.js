const sgMail = require('@sendgrid/mail')

const sendgridAPIKey = process.env.SENDGRID_API_KEY
sgMail.setApiKey(sendgridAPIKey);
//sgMail.setApiKey(process.env.SENDGRID_API_KEY)


const verifiedSender = 'myemail@persol.net'

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: verifiedSender,
        subject: 'Thanks for signing up!',
        text: `Hey ${name}, Welcome to the app. We hope you like it`
    })
}

//cancellation email
const sendCancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: verifiedSender,
        subject: 'Account cancellation!',
        html: `<i><h2>Goodbye ${name},</h2> We're sorry to see you go. Is there anything you would have liked us to do</i>`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}

const sgMail = require('@sendgrid/mail')

const sendgridAPIKey = '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'
sgMail.setApiKey(sendgridAPIKey);
//sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// const msg = {
//     to: 'alarbiampofo@gmail.com', // Change to your recipient
//     from: 'augustine.larbi-ampofo@persol.net', // Change to your verified sender
//     subject: 'Sending with SendGrid is Fun',
//     text: 'and easy to do anywhere, even with Node.js',
//     html: '<strong>and easy to do anywhere, even with Node.js</strong>',
// }
// sgMail.send(msg).then(() => {
//     console.log('Email sent')
// }).catch((error) => {
//     console.error(error)
// })

const verifiedSender = 'augustine.larbi-ampofo@persol.net'

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
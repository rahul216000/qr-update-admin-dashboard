const Sib = require('sib-api-v3-sdk')
const client = Sib.ApiClient.instance
const MyapiKey = client.authentications['api-key']
MyapiKey.apiKey = process.env.BREVO_API_KEY;


function SendMail(sender, email, subject, content) {
    const tranEmailApi = new Sib.TransactionalEmailsApi()

    const receivers = [
        {
            email: email
        }
    ]

    tranEmailApi
        .sendTransacEmail({
            sender,
            to: receivers,
            subject: subject,
            htmlContent: `${content}
        `
        })
        .then(console.log)
        .catch(console.log)
}

module.exports = SendMail;

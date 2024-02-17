const mailer = require('nodemailer');
const EmailActivation = require("../models/EmailActivation");

class EmailService {
    constructor() {
        this.transporter = mailer.createTransport({
            host: process.env.SMPT_HOST,
            port: process.env.SMPT_PORT,
            secure: false,
            auth: {
                user: process.env.SMPT_USER,
                pass: process.env.SMTP_PASSWORD
            }
        })
    }

    async sendActivationMail(to, link) {
        await this.transporter.sendMail({
            from: process.env.SMPT_USER,
            to,
            subject: 'Активация аккаунта на ' + process.env.API_URL,
            text: '',
            html: `
                <div>
                    <h1>Для активации пройдите по <a target="_blank" href="${link}">ссылке<a/></h1>
                </div>
            `
        })
    }


    async createEmailActivation(id) {
        await EmailActivation.create({
            isActivated: false,
            user: id
        })
    }
}

module.exports = new EmailService();

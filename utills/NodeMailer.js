import nodemailer from 'nodemailer'

export default async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            port: Number(process.env.EMAIL_PORT),
            secure: false,
            service: process.env.SERVICE,
            auth: {
                user: process.env.SENDER_MAIL,
                pass: process.env.PASS,
            },
        })

        await transporter.sendMail({
            from: process.env.SENDER_MAIL,
            to: email,
            subject: subject,
            text: text
        })
    } catch (error) {
        console.log(error)
    }
}
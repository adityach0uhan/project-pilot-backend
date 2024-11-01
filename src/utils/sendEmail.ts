import nodemailer from 'nodemailer';

async function sendEmail(to: string, subject: string, text: string) {
    const smtpUser = process.env.SMTP_User;
    const smtpPass = process.env.SMTP_Pass;

    if (!smtpUser || !smtpPass) {
        throw new Error(
            'SMTP credentials are not set in environment variables.'
        );
    }

    let transporter = nodemailer.createTransport({
        host: 'sandbox.smtp.mailtrap.io',
        port: 2525,
        auth: {
            user: '8bde28327426b1',
            pass: '244333191f2964'
        }
    });

    let mailOptions = {
        from: '"Student Project Manager" <your-email@example.com>', // Use an actual email address
        to: to,
        subject: subject,
        text: text
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
}

export default sendEmail;

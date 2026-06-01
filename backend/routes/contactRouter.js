import express from 'express';
import { Resend } from 'resend';
import validator from 'validator';

const router = express.Router();

router.post('/', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ message: 'Name, email, and message are required' });
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: 'Invalid email address' });
    }

    try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const { data, error } = await resend.emails.send({
            from: 'Portfolio Contact <onboarding@resend.dev>',
            to: process.env.CONTACT_EMAIL,
            replyTo: email,
            subject: `New message from ${name}`,
            html: `
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
            `
        });

        if (error) {
            console.error('Resend error:', error);
            return res.status(500).json({ message: error.message || 'Failed to send message' });
        }

        res.status(200).json({ message: 'Message sent' });
    } catch (err) {
        console.error('Contact route error:', err);
        res.status(500).json({ message: 'Failed to send message' });
    }
});

export default router;

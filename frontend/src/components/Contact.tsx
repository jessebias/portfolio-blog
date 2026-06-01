import { useState } from 'react';
import axios from 'axios';
import Button from './ui/Button';

const Contact = () => {
    const [name, setName]       = useState('');
    const [email, setEmail]     = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus]   = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');
        setErrorMsg('');
        try {
            await axios.post('/api/contact', { name, email, message });
            setStatus('success');
            setName('');
            setEmail('');
            setMessage('');
        } catch (err: any) {
            setErrorMsg(err.response?.data?.message || 'Failed to send message. Please try again.');
            setStatus('error');
        }
    };

    return (
        <section id="contact" className="max-w-[800px] mx-auto px-6 py-[120px]">
            <h2 className="tracking-[0.2em] mb-[40px] text-[1.05rem] text-center">CONTACT</h2>

            <div className="rounded-3xl border border-(--border) bg-[#080808] p-8 md:p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.03)_0%,transparent_70%)] pointer-events-none"></div>

                <form className="flex flex-col gap-6 relative z-10" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-[0.7rem] uppercase tracking-[0.14em] text-(--muted)">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="bg-[rgba(255,255,255,0.03)] border border-(--border) rounded-xl px-4 py-3 text-(--text) outline-none focus:border-[rgba(255,255,255,0.2)] transition-colors placeholder:text-[rgba(255,255,255,0.1)]"
                                placeholder="YOUR NAME"
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[0.7rem] uppercase tracking-[0.14em] text-(--muted)">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="bg-[rgba(255,255,255,0.03)] border border-(--border) rounded-xl px-4 py-3 text-(--text) outline-none focus:border-[rgba(255,255,255,0.2)] transition-colors placeholder:text-[rgba(255,255,255,0.1)]"
                                placeholder="YOUR EMAIL"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[0.7rem] uppercase tracking-[0.14em] text-(--muted)">Message</label>
                        <textarea
                            rows={6}
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            className="bg-[rgba(255,255,255,0.03)] border border-(--border) rounded-xl px-4 py-3 text-(--text) outline-none focus:border-[rgba(255,255,255,0.2)] transition-colors placeholder:text-[rgba(255,255,255,0.1)] resize-none"
                            placeholder="WHAT'S ON YOUR MIND?"
                            required
                        ></textarea>
                    </div>

                    {status === 'success' && (
                        <p className="text-green-400 text-xs tracking-wide text-center">MESSAGE SENT — I'll be in touch.</p>
                    )}
                    {status === 'error' && (
                        <p className="text-red-400 text-xs tracking-wide text-center">{errorMsg}</p>
                    )}

                    <div className="flex justify-center mt-4">
                        <Button type="submit" disabled={status === 'sending'}>
                            {status === 'sending' ? 'SENDING...' : 'SEND MESSAGE'}
                        </Button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default Contact;

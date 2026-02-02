import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Utensils, AlertCircle, CheckCircle2 } from 'lucide-react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        // Mocking the backend request for now
        try {
            // await axios.post('/api/auth/forgot-password', { email });
            await new Promise(resolve => setTimeout(resolve, 1500));
            setIsSubmitted(true);
        } catch (err) {
            setError('Failed to send reset link. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex items-center justify-center p-4 transition-colors duration-300">
            <div className="max-w-[440px] w-full">
                {/* Logo Section */}
                <div className="flex flex-col items-center mb-12">
                    <div className="w-24 h-24 bg-[#0a0a0a] dark:bg-black rounded-[2.2rem] flex items-center justify-center shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] mb-8 relative group overflow-hidden border dark:border-gray-800">
                        <div className="absolute inset-0 bg-gradient-to-tr from-black via-[#1a1a1a] to-[#2a2a2a]"></div>
                        <Utensils className="text-[#ccac41] relative z-10 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]" size={44} strokeWidth={2.5} />
                    </div>
                    <h1 className="text-[2.75rem] font-[900] text-[#1a1a1b] dark:text-gray-100 tracking-[-0.03em] mb-2 leading-tight text-center">Reset Password</h1>
                    <p className="text-[#71717a] dark:text-gray-400 font-semibold text-center opacity-80 text-sm">
                        {isSubmitted
                            ? "Check your email for the reset instructions"
                            : "Enter your email to receive a password reset link"}
                    </p>
                </div>

                {isSubmitted ? (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/20 p-6 rounded-[1.5rem] flex flex-col items-center gap-4 text-center">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="text-green-600 dark:text-green-400" size={32} />
                            </div>
                            <div>
                                <h3 className="text-green-800 dark:text-green-300 font-black text-lg mb-1 uppercase tracking-wider">Email Sent!</h3>
                                <p className="text-green-600 dark:text-green-400 font-bold text-sm">
                                    We've sent a recovery link to <br />
                                    <span className="text-green-700 dark:text-green-200 underline">{email}</span>
                                </p>
                            </div>
                        </div>

                        <div className="text-center">
                            <Link to="/login" className="inline-flex items-center gap-2 text-[#71717a] dark:text-gray-400 hover:text-[#1a1a1b] dark:hover:text-gray-100 font-black text-sm transition-all hover:gap-3 uppercase tracking-widest">
                                <ArrowLeft size={16} strokeWidth={3} />
                                Back to Login
                            </Link>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-7">
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 p-4 rounded-2xl mb-6 flex items-start gap-3 border border-red-100 dark:border-red-900/20">
                                <AlertCircle size={20} className="shrink-0 mt-0.5" />
                                <p className="text-sm font-bold">{error}</p>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-black text-[#1a1a1b] dark:text-gray-300 mb-2.5 px-1 uppercase tracking-wider opacity-90">Email Address</label>
                            <div className="relative group flex items-center">
                                <div className="absolute left-5 text-[#94a3b8] transition-colors group-focus-within:text-[#ccac41]">
                                    <Mail size={20} />
                                </div>
                                <input
                                    type="email"
                                    className="w-full bg-[#eff6ff] dark:bg-[#1a1a1a] border-2 border-transparent rounded-[1.25rem] py-4.5 pl-14 pr-5 focus:bg-white dark:focus:bg-black focus:border-[#ccac41] transition-all outline-none font-bold text-[#1a1a1b] dark:text-gray-100 placeholder:text-[#94a3b8]/70"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-[#ccac41] hover:bg-[#b49435] text-[#1a1a1b] font-[900] text-lg py-5 rounded-[1.25rem] shadow-[0_15px_30px_-10px_rgba(204,172,65,0.4)] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98] tracking-[0.15em] uppercase border-b-4 border-[#b49435]/30"
                        >
                            {isSubmitting ? 'SENDING LINK...' : 'SEND RESET LINK'}
                        </button>

                        <div className="pt-8 text-center">
                            <Link to="/login" className="inline-flex items-center gap-2 text-[#71717a] dark:text-gray-400 hover:text-[#1a1a1b] dark:hover:text-gray-100 font-black text-sm transition-all hover:gap-3 uppercase tracking-widest">
                                <ArrowLeft size={16} strokeWidth={3} />
                                Back to Login
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;

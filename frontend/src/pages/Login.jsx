import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Mail,
    Lock,
    AlertCircle,
    Utensils,
    ArrowLeft
} from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [keepLoggedIn, setKeepLoggedIn] = useState(false);

    const { login, user, loading } = useAuth();
    const navigate = useNavigate();

    // Redirect if already logged in
    React.useEffect(() => {
        if (!loading && user) {
            if (user.role === 'customer') {
                navigate('/dashboard');
            } else {
                navigate('/admin');
            }
        }
    }, [user, loading, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to login. Please check your credentials.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex items-center justify-center p-4 transition-colors duration-300">
            <div className="max-w-[440px] w-full">
                {/* Logo Section - Squircle Style */}
                <div className="flex flex-col items-center mb-12">
                    <div className="w-24 h-24 bg-[#0a0a0a] dark:bg-black rounded-[2.2rem] flex items-center justify-center shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] mb-8 relative group overflow-hidden border dark:border-gray-800">
                        <div className="absolute inset-0 bg-gradient-to-tr from-black via-[#1a1a1a] to-[#2a2a2a]"></div>
                        <Utensils className="text-[#ccac41] relative z-10 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]" size={44} strokeWidth={2.5} />
                    </div>
                    <h1 className="text-[2.75rem] font-[900] text-[#1a1a1b] dark:text-gray-100 tracking-[-0.03em] mb-2 leading-tight">Welcome Back</h1>
                    <p className="text-[#71717a] dark:text-gray-400 font-semibold text-center opacity-80 text-sm">Enter your credentials to access the system</p>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 p-4 rounded-2xl mb-6 flex items-start gap-3 border border-red-100 dark:border-red-900/20">
                        <AlertCircle size={20} className="shrink-0 mt-0.5" />
                        <p className="text-sm font-bold">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-7">
                    {/* Email Input */}
                    <div>
                        <label className="block text-sm font-black text-[#1a1a1b] dark:text-gray-300 mb-2.5 px-1 uppercase tracking-wider opacity-90">Email Address</label>
                        <div className="relative group flex items-center">
                            <div className="absolute left-5 text-[#94a3b8] transition-colors group-focus-within:text-[#ccac41]">
                                <Mail size={20} />
                            </div>
                            <input
                                type="email"
                                className="w-full bg-[#eff6ff] dark:bg-[#1a1a1a] border-2 border-transparent rounded-[1.25rem] py-4.5 pl-14 pr-5 focus:bg-white dark:focus:bg-black focus:border-[#ccac41] transition-all outline-none font-bold text-[#1a1a1b] dark:text-gray-100 placeholder:text-[#94a3b8]/70"
                                placeholder="admin@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div>
                        <div className="flex justify-between items-center mb-2.5 px-1">
                            <label className="text-sm font-black text-[#1a1a1b] dark:text-gray-300 uppercase tracking-wider opacity-90">Password</label>
                            <Link to="/forgot-password" size="sm" className="text-sm font-black text-[#ccac41] hover:text-[#b49435] transition-colors">
                                Forgot?
                            </Link>
                        </div>
                        <div className="relative group flex items-center">
                            <div className="absolute left-5 text-[#94a3b8] transition-colors group-focus-within:text-[#ccac41]">
                                <Lock size={20} />
                            </div>
                            <input
                                type="password"
                                className="w-full bg-[#eff6ff] dark:bg-[#1a1a1a] border-2 border-transparent rounded-[1.25rem] py-4.5 pl-14 pr-5 focus:bg-white dark:focus:bg-black focus:border-[#ccac41] transition-all outline-none font-bold text-[#1a1a1b] dark:text-gray-100 placeholder:text-[#94a3b8]/70"
                                placeholder="••••••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Checkbox */}
                    <div className="flex items-center px-1">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative flex items-center justify-center">
                                <input
                                    type="checkbox"
                                    className="peer sr-only"
                                    checked={keepLoggedIn}
                                    onChange={(e) => setKeepLoggedIn(e.target.checked)}
                                />
                                <div className="w-6 h-6 bg-[#eff6ff] dark:bg-[#1a1a1a] border border-[#dbeafe] dark:border-gray-800 rounded-lg peer-checked:bg-[#ccac41] peer-checked:border-[#ccac41] transition-all duration-300 shadow-sm"></div>
                                <div className="absolute text-white scale-0 peer-checked:scale-100 transition-transform duration-300">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </div>
                            </div>
                            <span className="text-sm font-bold text-[#71717a] dark:text-gray-400">Keep me logged in</span>
                        </label>
                    </div>

                    {/* Sign In Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#ccac41] hover:bg-[#b49435] text-[#1a1a1b] font-[900] text-lg py-5 rounded-[1.25rem] shadow-[0_15px_30px_-10px_rgba(204,172,65,0.4)] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98] tracking-[0.15em] uppercase border-b-4 border-[#b49435]/30"
                    >
                        {isSubmitting ? 'SIGNING IN...' : 'SIGN IN'}
                    </button>
                </form>

                {/* Footer Links */}
                <div className="mt-12 space-y-7 text-center">
                    <p className="text-[#71717a] dark:text-gray-400 font-bold text-sm tracking-tight">
                        New to the system?{' '}
                        <Link to="/register" className="text-[#ccac41] hover:text-[#b49435] transition-colors font-black uppercase tracking-wider ml-1">
                            Create Account
                        </Link>
                    </p>

                    <div className="pt-2">
                        <p className="text-[10px] font-black text-[#cbd5e1] dark:text-gray-600 uppercase tracking-[0.2em] mb-1">
                            LOCKED OUT? <Link to="/contact" className="text-[#60a5fa] hover:text-[#3b82f6] transition-colors ml-1">CONTACT ADMIN</Link>
                        </p>
                        <p className="text-xs font-bold text-[#94a3b8] dark:text-gray-500 italic opacity-60">(admin@example.com)</p>
                    </div>

                    <div className="pt-8 border-t border-[#f1f5f9] dark:border-gray-900">
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

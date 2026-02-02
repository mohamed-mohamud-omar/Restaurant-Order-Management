import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Mail,
    Lock,
    User as UserIcon,
    AlertCircle,
    ChevronDown,
    ShieldCheck,
    UserRound,
    ArrowLeft,
    Utensils,
    CheckCircle
} from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'customer'
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }

        setIsSubmitting(true);
        try {
            const { confirmPassword, ...registerData } = formData;
            const response = await register(registerData);

            // If there's a message (pending approval), show it
            if (response.message) {
                setSuccessMessage(response.message);
                // Reset form
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    role: 'customer'
                });
            } else {
                // Customer registration - redirect to home
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create account. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex items-center justify-center p-4 transition-colors duration-300">
            <div className="max-w-[480px] w-full">
                {/* Logo Section - Squircle Style */}
                <div className="flex flex-col items-center mb-10">
                    <div className="w-20 h-20 bg-[#0a0a0a] dark:bg-black rounded-[2rem] flex items-center justify-center shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] mb-6 relative group overflow-hidden border dark:border-gray-800">
                        <div className="absolute inset-0 bg-gradient-to-tr from-black via-[#1a1a1a] to-[#2a2a2a]"></div>
                        <Utensils className="text-[#ccac41] relative z-10 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]" size={38} strokeWidth={2.5} />
                    </div>
                    <h1 className="text-[2.5rem] font-[900] text-[#1a1a1b] dark:text-gray-100 tracking-[-0.03em] mb-2 leading-tight">Create Account</h1>
                    <p className="text-[#71717a] dark:text-gray-400 font-semibold text-center opacity-80 text-sm">Join our premium dining community</p>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 p-4 rounded-2xl mb-6 flex items-start gap-3 border border-red-100 dark:border-red-900/20">
                        <AlertCircle size={20} className="shrink-0 mt-0.5" />
                        <p className="text-sm font-bold">{error}</p>
                    </div>
                )}

                {successMessage && (
                    <div className="bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400 p-5 rounded-2xl mb-6 border border-green-200 dark:border-green-900/20">
                        <div className="flex items-start gap-3 mb-3">
                            <CheckCircle size={22} className="shrink-0 mt-0.5 text-green-600 dark:text-green-400" />
                            <div>
                                <h3 className="font-black text-base mb-1">Registration Successful!</h3>
                                <p className="text-sm font-semibold leading-relaxed">{successMessage}</p>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-green-200 dark:border-green-900/20">
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-2 text-sm font-bold text-green-700 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition-colors"
                            >
                                <ArrowLeft size={16} />
                                Return to Login
                            </Link>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Input */}
                    <div>
                        <label className="block text-xs font-[1000] text-[#1a1a1b] dark:text-gray-300 mb-2 px-1 uppercase tracking-widest opacity-90">Full Name</label>
                        <div className="relative group flex items-center">
                            <div className="absolute left-5 text-[#94a3b8] transition-colors group-focus-within:text-[#ccac41]">
                                <UserIcon size={18} />
                            </div>
                            <input
                                type="text"
                                name="name"
                                className="w-full bg-[#eff6ff] dark:bg-[#1a1a1a] border-2 border-transparent rounded-[1.25rem] py-4 pl-14 pr-5 focus:bg-white dark:focus:bg-black focus:border-[#ccac41] transition-all outline-none font-bold text-[#1a1a1b] dark:text-gray-100 placeholder:text-[#94a3b8]/70"
                                placeholder="Abdisalam Aidid"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Email Input */}
                    <div>
                        <label className="block text-xs font-[1000] text-[#1a1a1b] dark:text-gray-300 mb-2 px-1 uppercase tracking-widest opacity-90">Email Address</label>
                        <div className="relative group flex items-center">
                            <div className="absolute left-5 text-[#94a3b8] transition-colors group-focus-within:text-[#ccac41]">
                                <Mail size={18} />
                            </div>
                            <input
                                type="email"
                                name="email"
                                className="w-full bg-[#eff6ff] dark:bg-[#1a1a1a] border-2 border-transparent rounded-[1.25rem] py-4 pl-14 pr-5 focus:bg-white dark:focus:bg-black focus:border-[#ccac41] transition-all outline-none font-bold text-[#1a1a1b] dark:text-gray-100 placeholder:text-[#94a3b8]/70"
                                placeholder="salam@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Password */}
                        <div>
                            <label className="block text-xs font-[1000] text-[#1a1a1b] dark:text-gray-300 mb-2 px-1 uppercase tracking-widest opacity-90">Password</label>
                            <div className="relative group flex items-center">
                                <div className="absolute left-5 text-[#94a3b8] transition-colors group-focus-within:text-[#ccac41]">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    className="w-full bg-[#eff6ff] dark:bg-[#1a1a1a] border-2 border-transparent rounded-[1.25rem] py-4 pl-14 pr-5 focus:bg-white dark:focus:bg-black focus:border-[#ccac41] transition-all outline-none font-bold text-[#1a1a1b] dark:text-gray-100 placeholder:text-[#94a3b8]"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-xs font-[1000] text-[#1a1a1b] dark:text-gray-300 mb-2 px-1 uppercase tracking-widest opacity-90">Confirm</label>
                            <div className="relative group flex items-center">
                                <div className="absolute left-5 text-[#94a3b8] transition-colors group-focus-within:text-[#ccac41]">
                                    <ShieldCheck size={18} />
                                </div>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    className="w-full bg-[#eff6ff] dark:bg-[#1a1a1a] border-2 border-transparent rounded-[1.25rem] py-4 pl-14 pr-5 focus:bg-white dark:focus:bg-black focus:border-[#ccac41] transition-all outline-none font-bold text-[#1a1a1b] dark:text-gray-100 placeholder:text-[#94a3b8]"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Role Selection */}
                    <div>
                        <label className="block text-xs font-[1000] text-[#1a1a1b] dark:text-gray-300 mb-2 px-1 uppercase tracking-widest opacity-90">Select Role</label>
                        <div className="relative group flex items-center">
                            <div className="absolute left-5 text-[#94a3b8] transition-colors group-focus-within:text-[#ccac41]">
                                <UserIcon size={18} />
                            </div>
                            <select
                                name="role"
                                className="w-full bg-[#eff6ff] dark:bg-[#1a1a1a] border-2 border-transparent rounded-[1.25rem] py-4 pl-14 pr-12 focus:bg-white dark:focus:bg-black focus:border-[#ccac41] transition-all outline-none font-bold text-[#1a1a1b] dark:text-gray-100 appearance-none cursor-pointer"
                                value={formData.role}
                                onChange={handleChange}
                            >
                                <option value="customer">Customer</option>
                                <option value="staff">General Staff</option>
                                <option value="waiter">Staff (Waiter)</option>
                                <option value="kitchen">Staff (Kitchen)</option>
                                <option value="cashier">Staff (Cashier)</option>
                            </select>
                            <div className="absolute right-5 pointer-events-none text-[#94a3b8] transition-colors group-focus-within:text-[#ccac41]">
                                <ChevronDown size={20} />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#d4af37] hover:bg-[#c5a030] text-black font-black text-lg py-5 rounded-[1.2rem] shadow-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed mt-4 active:scale-[0.98] tracking-[0.1em] uppercase"
                    >
                        {isSubmitting ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <div className="text-center mt-8 space-y-4">
                    <p className="text-[#71717a] font-bold">
                        Already have an account?{' '}
                        <Link to="/login" className="text-[#d4af37] hover:text-[#c5a030] transition-colors ml-1 uppercase tracking-wider">
                            Sign In
                        </Link>
                    </p>

                    <Link to="/" className="flex items-center justify-center gap-2 text-[#71717a] hover:text-[#1a1a1b] font-bold text-sm transition-colors pt-4 border-t border-[#f1f5f9]">
                        <ArrowLeft size={16} />
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;

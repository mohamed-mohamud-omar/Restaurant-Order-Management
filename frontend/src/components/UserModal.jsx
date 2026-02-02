import React, { useState, useEffect } from 'react';
import { X, User, Mail, Shield, Lock, Power } from 'lucide-react';

const UserModal = ({ isOpen, onClose, onSave, user }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'staff',
        isActive: true
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                password: '', // Don't show password in edit mode
                role: user.role || 'staff',
                isActive: user.isActive ?? true
            });
        } else {
            setFormData({
                name: '',
                email: '',
                password: '',
                role: 'staff',
                isActive: true
            });
        }
    }, [user, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/40 dark:bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#111111] rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-gray-800 transition-colors">
                <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-[#1a1a1a]">
                    <div>
                        <h3 className="text-2xl font-black text-gray-800 dark:text-white tracking-tight">
                            {user ? 'Edit User' : 'Add New User'}
                        </h3>
                        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">
                            {user ? `Managing Access for ${user._id.slice(-6).toUpperCase()}` : 'Grant access to a new team member'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 hover:bg-white dark:hover:bg-white/10 rounded-2xl transition-all hover:rotate-90 group shadow-sm border border-transparent hover:border-gray-100 dark:hover:border-gray-700"
                    >
                        <X size={24} className="text-gray-400 group-hover:text-orange-600 transition-colors" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {/* Name */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2 px-1">
                            <User size={12} /> Full Name
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. John Doe"
                            className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-bold text-gray-800 dark:text-gray-200 placeholder:text-gray-300 dark:placeholder:text-gray-600"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2 px-1">
                            <Mail size={12} /> Email Address
                        </label>
                        <input
                            type="email"
                            required
                            placeholder="e.g. john@example.com"
                            className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-bold text-gray-800 dark:text-gray-200 placeholder:text-gray-300 dark:placeholder:text-gray-600"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    {/* Password (Only for new users OR optional for edit) */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2 px-1">
                            <Lock size={12} /> {user ? 'New Password (Optional)' : 'Password'}
                        </label>
                        <input
                            type="password"
                            required={!user}
                            placeholder={user ? "••••••••" : "At least 6 characters"}
                            className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-bold text-gray-800 dark:text-gray-200 placeholder:text-gray-300 dark:placeholder:text-gray-600"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {/* Role */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2 px-1">
                                <Shield size={12} /> access Role
                            </label>
                            <select
                                className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-bold text-gray-800 dark:text-gray-200 cursor-pointer appearance-none uppercase text-xs tracking-wider"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            >
                                <option value="customer">Customer</option>
                                <option value="waiter">Waiter</option>
                                <option value="kitchen">Kitchen</option>
                                <option value="cashier">Cashier</option>
                                <option value="staff">Staff</option>
                                <option value="admin">Administrator</option>
                            </select>
                        </div>

                        {/* Status Toggle */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2 px-1">
                                <Power size={12} /> Account Status
                            </label>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                                className={`w-full py-4 px-6 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 border-[1.5px] ${formData.isActive
                                        ? 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400 hover:bg-green-500/20'
                                        : 'bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/20'
                                    }`}
                            >
                                <div className={`w-2 h-2 rounded-full ${formData.isActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                                {formData.isActive ? 'Active' : 'Inactive'}
                            </button>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all uppercase text-[10px] tracking-widest"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-4 bg-orange-600 text-white font-bold rounded-2xl hover:bg-orange-700 transition-all shadow-xl shadow-orange-100 dark:shadow-none uppercase text-[10px] tracking-widest hover:scale-105 active:scale-95"
                        >
                            {user ? 'Save Changes' : 'Create Account'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserModal;

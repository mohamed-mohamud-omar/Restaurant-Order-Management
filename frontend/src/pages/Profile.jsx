import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Calendar, Key } from 'lucide-react';

const Profile = () => {
    const { user } = useAuth();

    if (!user) return <div className="p-8">Loading profile...</div>;

    return (
        <div className="p-8 animate-in slide-in-from-bottom-4 duration-500 min-h-screen transition-colors">
            <h1 className="text-4xl font-black text-gray-800 dark:text-gray-100 mb-8 tracking-tight">My Profile</h1>

            <div className="max-w-3xl bg-white dark:bg-[#111111] rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden transition-colors">
                {/* Header / Banner */}
                <div className="h-32 bg-gradient-to-r from-orange-400 to-orange-600 dark:from-orange-600 dark:to-orange-800 relative">
                    <div className="absolute -bottom-12 left-8">
                        <div className="w-24 h-24 rounded-2xl bg-white dark:bg-[#111111] border-4 border-white dark:border-gray-800 flex items-center justify-center text-orange-600 dark:text-orange-500 text-3xl font-black shadow-lg uppercase transition-colors">
                            {user.name.charAt(0)}
                        </div>
                    </div>
                </div>

                <div className="pt-16 pb-8 px-8">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{user.name}</h2>
                            <p className="text-gray-500 dark:text-gray-400 font-medium">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
                        </div>
                        <div className="bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition-colors">
                            {user.isActive ? 'Active Account' : 'Inactive'}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                        {/* Detail Cards */}
                        <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-gray-800 transition-colors">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                                    <Mail size={18} />
                                </div>
                                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Email Address</span>
                            </div>
                            <p className="text-gray-800 dark:text-gray-200 font-semibold pl-1">{user.email}</p>
                        </div>

                        <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-gray-800 transition-colors">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
                                    <Shield size={18} />
                                </div>
                                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Role & Permissions</span>
                            </div>
                            <p className="text-gray-800 dark:text-gray-200 font-semibold pl-1 capitalize">{user.role}</p>
                        </div>

                        <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-gray-800 transition-colors">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
                                    <Calendar size={18} />
                                </div>
                                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Joined On</span>
                            </div>
                            <p className="text-gray-800 dark:text-gray-200 font-semibold pl-1">
                                {new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>

                        <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-gray-800 transition-colors opacity-50 cursor-not-allowed">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-lg">
                                    <Key size={18} />
                                </div>
                                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Password</span>
                            </div>
                            <p className="text-gray-800 dark:text-gray-200 font-semibold pl-1">••••••••</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;

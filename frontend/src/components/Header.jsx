import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, LogOut, User as UserIcon, ShoppingBag } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const Header = ({ title, subtitle }) => {
    const { user, logout } = useAuth();
    const { isDarkMode, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="flex justify-between items-center p-6 bg-white dark:bg-[#1a1a1a] border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
            <div>
                {title ? (
                    <>
                        <h1 className="text-2xl font-[900] text-gray-800 dark:text-gray-100 tracking-tight leading-none uppercase">{title}</h1>
                        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mt-2">{subtitle}</p>
                    </>
                ) : (
                    <>
                        <h1 className="text-2xl font-[900] text-gray-800 dark:text-gray-100 tracking-tight">SOMALI<span className="text-orange-600">RESTAURANT</span></h1>
                        <p className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Customer Portal • {user?.role}</p>
                    </>
                )}
            </div>

            <div className="flex items-center gap-6">
                {/* My Orders Link - Only for customers */}
                {user?.role === 'customer' && (
                    <Link
                        to="/my-orders"
                        className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30 font-bold text-sm transition-all active:scale-95 border border-orange-100 dark:border-orange-800"
                    >
                        <ShoppingBag size={18} />
                        <span className="hidden sm:inline">My Orders</span>
                    </Link>
                )}

                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-[#111111] text-gray-500 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-500 hover:bg-white dark:hover:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 flex items-center justify-center transition-all duration-300 active:scale-90 shadow-sm hover:shadow-md cursor-pointer group z-50"
                    title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                    {isDarkMode ? (
                        <Sun size={20} className="transition-transform group-hover:rotate-45" />
                    ) : (
                        <Moon size={20} className="transition-transform group-hover:-rotate-12" />
                    )}
                </button>

                <div className="h-8 w-px bg-gray-100 dark:bg-gray-800 mx-1"></div>

                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-black text-gray-800 dark:text-gray-100 uppercase tracking-tight leading-none">{user?.name}</p>
                        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase mt-1 tracking-widest">{user?.role} ACCESS</p>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="p-3 rounded-2xl bg-gray-50 dark:bg-[#2a2a2a] text-gray-400 hover:text-red-500 transition-all active:scale-95 shadow-sm"
                        title="Logout"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;

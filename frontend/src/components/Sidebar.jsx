import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    ClipboardList,
    Menu as MenuIcon,
    CreditCard,
    Users as UsersIcon,
    BarChart,
    LogOut,
    ChefHat
} from 'lucide-react';

const Sidebar = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const menuItems = [
        // Dashboard: Admin only
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin', allowedRoles: ['admin'] },
        // POS: Admin, Staff, Waiter, Cashier
        { icon: MenuIcon, label: 'Take Order', path: '/menu', allowedRoles: ['admin', 'staff', 'waiter', 'cashier'] },
        // Orders: Admin only (for full order management)
        { icon: ClipboardList, label: 'Orders', path: '/admin/orders', allowedRoles: ['admin'] },
        // Menu Management: Admin only
        { icon: MenuIcon, label: 'Manage Menu', path: '/admin/menu-manage', allowedRoles: ['admin'] },
        // Payments: Admin and Cashier, Staff, Waiter
        { icon: CreditCard, label: 'Payments', path: '/admin/payments', allowedRoles: ['admin', 'staff', 'cashier', 'waiter'] },
        // Kitchen: Admin and Kitchen, Staff, Waiter
        { icon: ChefHat, label: 'Kitchen View', path: '/admin/kitchen', allowedRoles: ['admin', 'staff', 'kitchen', 'waiter'] },
        // Management: Admin only
        { icon: UsersIcon, label: 'Users', path: '/admin/users', allowedRoles: ['admin'] },
        { icon: BarChart, label: 'Reports', path: '/admin/reports', allowedRoles: ['admin'] },
    ];

    const filteredMenuItems = menuItems.filter(item =>
        item.allowedRoles.includes(user?.role || 'customer')
    );

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <aside className="w-64 bg-white dark:bg-[#111111] border-r border-gray-100 dark:border-gray-800 flex flex-col h-screen sticky top-0 transition-all z-50">
            {/* Branding */}
            <div className="p-8 border-b border-gray-50 dark:border-gray-800">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-orange-100 dark:shadow-none border-2 border-orange-500/20 rotate-3 group-hover:rotate-0 transition-transform">
                        <span className="text-white font-black text-2xl italic leading-none">S</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-gray-800 dark:text-gray-100 tracking-tighter leading-none uppercase">Somali<span className="text-orange-600 italic">Restaurant</span></h1>
                        <p className="text-[10px] font-bold text-gray-300 dark:text-gray-600 uppercase tracking-[0.2em] mt-1">Control Center</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1.5 mt-6 overflow-y-auto">
                {filteredMenuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/admin'}
                        className={({ isActive }) => `
              flex items-center gap-3.5 px-5 py-3.5 rounded-2xl font-bold transition-all group relative overflow-hidden
              ${isActive
                                ? 'bg-orange-600 text-white shadow-xl shadow-orange-100 dark:shadow-none'
                                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] hover:text-gray-900 dark:hover:text-gray-100'}
            `}
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 relative z-10 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-orange-600'}`} />
                                <span className="text-sm relative z-10">{item.label}</span>
                                {isActive && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-500 opacity-100"></div>
                                )}
                            </>
                        )}
                    </NavLink>
                ))}

                {/* Profile Link (Visible to All Staff) */}
                <NavLink
                    to="/admin/profile"
                    className={({ isActive }) => `
              flex items-center gap-3.5 px-5 py-3.5 rounded-2xl font-bold transition-all group relative overflow-hidden mt-2
              ${isActive
                            ? 'bg-orange-600 text-white shadow-xl shadow-orange-100 dark:shadow-none'
                            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] hover:text-gray-900 dark:hover:text-gray-100'}
            `}
                >
                    {({ isActive }) => (
                        <>
                            <UsersIcon className={`w-5 h-5 transition-transform group-hover:scale-110 relative z-10 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-orange-600'}`} />
                            <span className="text-sm relative z-10">Profile</span>
                            {isActive && (
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-500 opacity-100"></div>
                            )}
                        </>
                    )}
                </NavLink>
            </nav>

            {/* User Info Minimal */}
            <div className="p-6 border-t border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-black/20">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 flex items-center justify-center text-orange-600 font-black shadow-sm uppercase">
                        {user?.name?.charAt(0) || 'A'}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-[11px] font-black text-gray-800 dark:text-gray-100 truncate leading-none uppercase tracking-tight">{user?.name}</p>
                        <p className="text-[9px] font-bold text-gray-400 dark:text-gray-600 uppercase mt-1 tracking-widest">{user?.role} Access</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;

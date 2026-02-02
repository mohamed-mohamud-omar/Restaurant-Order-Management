import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import {
    Plus,
    Search,
    MoreVertical,
    Shield,
    User as UserIcon,
    CheckCircle,
    XCircle,
    Edit2,
    Trash2,
    Power
} from 'lucide-react';
import UserModal from '../components/UserModal';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users');
            setUsers(response.data.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to load users');
            setLoading(false);
        }
    };

    const handleSaveUser = async (userData) => {
        try {
            if (selectedUser) {
                // Update
                const res = await api.put(`/users/${selectedUser._id}`, userData);
                setUsers(users.map(u => u._id === selectedUser._id ? res.data.data : u));
            } else {
                // Create
                const res = await api.post('/users', userData);
                setUsers([res.data.data, ...users]);
            }
            setIsModalOpen(false);
            setSelectedUser(null);
        } catch (err) {
            alert(err.response?.data?.error || 'Operation failed');
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await api.delete(`/users/${id}`);
            setUsers(users.filter(u => u._id !== id));
        } catch (err) {
            alert(err.response?.data?.error || 'Delete failed');
        }
    };

    const toggleUserStatus = async (user) => {
        try {
            const res = await api.put(`/users/${user._id}`, {
                isActive: !user.isActive
            });
            setUsers(users.map(u => u._id === user._id ? res.data.data : u));
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to update user status');
        }
    };

    const openEditModal = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const openAddModal = () => {
        setSelectedUser(null);
        setIsModalOpen(true);
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-8 text-center text-gray-500">Loading users...</div>;

    return (
        <div className="p-8 animate-in slide-in-from-bottom-4 duration-500 transition-colors">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-black text-gray-800 dark:text-gray-100 tracking-tight">User Management</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Manage access and roles for your team</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="bg-orange-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-100 flex items-center gap-2 active:scale-95"
                >
                    <Plus size={20} />
                    Add New User
                </button>
            </div>

            <div className="bg-white dark:bg-[#111111] rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                {/* Toolbar */}
                <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex items-center gap-4 bg-gray-50/50 dark:bg-[#1a1a1a]">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-[#252525] border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium text-gray-800 dark:text-gray-200"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-[#1a1a1a] border-b border-gray-100 dark:border-gray-800">
                            <tr>
                                <th className="px-8 py-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider text-right">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                            {filteredUsers.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors group">
                                    <td className="px-8 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 font-bold uppercase text-sm">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800 dark:text-gray-200">{user.name}</p>
                                                <p className="text-sm text-gray-400 dark:text-gray-500 font-medium">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={`
                                            inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide
                                            ${user.role === 'admin' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' :
                                                user.role === 'staff' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}
                                        `}>
                                            <Shield size={12} />
                                            {user.role}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.isActive ? (
                                            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-bold text-xs bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-lg w-fit">
                                                <CheckCircle size={14} />
                                                Active
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-red-500 dark:text-red-400 font-bold text-xs bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-lg w-fit">
                                                <XCircle size={14} />
                                                Inactive
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 text-gray-400">
                                            <button
                                                onClick={() => toggleUserStatus(user)}
                                                className={`p-2 rounded-lg transition-colors ${user.isActive
                                                    ? 'hover:bg-orange-50 dark:hover:bg-orange-900/20 text-gray-400 hover:text-orange-600 dark:hover:text-orange-400'
                                                    : 'hover:bg-green-50 dark:hover:bg-green-900/20 text-gray-400 hover:text-green-600 dark:hover:text-green-400'
                                                    }`}
                                                title={user.isActive ? 'Deactivate User' : 'Activate User'}
                                            >
                                                <Power size={18} />
                                            </button>
                                            <button
                                                onClick={() => openEditModal(user)}
                                                className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors"
                                                title="Edit User"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(user._id)}
                                                className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg transition-colors"
                                                title="Delete User"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-8 py-12 text-center text-gray-400 font-medium">
                                        No users found matching "{searchTerm}"
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <UserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveUser}
                user={selectedUser}
            />
        </div>
    );
};

export default Users;

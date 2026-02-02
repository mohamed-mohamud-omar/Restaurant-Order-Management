import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Package, Clock, CheckCircle, XCircle, ChefHat, DollarSign } from 'lucide-react';

const MyOrders = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/orders', {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Filter to show only current user's orders
            const myOrders = response.data.data.filter(order => order.user._id === user._id);
            setOrders(myOrders);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <Clock className="text-yellow-500" size={20} />;
            case 'preparing':
                return <ChefHat className="text-blue-500" size={20} />;
            case 'ready':
                return <CheckCircle className="text-green-500" size={20} />;
            case 'delivered':
                return <CheckCircle className="text-green-600" size={20} />;
            case 'cancelled':
                return <XCircle className="text-red-500" size={20} />;
            default:
                return <Package className="text-gray-500" size={20} />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
            case 'preparing':
                return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
            case 'ready':
                return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
            case 'delivered':
                return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
            case 'cancelled':
                return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
            default:
                return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400';
        }
    };

    const filteredOrders = filter === 'all'
        ? orders
        : orders.filter(order => order.status === filter);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0f0f0f]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f0f] transition-colors duration-300">
            <div className="max-w-6xl mx-auto p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-black text-gray-800 dark:text-gray-100 mb-2 tracking-tight">My Orders</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Track your order history and status</p>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {['all', 'pending', 'preparing', 'ready', 'delivered', 'cancelled'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-6 py-2.5 rounded-xl font-bold text-sm uppercase tracking-wide transition-all whitespace-nowrap ${filter === status
                                    ? 'bg-orange-600 text-white shadow-lg'
                                    : 'bg-white dark:bg-[#1a1a1a] text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#222222] border border-gray-200 dark:border-gray-800'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                    <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl p-12 text-center border border-gray-100 dark:border-gray-800">
                        <Package className="mx-auto mb-4 text-gray-300 dark:text-gray-700" size={64} />
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">No Orders Found</h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            {filter === 'all'
                                ? "You haven't placed any orders yet."
                                : `No ${filter} orders found.`}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredOrders.map((order) => (
                            <div
                                key={order._id}
                                className="bg-white dark:bg-[#1a1a1a] rounded-3xl p-6 border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                                            {getStatusIcon(order.status)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-800 dark:text-gray-100 text-lg">
                                                Order #{order._id.slice(-6).toUpperCase()}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`px-4 py-2 rounded-xl font-bold text-sm uppercase ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="space-y-2 mb-4 pl-4 border-l-2 border-gray-100 dark:border-gray-800">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center py-2">
                                            <div className="flex items-center gap-3">
                                                <span className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg font-bold text-sm text-gray-600 dark:text-gray-400">
                                                    {item.quantity}x
                                                </span>
                                                <span className="font-semibold text-gray-800 dark:text-gray-200">
                                                    {item.menuItem.name}
                                                </span>
                                            </div>
                                            <span className="font-bold text-gray-700 dark:text-gray-300">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Order Footer */}
                                <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-800">
                                    <div className="flex items-center gap-2 text-sm">
                                        <DollarSign size={16} className="text-gray-400" />
                                        <span className="text-gray-500 dark:text-gray-400 font-medium">
                                            Payment: <span className="font-bold text-gray-700 dark:text-gray-300 capitalize">{order.paymentMethod || 'Cash'}</span>
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Total Amount</p>
                                        <p className="text-2xl font-black text-orange-600 dark:text-orange-500">
                                            ${order.totalAmount.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;

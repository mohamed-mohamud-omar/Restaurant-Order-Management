import React, { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import { Clock, CheckCircle, ChefHat, AlertCircle } from 'lucide-react';

const KitchenDisplay = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const lastOrderCount = useRef(0);
    const audioRef = useRef(new Audio('/notification.mp3')); // Ensure this file exists in public/ or handle error

    const fetchKitchenOrders = async () => {
        try {
            // Fetch pending, preparing, and ready orders
            const res = await api.get('/orders?status=pending&status=preparing&status=ready');
            // Sort by time (oldest first)
            const sortedOrders = res.data.data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

            // Sound Alert logic
            if (sortedOrders.length > lastOrderCount.current && lastOrderCount.current !== 0) {
                // Play sound
                audioRef.current.play().catch(e => console.log('Audio play failed', e));
            }
            lastOrderCount.current = sortedOrders.length;

            setOrders(sortedOrders);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch kitchen orders', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchKitchenOrders();
        const interval = setInterval(fetchKitchenOrders, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, []);

    const updateStatus = async (orderId, newStatus) => {
        try {
            await api.put(`/orders/${orderId}`, { status: newStatus });
            fetchKitchenOrders(); // Refresh immediately
        } catch (error) {
            const message = error.response?.data?.error || 'Failed to update status';
            alert(message);
        }
    };

    const getElapsedTime = (createdAt) => {
        const diff = new Date() - new Date(createdAt);
        const minutes = Math.floor(diff / 60000);
        return `${minutes}m`;
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'pending': return 'bg-white dark:bg-[#111111] border-l-yellow-400';
            case 'preparing': return 'bg-blue-50 dark:bg-blue-900/20 border-l-blue-500 dark:border-l-blue-600';
            case 'ready': return 'bg-green-50 dark:bg-green-900/10 border-l-green-500 dark:border-l-green-600';
            default: return 'bg-white border-l-gray-300';
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading KDS...</div>;

    return (
        <div className="p-4 bg-gray-900 dark:bg-[#0a0a0a] min-h-screen transition-colors">
            <header className="flex justify-between items-center mb-6 px-4">
                <div>
                    <h1 className="text-3xl font-black text-white dark:text-gray-100 tracking-tight flex items-center gap-3">
                        <ChefHat className="text-orange-500" size={32} />
                        Kitchen Display System
                    </h1>
                    <p className="text-gray-400 dark:text-gray-500 font-medium text-sm mt-1">Live Feed • {orders.length} Active Tickets</p>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2 px-3 py-1 bg-gray-800 dark:bg-[#111111] rounded-lg border border-gray-700 dark:border-gray-800">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-bold text-gray-300 dark:text-gray-400 uppercase tracking-wider">Live</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4 overflow-x-auto pb-8">
                {orders.length === 0 && (
                    <div className="col-span-full h-96 flex flex-col items-center justify-center text-gray-600 dark:text-gray-500">
                        <CheckCircle size={64} className="mb-4 opacity-50" />
                        <h2 className="text-2xl font-bold">All caught up!</h2>
                        <p>No active orders in the queue.</p>
                    </div>
                )}

                {orders.map((order) => (
                    <div
                        key={order._id}
                        className={`rounded-xl overflow-hidden shadow-lg border-l-8 flex flex-col h-full transition-all ${getStatusStyles(order.status)}`}
                    >
                        {/* Ticket Header */}
                        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-start bg-opacity-50">
                            <div>
                                <h3 className="font-black text-xl text-gray-800 dark:text-gray-100">#{order._id.slice(-4).toUpperCase()}</h3>
                                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1">
                                    {order.tableNumber ? `Table ${order.tableNumber}` : 'Takeout'}
                                </p>
                            </div>
                            <div className="text-right">
                                <span className={`
                                    inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-black uppercase tracking-wider
                                    ${order.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-500' :
                                        order.status === 'preparing' ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400' :
                                            'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400'}
                                `}>
                                    <Clock size={12} />
                                    {getElapsedTime(order.createdAt)}
                                </span>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="p-4 flex-1 space-y-3">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="flex items-start gap-3">
                                    <span className="font-black text-gray-800 dark:text-gray-200 text-lg w-6">{item.quantity}x</span>
                                    <div>
                                        <p className="font-bold text-gray-800 dark:text-gray-200 leading-tight">{item.menuItem?.name}</p>
                                        {/* Optional: Add notes/mods here if schema supports it */}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="p-3 bg-gray-50 dark:bg-black/20 border-t border-gray-100 dark:border-gray-800 grid grid-cols-1 gap-2 transition-colors">
                            {order.status === 'pending' && (
                                <button
                                    onClick={() => updateStatus(order._id, 'preparing')}
                                    className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold uppercase tracking-wider hover:bg-blue-700 transition-colors shadow-md shadow-blue-200 dark:shadow-none"
                                >
                                    Start Prep
                                </button>
                            )}
                            {order.status === 'preparing' && (
                                <button
                                    onClick={() => updateStatus(order._id, 'ready')}
                                    className="w-full py-3 bg-green-600 text-white rounded-lg font-bold uppercase tracking-wider hover:bg-green-700 transition-colors shadow-md shadow-green-200 dark:shadow-none"
                                >
                                    Mark Ready
                                </button>
                            )}
                            {order.status === 'ready' && (
                                <button
                                    onClick={() => updateStatus(order._id, 'served')}
                                    className="w-full py-3 bg-orange-600 text-white rounded-lg font-bold uppercase tracking-wider hover:bg-orange-700 transition-colors shadow-md shadow-orange-200 dark:shadow-none animate-pulse hover:animate-none"
                                >
                                    Mark Served
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default KitchenDisplay;

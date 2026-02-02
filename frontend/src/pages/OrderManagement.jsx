import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import {
    ClipboardList,
    Plus,
    Search,
    Filter,
    RefreshCcw,
    Eye,
    Pencil,
    Trash2,
    DollarSign,
    Box
} from 'lucide-react';
import OrderDetailsModal from '../components/OrderDetailsModal';
import OrderEditModal from '../components/OrderEditModal';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filterStatus) params.append('status', filterStatus);

            const res = await api.get(`/orders?${params.toString()}`);
            const data = res.data.data;
            setOrders(data);

            // Sync selected order if open
            if (selectedOrder) {
                const updated = data.find(o => o._id === selectedOrder._id);
                if (updated) setSelectedOrder(updated);
            }
        } catch (error) {
            console.error('Failed to fetch orders', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [filterStatus]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            try {
                await api.delete(`/orders/${id}`);
                setOrders(orders.filter(order => order._id !== id));
                if (selectedOrder?._id === id) {
                    setIsDetailsOpen(false);
                    setIsEditOpen(false);
                }
            } catch (error) {
                alert('Failed to delete order');
            }
        }
    };

    const handlePay = async (id) => {
        try {
            const res = await api.put(`/orders/${id}`, {
                paymentStatus: 'paid',
                paymentMethod: 'Cash' // Default for quick pay
            });
            const updatedOrder = res.data.data;
            setOrders(orders.map(order => order._id === id ? updatedOrder : order));
            if (selectedOrder?._id === id) setSelectedOrder(updatedOrder);
        } catch (error) {
            alert('Failed to update payment status');
        }
    };

    const handleUpdateOrder = async (id, updatedData) => {
        try {
            const res = await api.put(`/orders/${id}`, updatedData);
            const updatedOrder = res.data.data;
            setOrders(orders.map(order => order._id === id ? updatedOrder : order));
            if (selectedOrder?._id === id) setSelectedOrder(updatedOrder);
        } catch (error) {
            alert('Failed to update order details');
        }
    };

    const handleView = (order) => {
        setSelectedOrder(order);
        setIsDetailsOpen(true);
    };

    const handleEdit = (order) => {
        setSelectedOrder(order);
        setIsEditOpen(true);
    };

    const getStatusStyle = (status) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'bg-[#fefce8] text-[#854d0e] dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'preparing':
                return 'bg-[#eff6ff] text-[#1e40af] dark:bg-blue-900/40 dark:text-blue-400';
            case 'ready':
                return 'bg-[#f0fdf4] text-[#166534] dark:bg-green-900/40 dark:text-green-400';
            case 'delivered':
            case 'served':
                return 'bg-[#f9fafb] text-[#374151] dark:bg-gray-800 dark:text-gray-400';
            case 'cancelled':
                return 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400';
            default:
                return 'bg-gray-50 text-gray-500';
        }
    };

    const filteredOrders = orders.filter(order => {
        const orderId = order._id.toLowerCase();
        const guestName = (order.customerName || '').toLowerCase();
        const userName = (order.user?.name || '').toLowerCase();
        const tableLabel = (order.tableNumber ? `Table ${order.tableNumber}` : 'Takeout').toLowerCase();
        const search = searchTerm.toLowerCase();

        return orderId.includes(search) ||
            guestName.includes(search) ||
            userName.includes(search) ||
            tableLabel.includes(search);
    });

    if (loading && !orders.length) {
        return (
            <div className="h-[400px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
            </div>
        );
    }

    return (
        <div className="p-8 animate-in fade-in duration-500 min-h-screen bg-[#fcfcfc] dark:bg-transparent font-sans">
            <div className="max-w-[1600px] mx-auto">
                <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#f97316] rounded-xl flex items-center justify-center shadow-lg shadow-orange-100 dark:shadow-none">
                            <Box className="text-white" size={24} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-[900] text-[#1e293b] dark:text-gray-100 tracking-tight leading-none uppercase">Order Management</h1>
                            <p className="text-gray-500 dark:text-gray-400 font-medium mt-2 text-sm italic">Track and manage all customer orders.</p>
                        </div>
                    </div>

                    <Link
                        to="/menu"
                        className="bg-[#f97316] text-white px-8 py-3.5 rounded-2xl font-black flex items-center gap-2 hover:bg-orange-700 transition-all shadow-md shadow-orange-50 dark:shadow-none active:scale-95 text-sm uppercase tracking-widest"
                    >
                        <Plus size={20} /> New Order
                    </Link>
                </header>

                {/* Sub-Header / Filters */}
                <div className="bg-white dark:bg-[#111111] p-3 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 mb-8 flex flex-wrap items-center gap-4">
                    <div className="relative flex-1 min-w-[300px]">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search order ID, guest, or table..."
                            className="w-full bg-gray-50/50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 rounded-[1.5rem] py-3.5 pl-14 pr-6 focus:ring-2 focus:ring-orange-500/10 outline-none transition-all font-bold text-gray-700 dark:text-gray-200 placeholder:text-gray-300 dark:placeholder:text-gray-600 text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-3 pr-2">
                        <div className="bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 px-6 py-3 rounded-[1.5rem] flex items-center gap-3 hover:border-gray-200 dark:hover:border-gray-700 transition-colors shadow-sm cursor-pointer">
                            <Filter size={18} className="text-gray-400" />
                            <select
                                className="bg-transparent border-none text-xs font-black text-gray-600 dark:text-gray-400 focus:ring-0 cursor-pointer outline-none uppercase tracking-widest"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="" className="dark:bg-[#1a1a1a]">All Statuses</option>
                                <option value="pending" className="dark:bg-[#1a1a1a]">Pending</option>
                                <option value="preparing" className="dark:bg-[#1a1a1a]">Preparing</option>
                                <option value="ready" className="dark:bg-[#1a1a1a]">Ready</option>
                                <option value="served" className="dark:bg-[#1a1a1a]">Served/Delivered</option>
                                <option value="cancelled" className="dark:bg-[#1a1a1a]">Cancelled</option>
                            </select>
                        </div>

                        <button
                            onClick={fetchOrders}
                            className="p-3.5 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 rounded-[1.5rem] text-gray-400 hover:text-orange-600 dark:hover:text-orange-500 transition-all active:scale-95 shadow-sm"
                        >
                            <RefreshCcw size={20} />
                        </button>
                    </div>
                </div>

                {/* Orders Content */}
                <div className="bg-white dark:bg-[#111111] rounded-[3rem] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden transition-all">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[#fcfcfc] dark:bg-[#1a1a1a] border-b border-gray-100 dark:border-gray-800">
                                <tr>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest">ID</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest">CUSTOMER / TABLE</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest">ITEMS</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest">TOTAL</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest">STATUS</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest text-right">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50/50 dark:divide-gray-800/50">
                                {filteredOrders.length > 0 ? (
                                    filteredOrders.map((order) => (
                                        <tr key={order._id} className="hover:bg-gray-50/30 dark:hover:bg-white/[0.01] transition-colors group">
                                            <td className="px-8 py-7">
                                                <span className="font-mono text-xs font-bold text-gray-400 group-hover:text-gray-600 transition-colors tracking-tight">
                                                    #{order._id.slice(-5).toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-8 py-7">
                                                <div>
                                                    <p className="text-base font-[900] text-[#1e293b] dark:text-gray-100 tracking-tight leading-none uppercase">
                                                        {order.customerName || order.user?.name || 'Walk-in'}
                                                    </p>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase mt-2 tracking-widest">
                                                        {order.tableNumber ? `Table ${order.tableNumber}` : 'Takeout'}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-7">
                                                <span className="text-sm font-bold text-gray-500 dark:text-gray-400">
                                                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-7">
                                                <span className="text-base font-[900] text-[#1e293b] dark:text-gray-100">
                                                    ${(order.totalAmount || 0).toFixed(2)}
                                                </span>
                                            </td>
                                            <td className="px-8 py-7">
                                                <span className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.1em] ${getStatusStyle(order.status)} shadow-sm`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-7 text-right">
                                                <div className="flex items-center justify-end gap-5">
                                                    {order.paymentStatus !== 'paid' ? (
                                                        <button
                                                            onClick={() => handlePay(order._id)}
                                                            className="flex items-center gap-1.5 text-[#16a34a] hover:text-[#15803d] transition-all text-[11px] font-[900] uppercase tracking-widest active:scale-95 group/pay"
                                                        >
                                                            <DollarSign size={14} strokeWidth={3} className="text-[#16a34a] group-hover/pay:scale-125 transition-transform" /> Pay
                                                        </button>
                                                    ) : (
                                                        <div className="text-[9px] font-black text-green-500/50 uppercase tracking-widest border border-green-500/20 px-2 py-1 rounded-lg">
                                                            Paid
                                                        </div>
                                                    )}
                                                    <button
                                                        onClick={() => handleView(order)}
                                                        className="text-gray-400 hover:text-blue-500 transition-all active:scale-90 hover:scale-110"
                                                        title="View Details"
                                                    >
                                                        <Eye size={20} strokeWidth={1.5} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEdit(order)}
                                                        className="text-gray-400 hover:text-orange-500 transition-all active:scale-90 hover:scale-110"
                                                        title="Edit Order"
                                                    >
                                                        <Pencil size={18} strokeWidth={1.5} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(order._id)}
                                                        className="text-gray-400 hover:text-red-500 transition-all active:scale-90 hover:scale-110"
                                                        title="Delete Order"
                                                    >
                                                        <Trash2 size={20} strokeWidth={1.5} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-8 py-24 text-center">
                                            <div className="flex flex-col items-center justify-center opacity-30">
                                                <ClipboardList size={64} className="text-gray-400 mb-4" />
                                                <p className="text-xl font-black text-gray-500 uppercase tracking-widest leading-none">No orders found</p>
                                                <p className="text-xs font-bold text-gray-400 mt-3 tracking-widest uppercase">Try adjusting your filters or search term</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <OrderDetailsModal
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                order={selectedOrder}
                onPay={handlePay}
                onEdit={handleEdit}
            />

            <OrderEditModal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                order={selectedOrder}
                onSave={handleUpdateOrder}
            />
        </div>
    );
};

export default OrderManagement;

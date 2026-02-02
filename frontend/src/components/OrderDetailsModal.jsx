import React from 'react';
import { X, Clock, MapPin, User, Hash, ChefHat, CheckCircle2, AlertCircle, Pencil } from 'lucide-react';

const OrderDetailsModal = ({ isOpen, onClose, order, onPay, onEdit }) => {
    if (!isOpen || !order) return null;

    const getStatusStyles = (status) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return { bg: 'bg-yellow-50 dark:bg-yellow-900/20', text: 'text-yellow-700 dark:text-yellow-400', icon: <Clock size={16} /> };
            case 'preparing':
                return { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-400', icon: <ChefHat size={16} /> };
            case 'ready':
                return { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-400', icon: <CheckCircle2 size={16} /> };
            case 'delivered':
            case 'served':
                return { bg: 'bg-gray-50 dark:bg-gray-800', text: 'text-gray-600 dark:text-gray-400', icon: <CheckCircle2 size={16} /> };
            case 'cancelled':
                return { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-400', icon: <AlertCircle size={16} /> };
            default:
                return { bg: 'bg-gray-50 dark:bg-gray-800', text: 'text-gray-600 dark:text-gray-400', icon: <AlertCircle size={16} /> };
        }
    };

    const statusStyle = getStatusStyles(order.status);

    const handleModalPay = async () => {
        await onPay(order._id);
    };

    return (
        <div className="fixed inset-0 bg-black/40 dark:bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#111111] rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-gray-800 transition-colors">
                {/* Header */}
                <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-[#1a1a1a]">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${statusStyle.bg} ${statusStyle.text}`}>
                            {statusStyle.icon}
                        </div>
                        <div>
                            <h3 className="text-2xl font-[1000] text-[#1e293b] dark:text-white tracking-tight leading-none uppercase">
                                Order #{order._id.slice(-5).toUpperCase()}
                            </h3>
                            <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mt-2">
                                {new Date(order.createdAt).toLocaleString()}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 hover:bg-white dark:hover:bg-white/10 rounded-2xl transition-all group shadow-sm border border-transparent hover:border-gray-100 dark:hover:border-gray-700"
                    >
                        <X size={24} className="text-gray-400 group-hover:text-orange-600 transition-colors" />
                    </button>
                </div>

                <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {/* Customer Info */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="p-5 rounded-3xl bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800">
                            <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <User size={12} /> Customer Info
                            </p>
                            <p className="text-base font-black text-[#1e293b] dark:text-white uppercase truncate">
                                {order.customerName || order.user?.name || 'Walk-in Customer'}
                            </p>
                            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-0.5">
                                {order.user?.email || 'Guest Account'}
                            </p>
                        </div>
                        <div className="p-5 rounded-3xl bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800">
                            <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <MapPin size={12} /> Location / Type
                            </p>
                            <p className="text-base font-black text-[#1e293b] dark:text-white uppercase truncate">
                                {order.tableNumber ? `Table ${order.tableNumber}` : 'Takeout'}
                            </p>
                            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-0.5 whitespace-nowrap">
                                {order.paymentStatus === 'paid' ? 'Paid via ' + (order.paymentMethod || 'Cash') : 'Pending Payment'}
                            </p>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div>
                        <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4 px-2">Order Summary</p>
                        <div className="space-y-3">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-50 dark:border-gray-800 transition-all hover:bg-gray-50/50 dark:hover:bg-white/[0.02]">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 font-black text-sm">
                                            {item.quantity}x
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-[#1e293b] dark:text-gray-100 uppercase tracking-tight">
                                                {item.menuItem?.name || 'Unknown Item'}
                                            </p>
                                            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                                                ${item.price?.toFixed(2) || '0.00'} / unit
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-sm font-[900] text-[#1e293b] dark:text-gray-100">
                                        ${((item.price || 0) * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Totals */}
                    <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex justify-between items-center mb-2 px-4 text-gray-500 dark:text-gray-400 font-bold text-xs uppercase tracking-widest">
                            <span>Subtotal</span>
                            <span>${(order.totalAmount || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center mb-6 px-4 py-4 bg-[#f97316] rounded-2xl text-white shadow-lg shadow-orange-100 dark:shadow-none">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Total Amount</span>
                            <span className="text-2xl font-[1000] tracking-tighter">${(order.totalAmount || 0).toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div className="p-8 bg-gray-50/50 dark:bg-[#1a1a1a] border-t border-gray-100 dark:border-gray-800 flex flex-wrap gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 min-w-[140px] py-4 px-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 font-[900] text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all active:scale-95"
                    >
                        Close Details
                    </button>
                    <button
                        onClick={() => onEdit(order)}
                        className="flex-1 min-w-[140px] py-4 px-6 bg-white dark:bg-[#111111] border border-orange-200 dark:border-orange-900/30 text-orange-600 dark:text-orange-500 font-[900] text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <Pencil size={14} strokeWidth={1.5} /> Edit Order
                    </button>
                    {order.paymentStatus !== 'paid' && (
                        <button
                            onClick={handleModalPay}
                            className="flex-1 min-w-[140px] py-4 px-6 bg-green-600 text-white font-[900] text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-green-700 transition-all shadow-lg shadow-green-100 dark:shadow-none active:scale-95 flex items-center justify-center gap-2"
                        >
                            <CheckCircle2 size={16} /> Mark as Paid
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsModal;

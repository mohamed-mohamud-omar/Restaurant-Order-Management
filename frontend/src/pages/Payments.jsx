import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import {
    DollarSign,
    CreditCard,
    Calendar,
    Download,
    Search,
    Filter,
    FileText,
    CheckCircle,
    XCircle,
    Printer,
    ChevronDown,
    RefreshCcw,
    TrendingUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Payments = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ totalRevenue: 0, pendingPayments: 0, paidCount: 0 });
    const [filters, setFilters] = useState({ paymentStatus: '', paymentMethod: '' });
    const [invoiceOrder, setInvoiceOrder] = useState(null);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters.paymentStatus) params.append('paymentStatus', filters.paymentStatus);
            if (filters.paymentMethod) params.append('paymentMethod', filters.paymentMethod);

            const res = await api.get(`/orders?${params.toString()}`);
            const data = res.data.data;
            setOrders(data);
            calculateStats(data);
        } catch (error) {
            console.error('Failed to fetch orders', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (data) => {
        const totalRev = data.reduce((acc, order) =>
            order.paymentStatus === 'paid' ? acc + order.totalAmount : acc, 0
        );
        const pending = data.reduce((acc, order) =>
            order.paymentStatus === 'unpaid' ? acc + order.totalAmount : acc, 0
        );
        const paid = data.filter(o => o.paymentStatus === 'paid').length;

        setStats({ totalRevenue: totalRev, pendingPayments: pending, paidCount: paid });
    };

    useEffect(() => {
        fetchOrders();
    }, [filters]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    const handlePrint = () => {
        const printContent = document.getElementById('invoice-content');
        const originalContents = document.body.innerHTML;

        document.body.innerHTML = printContent.innerHTML;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload(); // Reload to restore state/listeners
    };

    // Simplified update payment status for demo purposes
    // IN REAL APP: This would likely be a separate API call or integrated into order update
    const markAsPaid = async (order, method) => {
        try {
            await api.put(`/orders/${order._id}`, {
                paymentStatus: 'paid',
                paymentMethod: method
            });
            fetchOrders();
        } catch (error) {
            alert('Failed to update payment');
        }
    };

    if (loading && !orders.length) {
        return (
            <div className="h-[400px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
            </div>
        );
    }

    return (
        <div className="p-8 animate-in slide-in-from-bottom-4 duration-500 min-h-screen transition-colors">
            <div className="max-w-[1600px] mx-auto">
                <header className="mb-8">
                    <h1 className="text-4xl font-black text-gray-800 dark:text-gray-100 tracking-tight flex items-center gap-3">
                        <CreditCard className="text-orange-600 dark:text-orange-500" size={32} />
                        Payments & Billing
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Manage transactions, track revenue, and generate invoices.</p>
                </header>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white dark:bg-[#111111] p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4 transition-colors">
                        <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400">
                            <DollarSign size={28} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Total Revenue</p>
                            <h3 className="text-3xl font-black text-gray-800 dark:text-gray-100">{formatCurrency(stats.totalRevenue)}</h3>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#111111] p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4 transition-colors">
                        <div className="w-14 h-14 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-500">
                            <RefreshCcw size={28} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Pending Payments</p>
                            <h3 className="text-3xl font-black text-gray-800 dark:text-gray-100">{formatCurrency(stats.pendingPayments)}</h3>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#111111] p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4 transition-colors">
                        <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <TrendingUp size={28} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Paid Orders</p>
                            <h3 className="text-3xl font-black text-gray-800 dark:text-gray-100">{stats.paidCount}</h3>
                        </div>
                    </div>
                </div>

                {/* Filters & Actions */}
                <div className="bg-white dark:bg-[#111111] p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 mb-6 flex flex-wrap items-center gap-4 transition-colors text-gray-800 dark:text-gray-200">
                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-[#1a1a1a] rounded-xl border border-gray-100 dark:border-gray-700">
                        <Filter size={18} className="text-gray-400" />
                        <select
                            value={filters.paymentStatus}
                            onChange={(e) => setFilters({ ...filters, paymentStatus: e.target.value })}
                            className="bg-transparent border-none text-sm font-bold text-gray-700 dark:text-gray-300 focus:ring-0 cursor-pointer outline-none"
                        >
                            <option value="" className="dark:bg-[#1a1a1a]">All Statuses</option>
                            <option value="paid" className="dark:bg-[#1a1a1a]">Paid</option>
                            <option value="unpaid" className="dark:bg-[#1a1a1a]">Unpaid</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-[#1a1a1a] rounded-xl border border-gray-100 dark:border-gray-700">
                        <CreditCard size={18} className="text-gray-400" />
                        <select
                            value={filters.paymentMethod}
                            onChange={(e) => setFilters({ ...filters, paymentMethod: e.target.value })}
                            className="bg-transparent border-none text-sm font-bold text-gray-700 dark:text-gray-300 focus:ring-0 cursor-pointer outline-none"
                        >
                            <option value="" className="dark:bg-[#1a1a1a]">All Methods</option>
                            <option value="Cash" className="dark:bg-[#1a1a1a]">Cash</option>
                            <option value="Card" className="dark:bg-[#1a1a1a]">Card</option>
                            <option value="Mobile Money" className="dark:bg-[#1a1a1a]">Mobile Money</option>
                        </select>
                    </div>

                    <button
                        onClick={() => setFilters({ paymentStatus: '', paymentMethod: '' })}
                        className="text-sm font-bold text-gray-500 hover:text-orange-600 dark:hover:text-orange-400 ml-auto transition-colors"
                    >
                        Clear Filters
                    </button>
                </div>

                {/* Transactions Table */}
                <div className="bg-white dark:bg-[#111111] rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden transition-colors font-sans">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-[#1a1a1a] border-b border-gray-100 dark:border-gray-800">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider">Invoice ID</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider">Method</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                {orders.length > 0 ? (
                                    orders.map((order) => (
                                        <tr key={order._id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className="font-mono text-xs font-bold text-gray-500 dark:text-gray-400">#{order._id.slice(-6).toUpperCase()}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-bold text-gray-800 dark:text-gray-100">{order.user?.name || 'Unknown'}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-bold text-gray-800 dark:text-gray-100">{formatCurrency(order.totalAmount)}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {order.paymentStatus === 'paid' ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-black uppercase tracking-wider">
                                                        <CheckCircle size={12} /> Paid
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-black uppercase tracking-wider">
                                                        <XCircle size={12} /> Unpaid
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{order.paymentMethod || '-'}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {['admin', 'cashier'].includes(user?.role) && order.paymentStatus === 'unpaid' && (
                                                        <div className="relative group">
                                                            <button className="flex items-center gap-2 px-3 py-1.5 text-green-600 dark:text-green-500 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 rounded-xl transition-all border border-green-100 dark:border-green-900/30 font-bold text-xs uppercase tracking-wider">
                                                                <DollarSign size={14} />
                                                                Pay
                                                            </button>
                                                            {/* Dropdown for payment method */}
                                                            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#1a1a1a] shadow-2xl rounded-2xl p-2 hidden group-hover:block z-20 border border-gray-100 dark:border-gray-800 animate-in fade-in slide-in-from-top-2 duration-200">
                                                                <p className="text-[10px] font-black text-gray-400 uppercase px-3 py-1 mb-1 tracking-widest">Select Method</p>
                                                                <button onClick={() => markAsPaid(order, 'Cash')} className="w-full text-left px-3 py-2 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-xl text-sm font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2 transition-colors">
                                                                    <div className="w-2 h-2 rounded-full bg-green-500"></div> Cash
                                                                </button>
                                                                <button onClick={() => markAsPaid(order, 'Card')} className="w-full text-left px-3 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl text-sm font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2 transition-colors">
                                                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div> Card
                                                                </button>
                                                                <button onClick={() => markAsPaid(order, 'Mobile Money')} className="w-full text-left px-3 py-2 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-xl text-sm font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2 transition-colors">
                                                                    <div className="w-2 h-2 rounded-full bg-purple-500"></div> Mobile Money
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                    <button
                                                        onClick={() => setInvoiceOrder(order)}
                                                        className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                        title="View Invoice"
                                                    >
                                                        <FileText size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="p-12 text-center text-gray-500">
                                            <p className="font-bold">No transactions found</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Invoice Modal */}
            {invoiceOrder && (
                <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-[#111111] w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 shadow-2xl border border-gray-100 dark:border-gray-800">
                        {/* Printable Area - We keep it slightly neutral but themed for display */}
                        {/* Printable Area */}
                        <div id="invoice-content" className="p-10 bg-white dark:bg-[#111111] transition-colors relative overflow-hidden">
                            {/* Paid Stamp */}
                            {invoiceOrder.paymentStatus === 'paid' && (
                                <div className="absolute top-6 left-1/2 -translate-x-1/2 border-2 border-green-500/20 text-green-500/20 font-black text-2xl px-3 py-1 rounded-lg rotate-[-15deg] pointer-events-none select-none uppercase tracking-[0.3em] z-0">
                                    PAID
                                </div>
                            )}

                            <div className="flex justify-between items-start mb-8 relative z-10">
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                                            <span className="text-white font-black text-lg italic">S</span>
                                        </div>
                                        <h2 className="text-lg font-black text-gray-800 dark:text-gray-100 tracking-tighter uppercase">Somali<span className="text-orange-600 italic">Restaurant</span></h2>
                                    </div>
                                    <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter mb-1">INVOICE</h1>
                                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">NO. {invoiceOrder._id.toUpperCase()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Issued By</p>
                                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200">Banaadir</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Mogadishu, Somalia</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8 mb-8">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 border-b border-gray-100 dark:border-gray-800 pb-1 text-left">Billed To</p>
                                    <p className="text-lg font-black text-gray-800 dark:text-white text-left">
                                        {invoiceOrder.customerName || (invoiceOrder.user?.role === 'customer' ? invoiceOrder.user?.name : null) || 'Walk-in Customer'}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium text-left">{invoiceOrder.user?.email || 'N/A'}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium text-left">{invoiceOrder.tableNumber ? `Table ${invoiceOrder.tableNumber}` : 'Takeout'}</p>
                                </div>
                                <div className="text-right flex flex-col items-end">
                                    <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 border-b border-gray-100 dark:border-gray-800 pb-1 w-full">Order Details</p>
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-bold text-gray-800 dark:text-gray-200">Date: {new Date(invoiceOrder.createdAt).toLocaleDateString()}</p>
                                        <p className="text-xs font-bold text-gray-600 dark:text-gray-400">Time: {new Date(invoiceOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        <p className="text-[10px] font-black text-orange-600 dark:text-orange-500 uppercase tracking-wider mt-1">
                                            {invoiceOrder.paymentMethod} • {invoiceOrder.paymentStatus}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <table className="w-full mb-8">
                                <thead className="border-b border-gray-900 dark:border-gray-100">
                                    <tr>
                                        <th className="text-left py-2 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Item Description</th>
                                        <th className="text-center py-2 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Qty</th>
                                        <th className="text-right py-2 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Unit Price</th>
                                        <th className="text-right py-2 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                    {invoiceOrder.items.map((item, i) => (
                                        <tr key={i}>
                                            <td className="py-3">
                                                <p className="text-sm font-black text-gray-800 dark:text-gray-200">{item.menuItem?.name || 'Item'}</p>
                                                <p className="text-[9px] text-gray-400 dark:text-gray-500 font-bold tracking-tighter uppercase">SKU: {item.menuItem?._id?.slice(-6).toUpperCase() || 'N/A'}</p>
                                            </td>
                                            <td className="py-3 text-center text-sm font-black text-gray-600 dark:text-gray-400">{item.quantity}</td>
                                            <td className="py-3 text-right text-sm font-bold text-gray-600 dark:text-gray-400">${item.price.toFixed(2)}</td>
                                            <td className="py-3 text-right text-sm font-black text-gray-800 dark:text-gray-100">${(item.price * item.quantity).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="flex justify-between items-end border-t border-gray-100 dark:border-gray-800 pt-8 transition-colors">
                                <div className="max-w-[200px] text-left">
                                    <p className="text-[10px] font-black text-gray-800 dark:text-white uppercase mb-1">Important Note</p>
                                    <p className="text-[9px] text-gray-500 dark:text-gray-500 font-bold leading-normal">
                                        Thank you for dining with us! For any inquiries, please contact support@somalirestaurant.com.
                                    </p>
                                </div>
                                <div className="w-56">
                                    <div className="flex justify-between items-center mb-1 px-2">
                                        <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase">Subtotal</span>
                                        <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{formatCurrency(invoiceOrder.totalAmount)}</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-4 px-2">
                                        <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase">Tax (0%)</span>
                                        <span className="text-sm font-bold text-gray-800 dark:text-gray-200">$0.00</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-gray-900 dark:bg-orange-600 rounded-xl px-4 py-3 text-white transition-colors">
                                        <span className="text-[10px] font-black uppercase tracking-widest">Total</span>
                                        <span className="text-xl font-black">{formatCurrency(invoiceOrder.totalAmount)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* footer area */}
                            <div className="mt-12 flex justify-between items-end">
                                <div>
                                    <div className="w-32 border-b border-gray-900 dark:border-gray-700 mb-1"></div>
                                    <p className="text-[8px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Authorized Signature</p>
                                </div>
                                <p className="text-[8px] font-black text-gray-300 dark:text-gray-700 uppercase tracking-[0.2em]">www.somalirestaurant.com</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="bg-gray-50 dark:bg-[#1a1a1a] px-12 py-6 flex justify-end gap-4 border-t border-gray-100 dark:border-gray-800 transition-colors">
                            <button
                                onClick={() => setInvoiceOrder(null)}
                                className="px-6 py-3 font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-xl transition-colors"
                            >
                                Close
                            </button>
                            <button
                                onClick={handlePrint}
                                className="px-6 py-3 bg-gray-900 dark:bg-orange-600 text-white font-bold rounded-xl hover:bg-black dark:hover:bg-orange-700 transition-colors flex items-center gap-2 shadow-lg"
                            >
                                <Printer size={18} /> Print Invoice
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Payments;

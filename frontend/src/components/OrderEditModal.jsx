import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import {
    X,
    Save,
    AlertCircle,
    Info,
    ChevronDown,
    Plus,
    Minus,
    Trash2,
    Search,
    Utensils,
    DollarSign
} from 'lucide-react';

const OrderEditModal = ({ isOpen, onClose, order, onSave }) => {
    const [formData, setFormData] = useState({
        status: '',
        tableNumber: '',
        customerName: '',
        items: []
    });
    const [menuItems, setMenuItems] = useState([]);
    const [itemSearchTerm, setItemSearchTerm] = useState('');
    const [showItemResults, setShowItemResults] = useState(false);

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const res = await api.get('/menu-items');
                setMenuItems(res.data.data);
            } catch (err) {
                console.error('Failed to fetch menu items', err);
            }
        };

        if (isOpen) {
            fetchMenuItems();
        }
    }, [isOpen]);

    useEffect(() => {
        if (order) {
            setFormData({
                status: order.status || 'pending',
                tableNumber: order.tableNumber || '',
                customerName: order.customerName || order.user?.name || '',
                items: order.items.map(item => ({
                    menuItem: item.menuItem?._id || item.menuItem, // Handle both populated and unpopulated
                    name: item.menuItem?.name || 'Unknown Item',
                    price: item.price,
                    quantity: item.quantity
                })) || []
            });
        }
    }, [order, isOpen]);

    if (!isOpen || !order) return null;

    const calculateTotal = (items) => {
        return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const updateItemQuantity = (index, delta) => {
        const newItems = [...formData.items];
        const newQuantity = Math.max(1, newItems[index].quantity + delta);
        newItems[index].quantity = newQuantity;
        setFormData({ ...formData, items: newItems });
    };

    const removeItem = (index) => {
        const newItems = formData.items.filter((_, i) => i !== index);
        setFormData({ ...formData, items: newItems });
    };

    const addItemToOrder = (menuItem) => {
        const existingIndex = formData.items.findIndex(item => item.menuItem === menuItem._id);

        if (existingIndex !== -1) {
            updateItemQuantity(existingIndex, 1);
        } else {
            const newItem = {
                menuItem: menuItem._id,
                name: menuItem.name,
                price: menuItem.price,
                quantity: 1
            };
            setFormData({ ...formData, items: [...formData.items, newItem] });
        }
        setItemSearchTerm('');
        setShowItemResults(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const finalData = {
            ...formData,
            totalAmount: calculateTotal(formData.items)
        };
        onSave(order._id, finalData);
        onClose();
    };

    const filteredMenuItems = menuItems.filter(item =>
        item.name.toLowerCase().includes(itemSearchTerm.toLowerCase()) &&
        !formData.items.some(oi => oi.menuItem === item._id)
    );

    return (
        <div className="fixed inset-0 bg-black/40 dark:bg-black/90 backdrop-blur-md z-[110] flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-[#0f0f0f] rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-gray-800 transition-colors flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-[#151515] shrink-0">
                    <div>
                        <h3 className="text-2xl font-[1000] text-[#1e293b] dark:text-white tracking-tight leading-none uppercase">
                            Edit Order 内容
                        </h3>
                        <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mt-2">
                            Modify items & details for #{order._id.slice(-5).toUpperCase()}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 hover:bg-white dark:hover:bg-white/10 rounded-2xl transition-all group shadow-sm border border-transparent hover:border-gray-100 dark:hover:border-gray-700"
                    >
                        <X size={24} className="text-gray-400 group-hover:text-orange-600 transition-colors" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="p-8 space-y-8">
                        {/* Status & Table Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1">Order Status</label>
                                <div className="relative group">
                                    <select
                                        className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 rounded-2xl py-4 pl-6 pr-12 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-[900] text-[#1e293b] dark:text-gray-100 appearance-none uppercase text-xs tracking-wider cursor-pointer"
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="preparing">Preparing</option>
                                        <option value="ready">Ready</option>
                                        <option value="served">Served</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-orange-500 transition-colors" size={20} />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1">Table Number</label>
                                <input
                                    type="number"
                                    placeholder="e.g. 5"
                                    className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-[900] text-[#1e293b] dark:text-gray-100 text-sm"
                                    value={formData.tableNumber}
                                    onChange={(e) => setFormData({ ...formData, tableNumber: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Customer Name */}
                        <div className="space-y-3">
                            <label className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1">Customer Name</label>
                            <input
                                type="text"
                                placeholder="Guest/Customer Name"
                                className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-[900] text-[#1e293b] dark:text-gray-100 text-sm"
                                value={formData.customerName}
                                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                            />
                        </div>

                        {/* Item Editor Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-1">
                                <label className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Order Items</label>
                                <span className="text-[10px] font-black text-orange-600 dark:text-orange-400 uppercase bg-orange-50 dark:bg-orange-900/20 px-3 py-1 rounded-full">
                                    Total: ${calculateTotal(formData.items).toFixed(2)}
                                </span>
                            </div>

                            {/* Item List */}
                            <div className="space-y-3">
                                {formData.items.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-[#151515] rounded-2xl border border-gray-100 dark:border-gray-800 group transition-all hover:bg-white dark:hover:bg-[#1a1a1a] hover:shadow-sm">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-orange-600">
                                                <Utensils size={18} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-[#1e293b] dark:text-gray-100 uppercase tracking-tight">{item.name}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">${item.price.toFixed(2)} / unit</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center gap-3 bg-white dark:bg-[#0f0f0f] border border-gray-200 dark:border-gray-800 rounded-xl p-1">
                                                <button
                                                    type="button"
                                                    onClick={() => updateItemQuantity(idx, -1)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 transition-colors"
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="text-xs font-black text-[#1e293b] dark:text-white w-4 text-center">{item.quantity}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => updateItemQuantity(idx, 1)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 transition-colors"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeItem(idx)}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {formData.items.length === 0 && (
                                    <div className="py-12 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-3xl flex flex-col items-center justify-center opacity-40">
                                        <Utensils size={40} className="text-gray-300 mb-3" />
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No items in order</p>
                                    </div>
                                )}
                            </div>

                            {/* Add New Item Search */}
                            <div className="relative pt-2">
                                <div className="relative group">
                                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Add more food items..."
                                        className="w-full bg-white dark:bg-[#0f0f0f] border border-gray-200 dark:border-gray-800 rounded-2xl py-4 pl-14 pr-6 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-bold text-sm text-[#1e293b] dark:text-gray-100 placeholder:text-gray-300 dark:placeholder:text-gray-700"
                                        value={itemSearchTerm}
                                        onChange={(e) => {
                                            setItemSearchTerm(e.target.value);
                                            setShowItemResults(true);
                                        }}
                                        onFocus={() => setShowItemResults(true)}
                                    />
                                </div>

                                {showItemResults && itemSearchTerm && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1a1a1a] rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 z-[120] max-h-60 overflow-y-auto custom-scrollbar animate-in slide-in-from-top-2 duration-200">
                                        {filteredMenuItems.length > 0 ? (
                                            <div className="p-2 space-y-1">
                                                {filteredMenuItems.map((item) => (
                                                    <button
                                                        key={item._id}
                                                        type="button"
                                                        onClick={() => addItemToOrder(item)}
                                                        className="w-full flex items-center justify-between p-4 hover:bg-orange-50 dark:hover:bg-orange-900/10 rounded-2xl transition-all group"
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-[#0f0f0f] flex items-center justify-center text-gray-400 group-hover:text-orange-600 transition-colors">
                                                                <Utensils size={18} />
                                                            </div>
                                                            <div className="text-left">
                                                                <p className="text-xs font-black text-[#1e293b] dark:text-white uppercase tracking-tight">{item.name}</p>
                                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">${item.price.toFixed(2)}</p>
                                                            </div>
                                                        </div>
                                                        <Plus size={18} className="text-gray-300 group-hover:text-orange-500 transition-colors" />
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="p-8 text-center opacity-30">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No matching items</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-8 bg-gray-50/50 dark:bg-[#151515] border-t border-gray-100 dark:border-gray-800 flex gap-4 shrink-0">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 font-[1000] rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all uppercase text-[11px] tracking-widest active:scale-95 shadow-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-4 bg-[#f97316] text-white font-[1000] rounded-2xl hover:bg-orange-600 transition-all shadow-xl shadow-orange-100 dark:shadow-none uppercase text-[11px] tracking-widest hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                        >
                            <Save size={18} /> Save & Update Order
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OrderEditModal;

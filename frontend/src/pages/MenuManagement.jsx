import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import {
    Settings,
    Plus,
    Trash2,
    Edit2,
    Layers,
    Utensils,
    AlertTriangle,
    Image as ImageIcon,
    X,
    Check,
    Power
} from 'lucide-react';

const MenuManagement = () => {
    const [categories, setCategories] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [activeTab, setActiveTab] = useState('items'); // 'items' | 'categories'
    const [loading, setLoading] = useState(true);

    // Modals state
    const [isItemModalOpen, setIsItemModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

    // Form states
    const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });
    const [itemForm, setItemForm] = useState({ name: '', description: '', price: '', category: '', image: '', isAvailable: true });

    const fetchData = async () => {
        try {
            const [catRes, itemRes] = await Promise.all([
                api.get('/categories'),
                api.get('/menu-items')
            ]);
            setCategories(catRes.data.data);
            setMenuItems(itemRes.data.data);
        } catch (err) {
            console.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // --- Item Handlers ---

    const openItemModal = (item = null) => {
        if (item) {
            setEditingItem(item);
            setItemForm({
                name: item.name,
                description: item.description,
                price: item.price,
                category: item.category?._id || item.category,
                image: item.image,
                isAvailable: item.isAvailable
            });
        } else {
            setEditingItem(null);
            setItemForm({ name: '', description: '', price: '', category: '', image: '', isAvailable: true });
        }
        setIsItemModalOpen(true);
    };

    const handleItemSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingItem) {
                await api.put(`/menu-items/${editingItem._id}`, itemForm);
            } else {
                await api.post('/menu-items', itemForm);
            }
            setIsItemModalOpen(false);
            fetchData();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to save menu item');
        }
    };

    const toggleAvailability = async (item) => {
        try {
            // Optimistic update
            setMenuItems(prevItems => prevItems.map(i =>
                i._id === item._id ? { ...i, isAvailable: !i.isAvailable } : i
            ));

            const res = await api.put(`/menu-items/${item._id}`, { isAvailable: !item.isAvailable });

            // Update with server response but preserve populated category if missing in response
            setMenuItems(prevItems => prevItems.map(i => {
                if (i._id === item._id) {
                    // Start with the existing item (to keep populated fields like category)
                    // Overwrite with the response data (which has the new isAvailable state)
                    // If response category is just an ID, we might want to keep the old populated category object if the IDs match
                    const updated = { ...i, ...res.data.data };
                    if (typeof updated.category === 'string' && typeof i.category === 'object' && i.category._id === updated.category) {
                        updated.category = i.category;
                    }
                    return updated;
                }
                return i;
            }));
        } catch (err) {
            console.error('Failed to update availability:', err);
            alert('Failed to update availability. Please try again.');
            fetchData(); // Revert on error
        }
    };

    const deleteItem = async (id) => {
        if (window.confirm('Delete this item? This cannot be undone.')) {
            try {
                await api.delete(`/menu-items/${id}`);
                fetchData();
            } catch (err) {
                alert('Failed to delete item');
            }
        }
    };

    // --- Category Handlers ---

    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/categories', categoryForm);
            setCategoryForm({ name: '', description: '' });
            setIsCategoryModalOpen(false);
            fetchData();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to create category');
        }
    };

    const deleteCategory = async (id) => {
        if (window.confirm('Are you sure? Items in this category will become uncategorized.')) {
            try {
                await api.delete(`/categories/${id}`);
                fetchData();
            } catch (err) {
                alert('Failed to delete category');
            }
        }
    };

    // --- Render Helpers ---

    const getItemsByCategory = () => {
        const grouped = {};
        categories.forEach(cat => {
            grouped[cat._id] = { ...cat, items: [] };
        });
        // Add "Uncategorized" bucket
        grouped['uncategorized'] = { _id: 'uncategorized', name: 'Uncategorized', items: [] };

        menuItems.forEach(item => {
            const catId = item.category?._id || item.category || 'uncategorized';
            if (grouped[catId]) {
                grouped[catId].items.push(item);
            } else {
                grouped['uncategorized'].items.push(item);
            }
        });

        return Object.values(grouped).filter(g => g.items.length > 0 || g._id !== 'uncategorized');
    };

    if (loading) {
        return (
            <div className="h-[400px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
            </div>
        );
    }

    return (
        <div className="p-8 animate-in slide-in-from-bottom-4 duration-500 min-h-screen transition-colors">
            <div className="max-w-[1600px] mx-auto">
                {/* Header */}
                <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-gray-800 dark:text-gray-100 tracking-tight flex items-center gap-4">
                            <div className="bg-orange-100 dark:bg-orange-900/20 p-2.5 rounded-2xl transition-colors">
                                <Settings className="text-orange-600 dark:text-orange-500" size={28} />
                            </div>
                            MENU <span className="text-orange-600 dark:text-orange-500 italic">MANAGER</span>
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 font-medium mt-2 ml-1">Configure categories, items, and availability.</p>
                    </div>

                    <div className="flex gap-2 bg-white dark:bg-[#111111] p-1.5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
                        <button
                            onClick={() => setActiveTab('items')}
                            className={`px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all ${activeTab === 'items' ? 'bg-orange-600 text-white shadow-lg shadow-orange-100 dark:shadow-none' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#1a1a1a]'
                                }`}
                        >
                            <Utensils size={18} /> Items
                        </button>
                        <button
                            onClick={() => setActiveTab('categories')}
                            className={`px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all ${activeTab === 'categories' ? 'bg-orange-600 text-white shadow-lg shadow-orange-100 dark:shadow-none' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#1a1a1a]'
                                }`}
                        >
                            <Layers size={18} /> Categories
                        </button>
                    </div>
                </header>

                {activeTab === 'items' ? (
                    <div className="space-y-12">
                        {/* New Item Button */}
                        <button
                            onClick={() => openItemModal()}
                            className="fixed bottom-8 right-8 z-40 bg-orange-600 text-white p-4 rounded-full shadow-2xl hover:bg-orange-700 transition-all hover:scale-110 active:scale-95 group"
                        >
                            <Plus size={32} />
                            <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs font-bold py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                Add New Item
                            </span>
                        </button>

                        {/* Items Grouped by Category */}
                        {getItemsByCategory().map(category => (
                            <section key={category._id} className="animate-in fade-in duration-500">
                                <div className="flex items-center gap-4 mb-6">
                                    <h2 className="text-2xl font-black text-gray-800 dark:text-gray-100">{category.name}</h2>
                                    <div className="h-px bg-gray-200 dark:bg-gray-800 flex-1"></div>
                                    <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{category.items.length} Items</span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {category.items.map(item => (
                                        <div key={item._id} className={`bg-white dark:bg-[#111111] rounded-3xl shadow-sm border overflow-hidden group hover:shadow-xl dark:hover:shadow-black/50 transition-all duration-300 relative border-gray-100 dark:border-gray-800 ${!item.isAvailable ? 'opacity-60 grayscale-[0.5] hover:grayscale-0 hover:opacity-100' : ''}`}>
                                            {/* Image */}
                                            <div className="h-48 overflow-hidden relative">
                                                <img
                                                    src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80'}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    alt={item.name}
                                                />
                                                <div className="absolute top-4 right-4 flex gap-2">
                                                    <button
                                                        onClick={() => openItemModal(item)}
                                                        className="p-2 bg-white/90 dark:bg-black/80 backdrop-blur-sm rounded-full text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 shadow-sm transition-colors"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteItem(item._id)}
                                                        className="p-2 bg-white/90 dark:bg-black/80 backdrop-blur-sm rounded-full text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 shadow-sm transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                                {!item.isAvailable && (
                                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest transform -rotate-12 border-2 border-white">
                                                            Unavailable
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="p-6">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="font-black text-gray-800 dark:text-gray-100 text-lg leading-tight">{item.name}</h3>
                                                    <span className="text-orange-600 dark:text-orange-500 font-black text-lg">${item.price.toFixed(2)}</span>
                                                </div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium line-clamp-2 mb-4 min-h-[40px]">{item.description}</p>

                                                {/* Availability Toggle */}
                                                <button
                                                    onClick={() => toggleAvailability(item)}
                                                    className={`w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${item.isAvailable
                                                        ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30'
                                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                                        }`}
                                                >
                                                    <Power size={14} />
                                                    {item.isAvailable ? 'Available' : 'Unavailable'}
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Add Card Placeholder */}
                                    <button
                                        onClick={() => {
                                            if (category._id !== 'uncategorized') {
                                                setEditingItem(null);
                                                setItemForm({ name: '', description: '', price: '', category: category._id, image: '', isAvailable: true });
                                                setIsItemModalOpen(true);
                                            } else {
                                                openItemModal();
                                            }
                                        }}
                                        className="border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl h-full min-h-[340px] flex flex-col items-center justify-center text-gray-400 dark:text-gray-600 hover:border-orange-300 dark:hover:border-orange-700 hover:text-orange-500 dark:hover:text-orange-400 hover:bg-orange-50/10 transition-all group/add"
                                    >
                                        <div className="w-16 h-16 bg-gray-50 dark:bg-[#1a1a1a] rounded-full flex items-center justify-center mb-4 group-hover/add:bg-orange-100 dark:group-hover/add:bg-orange-900/30 transition-colors">
                                            <Plus size={32} className="group-hover/add:text-orange-600 dark:group-hover/add:text-orange-500 transition-colors" />
                                        </div>
                                        <span className="font-bold text-sm">Add to {category.name}</span>
                                    </button>
                                </div>
                            </section>
                        ))}
                    </div>
                ) : (
                    /* Categories Tab */
                    <div className="max-w-4xl mx-auto space-y-8">
                        <div className="flex justify-between items-center bg-gray-900 dark:bg-black text-white p-8 rounded-3xl shadow-xl overflow-hidden relative border border-gray-800">
                            <div className="relative z-10">
                                <h2 className="text-2xl font-black mb-2">Manage Categories</h2>
                                <p className="text-gray-400 dark:text-gray-500 font-medium max-w-sm">Create and organize your menu sections. Items are grouped by these categories.</p>
                            </div>
                            <button
                                onClick={() => setIsCategoryModalOpen(true)}
                                className="relative z-10 bg-orange-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-900/50 flex items-center gap-2"
                            >
                                <Plus size={20} /> New Category
                            </button>
                            {/* Decorative */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gray-800 rounded-full -mr-16 -mt-32 opacity-50"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-900 rounded-full -ml-16 -mb-16 opacity-30"></div>
                        </div>

                        <div className="grid gap-4">
                            {categories.map(cat => (
                                <div key={cat._id} className="bg-white dark:bg-[#111111] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex justify-between items-center group hover:border-orange-100 dark:hover:border-orange-900/30 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-50 dark:bg-[#1a1a1a] rounded-xl flex items-center justify-center text-gray-400 dark:text-gray-600 group-hover:text-orange-500 group-hover:bg-orange-50 dark:group-hover:bg-orange-900/20 transition-colors">
                                            <Layers size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-gray-800 dark:text-gray-100">{cat.name}</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{cat.description || 'No description'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <span className="block text-xl font-black text-gray-800 dark:text-gray-100">
                                                {menuItems.filter(i => (i.category?._id || i.category) === cat._id).length}
                                            </span>
                                            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">Items</span>
                                        </div>
                                        <div className="h-8 w-px bg-gray-100 dark:bg-gray-800"></div>
                                        <button onClick={() => deleteCategory(cat._id)} className="p-3 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors">
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {categories.length === 0 && (
                                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-3xl">
                                    <p className="text-gray-400 font-bold">No categories yet. Create one to get started!</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* --- Modals --- */}

            {/* Item Modal */}
            {isItemModalOpen && (
                <div className="fixed inset-0 bg-black/40 dark:bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-[#111111] rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-gray-800 transition-colors">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-[#1a1a1a]">
                            <h3 className="text-xl font-black text-gray-800 dark:text-white">{editingItem ? 'Edit Item' : 'New Menu Item'}</h3>
                            <button onClick={() => setIsItemModalOpen(false)} className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors">
                                <X size={24} className="text-gray-400 dark:text-gray-500" />
                            </button>
                        </div>
                        <form onSubmit={handleItemSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Item Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Classic Burger"
                                    className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl py-3 px-4 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all font-bold text-gray-800 dark:text-gray-200"
                                    value={itemForm.name}
                                    onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Price ($)</label>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        step="0.01"
                                        className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl py-3 px-4 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all font-bold text-gray-800 dark:text-gray-200"
                                        value={itemForm.price}
                                        onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Category</label>
                                    <select
                                        className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl py-3 px-4 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all font-bold text-gray-800 dark:text-gray-200 cursor-pointer"
                                        value={itemForm.category}
                                        onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })}
                                        required
                                    >
                                        <option value="" className="dark:bg-[#1a1a1a]">Select...</option>
                                        {categories.map(c => <option key={c._id} value={c._id} className="dark:bg-[#1a1a1a]">{c.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Description</label>
                                <textarea
                                    placeholder="Describe the dish..."
                                    className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl py-3 px-4 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all font-medium text-gray-600 dark:text-gray-400 min-h-[100px]"
                                    value={itemForm.description}
                                    onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Image URL</label>
                                <div className="relative">
                                    <ImageIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="https://..."
                                        className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all font-medium text-gray-600 dark:text-gray-400"
                                        value={itemForm.image}
                                        onChange={(e) => setItemForm({ ...itemForm, image: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setIsItemModalOpen(false)}
                                    className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-colors shadow-lg shadow-orange-200"
                                >
                                    {editingItem ? 'Save Changes' : 'Create Item'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Category Modal */}
            {isCategoryModalOpen && (
                <div className="fixed inset-0 bg-black/40 dark:bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-[#111111] rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-gray-800 transition-colors">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-[#1a1a1a]">
                            <h3 className="text-xl font-black text-gray-800 dark:text-white">New Category</h3>
                            <button onClick={() => setIsCategoryModalOpen(false)} className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors">
                                <X size={24} className="text-gray-400 dark:text-gray-500" />
                            </button>
                        </div>
                        <form onSubmit={handleCategorySubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Category Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Desserts"
                                    className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl py-3 px-4 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all font-bold text-gray-800 dark:text-gray-200"
                                    value={categoryForm.name}
                                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Description</label>
                                <input
                                    type="text"
                                    placeholder="Short description..."
                                    className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl py-3 px-4 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all font-medium text-gray-600 dark:text-gray-400"
                                    value={categoryForm.description}
                                    onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                                />
                            </div>
                            <div className="pt-4 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setIsCategoryModalOpen(false)}
                                    className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-colors shadow-lg shadow-orange-200"
                                >
                                    Create Category
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MenuManagement;

import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import MenuItemCard from '../components/MenuItemCard';
import CartPanel from '../components/CartPanel';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingBasket, Search, UtensilsCrossed, ChevronRight } from 'lucide-react';

const Menu = () => {
    const [categories, setCategories] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const { user, logout } = useAuth();
    const { cartItems } = useCart();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catRes, itemRes] = await Promise.all([
                    api.get('/categories'),
                    api.get('/menu-items')
                ]);
                setCategories(catRes.data.data);
                setMenuItems(itemRes.data.data);
            } catch (err) {
                console.error('Failed to fetch menu data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredItems = selectedCategory
        ? menuItems.filter(item => item.category?._id === selectedCategory)
        : menuItems;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0a0a0a] transition-colors">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
                    <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse">Loading deliciousness...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-[#0a0a0a] transition-colors">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#111111]/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-xs transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-orange-600 p-2.5 rounded-xl shadow-lg shadow-orange-100 dark:shadow-none">
                            <UtensilsCrossed className="text-white" size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-gray-800 dark:text-gray-100 tracking-tight transition-colors">SOMALI<span className="text-orange-600">RESTAURANT</span></h1>
                            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest transition-colors">Premium Dining</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:block text-right mr-2">
                            <p className="text-sm font-bold text-gray-800 dark:text-gray-100 transition-colors">{user?.name}</p>
                            <button onClick={logout} className="text-xs font-medium text-orange-600 dark:text-orange-500 hover:text-orange-700 dark:hover:text-orange-400 transition-colors">Sign Out</button>
                        </div>
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 p-3 rounded-2xl hover:border-orange-200 dark:hover:border-orange-900/40 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all shadow-sm group transform active:scale-95"
                        >
                            <ShoppingBasket size={24} className="text-gray-700 dark:text-gray-300 group-hover:text-orange-600 dark:group-hover:text-orange-500 transition-colors" />
                            {cartItems.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-md animate-bounce">
                                    {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Categories Section */}
                <section className="mb-10">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-black text-gray-800 dark:text-gray-100 uppercase tracking-tight transition-colors">Our <span className="text-orange-600">Menu</span></h2>
                        <div className="relative hidden sm:block">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                <Search size={18} />
                            </span>
                            <input
                                type="text"
                                placeholder="Search food..."
                                className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-full py-2.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-hidden transition-all w-64 shadow-sm text-gray-800 dark:text-gray-100"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all flex items-center gap-2 ${selectedCategory === null
                                ? 'bg-orange-600 text-white shadow-lg shadow-orange-100 dark:shadow-none'
                                : 'bg-white dark:bg-[#111111] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:border-orange-200 dark:hover:border-orange-900/40 hover:text-orange-600 dark:hover:text-orange-400'
                                }`}
                        >
                            All Items
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat._id}
                                onClick={() => setSelectedCategory(cat._id)}
                                className={`px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all ${selectedCategory === cat._id
                                    ? 'bg-orange-600 text-white shadow-lg shadow-orange-100 dark:shadow-none'
                                    : 'bg-white dark:bg-[#111111] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:border-orange-200 dark:hover:border-orange-900/40 hover:text-orange-600 dark:hover:text-orange-400'
                                    }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Menu Items Grid */}
                <section>
                    {filteredItems.length === 0 ? (
                        <div className="bg-white dark:bg-[#111111] rounded-3xl p-20 text-center border-2 border-dashed border-gray-200 dark:border-gray-800 transition-colors">
                            <UtensilsCrossed size={48} className="text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">No items found</h3>
                            <p className="text-gray-500 dark:text-gray-400 mt-2">Looks like this category is currently empty.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {filteredItems.map((item) => (
                                <MenuItemCard key={item._id} item={item} />
                            ))}
                        </div>
                    )}
                </section>
            </main>

            {/* Cart Panel Sidebar */}
            <CartPanel isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </div>
    );
};

export default Menu;

import React from 'react';
import { Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const MenuItemCard = ({ item }) => {
    const { addToCart, cartItems, updateQuantity } = useCart();
    const cartItem = cartItems.find((ci) => ci._id === item._id);

    return (
        <div className={`bg-white dark:bg-[#111111] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-md dark:hover:shadow-black/50 transition-all group ${!item.isAvailable ? 'opacity-75' : ''}`}>
            <div className="h-48 overflow-hidden relative">
                <img
                    src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80'}
                    alt={item.name}
                    className={`w-full h-full object-cover transition-transform duration-500 ${item.isAvailable ? 'group-hover:scale-105' : 'grayscale'}`}
                />
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/90 backdrop-blur-sm px-3 py-1 rounded-lg text-orange-600 dark:text-orange-500 font-bold shadow-sm transition-colors">
                    ${item.price.toFixed(2)}
                </div>
                {!item.isAvailable && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="bg-red-600 text-white px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider transform -rotate-12 shadow-lg border-2 border-white">
                            Unavailable
                        </span>
                    </div>
                )}
            </div>
            <div className="p-5">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1 transition-colors">{item.name}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2 transition-colors">{item.description}</p>

                <div className="flex items-center justify-between">
                    {!item.isAvailable ? (
                        <button
                            disabled
                            className="w-full flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 py-2.5 rounded-xl font-bold cursor-not-allowed"
                        >
                            Unavailable
                        </button>
                    ) : !cartItem ? (
                        <button
                            onClick={() => addToCart(item)}
                            className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-orange-100 dark:shadow-none active:scale-95"
                        >
                            <Plus size={18} /> Add to Order
                        </button>
                    ) : (
                        <div className="w-full flex items-center justify-between bg-orange-50 dark:bg-orange-900/20 rounded-xl p-1 border border-orange-100 dark:border-orange-900/30 transition-colors">
                            <button
                                onClick={() => updateQuantity(item._id, cartItem.quantity - 1)}
                                className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-lg text-orange-600 dark:text-orange-500 transition-colors"
                            >
                                <Minus size={18} />
                            </button>
                            <span className="font-bold text-orange-700 dark:text-orange-400 transition-colors">{cartItem.quantity}</span>
                            <button
                                onClick={() => updateQuantity(item._id, cartItem.quantity + 1)}
                                className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-lg text-orange-600 dark:text-orange-500 transition-colors"
                            >
                                <Plus size={18} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MenuItemCard;

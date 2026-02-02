import React from 'react';
import { X, Trash2, ShoppingBasket, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import api from '../utils/api';

const CartPanel = ({ isOpen, onClose }) => {
    const { cartItems, total, removeFromCart, updateQuantity, clearCart } = useCart();

    const handlePlaceOrder = async () => {
        try {
            const orderData = {
                items: cartItems.map(item => ({
                    menuItem: item._id,
                    quantity: item.quantity,
                    price: item.price
                })),
                totalAmount: total,
                paymentMethod: 'Cash',
                paymentStatus: 'unpaid'
            };
            await api.post('/orders', orderData);
            alert('Order placed successfully!');
            clearCart();
            onClose();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to place order');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

            <div className="absolute inset-y-0 right-0 max-w-full flex">
                <div className="w-screen max-w-md pointer-events-auto">
                    <div className="h-full flex flex-col bg-white dark:bg-[#111111] shadow-2xl transition-colors">
                        <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                            <div className="flex items-start justify-between border-b border-gray-100 dark:border-gray-800 pb-6 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-xl text-orange-600 dark:text-orange-500">
                                        <ShoppingBasket size={24} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Your Order</h2>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-colors text-gray-400 dark:text-gray-500"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="mt-8">
                                {cartItems.length === 0 ? (
                                    <div className="text-center py-20">
                                        <div className="bg-gray-50 dark:bg-white/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
                                            <ShoppingBasket size={32} className="text-gray-300 dark:text-gray-600" />
                                        </div>
                                        <p className="text-gray-500 dark:text-gray-400 font-medium trasition-colors">Your cart is empty</p>
                                        <button
                                            onClick={onClose}
                                            className="text-orange-600 dark:text-orange-500 font-bold mt-2 hover:underline transition-colors"
                                        >
                                            Browse the menu
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flow-root">
                                        <ul className="space-y-6">
                                            {cartItems.map((item) => (
                                                <li key={item._id} className="flex py-2">
                                                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-gray-100 dark:border-gray-800 transition-colors">
                                                        <img
                                                            src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=80'}
                                                            alt={item.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </div>

                                                    <div className="ml-4 flex flex-1 flex-col">
                                                        <div>
                                                            <div className="flex justify-between text-base font-bold text-gray-800 dark:text-gray-100 transition-colors">
                                                                <h3>{item.name}</h3>
                                                                <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                                                            </div>
                                                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-1 transition-colors">{item.description}</p>
                                                        </div>
                                                        <div className="flex flex-1 items-end justify-between text-sm">
                                                            <div className="flex items-center bg-gray-50 dark:bg-white/5 rounded-lg p-0.5 border border-gray-100 dark:border-gray-800 transition-colors">
                                                                <button
                                                                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                                    className="p-1.5 hover:bg-white dark:hover:bg-white/10 rounded-md text-gray-600 dark:text-gray-400 transition-all"
                                                                >
                                                                    <ChevronRight size={14} className="rotate-180" />
                                                                </button>
                                                                <span className="px-3 font-bold text-gray-700 dark:text-gray-200 transition-colors">{item.quantity}</span>
                                                                <button
                                                                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                                    className="p-1.5 hover:bg-white dark:hover:bg-white/10 rounded-md text-gray-600 dark:text-gray-400 transition-all"
                                                                >
                                                                    <ChevronRight size={14} />
                                                                </button>
                                                            </div>

                                                            <button
                                                                onClick={() => removeFromCart(item._id)}
                                                                className="font-medium text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 flex items-center gap-1.5 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                            >
                                                                <Trash2 size={16} />
                                                                Remove
                                                            </button>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>

                        {cartItems.length > 0 && (
                            <div className="border-t border-gray-100 dark:border-gray-800 py-6 px-4 sm:px-6 bg-gray-50/50 dark:bg-black/20 transition-colors">
                                <div className="flex justify-between text-base font-medium text-gray-900 dark:text-gray-100 mb-2 transition-colors">
                                    <p className="text-gray-500 dark:text-gray-400">Subtotal</p>
                                    <p className="text-xl font-bold text-gray-800 dark:text-gray-100">${total.toFixed(2)}</p>
                                </div>
                                <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-500 mb-6 transition-colors">Taxes and shipping calculated at checkout.</p>
                                <div className="">
                                    <button
                                        onClick={handlePlaceOrder}
                                        className="w-full flex items-center justify-center rounded-xl bg-orange-600 px-6 py-4 text-lg font-bold text-white shadow-xl shadow-orange-100 dark:shadow-none hover:bg-orange-700 transition-all duration-300 transform active:scale-[0.98]"
                                    >
                                        Place Your Order
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPanel;

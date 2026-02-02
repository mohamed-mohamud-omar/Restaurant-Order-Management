import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import {
    DollarSign,
    Clock,
    Utensils,
    Users as UsersIcon,
    TrendingUp,
    TrendingDown,
    Calendar,
    CheckCircle
} from 'lucide-react';
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/stats');
                const analyticsRes = await api.get('/analytics');
                setStats(res.data.data);
                setAnalytics(analyticsRes.data.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching stats:', err);
                setError('Failed to load statistics');
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-center text-red-500 font-bold">
                {error}
            </div>
        );
    }

    if (!stats && !loading) {
        return <div className="p-8 text-center text-gray-500 font-bold">Waiting for statistics...</div>;
    }

    const statCards = [
        {
            label: 'New Orders',
            value: stats?.orders?.pending || 0,
            subValue: 'Pending Confirmation',
            icon: Clock,
            color: 'bg-amber-500',
            bgColor: 'bg-amber-50'
        },
        {
            label: 'In Preparation',
            value: stats?.orders?.preparing || 0,
            subValue: 'Kitchen is working',
            icon: Utensils,
            color: 'bg-blue-500',
            bgColor: 'bg-blue-50'
        },
        {
            label: 'Completed Today',
            value: stats?.orders?.completedToday || 0,
            subValue: `${stats?.orders?.today || 0} Total Orders`,
            icon: CheckCircle,
            color: 'bg-green-500',
            bgColor: 'bg-green-50'
        },
        {
            label: 'Avg Order Time',
            value: `${stats?.orders?.avgTime || 0}min`,
            subValue: 'Preparation & Delivery',
            icon: TrendingUp,
            color: 'bg-purple-500',
            bgColor: 'bg-purple-50'
        },
        {
            label: 'Total Revenue',
            value: `$${(stats?.revenue || 0).toLocaleString()}`,
            subValue: 'All time',
            icon: DollarSign,
            color: 'bg-orange-500',
            bgColor: 'bg-orange-50'
        },
    ];

    return (
        <div className="p-8 animate-in fade-in duration-500 transition-colors">
            <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-[1000] text-gray-800 dark:text-gray-100 tracking-tight">Dashboard Overview</h1>
                    <p className="text-gray-400 dark:text-gray-500 font-bold text-sm uppercase tracking-widest mt-1 flex items-center gap-2">
                        <Calendar size={14} className="text-orange-500" />
                        Live tracking for {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-white dark:bg-[#1a1a1a] px-4 py-2 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-black text-gray-600 dark:text-gray-400 uppercase tracking-wider">System Live</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
                {statCards.map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-[#1a1a1a] p-6 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-2xl hover:-translate-y-2 transition-all group overflow-hidden relative">
                        <div className={`absolute top-0 right-0 w-32 h-32 ${stat.bgColor} dark:bg-black/20 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-125 opacity-40 dark:opacity-20`}></div>

                        <div className="relative z-10">
                            <div className={`w-14 h-14 ${stat.bgColor} dark:bg-[#2a2a2a] rounded-3xl flex items-center justify-center mb-6 transition-all group-hover:rotate-12 group-hover:scale-110 shadow-sm border border-transparent dark:border-gray-800`}>
                                <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
                            </div>

                            <p className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">{stat.label}</p>
                            <h3 className="text-3xl font-black text-gray-800 dark:text-gray-100 mb-1.5">{stat.value}</h3>
                            <p className="text-[10px] font-bold text-gray-500 dark:text-gray-600 uppercase tracking-tight">{stat.subValue}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-[#1a1a1a] p-8 rounded-[3rem] shadow-sm border border-gray-100 dark:border-gray-800 min-h-[400px]">
                    <div className="flex items-center justify-between mb-8 px-2">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/10 rounded-2xl flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-orange-500" />
                            </div>
                            <div>
                                <h4 className="text-xl font-black text-gray-800 dark:text-gray-100">Sales Analytics</h4>
                                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Last 7 Days</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <h3 className="text-2xl font-black text-gray-800 dark:text-gray-100">${analytics?.weeklyRevenue?.reduce((acc, curr) => acc + curr.dailyRevenue, 0).toLocaleString() || 0}</h3>
                            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Total Revenue</p>
                        </div>
                    </div>

                    <div className="h-[280px]">
                        {analytics?.weeklyRevenue && analytics.weeklyRevenue.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={analytics.weeklyRevenue} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.5} />
                                    <XAxis
                                        dataKey="_id"
                                        tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, { weekday: 'short' })}
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 600 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 600 }}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1a1a1a', border: 'none', borderRadius: '12px', color: '#fff' }}
                                        labelStyle={{ color: '#9CA3AF', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}
                                        itemStyle={{ color: '#fff', fontSize: '13px', fontWeight: 'bold' }}
                                        cursor={{ stroke: '#f97316', strokeWidth: 1, strokeDasharray: '4 4' }}
                                        formatter={(value) => [`$${value}`, 'Revenue']}
                                        labelFormatter={(label) => new Date(label).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="dailyRevenue"
                                        stroke="#f97316"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorRevenue)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-600">
                                <TrendingUp className="w-10 h-10 mb-2 opacity-20" />
                                <p className="text-sm font-bold">No sales data available</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1a1a1a] p-8 rounded-[3rem] shadow-sm border border-gray-100 dark:border-gray-800 min-h-[400px]">
                    <div className="flex items-center justify-between mb-8 px-2">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/10 rounded-2xl flex items-center justify-center">
                                <Clock className="w-6 h-6 text-purple-500" />
                            </div>
                            <div>
                                <h4 className="text-xl font-black text-gray-800 dark:text-gray-100">Performance Metrics</h4>
                                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Peak Hours Activity</p>
                            </div>
                        </div>
                    </div>

                    <div className="h-[280px]">
                        {analytics?.peakHours && analytics.peakHours.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={analytics.peakHours.sort((a, b) => a._id - b._id)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.5} />
                                    <XAxis
                                        dataKey="_id"
                                        tickFormatter={(hour) => `${hour}:00`}
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 600 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 600 }}
                                    />
                                    <Tooltip
                                        cursor={{ fill: '#f3f4f6', opacity: 0.4 }}
                                        contentStyle={{ backgroundColor: '#1a1a1a', border: 'none', borderRadius: '12px', color: '#fff' }}
                                        labelStyle={{ color: '#9CA3AF', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}
                                        itemStyle={{ color: '#fff', fontSize: '13px', fontWeight: 'bold' }}
                                        formatter={(value) => [`${value} Orders`, 'Volume']}
                                        labelFormatter={(label) => `${label}:00 - ${label + 1}:00`}
                                    />
                                    <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={40}>
                                        {analytics.peakHours.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill="#a855f7" />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-600">
                                <TrendingDown className="w-10 h-10 mb-2 opacity-20" />
                                <p className="text-sm font-bold">No performance data available</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

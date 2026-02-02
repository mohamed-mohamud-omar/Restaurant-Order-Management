import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar
} from 'recharts';
import { Download, TrendingUp, ShoppingBag, DollarSign } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const Reports = () => {
    const [analyticsData, setAnalyticsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const response = await api.get('/analytics');
            setAnalyticsData(response.data.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching analytics:", err);
            const errorMsg = err.response?.data?.error || err.message || "Failed to load analytics data.";
            setError(`Error: ${errorMsg}`);
            setLoading(false);
        }
    };

    const downloadPDF = () => {
        if (!analyticsData) return;

        try {
            const doc = new jsPDF();

            doc.setFontSize(20);
            doc.text("Restaurant Sales Report", 14, 22);
            doc.setFontSize(11);
            doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 30);

            // Summary
            doc.text("Daily Summary", 14, 40);

            autoTable(doc, {
                startY: 45,
                head: [['Metric', 'Value']],
                body: [
                    ['Total Revenue Today', `$${analyticsData.dailySales.totalRevenue.toFixed(2)}`],
                    ['Total Orders Today', analyticsData.dailySales.totalOrders],
                    ['Monthly Revenue', `$${analyticsData.monthlyStats.totalRevenue.toFixed(2)}`]
                ],
            });

            // Popular Items
            const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY : 60;
            doc.text("Popular Items", 14, finalY + 10);

            const popularItemsData = analyticsData.popularItems.map(item => [
                item.name,
                item.category,
                item.totalSold,
                `$${item.revenueGenerated.toFixed(2)}`
            ]);

            autoTable(doc, {
                startY: finalY + 15,
                head: [['Item Name', 'Category', 'Quantity Sold', 'Revenue']],
                body: popularItemsData,
            });

            doc.save("sales_report.pdf");
        } catch (err) {
            console.error("PDF Export Error:", err);
            alert("Failed to generate PDF. Check console for details.");
        }
    };

    const downloadExcel = () => {
        if (!analyticsData) return;

        const wb = XLSX.utils.book_new();

        // Sheet 1: Summary
        const summaryData = [
            { Metric: "Total Revenue Today", Value: analyticsData.dailySales.totalRevenue },
            { Metric: "Total Orders Today", Value: analyticsData.dailySales.totalOrders },
            { Metric: "Monthly Revenue", Value: analyticsData.monthlyStats.totalRevenue }
        ];
        const wsSummary = XLSX.utils.json_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(wb, wsSummary, "Summary");

        // Sheet 2: Popular Items
        const popularItemsData = analyticsData.popularItems.map(item => ({
            "Item Name": item.name,
            "Category": item.category,
            "Quantity Sold": item.totalSold,
            "Revenue": item.revenueGenerated
        }));
        const wsItems = XLSX.utils.json_to_sheet(popularItemsData);
        XLSX.utils.book_append_sheet(wb, wsItems, "Popular Items");

        // Sheet 3: Weekly Revenue
        const weeklyData = analyticsData.weeklyRevenue.map(day => ({
            "Date": day._id,
            "Revenue": day.dailyRevenue,
            "Orders": day.orderCount
        }));
        const wsWeekly = XLSX.utils.json_to_sheet(weeklyData);
        XLSX.utils.book_append_sheet(wb, wsWeekly, "Weekly Trends");


        XLSX.writeFile(wb, "sales_report.xlsx");
    };

    if (loading) return <div className="p-6 text-center">Loading analytics...</div>;
    if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

    return (
        <div className="p-6 bg-gray-50 dark:bg-[#0a0a0a] min-h-screen transition-colors">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Reports & Analytics</h1>
                <div className="flex gap-4">
                    <button
                        onClick={downloadPDF}
                        className="bg-red-600 dark:bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-700 dark:hover:bg-red-800 flex items-center gap-2 transition-colors"
                    >
                        <Download size={20} /> Download PDF
                    </button>
                    <button
                        onClick={downloadExcel}
                        className="bg-green-600 dark:bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-700 dark:hover:bg-green-800 flex items-center gap-2 transition-colors"
                    >
                        <Download size={20} /> Download Excel
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-[#111111] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Today's Revenue</p>
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">
                                ${analyticsData.dailySales.totalRevenue.toFixed(2)}
                            </h3>
                        </div>
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <DollarSign className="text-green-600 dark:text-green-400" size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#111111] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Today's Orders</p>
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">
                                {analyticsData.dailySales.totalOrders}
                            </h3>
                        </div>
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <ShoppingBag className="text-blue-600 dark:text-blue-400" size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#111111] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Monthly Revenue</p>
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">
                                ${analyticsData.monthlyStats.totalRevenue.toFixed(2)}
                            </h3>
                        </div>
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                            <TrendingUp className="text-purple-600 dark:text-purple-400" size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-white dark:bg-[#111111] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Revenue Trend (Last 7 Days)</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={analyticsData.weeklyRevenue}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                <XAxis dataKey="_id" stroke="#777" />
                                <YAxis stroke="#777" />
                                <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#333', color: '#fff' }} />
                                <Legend />
                                <Line type="monotone" dataKey="dailyRevenue" stroke="#f97316" name="Revenue ($)" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#111111] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Orders Trend (Last 7 Days)</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analyticsData.weeklyRevenue}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                <XAxis dataKey="_id" stroke="#777" />
                                <YAxis stroke="#777" />
                                <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#333', color: '#fff' }} />
                                <Legend />
                                <Bar dataKey="orderCount" fill="#22c55e" name="Orders" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Popular Items Table */}
            <div className="bg-white dark:bg-[#111111] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden transition-colors">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Most Popular Items</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-[#1a1a1a]">
                            <tr>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Item Name</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Quantity Sold</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Revenue Generated</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {analyticsData.popularItems.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">{item.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{item.category}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{item.totalSold}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">${item.revenueGenerated.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Reports;

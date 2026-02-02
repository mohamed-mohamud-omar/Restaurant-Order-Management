import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const AdminLayout = () => {
    return (
        <div className="flex min-h-screen bg-gray-50/50 dark:bg-[#0a0a0a] transition-colors duration-300">
            <Sidebar />
            <main className="flex-1 overflow-x-hidden">
                <div className="max-w-[1600px] mx-auto min-h-screen flex flex-col">
                    <Header title="Somali Restaurant" subtitle="Control Center" />
                    <div className="flex-1">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;

import { type ReactNode } from 'react';
import Navbar from './Navbar';
import { Toaster } from 'sonner';

interface LayoutProps {
    children: ReactNode
}

const Layout = ({
    children
}: LayoutProps) => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50 font-sans transition-colors duration-200">
            <Navbar />
            <main className="pt-20 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {children}
            </main>
            <Toaster position="bottom-right" richColors />
        </div>
    );
};

export default Layout;

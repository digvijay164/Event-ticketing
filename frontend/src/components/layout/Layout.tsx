import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { motion } from 'framer-motion';

export function Layout() {
    return (
        <div className="min-h-screen flex flex-col selection:bg-blue-500/30">
            <Navbar />
            <motion.main
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex-1 container mx-auto px-4 py-8 max-w-6xl"
            >
                <Outlet />
            </motion.main>
            <footer className="py-6 border-t border-zinc-800 text-center text-zinc-500 text-sm">
                <p>&copy; {new Date().getFullYear()} EventTicketing DApp. All rights reserved.</p>
            </footer>
        </div>
    );
}

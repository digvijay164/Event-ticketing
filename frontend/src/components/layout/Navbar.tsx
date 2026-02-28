import { Link, useLocation } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Ticket } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Small utility for tailwind class merging
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function Navbar() {
    const location = useLocation();

    const navLinks = [
        { name: 'Events', path: '/' },
        { name: 'My Tickets', path: '/tickets' },
        { name: 'Create Event', path: '/create' },
        { name: 'Dashboard', path: '/organizer' },
    ];

    return (
        <nav className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-lg sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-6xl">
                <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl hover:opacity-80 transition-opacity">
                    <Ticket className="w-6 h-6 text-blue-500" />
                    <span>TixChain</span>
                </Link>
                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-6 text-sm font-medium">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={cn(
                                    "transition-colors hover:text-white",
                                    location.pathname === link.path ? "text-white" : "text-zinc-400"
                                )}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                    <ConnectButton
                        chainStatus="icon"
                        showBalance={false}
                    />
                </div>
            </div>
            {/* Mobile Nav (simple scroll row) */}
            <div className="md:hidden flex overflow-x-auto gap-4 px-4 py-3 border-t border-zinc-800/50 text-sm font-medium hide-scrollbar">
                {navLinks.map((link) => (
                    <Link
                        key={link.path}
                        to={link.path}
                        className={cn(
                            "whitespace-nowrap transition-colors",
                            location.pathname === link.path ? "text-white" : "text-zinc-400"
                        )}
                    >
                        {link.name}
                    </Link>
                ))}
            </div>
        </nav>
    );
}

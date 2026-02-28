import { Link } from 'react-router-dom';
import { formatEther } from 'viem';
import { motion } from 'framer-motion';
import { Calendar, Ticket, User } from 'lucide-react';
import type { EventData } from '../../hooks/useEvents';

interface EventCardProps {
    event: EventData;
}

export function EventCard({ event }: EventCardProps) {
    const date = new Date(Number(event.date) * 1000).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    const isPast = Number(event.date) * 1000 < Date.now();
    const soldOut = event.ticketsRemaining === 0n;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-colors flex flex-col h-full group"
        >
            <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-xl text-zinc-100 group-hover:text-blue-400 transition-colors line-clamp-1">
                        {event.name}
                    </h3>
                    {(isPast || soldOut) && (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-zinc-800 text-zinc-400 px-2 py-1 rounded-full whitespace-nowrap">
                            {isPast ? 'Ended' : 'Sold Out'}
                        </span>
                    )}
                </div>

                <div className="space-y-3 mb-6 flex-1">
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                        <Calendar className="w-4 h-4 text-zinc-500" />
                        <span>{date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                        <User className="w-4 h-4 text-zinc-500" />
                        <span className="truncate">{event.organizer.slice(0, 6)}...{event.organizer.slice(-4)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                        <Ticket className="w-4 h-4 text-zinc-500" />
                        <span>{event.ticketsRemaining.toString()} / {event.totalTickets.toString()} remaining</span>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-800/50">
                    <div className="flex flex-col">
                        <span className="text-xs text-zinc-500">Price</span>
                        <span className="font-semibold text-zinc-100">{formatEther(event.price)} ETH</span>
                    </div>
                    <Link
                        to={`/event/${event.id}`}
                        className="bg-zinc-800 hover:bg-zinc-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}

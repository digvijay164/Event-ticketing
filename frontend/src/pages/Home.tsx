import { useEvents } from '../hooks/useEvents';
import { EventCard } from '../components/ui/EventCard';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function Home() {
    const { events, isLoading } = useEvents();

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-zinc-500 gap-4">
                <Loader2 className="w-8 h-8 animate-spin" />
                <p>Loading events from blockchain...</p>
            </div>
        );
    }

    if (events.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center border border-dashed border-zinc-800 rounded-2xl p-8 bg-zinc-900/30">
                <h2 className="text-xl font-semibold mb-2 text-zinc-200">No Events Found</h2>
                <p className="text-zinc-500 mb-6 max-w-md">There are no upcoming events listed right now. Be the first to create one!</p>
                <a href="/create" className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors">
                    Create Event
                </a>
            </div>
        );
    }

    // Sort events: upcoming first, then past
    const now = Date.now() / 1000;
    const sortedEvents = [...events].sort((a, b) => {
        const aIsPast = Number(a.date) < now;
        const bIsPast = Number(b.date) < now;
        if (aIsPast === bIsPast) return Number(a.date) - Number(b.date);
        return aIsPast ? 1 : -1;
    });

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-100 mb-2">Upcoming Events</h1>
                <p className="text-zinc-400">Discover and purchase tickets to premium decentralized events.</p>
            </div>

            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial="hidden"
                animate="show"
                variants={{
                    hidden: { opacity: 0 },
                    show: {
                        opacity: 1,
                        transition: { staggerChildren: 0.1 }
                    }
                }}
            >
                {sortedEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                ))}
            </motion.div>
        </div>
    );
}

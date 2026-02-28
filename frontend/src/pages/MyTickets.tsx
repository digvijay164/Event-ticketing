import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useEvents, type EventData } from '../hooks/useEvents';
import { useUserTickets } from '../hooks/useUserTickets';
import { TransferModal } from '../components/ui/TransferModal';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';
import { Ticket, Send, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

function TicketItem({ event, userAddress }: { event: EventData, userAddress: `0x${string}` }) {
    const { ticketCount, refetch } = useUserTickets(userAddress, event.id);
    const [isTransferOpen, setIsTransferOpen] = useState(false);

    if (ticketCount === 0) return null;

    const date = new Date(Number(event.date) * 1000).toLocaleDateString();

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center shrink-0">
                        <Ticket className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-white mb-1">{event.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-zinc-400">
                            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {date}</span>
                            <span className="bg-zinc-800 px-2 py-0.5 rounded-full text-zinc-300">
                                You own {ticketCount} ticket{ticketCount > 1 ? 's' : ''}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Link to={`/event/${event.id}`}>
                        <Button variant="outline">View Event</Button>
                    </Link>
                    <Button variant="secondary" onClick={() => setIsTransferOpen(true)}>
                        <Send className="w-4 h-4 mr-2" /> Transfer
                    </Button>
                </div>
            </motion.div>

            <TransferModal
                isOpen={isTransferOpen}
                onClose={() => setIsTransferOpen(false)}
                eventId={event.id}
                eventName={event.name}
                ownedQuantity={ticketCount}
                onSuccess={() => refetch()}
            />
        </>
    );
}

export function MyTickets() {
    const { address } = useAccount();
    const { events, isLoading } = useEvents();

    if (!address) {
        return (
            <div className="text-center p-12 border border-zinc-800 rounded-3xl bg-zinc-900/50">
                <h2 className="text-2xl font-bold text-white mb-4">Please connect your wallet</h2>
                <p className="text-zinc-500">Connect your wallet to view your purchased tickets.</p>
            </div>
        );
    }

    if (isLoading) {
        return <div className="text-center p-12 text-zinc-500 animate-pulse">Loading tickets...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">My Tickets</h1>
                <p className="text-zinc-400">View and transfer your purchased event tickets.</p>
            </div>

            <div className="space-y-4">
                {events.map(event => (
                    <TicketItem key={event.id} event={event} userAddress={address} />
                ))}
            </div>
        </div>
    );
}

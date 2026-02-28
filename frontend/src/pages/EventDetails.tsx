import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import { useEvents } from '../hooks/useEvents';
import { useEventContract } from '../hooks/useEventContract';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Calendar, Tag, ArrowLeft, Users, CheckCircle2 } from 'lucide-react';
import { formatEther } from 'viem';

export function EventDetails() {
    const { id } = useParams();
    const { events, isLoading, refetch } = useEvents();
    const { writeContractAsync, isPending } = useEventContract();

    const [quantity, setQuantity] = useState('1');
    const [isSuccess, setIsSuccess] = useState(false);

    // Auto-refetch on mount
    useEffect(() => { refetch(); }, [refetch]);

    if (isLoading) {
        return <div className="text-center p-8 text-zinc-400 animate-pulse">Loading Event...</div>;
    }

    const event = events.find((e) => e.id === Number(id));
    if (!event) {
        return (
            <div className="text-center p-8">
                <h2 className="text-xl font-bold mb-4">Event not found</h2>
                <Link to="/" className="text-blue-500 hover:underline">Go back home</Link>
            </div>
        );
    }

    const date = new Date(Number(event.date) * 1000);
    const isPast = Number(event.date) * 1000 < Date.now();
    const soldOut = event.ticketsRemaining === 0n;
    const totalPrice = event.price * BigInt(quantity || 1);

    const handleBuy = async () => {
        if (!quantity || Number(quantity) < 1) return;

        try {
            await writeContractAsync({
                functionName: 'buyTickets',
                args: [BigInt(event.id), BigInt(quantity)],
                value: totalPrice,
            });

            toast.success('Tickets purchased successfully!');
            setIsSuccess(true);
            setTimeout(() => {
                setIsSuccess(false);
                refetch(); // Refresh remaining tickets
            }, 5000);
        } catch (error: any) {
            console.error(error);
            toast.error(error?.shortMessage || 'Transaction failed');
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Link to="/" className="inline-flex items-center text-zinc-400 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Events
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div
                    className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <div className="mb-8">
                        <span className="bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full text-sm font-medium mb-4 inline-block">
                            {isPast ? 'Ended' : 'Upcoming'}
                        </span>
                        <h1 className="text-3xl font-bold text-white mb-2">{event.name}</h1>
                        <p className="text-zinc-500 font-mono text-sm max-w-full truncate" title={event.organizer}>
                            Organized by {event.organizer}
                        </p>
                    </div>

                    <div className="space-y-6 bg-zinc-950 p-6 rounded-2xl border border-zinc-800/50">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-zinc-400" />
                            </div>
                            <div>
                                <p className="text-zinc-500 text-sm">Date & Time</p>
                                <p className="text-zinc-200 font-medium">
                                    {date.toLocaleDateString()} at {date.toLocaleTimeString()}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center">
                                <Identicon />
                            </div>
                            <div>
                                <p className="text-zinc-500 text-sm">Availability</p>
                                <p className="text-zinc-200 font-medium">
                                    {event.ticketsRemaining.toString()} / {event.totalTickets.toString()} tickets left
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center">
                                <Tag className="w-6 h-6 text-zinc-400" />
                            </div>
                            <div>
                                <p className="text-zinc-500 text-sm">Price per ticket</p>
                                <p className="text-zinc-200 font-medium">{formatEther(event.price)} ETH</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 flex flex-col justify-center"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    {isSuccess ? (
                        <div className="text-center space-y-4">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto"
                            >
                                <CheckCircle2 className="w-10 h-10" />
                            </motion.div>
                            <h3 className="text-xl font-bold text-white">Purchase Successful!</h3>
                            <p className="text-zinc-400">You can view your tickets in the My Tickets dashboard.</p>
                            <Link to="/tickets">
                                <Button variant="outline" className="mt-4">Go to My Tickets</Button>
                            </Link>
                        </div>
                    ) : isPast ? (
                        <div className="text-center">
                            <p className="text-zinc-500 text-lg mb-4">This event has already ended.</p>
                            <Button disabled className="w-full">Event Ended</Button>
                        </div>
                    ) : soldOut ? (
                        <div className="text-center">
                            <p className="text-red-400 text-lg mb-4">This event is sold out.</p>
                            <Button disabled className="w-full text-red-100">Sold Out</Button>
                        </div>
                    ) : (
                        <>
                            <h3 className="text-xl font-bold text-white mb-6">Buy Tickets</h3>
                            <div className="space-y-6">
                                <div>
                                    <label className="text-sm text-zinc-400 mb-2 block">Quantity</label>
                                    <div className="flex items-center gap-4">
                                        <Button
                                            variant="outline"
                                            onClick={() => setQuantity(String(Math.max(1, Number(quantity) - 1)))}
                                        >-</Button>
                                        <Input
                                            type="number"
                                            min="1"
                                            max={Number(event.ticketsRemaining)}
                                            value={quantity}
                                            onChange={(e) => setQuantity(e.target.value)}
                                            className="text-center text-lg font-bold"
                                        />
                                        <Button
                                            variant="outline"
                                            onClick={() => setQuantity(String(Math.min(Number(event.ticketsRemaining), Number(quantity) + 1)))}
                                        >+</Button>
                                    </div>
                                </div>

                                <div className="flex justify-between items-end border-t border-zinc-800 pt-6">
                                    <div>
                                        <span className="text-zinc-400 text-sm block">Total Total</span>
                                        <span className="text-3xl font-bold text-white">{formatEther(totalPrice)} ETH</span>
                                    </div>
                                    <Button
                                        size="lg"
                                        onClick={handleBuy}
                                        isLoading={isPending}
                                    >
                                        Confirm Purchase
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </motion.div>
            </div>
        </div>
    );
}

function Identicon() {
    // Simple fake identicon block icon based on address
    return <Users className="w-6 h-6 text-zinc-400" />;
}

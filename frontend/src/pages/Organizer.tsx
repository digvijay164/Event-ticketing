import { useAccount } from 'wagmi';
import { useEvents } from '../hooks/useEvents';
import { useEventContract } from '../hooks/useEventContract';
import { Button } from '../components/ui/Button';
import { formatEther } from 'viem';
import { motion } from 'framer-motion';
import { BarChart3, Users, DollarSign, Wallet } from 'lucide-react';
import toast from 'react-hot-toast';

export function Organizer() {
    const { address } = useAccount();
    const { events, isLoading } = useEvents();
    const { writeContractAsync, isPending } = useEventContract();

    if (!address) {
        return (
            <div className="text-center p-12 border border-zinc-800 rounded-3xl bg-zinc-900/50">
                <h2 className="text-2xl font-bold text-white mb-4">Please connect your wallet</h2>
            </div>
        );
    }

    if (isLoading) {
        return <div className="text-center p-12 text-zinc-500 animate-pulse">Loading dashboard...</div>;
    }

    const myEvents = events.filter(e => e.organizer.toLowerCase() === address.toLowerCase());

    const totalRevenue = myEvents.reduce((acc, e) => acc + (e.fundsCollected || 0n), 0n);
    const totalTicketsSold = myEvents.reduce((acc, e) => acc + (e.totalTickets - e.ticketsRemaining), 0n);

    const handleWithdraw = async (eventId: number) => {
        try {
            await writeContractAsync({
                functionName: 'withdrawFunds',
                args: [BigInt(eventId)],
            });
            toast.success('Withdrawal submitted!');
            // Assuming auto-refetch will catch it later, but we can fast-feedback
        } catch (error: any) {
            console.error(error);
            toast.error(error?.shortMessage || 'Withdrawal failed. Event may not have ended.');
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Organizer Dashboard</h1>
                <p className="text-zinc-400">Manage your events, view analytics, and withdraw revenue.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center">
                            <BarChart3 className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-zinc-500 text-sm font-medium">Total Events</p>
                            <h3 className="text-2xl font-bold text-white">{myEvents.length}</h3>
                        </div>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-xl flex items-center justify-center">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-zinc-500 text-sm font-medium">Tickets Sold</p>
                            <h3 className="text-2xl font-bold text-white">{totalTicketsSold.toString()}</h3>
                        </div>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-purple-500/10 text-purple-500 rounded-xl flex items-center justify-center">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-zinc-500 text-sm font-medium">Total Revenue</p>
                            <h3 className="text-2xl font-bold text-white">{formatEther(totalRevenue)} ETH</h3>
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="space-y-6">
                <h2 className="text-xl font-bold text-white">Your Events</h2>

                {myEvents.length === 0 ? (
                    <div className="text-center p-12 border border-zinc-800 rounded-2xl border-dashed">
                        <p className="text-zinc-500">You haven't created any events yet.</p>
                    </div>
                ) : (
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-zinc-950/50 border-b border-zinc-800 text-sm text-zinc-400">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Event Name</th>
                                    <th className="px-6 py-4 font-medium">Date</th>
                                    <th className="px-6 py-4 font-medium">Sold</th>
                                    <th className="px-6 py-4 font-medium">Revenue</th>
                                    <th className="px-6 py-4 font-medium text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/50 text-sm">
                                {myEvents.map((event) => {
                                    const date = new Date(Number(event.date) * 1000).toLocaleDateString();
                                    const sold = event.totalTickets - event.ticketsRemaining;
                                    const isPast = Number(event.date) * 1000 < Date.now();
                                    const canWithdraw = isPast && event.fundsCollected > 0n;

                                    return (
                                        <tr key={event.id} className="hover:bg-zinc-800/20 transition-colors">
                                            <td className="px-6 py-4 font-medium text-zinc-200">{event.name}</td>
                                            <td className="px-6 py-4 text-zinc-400">{date}</td>
                                            <td className="px-6 py-4 text-zinc-400">
                                                {sold.toString()} / {event.totalTickets.toString()}
                                            </td>
                                            <td className="px-6 py-4 text-zinc-400 font-mono">
                                                {formatEther(event.fundsCollected)} ETH
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Button
                                                    variant={canWithdraw ? 'primary' : 'outline'}
                                                    size="sm"
                                                    disabled={!canWithdraw || isPending}
                                                    onClick={() => handleWithdraw(event.id)}
                                                >
                                                    <Wallet className="w-4 h-4 mr-2" />
                                                    Withdraw
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

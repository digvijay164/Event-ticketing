import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { parseEther } from 'viem';
import toast from 'react-hot-toast';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useEventContract } from '../hooks/useEventContract';
import { motion } from 'framer-motion';

export function CreateEvent() {
    const [name, setName] = useState('');
    const [dateStr, setDateStr] = useState('');
    const [priceEth, setPriceEth] = useState('');
    const [totalTickets, setTotalTickets] = useState('');

    const navigate = useNavigate();
    const { writeContractAsync, isPending } = useEventContract();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !dateStr || !priceEth || !totalTickets) {
            toast.error('Please fill in all fields');
            return;
        }

        try {
            const dateUnix = Math.floor(new Date(dateStr).getTime() / 1000);
            if (dateUnix <= Date.now() / 1000) {
                toast.error('Event date must be in the future');
                return;
            }

            await writeContractAsync({
                functionName: 'createEvent',
                args: [
                    name,
                    BigInt(dateUnix),
                    parseEther(priceEth),
                    BigInt(totalTickets)
                ],
            });

            toast.success('Event creation transaction submitted!');
            navigate('/');
        } catch (error: any) {
            console.error(error);
            toast.error(error?.shortMessage || error?.message || 'Transaction failed');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl mx-auto border border-zinc-800 bg-zinc-900 rounded-2xl p-8 shadow-2xl"
        >
            <h1 className="text-2xl font-bold mb-8 text-zinc-100">Create New Event</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    label="Event Name"
                    placeholder="E.g. ETHGlobal Hackathon"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <Input
                    label="Date & Time"
                    type="datetime-local"
                    value={dateStr}
                    onChange={(e) => setDateStr(e.target.value)}
                    required
                />
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Ticket Price (ETH)"
                        type="number"
                        step="0.0001"
                        min="0"
                        placeholder="0.05"
                        value={priceEth}
                        onChange={(e) => setPriceEth(e.target.value)}
                        required
                    />
                    <Input
                        label="Total Tickets"
                        type="number"
                        min="1"
                        placeholder="1000"
                        value={totalTickets}
                        onChange={(e) => setTotalTickets(e.target.value)}
                        required
                    />
                </div>
                <div className="pt-4">
                    <Button
                        type="submit"
                        className="w-full text-lg h-12"
                        isLoading={isPending}
                    >
                        Deploy Event on Chain
                    </Button>
                </div>
            </form>
        </motion.div>
    );
}

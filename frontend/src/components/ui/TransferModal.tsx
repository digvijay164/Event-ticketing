import React, { useState } from 'react';
import { isAddress } from 'viem';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { useEventContract } from '../../hooks/useEventContract';
import toast from 'react-hot-toast';

interface TransferModalProps {
    isOpen: boolean;
    onClose: () => void;
    eventId: number;
    eventName: string;
    ownedQuantity: number;
    onSuccess: () => void;
}

export function TransferModal({ isOpen, onClose, eventId, eventName, ownedQuantity, onSuccess }: TransferModalProps) {
    const [recipient, setRecipient] = useState('');
    const [quantity, setQuantity] = useState('1');
    const { writeContractAsync, isPending } = useEventContract();

    const handleTransfer = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!recipient || !isAddress(recipient)) {
            toast.error('Invalid Ethereum address');
            return;
        }
        const qty = Number(quantity);
        if (!qty || qty < 1 || qty > ownedQuantity) {
            toast.error('Invalid quantity');
            return;
        }

        try {
            await writeContractAsync({
                functionName: 'transferTickets',
                args: [BigInt(eventId), BigInt(qty), recipient as `0x${string}`],
            });
            toast.success('Transfer submitted!');
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error(error);
            toast.error(error?.shortMessage || 'Transfer failed');
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
                        >
                            <div className="flex justify-between items-center p-6 border-b border-zinc-800/50">
                                <h3 className="text-xl font-bold text-white">Transfer Tickets</h3>
                                <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleTransfer} className="p-6 space-y-5">
                                <div>
                                    <p className="text-zinc-400 text-sm mb-1">Event</p>
                                    <p className="font-semibold text-zinc-100">{eventName}</p>
                                </div>

                                <Input
                                    label="Recipient Address"
                                    placeholder="0x..."
                                    value={recipient}
                                    onChange={(e) => setRecipient(e.target.value)}
                                    required
                                />

                                <div className="flex gap-4 items-end">
                                    <Input
                                        label="Quantity"
                                        type="number"
                                        min="1"
                                        max={ownedQuantity}
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                        className="flex-1"
                                        required
                                    />
                                    <div className="h-11 flex items-center text-sm text-zinc-500 whitespace-nowrap">
                                        Max: {ownedQuantity}
                                    </div>
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" variant="primary" className="flex-1" isLoading={isPending}>
                                        Transfer
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

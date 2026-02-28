import { useReadContract, useReadContracts } from 'wagmi';
import { eventTicketingConfig } from './useEventContract';

export interface EventData {
    id: number;
    organizer: string;
    name: string;
    date: bigint;
    price: bigint;
    totalTickets: bigint;
    ticketsRemaining: bigint;
    fundsCollected: bigint;
}

export function useEvents() {
    const { data: nextEventId } = useReadContract({
        ...eventTicketingConfig,
        functionName: 'nextEventId',
    });

    const eventCount = Number(nextEventId || 0n);

    const contracts = Array.from({ length: eventCount }).map((_, i) => ({
        ...eventTicketingConfig,
        functionName: 'getEvent',
        args: [BigInt(i)],
    }));

    const { data: eventsData, isLoading, refetch } = useReadContracts({
        contracts: contracts as any,
    });

    const events: EventData[] = eventsData
        ?.map((result, index) => {
            if (result.status === 'success' && result.result) {
                const e = result.result as any;
                return {
                    id: index,
                    organizer: e.organizer,
                    name: e.name,
                    date: e.date,
                    price: e.price,
                    totalTickets: e.totalTickets,
                    ticketsRemaining: e.ticketsRemaining,
                    fundsCollected: e.fundsCollected,
                };
            }
            return null;
        })
        .filter((e): e is EventData => e !== null) || [];

    return { events, isLoading, refetch };
}

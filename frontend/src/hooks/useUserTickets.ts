import { useReadContract } from 'wagmi';
import { eventTicketingConfig } from './useEventContract';

export function useUserTickets(userAddress: `0x${string}` | undefined, eventId: number) {
    const { data: ticketCount, isLoading, refetch } = useReadContract({
        ...eventTicketingConfig,
        functionName: 'getUserTickets',
        args: userAddress !== undefined ? [userAddress, BigInt(eventId)] : undefined,
        query: {
            enabled: !!userAddress,
        },
    });

    return {
        ticketCount: ticketCount ? Number(ticketCount) : 0,
        isLoading,
        refetch
    };
}

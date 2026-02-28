import { useWriteContract, useAccount } from 'wagmi';
import EventTicketingAbi from '../../../artifacts/contracts/EventTicketing.sol/EventTicketing.json';

const CONTRACT_ADDRESS = '0x605E15788675539bA3A0d26290A9768B08d06786'; // REPLACE AFTER DEPLOYMENT

export const eventTicketingConfig = {
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: EventTicketingAbi.abi as any,
};

export function useEventContract() {
    const { address } = useAccount();

    const { writeContractAsync: writeTx, isPending } = useWriteContract();

    const writeContractAsync = async (params: { functionName: string; args?: any[]; value?: bigint }) => {
        return writeTx({
            ...eventTicketingConfig,
            ...params,
        } as any);
    };

    return {
        config: eventTicketingConfig,
        address,
        writeContractAsync,
        isPending,
    };
}

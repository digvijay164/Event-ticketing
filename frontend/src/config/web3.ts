import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

// Get a Project ID at https://cloud.walletconnect.com
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '3fcc6bba6f1de962d911bb5b5c3dba68';

export const config = getDefaultConfig({
    appName: 'EventTicketing DApp',
    projectId,
    chains: [sepolia],
    ssr: false, // Vite SPA
});

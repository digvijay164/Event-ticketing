import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { config } from './config/web3';
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider
                    theme={darkTheme({
                        accentColor: '#3b82f6', // blue-500
                        accentColorForeground: 'white',
                        borderRadius: 'medium',
                        fontStack: 'system',
                        overlayBlur: 'small',
                    })}
                >
                    {children}
                    <Toaster
                        position="bottom-right"
                        toastOptions={{
                            style: {
                                background: '#18181b', // zinc-900
                                color: '#fff',
                                border: '1px solid #27272a', // zinc-800
                            }
                        }}
                    />
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}

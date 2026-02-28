# EventTicketing DApp

A full-stack, production-grade decentralized application for creating and managing event tickets on the blockchain.

## Tech Stack
- **Smart Contract**: Solidity ^0.8.20, Hardhat
- **Frontend**: React + Vite, TypeScript, TailwindCSS, Framer Motion
- **Web3**: Wagmi v2, RainbowKit, Viem, Ethers v6

## Project Structure
- `contracts/` - Contains the `EventTicketing.sol` smart contract
- `scripts/` - Deployment scripts for Hardhat
- `frontend/` - The React Vite frontend application
- `hardhat.config.ts` - Hardhat configuration for connecting to Sepolia

## Getting Started

### 1. Smart Contract Deployment (Sepolia)
1. Install root dependencies:
   ```bash
   npm install
   ```
2. Set up environment variables:
   Copy `.env.example` to `.env` in the root folder and fill in your details:
   ```env
   SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/...
   PRIVATE_KEY=your_private_key
   ETHERSCAN_API_KEY=your_etherscan_key_for_verification
   ```
3. Compile the contract:
   ```bash
   npx hardhat compile
   ```
4. Deploy to Sepolia:
   ```bash
   npx hardhat run scripts/deploy.ts --network sepolia
   ```
5. Note the deployed contract address. You will also need to verify it using Etherscan (check Hardhat docs for `npx hardhat verify`).

### 2. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Update the contract address:
   Open `frontend/src/hooks/useEventContract.ts` and replace the `CONTRACT_ADDRESS` constant with the deployed address from step 4.
4. Run the development server:
   ```bash
   npm run dev
   ```

## Key Features
- **Decentralized Ticketing**: Fully on-chain event tracking.
- **Secure Accounting**: Exact ETH validation, proper funds locking until event completion.
- **Transfers**: Ability to securely transfer tickets to other wallet addresses.
- **Organizer Dashboard**: Dedicated view for revenue tracking and fund withdrawal.
- **Premium UX**: Framer Motion animations, intuitive RainbowKit login, and dark mode native Tailwind design.

## Deployment to Vercel
1. Push your repository to GitHub.
2. Go to Vercel and import the repository.
3. Keep the Root Directory as `frontend` or set the specific build commands if deploying from root:
   - Build Command: `cd frontend && npm run build`
   - Output Directory: `frontend/dist`
   - Install Command: `cd frontend && npm install`
4. Make sure to configure any necessary environment variables for WalletConnect if required in the future.
5. Deploy!

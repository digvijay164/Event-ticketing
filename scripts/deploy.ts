import { ethers } from "hardhat";

async function main() {
    const EventTicketing = await ethers.getContractFactory("EventTicketing");

    console.log("Deploying EventTicketing...");
    const eventTicketing = await EventTicketing.deploy();

    await eventTicketing.waitForDeployment();
    const address = await eventTicketing.getAddress();

    console.log(`EventTicketing custom deployed to: ${address}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

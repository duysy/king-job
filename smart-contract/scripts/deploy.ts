import { ethers, run, network } from "hardhat";
import { setTimeout } from "timers/promises";

async function main() {
    try {
        console.log("Deploying FreelancePlatform contract...");

        // Get the deployer's account
        const [deployer] = await ethers.getSigners();
        console.log("Deployer Account:", deployer.address);

        // Deploy the contract
        const FreelancePlatform = await ethers.getContractFactory("FreelancePlatform");
        const freelancePlatform = await FreelancePlatform.deploy();
        await freelancePlatform.waitForDeployment();

        const contractAddress = await freelancePlatform.getAddress();
        console.log(`FreelancePlatform deployed to: ${contractAddress}`);

        console.log("Waiting for block confirmations...");
        await setTimeout(3000);

        // Verify the contract
        if (network.name !== "hardhat" && network.name !== "localhost") {
            console.log("Starting contract verification...");
            try {
                await run("verify:verify", {
                    address: contractAddress,
                    contract: "contracts/FreelancePlatform.sol:FreelancePlatform",
                    constructorArguments: [],
                });
                console.log("Contract verified successfully");
            } catch (error: any) {
                if (error.message.includes("Already Verified")) {
                    console.log("Contract is already verified!");
                } else {
                    console.error("Error verifying contract:", error);
                }
            }
        }

        // Log deployment details
        console.log("\nDeployment Summary:");
        console.log("===================");
        console.log("Network:", network.name);
        console.log("Deployer Account:", deployer.address);
        console.log("Contract Address:", contractAddress);
        console.log("Block Number:", await ethers.provider.getBlockNumber());
        console.log("===================\n");
    } catch (error) {
        console.error("Error in deployment:", error);
        process.exitCode = 1;
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

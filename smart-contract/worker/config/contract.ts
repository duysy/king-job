import { ethers } from "ethers";
import * as fs from "fs";
import * as path from "path";
import { ENV } from "./env";

// ABI and Bytecode Paths
const freelancePlatformAbiPath = path.join(
    __dirname,
    "../../artifacts/contracts/FreelancePlatform.sol/FreelancePlatform.json",
);

export const abi = JSON.parse(fs.readFileSync(freelancePlatformAbiPath, "utf8")).abi;

// Provider and Signer
export const provider = new ethers.JsonRpcProvider(ENV.RPC_URL);
export const workerSigner = new ethers.Wallet(ENV.WORKER_PRIVATE_KEY, provider);

// Contract Address
export const contractAddress = ENV.CONTRACT_ADDRESS;

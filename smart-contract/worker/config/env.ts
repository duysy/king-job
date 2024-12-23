import * as dotenv from "dotenv";

dotenv.config();

export const ENV = {
    CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS || "0xBB6F3Ee65fd0C6Df66d29b5Ad9F3A8695A638172",
    PG_USER: process.env.PG_USER || "freelancer_platform",
    PG_HOST: process.env.PG_HOST || "localhost",
    PG_DATABASE: process.env.PG_DATABASE || "freelancer_platform",
    PG_PASSWORD: process.env.PG_PASSWORD || "freelancer_platform",
    PG_PORT: Number(process.env.PG_PORT) || 5432,
    RPC_URL: process.env.RPC_URL || "https://opbnb-testnet-rpc.bnbchain.org/",
    WORKER_PRIVATE_KEY: process.env.WORKER_PRIVATE_KEY || "",
};

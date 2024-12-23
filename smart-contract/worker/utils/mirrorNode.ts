import { contractAddress, provider } from "../config/contract";
import { LogEntry } from "../models/interfaces";

export const fetchLogs = async (fromBlock: number, toBlock: number): Promise<LogEntry[]> => {
    try {
        const logs = await provider.getLogs({
            address: contractAddress,
            fromBlock,
            toBlock,
        });

        return logs.map((log) => ({
            topics: [...log.topics],
            data: log.data,
            transaction_hash: log.transactionHash,
            timestamp: log.blockNumber.toString(),
        }));
    } catch (error) {
        console.error("Error fetching logs:", error);
        return [];
    }
};

export const getCurrentBlockNumber = async (): Promise<number> => {
    try {
        const currentBlock = await provider.getBlockNumber();
        console.log("Current block number:", currentBlock);
        return currentBlock;
    } catch (error) {
        console.error("Error fetching current block number:", error);
        throw new Error("Unable to fetch current block number");
    }
};

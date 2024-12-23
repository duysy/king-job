import { ethers, LogDescription } from "ethers";
import { DecodedLog, LogEntry } from "./models/interfaces";
import { abi } from "./config/contract";

export function decodeLogs(logs: LogEntry[]): DecodedLog[] {
    const iface = new ethers.Interface(abi);
    const decodedLogs: DecodedLog[] = [];

    logs.forEach((log: LogEntry) => {
        try {
            const decodedLog: LogDescription = iface.parseLog({
                topics: log.topics,
                data: log.data,
            }) as LogDescription;

            const jsonLog: DecodedLog = {
                eventName: decodedLog.name,
                signature: decodedLog.signature,
                args: decodedLog.args.reduce((acc: Record<string, string>, value, index) => {
                    const inputName = decodedLog.fragment.inputs[index]?.name || `arg${index}`;
                    acc[inputName] = value.toString();
                    return acc;
                }, {}),
                transactionHash: log.transaction_hash,
                timestamp: log.timestamp,
            };

            decodedLogs.push(jsonLog);
        } catch (error) {
            console.error("Error decoding log:", error);
        }
    });

    return decodedLogs;
}

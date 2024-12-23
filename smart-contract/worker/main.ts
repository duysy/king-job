import { pool } from "./config/database";
import { decodeLogs } from "./main_decodeLogs";
import { JobStatus } from "./models/enums";
import { getJobById, updateJobTransactions } from "./services/jobService";
import { getUserByWalletAddress } from "./services/userService";
import { fetchLogs, getCurrentBlockNumber } from "./utils/mirrorNode";

async function processLogs(): Promise<void> {
    const KEY_CRAWL = "crawl_onchain";
    while (true) {
        let client;
        try {
            client = await pool.connect();
            console.log("Connected to PostgreSQL successfully!");

            const result = await client.query(
                "SELECT key, start_at, value FROM freelancer_platform_app_lastindexcrawl WHERE key = $1 LIMIT 1",
                [KEY_CRAWL],
            );

            if (result.rows.length === 0) {
                console.log("No matching keys found in the database. Skipping this iteration.");
                await new Promise((resolve) => setTimeout(resolve, 5000));
                continue;
            }

            const { key, start_at, value } = result.rows[0];
            const fromBlock = Number(value || start_at || null);
            const nowBlock = await getCurrentBlockNumber();

            console.log(`Crawling logs for key "${key}" from: ${fromBlock} to: ${nowBlock}`);
            const logs = await fetchLogs(fromBlock, nowBlock);
            const jsonLogs = decodeLogs(logs);
            for (const jsonLog of jsonLogs) {
                if (jsonLog.eventName === "JobCreated") {
                    const transactionHash = jsonLog.transactionHash;
                    const clientAddress = jsonLog.args.client;
                    const user = await getUserByWalletAddress(clientAddress);
                    const jobId = Number(jsonLog.args.jobId);
                    const job = await getJobById(jobId);
                    if (!user || !job) continue;

                    await updateJobTransactions(
                        jobId,
                        transactionHash,
                        job.transaction_accept_job,
                        job.transaction_complete_job,
                        job.freelancer_id,
                        JobStatus.PUSHED,
                    );
                } else if (jsonLog.eventName === "JobAccepted") {
                    const transactionHash = jsonLog.transactionHash;
                    const freelancerAddress = jsonLog.args.freelancer;
                    const userFreelance = await getUserByWalletAddress(freelancerAddress);
                    const jobId = Number(jsonLog.args.jobId);
                    const job = await getJobById(jobId);
                    if (!userFreelance || !job) continue;

                    await updateJobTransactions(
                        jobId,
                        job.transaction_create,
                        transactionHash,
                        job.transaction_complete_job,
                        userFreelance.id,
                        JobStatus.ACCEPTED,
                    );
                } else if (jsonLog.eventName === "JobCompleted") {
                    const transactionHash = jsonLog.transactionHash;
                    const freelancerAddress = jsonLog.args.freelancer;
                    const userFreelance = await getUserByWalletAddress(freelancerAddress);
                    const jobId = Number(jsonLog.args.jobId);
                    const job = await getJobById(jobId);
                    if (!userFreelance || !job) continue;

                    await updateJobTransactions(
                        jobId,
                        job.transaction_create,
                        job.transaction_complete_job,
                        transactionHash,
                        job.freelancer_id,
                        JobStatus.COMPLETED,
                    );
                }
            }

            await client.query("UPDATE freelancer_platform_app_lastindexcrawl SET value = $1, updated_at = NOW() WHERE key = $2", [
                nowBlock,
                key,
            ]);
        } catch (error) {
            console.error("Error processing logs:", error);
        } finally {
            if (client) client.release();
        }

        await new Promise((resolve) => setTimeout(resolve, 3000));
    }
}

processLogs().catch((error) => {
    console.error("Fatal error in processLogs:", error);
});

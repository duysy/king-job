import { PoolClient } from "pg";
import { pool } from "../config/database";
import { JobStatus } from "../models/enums";

import { QueryResult } from "pg";
import { Job } from "../models/interfaces";

export const getJobById = async (jobId: number): Promise<Job | null> => {
    let client: PoolClient | undefined;

    try {
        client = await pool.connect();
        console.log(`Fetching job with ID: ${jobId}`);

        const query = `SELECT * FROM freelancer_platform_app_job WHERE id = $1 LIMIT 1`;
        const result: QueryResult<Job> = await client.query(query, [jobId]);

        if (result.rows.length === 0) {
            console.log(`No job found with ID: ${jobId}`);
            return null;
        }

        const job = result.rows[0];
        console.log(`Job found:`, job);
        return job;
    } catch (error) {
        console.error("Error fetching job by ID:", error);
        return null;
    } finally {
        if (client) client.release();
    }
};

export const updateJobTransactions = async (
    jobId: number,
    transactionCreate: string | null,
    transactionAcceptJob: string | null,
    transactionCompleteJob: string | null,
    freelancer_id: number | null,
    status: JobStatus,
): Promise<boolean> => {
    let client: PoolClient | undefined;

    try {
        client = await pool.connect();
        console.log(`Updating job ID ${jobId} with new transactions and status: ${status}`);

        const query = `
            UPDATE freelancer_platform_app_job
            SET
                transaction_create = $1,
                transaction_accept_job = $2,
                transaction_complete_job = $3,
                freelancer_id = $4,
                status = $5,
                updated_at = NOW()
            WHERE id = $6
        `;

        const result = await client.query(query, [
            transactionCreate,
            transactionAcceptJob,
            transactionCompleteJob,
            freelancer_id,
            status,
            jobId,
        ]);

        if (Number(result.rowCount) > 0) {
            console.log(`Job ID ${jobId} successfully updated.`);
            return true;
        } else {
            console.log(`Job ID ${jobId} not found.`);
            return false;
        }
    } catch (error) {
        console.error("Error updating job transactions:", error);
        return false;
    } finally {
        if (client) client.release();
    }
};

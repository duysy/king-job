import { JobStatus } from "./enums";

export interface LogEntry {
    topics: string[];
    data: string;
    transaction_hash: string;
    timestamp: string;
}

export interface DecodedLog {
    eventName: string;
    signature: string;
    args: Record<string, string>;
    transactionHash: string;
    timestamp: string;
}

export interface User {
    id: number;
    username: string | null;
    email: string | null;
    is_active: boolean;
    date_joined: string;
    wallet_address: string;
}

export interface PublishResult {
    onchainId: number;
    transactionHash: string;
}

export interface Job {
    id: number;
    title: string;
    description: string;
    info: string | null;
    image: string | null;
    client_id: number;
    freelancer_id: number | null;
    amount: string;
    status: JobStatus;
    created_at: string;
    updated_at: string;
    transaction_create: string | null;
    transaction_accept_job: string | null;
    transaction_complete_job: string | null;
    job_type_id: number | null;
}

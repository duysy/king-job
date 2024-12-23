export interface IUserInfo {
  id: number;
  username?: string;
  wallet_address: string;
  name?: string;
  image?: string;
  bio?: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  github?: string;
  instagram?: string;
}

export interface IUserUpdatePayload {
  name: string;
  bio?: string;
  image?: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  github?: string;
  instagram?: string;
}

export enum JobStatus {
  NEW = "NEW",
  PUSHED = "PUSHED",
  ACCEPTED = "ACCEPTED",
  COMPLETED = "COMPLETED",
  DISPUTED = "DISPUTED",
  RESOLVED = "RESOLVED",
}

export interface IJobType {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface IUserInfoProfileSchema {
  id: number;
  username?: string;
  wallet_address: string;
  name?: string;
  image?: string;
  bio?: string;
  facebook?: string;
  twitter?: string;
}

export interface IJob {
  id: number;
  title: string;
  description: string;
  info?: string;
  image?: string | null;
  amount: string;
  status: JobStatus;
  created_at: string;
  updated_at: string;
  client?: IUserInfo;
  freelancer?: IUserInfo;
  job_type?: IJobType;
  transaction_create?: string | null;
  transaction_accept_job?: string | null;
  transaction_complete_job?: string | null;
}

export interface ICreateJobPayload {
  title: string;
  description: string;
  amount: string;
  job_type: number;
  image?: string;
}

export interface ITopFreelancer {
  id: number;
  username?: string;
  wallet_address: string;
  name?: string;
  image?: string;
  completed_jobs_count: number;
}

export interface IChatMessage {
  id: number;
  sender_address: string;
  sender_name?: string;
  receiver_address: string;
  receiver_name?: string;
  content: string;
  timestamp: string;
}

export interface IGetJobsOptions {
  page?: number;
  page_size?: number;
  job_type_id?: number;
  min_amount?: number;
  max_amount?: number;
  search?: string;
  status?: string;
}

export interface ICompletedProject {
  id: number;
  title: string;
  amount: number;
  description: string;
  completed_at: string; // ISO 8601 string for date
}

export interface ISocialLinks {
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  github?: string;
  instagram?: string;
}

export interface IUserResume {
  id: number;
  username: string;
  name: string;
  email?: string | null;
  bio?: string | null;
  image?: string;
  wallet_address: string;
  date_joined: string; // ISO 8601 string for date
  social_links: ISocialLinks;
  completed_projects: ICompletedProject[];
  total_income: number;
}

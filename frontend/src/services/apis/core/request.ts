import api from "../api";
import {
  IChatMessage,
  ICreateJobPayload,
  IGetJobsOptions,
  IJob,
  IJobType,
  ITopFreelancer,
  IUserInfo,
  IUserInfoProfileSchema,
  IUserResume,
  IUserUpdatePayload,
} from "./types";

// Fetch user info
export const getUserInfo = async (): Promise<IUserInfo> => {
  const response = await api.get<IUserInfo>("/user/info");
  return response.data;
};

// Update user
export const updateUser = async (
  payload: IUserUpdatePayload
): Promise<void> => {
  await api.put("/user/update", payload);
};

// Fetch job types
export const getJobTypes = async (): Promise<IJobType[]> => {
  const response = await api.get<IJobType[]>("/job-types");
  return response.data;
};

// Fetch the last created job
export const getJobs = async (
  options: IGetJobsOptions = {}
): Promise<IJob[]> => {
  const params = new URLSearchParams();

  if (options.page !== undefined) {
    params.set("page", String(options.page));
  }
  if (options.page_size !== undefined) {
    params.set("page_size", String(options.page_size));
  }
  if (options.job_type_id !== undefined) {
    params.set("job_type_id", String(options.job_type_id));
  }
  if (options.min_amount !== undefined) {
    params.set("min_amount", String(options.min_amount));
  }
  if (options.max_amount !== undefined) {
    params.set("max_amount", String(options.max_amount));
  }
  if (options.search) {
    params.set("search", options.search);
  }
  if (options.status) {
    params.set("status", options.status);
  }

  const queryString = params.toString();
  const url = queryString ? `/jobs?${queryString}` : "/jobs";

  const response = await api.get<IJob[]>(url);
  return response.data;
};

// Fetch jobs by client (authenticated user as the client)
export const getJobsByClient = async (): Promise<IJob[]> => {
  const response = await api.get<IJob[]>("/jobs/by-client");
  return response.data;
};

// Fetch jobs by freelancer (authenticated user as the freelancer)
export const getJobsByFreelancer = async (): Promise<IJob[]> => {
  const response = await api.get<IJob[]>("/jobs/by-freelancer");
  return response.data;
};

export const createJob = async (payload: ICreateJobPayload): Promise<IJob> => {
  const response = await api.post<IJob>("/jobs", payload);
  return response.data;
};
// Fetch top freelancers
export const getTopFreelancers = async (): Promise<ITopFreelancer[]> => {
  const response = await api.get<ITopFreelancer[]>("/top-freelancers");
  return response.data;
};

// Fetch newest jobs
export const getNewestJobs = async (): Promise<IJob[]> => {
  const response = await api.get<IJob[]>("/jobs/newest");
  return response.data;
};

export const getJobPickers = async (
  jobId: number
): Promise<IUserInfoProfileSchema[]> => {
  const response = await api.get<IUserInfoProfileSchema[]>(
    `/jobs/${jobId}/picks`
  );
  return response.data;
};

export const pickJob = async (jobId: number): Promise<string> => {
  const response = await api.post<string>(`/jobs/${jobId}/pick`);
  return response.data;
};
export const getJobById = async (id: number): Promise<IJob> => {
  const response = await api.get<IJob>(`/jobs/${id}`);
  return response.data;
};

export const fetchChatMessages = async (
  jobId: number,
  userA?: string,
  userB?: string
): Promise<IChatMessage[]> => {
  const params: Record<string, string> = {};

  if (userA) {
    params.user_A = userA;
  }
  if (userB) {
    params.user_B = userB;
  }

  const queryString = new URLSearchParams(params).toString();
  const url = `/jobs/${jobId}/chat${queryString ? `?${queryString}` : ""}`;

  const response = await api.get<IChatMessage[]>(url);
  return response.data;
};

export const sendChatMessage = async (
  jobId: number,
  content: string,
  receiver_address: string
): Promise<string> => {
  const response = await api.post(`/jobs/${jobId}/chat`, {
    content,
    receiver_address,
  });
  return response.data;
};

export const getUserResume = async (
  walletAddress: string
): Promise<IUserResume> => {
  const response = await api.get<IUserResume>(`/users/${walletAddress}/resume`);
  return response.data;
};

import { createMutation, createQuery } from "react-query-kit";
import {
  createJob,
  fetchChatMessages,
  getJobById,
  getJobPickers,
  getJobs,
  getJobsByClient,
  getJobsByFreelancer,
  getJobTypes,
  getNewestJobs,
  getTopFreelancers,
  getUserInfo,
  getUserResume,
  pickJob,
  sendChatMessage,
  updateUser,
} from "./request";
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

export const useUserInfo = createQuery<IUserInfo>({
  queryKey: ["useUserInfo"],
  fetcher: () => getUserInfo(),
});

export const useUpdateUser = createMutation<void, IUserUpdatePayload>({
  mutationFn: updateUser,
});

export const useJobTypes = createQuery<IJobType[]>({
  queryKey: ["useJobTypes"],
  fetcher: () => getJobTypes(),
  refetchInterval: 1000 * 3,
});

export const useJobs = createQuery<IJob[], IGetJobsOptions>({
  queryKey: ["useJobs"],
  fetcher: (options) => getJobs(options),
  refetchInterval: 1000 * 3,
});

export const useJobsByClient = createQuery<IJob[]>({
  queryKey: ["useJobsByClient"],
  fetcher: () => getJobsByClient(),
  refetchInterval: 1000 * 3,
});

export const useJobsByFreelancer = createQuery<IJob[]>({
  queryKey: ["useJobsByFreelancer"],
  fetcher: () => getJobsByFreelancer(),
  refetchInterval: 1000 * 3,
});

export const useCreateJob = createMutation<IJob, ICreateJobPayload>({
  mutationFn: createJob,
});

export const useTopFreelancers = createQuery<ITopFreelancer[]>({
  queryKey: ["useTopFreelancers"],
  fetcher: () => getTopFreelancers(),
  refetchInterval: 1000 * 3,
});

export const useNewestJobs = createQuery<IJob[]>({
  queryKey: ["useNewestJobs"],
  fetcher: () => getNewestJobs(),
  refetchInterval: 1000 * 3,
});

export const useJobDetails = createQuery<IJob, { id: number }>({
  queryKey: ["jobDetails"],
  fetcher: ({ id }) => getJobById(id),
  refetchInterval: 1000 * 3,
});

export const useJobPickers = createQuery<
  IUserInfoProfileSchema[],
  { jobId: number }
>({
  queryKey: ["jobPickers"],
  fetcher: ({ jobId }) => getJobPickers(jobId),
  refetchInterval: 1000 * 3,
});

export const usePickJob = createMutation<string, { jobId: number }>({
  mutationFn: ({ jobId }) => pickJob(jobId),
});

export const useFetchChatMessages = createQuery<
  IChatMessage[],
  { jobId: number; userA?: string; userB?: string }
>({
  queryKey: ["chatMessages"],
  fetcher: ({ jobId, userA, userB }) => fetchChatMessages(jobId, userA, userB),
  refetchInterval: 1000,
});

export const useSendChatMessage = createMutation<
  string,
  { jobId: number; receiver_address: string; content: string }
>({
  mutationFn: ({ jobId, content, receiver_address }) =>
    sendChatMessage(jobId, content, receiver_address),
});

export const useUserResume = createQuery<
  IUserResume,
  { walletAddress: string }
>({
  queryKey: ["useUserResume"],
  fetcher: ({ walletAddress }) => getUserResume(walletAddress),
});

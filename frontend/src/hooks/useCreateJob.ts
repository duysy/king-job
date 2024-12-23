import env from "@/env";
import { useCallback, useState } from "react";
import {
  useSimulateContract,
  useWatchContractEvent,
  useWriteContract,
} from "wagmi";

// You'll need to replace this with your actual contract ABI
const CONTRACT_ABI = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "jobId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "createJob",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
] as const;

const CONTRACT_ADDRESS = env.CONTRACT_ADDRESS as any;

interface CreateJobParams {
  jobId: number;
  amount: string;
}

interface UseCreateJobReturn {
  create: (params: CreateJobParams) => Promise<void>;
  isLoading: boolean;
  isSuccess: boolean;
  error: Error | null;
  reset: () => void;
  hash: string | undefined;
}

export function useCreateJob(): UseCreateJobReturn {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Simulate contract write to check for potential errors
  const { data: simulateData, isError } = useSimulateContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "createJob",
  });

  // Contract write hook
  const {
    writeContract,
    isError: isWriteError,
    isPending,
    data: hash,
  } = useWriteContract();

  // Watch for contract events
  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: "JobCreated",
    onLogs(logs) {
      console.log("Job created:", logs);
      setIsSuccess(true);
    },
  });

  // Reset state
  const reset = useCallback(() => {
    setIsSuccess(false);
    setError(null);
  }, []);

  // Create new job function
  const create = useCallback(
    async ({ jobId, amount }: CreateJobParams) => {
      try {
        reset();

        if (!jobId || !amount) {
          throw new Error("Job ID and amount are required");
        }

        // Convert amount to Wei
        const result = await writeContract({
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: "createJob",
          args: [BigInt(jobId), BigInt(amount)],
          value: BigInt(amount),
        });

        console.log("Transaction submitted:", result);
      } catch (err) {
        const error = err as Error;
        setError(error);
        console.error("Create job error:", error);
      }
    },
    [writeContract, reset]
  );

  return {
    create,
    isLoading: isPending,
    isSuccess,
    error,
    reset,
    hash: hash?.toString(),
  };
}

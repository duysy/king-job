import env from "@/env";
import { useCallback, useState } from "react";
import { useWatchContractEvent, useWriteContract } from "wagmi";

const CONTRACT_ABI = [
  {
    inputs: [
      { internalType: "uint256", name: "jobId", type: "uint256" },
      { internalType: "address", name: "freelancer", type: "address" },
    ],
    name: "acceptJob",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const CONTRACT_ADDRESS = env.CONTRACT_ADDRESS as any;

interface AcceptJobParams {
  jobId: number;
  freelancer: string;
}

interface UseAcceptJobReturn {
  accept: (params: AcceptJobParams) => Promise<void>;
  isLoading: boolean;
  isSuccess: boolean;
  error: Error | null;
  reset: () => void;
  hash: string | undefined;
}

export function useAcceptJob(): UseAcceptJobReturn {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const {
    writeContract,
    isError: isWriteError,
    isPending,
    data: hash,
  } = useWriteContract();

  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: "JobAccepted",
    onLogs(logs) {
      console.log("Job accepted:", logs);
      setIsSuccess(true);
    },
  });

  const reset = useCallback(() => {
    setIsSuccess(false);
    setError(null);
  }, []);

  const accept = useCallback(
    async ({ jobId, freelancer }: AcceptJobParams) => {
      try {
        reset();

        if (!jobId || !freelancer) {
          throw new Error("Job ID and freelancer address are required");
        }

        const result = await writeContract({
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: "acceptJob",
          args: [BigInt(jobId), freelancer as any],
        });

        console.log("Transaction submitted:", result);
      } catch (err) {
        const error = err as Error;
        setError(error);
        console.error("Accept job error:", error);
      }
    },
    [writeContract, reset]
  );

  return {
    accept,
    isLoading: isPending,
    isSuccess,
    error,
    reset,
    hash: hash?.toString(),
  };
}

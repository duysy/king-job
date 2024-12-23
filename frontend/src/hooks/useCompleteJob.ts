import { useCallback, useState } from "react";
import { useWriteContract, useWatchContractEvent } from "wagmi";
import env from "@/env";

const CONTRACT_ABI = [
  {
    inputs: [{ internalType: "uint256", name: "jobId", type: "uint256" }],
    name: "completeJob",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const CONTRACT_ADDRESS = env.CONTRACT_ADDRESS as any;

interface CompleteJobParams {
  jobId: number;
}

interface UseCompleteJobReturn {
  complete: (params: CompleteJobParams) => Promise<void>;
  isLoading: boolean;
  isSuccess: boolean;
  error: Error | null;
  reset: () => void;
  hash: string | undefined;
}

export function useCompleteJob(): UseCompleteJobReturn {
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
    eventName: "JobCompleted",
    onLogs(logs) {
      console.log("Job completed:", logs);
      setIsSuccess(true);
    },
  });

  const reset = useCallback(() => {
    setIsSuccess(false);
    setError(null);
  }, []);

  const complete = useCallback(
    async ({ jobId }: CompleteJobParams) => {
      try {
        reset();

        if (!jobId) {
          throw new Error("Job ID is required");
        }

        const result = await writeContract({
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: "completeJob",
          args: [BigInt(jobId)],
        });

        console.log("Transaction submitted:", result);
      } catch (err) {
        const error = err as Error;
        setError(error);
        console.error("Complete job error:", error);
      }
    },
    [writeContract, reset]
  );

  return {
    complete,
    isLoading: isPending,
    isSuccess,
    error,
    reset,
    hash: hash?.toString(),
  };
}

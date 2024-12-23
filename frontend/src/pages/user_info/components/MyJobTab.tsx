import { UrlMapping } from "@/commons/url-mapping.common";
import env from "@/env";
import { useCreateJob } from "@/hooks/useCreateJob";
import { JobStatus, useJobsByClient } from "@/services/apis/core";
import { getStatusBadgeClass } from "@/utils/colors";
import { formatDistanceToNow } from "date-fns";
import { formatEther } from "ethers";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const MyJobTab: React.FC = () => {
  const {
    data: userJobs,
    isLoading: isJobsLoading,
    error: errorJobsLoading,
  } = useJobsByClient();
  const navigate = useNavigate();

  const [currentJobId, setCurrentJobId] = useState<number | null>(null);
  const {
    create,
    isLoading,
    isSuccess,
    error,
    reset,
    hash: transactionHash,
  } = useCreateJob();

  const handleCreateJob = (jobId: number, jobAmount: string) => {
    setCurrentJobId(jobId);
    create({ jobId, amount: jobAmount });
  };

  if (isJobsLoading) {
    return <div className="text-center py-8">Loading jobs...</div>;
  }

  if (errorJobsLoading) {
    return (
      <div className="text-center py-8 text-red-500">
        Error loading jobs. Please try again later.
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-3xl shadow-2xl">
      <h2 className="text-3xl font-extrabold text-blue-800 mb-6 text-center">
        My Jobs
      </h2>
      {userJobs && userJobs.length > 0 ? (
        <div className="space-y-4">
          {userJobs.map((job) => (
            <div
              key={job.id}
              className="p-6 border rounded-lg shadow-lg bg-gray-50 hover:bg-white transition ease-in-out duration-300"
            >
              <div className="flex items-center space-x-6">
                <img
                  src={job.image || "https://via.placeholder.com/150"}
                  alt={job.title}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-blue-700">
                      {job.title}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(
                        job.status
                      )}`}
                    >
                      {job.status}
                    </span>
                  </div>
                  <p className="text-gray-600 font-semibold mt-2">
                    Amount: {formatEther(job.amount)} BSC
                  </p>

                  <div className="flex mt-3 space-x-4">
                    <p className="text-yellow-600">
                      Created:{" "}
                      {job.created_at
                        ? formatDistanceToNow(new Date(job.created_at), {
                            addSuffix: true,
                          })
                        : "Unknown"}
                    </p>
                    <p className="text-yellow-600">
                      Updated:
                      {job.updated_at
                        ? formatDistanceToNow(new Date(job.updated_at), {
                            addSuffix: true,
                          })
                        : "Unknown"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col justify-center items-center">
                  <button
                    onClick={() => handleCreateJob(job.id, job.amount)}
                    className={`py-2 px-4 rounded-full text-white transition-all duration-300 mb-5 w-36 ${
                      (isLoading && job.id === currentJobId) ||
                      job.status !== JobStatus.NEW
                        ? "bg-yellow-400 cursor-not-allowed"
                        : "bg-yellow-500 hover:bg-yellow-600"
                    }`}
                    disabled={isLoading || job.status !== JobStatus.NEW}
                  >
                    {isLoading && job.id === currentJobId
                      ? "Processing..."
                      : "Push onchain"}
                  </button>

                  <button
                    onClick={() =>
                      navigate(`${UrlMapping.job_picker}/${job.id}`)
                    }
                    className={`py-2 px-4 rounded-full text-white transition-all duration-300 bg-yellow-500 hover:bg-yellow-600 w-36`}
                  >
                    View Picker
                  </button>
                </div>
              </div>
              {isSuccess && transactionHash && job.id === currentJobId && (
                <p className="mt-3 text-green-600">
                  Push onchain successful!
                  <a
                    href={`${env.EXPLORER_SCAN}/tx/${transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    View transaction
                  </a>
                </p>
              )}
              {error && job.id === currentJobId && (
                <p className="text-red-500 mt-3">{error.message}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">No jobs found.</div>
      )}
    </div>
  );
};

export default MyJobTab;

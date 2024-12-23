import { UrlMapping } from "@/commons/url-mapping.common";
import { useCreateJob } from "@/hooks/useCreateJob";
import { useJobsByFreelancer } from "@/services/apis/core";
import { getStatusBadgeClass } from "@/utils/colors";
import { formatDistanceToNow } from "date-fns";
import { formatEther } from "ethers";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const FindJobTab: React.FC = () => {
  const {
    data: userJobs,
    isLoading: isJobsLoading,
    error: errorJobsLoading,
  } = useJobsByFreelancer();

  const [currentJobId, setCurrentJobId] = useState<number | null>(null);
  const {
    create,
    isLoading,
    isSuccess,
    error,
    reset,
    hash: transactionHash,
  } = useCreateJob();
  const navigate = useNavigate();

  const handleWithdrawFunds = (jobId: number, jobAmount: string) => {
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
        Find Jobs
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
                      Updated:{" "}
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
                    onClick={() =>
                      navigate(`${UrlMapping.job_found}/${job.id}`)
                    }
                    className={`py-2 px-4 rounded-full text-white transition-all duration-300 bg-yellow-500 w-36`}
                  >
                    View Job
                  </button>
                </div>
              </div>

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

export default FindJobTab;

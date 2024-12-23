import Footer from "@/components/Footer";
import NavigationBar from "@/components/NavBar";
import { JobStatus, useJobDetails, usePickJob } from "@/services/apis/core"; // Added usePickJob
import { getStatusBadgeClass } from "@/utils/colors";
import { formatDistanceToNow } from "date-fns";
import { formatEther } from "ethers";
import React from "react";
import { useParams } from "react-router-dom";

const JobDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const {
    data: job,
    isLoading,
    error,
  } = useJobDetails({ variables: { id: Number(id) } });

  const { mutate: pickJob, isPending: isPicking } = usePickJob();

  const handlePickJob = () => {
    if (!id) return;
    pickJob(
      { jobId: Number(id) },
      {
        onSuccess: (message) => {
          alert(message); // Show success message
        },
        onError: (error: any) => {
          alert(
            error.response?.data?.detail || "Failed to pick the job. Try again."
          );
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen flex flex-col">
        <NavigationBar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-600 text-lg animate-pulse">
            Loading job details...
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="bg-gray-50 min-h-screen flex flex-col">
        <NavigationBar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-red-600 text-lg">
            Job not found or an error occurred. Please try again later.
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <NavigationBar />
      <main className="flex-1 container mx-auto py-12 px-6 md:px-20">
        {/* Job Header */}
        <section className="text-center mb-12">
          <h1 className="text-5xl font-bold text-blue-900 mb-4">{job.title}</h1>
          <p className="text-lg text-gray-700">
            <span className="font-semibold">Posted by:</span>{" "}
            <span className="text-blue-700">
              {job.client?.username || "Unknown"}
            </span>
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {`Posted ${formatDistanceToNow(new Date(job.created_at), {
              addSuffix: true,
            })}`}
          </p>
        </section>

        {/* Job Image */}
        <div className="relative mb-10">
          <img
            src={job.image || "https://placehold.co/600x400"}
            alt={job.title}
            className="w-full max-h-[60vh] rounded-lg object-cover shadow-lg"
          />
        </div>

        {/* Job Details */}
        <section className="bg-white rounded-lg p-8 shadow-md mb-16">
          <h2 className="text-3xl font-bold text-blue-800 mb-6">Description</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            {job.description}
          </p>
          {job.info && (
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-blue-800 ">Details</h2>
              <div
                className="prose max-w-none mt-3"
                dangerouslySetInnerHTML={{ __html: job.info }}
              />
            </div>
          )}

          {/* Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Payment Section */}
            <div className="text-center md:text-left">
              <h4 className="text-lg font-semibold text-blue-700">Payment</h4>
              <p className="text-xl text-gray-800 mt-2">
                {formatEther(job.amount)} BNB
              </p>
            </div>

            {/* Type Section */}
            <div className="text-center md:text-left">
              <h4 className="text-lg font-semibold text-blue-700">Type</h4>
              <p className="text-xl text-gray-800 mt-2">
                {job.job_type?.name || "Unknown"}
              </p>
            </div>

            {/* Status Section */}
            <div className="text-center md:text-left">
              <h4 className="text-lg font-semibold text-blue-700">Status</h4>
              <div className="mt-2 inline-flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(
                    job.status
                  )}`}
                >
                  {job.status}
                </span>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          {job.status === JobStatus.PUSHED && (
            <div className="mt-12 flex justify-center">
              <button
                className={`w-64 py-3 text-white text-xl font-semibold rounded-lg shadow-lg transition-all ${
                  isPicking
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
                onClick={handlePickJob}
                disabled={isPicking}
              >
                {isPicking ? "Processing..." : "Pick This Job"}
              </button>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default JobDetailsPage;

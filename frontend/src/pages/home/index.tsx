import { UrlMapping } from "@/commons/url-mapping.common";
import Footer from "@/components/Footer";
import NavigationBar from "@/components/NavBar";
import { useNewestJobs, useTopFreelancers } from "@/services/apis/core";
import { useAuthStore } from "@/services/stores/useAuthStore";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { formatDistanceToNow } from "date-fns";
import { formatEther } from "ethers";
import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const { openConnectModal } = useConnectModal();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  // Fetch top freelancers and newest jobs
  const { data: topFreelancers, isLoading: isFreelancersLoading } =
    useTopFreelancers();
  const { data: newestJobs, isLoading: isNewestJobsLoading } = useNewestJobs();

  return (
    <div className="bg-white min-h-screen">
      <NavigationBar />

      {/* Hero Section */}
      <section className="relative pt-16 pb-32 bg-gradient-to-r from-blue-800 to-purple-800 text-white">
        <div className="container mx-auto flex flex-col lg:flex-row items-center gap-12 px-5 lg:px-16">
          {/* Left Column - Intro Text */}
          <div className="lg:w-1/2">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
              Discover & Hire <br /> Top Freelancers
            </h1>
            <p className="mb-8 text-lg">
              Connect with talented professionals and explore the latest job
              opportunities.
            </p>
            {!isAuthenticated ? (
              <button
                className="bg-yellow-400 text-blue-800 py-3 px-8 rounded-full font-semibold shadow-md hover:bg-yellow-500 hover:shadow-lg transition-all duration-300"
                onClick={openConnectModal}
              >
                Connect Wallet
              </button>
            ) : null}
          </div>

          {/* Right Column - Larger Image */}
          <div className="lg:w-1/2 flex justify-center lg:justify-end">
            <img
              src="/banner.png"
              alt="Freelancer illustration"
              className="w-full lg:w-[90%] xl:w-[100%] object-cover rounded-lg shadow-lg scale-125"
            />
          </div>
        </div>
      </section>

      {/* Top Freelancers */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-5 lg:px-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-10">
            Our Top Freelancers
          </h2>
          {isFreelancersLoading ? (
            <p className="text-center text-gray-500">Loading freelancers...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {(!topFreelancers || topFreelancers.length < 1) && (
                <div className="col-span-full text-center text-gray-600">
                  No freelancers found.
                </div>
              )}

              {topFreelancers?.map((freelancer) => (
                <div
                  key={freelancer.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg p-6 flex items-center cursor-pointer transition-shadow duration-300"
                  onClick={() =>
                    navigate(
                      `${UrlMapping.resume}/${freelancer.wallet_address}`
                    )
                  }
                >
                  {/* Avatar */}
                  <div className="w-16 h-16 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold text-2xl mr-5 shadow-md">
                    {freelancer.name?.charAt(0) ||
                      freelancer.username?.charAt(0) ||
                      "F"}
                  </div>
                  {/* Info */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">
                      {freelancer.name || freelancer.username}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Completed Jobs: {freelancer.completed_jobs_count}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newest Jobs */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-5 lg:px-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-10">
            Latest Jobs
          </h2>
          {isNewestJobsLoading ? (
            <p className="text-center text-gray-500">Loading jobs...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {(!newestJobs || newestJobs.length < 1) && (
                <div className="col-span-full text-center text-gray-600">
                  No jobs available yet.
                </div>
              )}

              {newestJobs?.map((job) => (
                <div
                  key={job.id}
                  onClick={() => navigate(`${UrlMapping.detail}/${job.id}`)}
                  className="bg-gray-50 rounded-lg shadow-md hover:shadow-lg overflow-hidden transition-shadow duration-300 flex flex-col cursor-pointer"
                >
                  {/* Job image */}
                  <img
                    src={job.image || "https://placehold.co/600x400"}
                    alt={job.title}
                    className="w-full h-48 object-cover"
                  />
                  {/* Job info */}
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-gray-700 mb-2">
                      {job.title}
                    </h3>
                    <p className="text-sm text-gray-600 flex-grow">
                      {job.description}
                    </p>
                    <div className="flex justify-between items-center mt-4">
                      <span className="font-semibold text-green-600">
                        {formatEther(job.amount)} BSC
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatDistanceToNow(new Date(job.created_at), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;

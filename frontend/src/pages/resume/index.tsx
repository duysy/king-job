import NavigationBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { useUserResume } from "@/services/apis/core";
import React from "react";
import { useParams } from "react-router-dom";
import { formatEther } from "ethers";

const ResumePage: React.FC = () => {
  const { walletAddress } = useParams<{ walletAddress: string }>();
  const {
    data: userInfo,
    isLoading,
    error,
  } = useUserResume({ variables: { walletAddress: walletAddress || "" } });

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <NavigationBar />
        <div className="text-center mt-20 text-gray-600">Loading resume...</div>
        <Footer />
      </div>
    );
  }

  if (error || !userInfo) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <NavigationBar />
        <div className="text-center mt-20 text-red-600">
          Failed to load resume. Please try again.
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavigationBar />
      <main className="max-w-[1000px] mx-auto py-16 px-6 md:px-20 bg-white shadow-lg rounded-lg my-10">
        {/* Header Section */}
        <section className="flex items-center gap-6 mb-12">
          <img
            src={userInfo.image || "https://placehold.co/150x150"}
            alt="User Avatar"
            className="w-24 h-24 rounded-full border-2 border-blue-500"
          />
          <div>
            <h1 className="text-4xl font-bold text-gray-800">
              {userInfo.name || "Anonymous"}
            </h1>
            <p className="text-gray-500">{userInfo.username}</p>
            <p className="text-blue-500">{userInfo.wallet_address}</p>
          </div>
        </section>

        {/* Bio Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Bio</h2>
          <p className="text-lg text-gray-600">
            {userInfo.bio || "No bio available"}
          </p>
        </section>

        {/* Social Links */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Social Links
          </h2>
          <ul className="flex flex-wrap gap-4">
            {Object.entries(userInfo.social_links || {}).map(
              ([key, value]) =>
                value && (
                  <li key={key}>
                    <a
                      href={value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </a>
                  </li>
                )
            )}
          </ul>
        </section>

        {/* Completed Projects */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Completed Projects
          </h2>
          <ul className="space-y-6">
            {userInfo.completed_projects.map((project) => (
              <li
                key={project.id}
                className="p-6 border rounded-lg shadow-sm bg-gray-50"
              >
                <h3 className="text-xl font-semibold text-blue-800">
                  {project.title}
                </h3>
                <p className="text-gray-600 mt-2">{project.description}</p>
                <div className="mt-4 text-gray-500">
                  <span className="font-bold">Amount Earned:</span>{" "}
                  {formatEther(project.amount)} BNB
                </div>
                <div className="text-gray-400 text-sm">
                  Completed At:{" "}
                  {new Date(project.completed_at).toLocaleDateString()}
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Total Income */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Total Income
          </h2>
          <p className="text-green-600 font-bold text-3xl">
            {formatEther(userInfo.total_income)} BNB
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ResumePage;

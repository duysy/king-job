import Chat from "@/components/Chat/Chat";
import Footer from "@/components/Footer";
import NavigationBar from "@/components/NavBar";
import {
  useFetchChatMessages,
  useJobDetails,
  useSendChatMessage,
} from "@/services/apis/core";
import { useAuthStore } from "@/services/stores/useAuthStore";
import { getStatusBadgeClass } from "@/utils/colors";
import { formatDistanceToNow } from "date-fns";
import { formatEther } from "ethers";
import React from "react";
import { useParams } from "react-router-dom";

const JobFoundPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    data: job,
    isLoading: isLoadingJob,
    error: jobError,
  } = useJobDetails({
    variables: { id: Number(id) },
  });

  const { getWalletAddress } = useAuthStore();
  const walletAddress = getWalletAddress();

  const { data: chatMessages, refetch: refetchChatMessages } =
    useFetchChatMessages({
      variables: {
        jobId: Number(id),
        userA: job?.client?.wallet_address || "",
        userB: walletAddress,
      },
    });

  const { mutate: sendMessage, isPending: isSendingMessage } =
    useSendChatMessage();

  const handleSendMessage = (message: string) => {
    if (!job?.client?.wallet_address) return;

    sendMessage(
      {
        jobId: Number(id),
        content: message,
        receiver_address: job.client.wallet_address,
      },
      {
        onSuccess: () => {
          refetchChatMessages();
        },
        onError: () => {
          alert("Failed to send message.");
        },
      }
    );
  };

  if (isLoadingJob) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <NavigationBar />
        <div className="text-center mt-20">Loading job details...</div>
        <Footer />
      </div>
    );
  }

  if (jobError || !job) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <NavigationBar />
        <div className="text-center mt-20">
          Job not found or an error occurred.
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavigationBar />
      <main className="container mx-auto py-10 flex space-x-8">
        {/* Left Panel: Job Info */}
        <div className="w-1/2 bg-white rounded-xl p-8 shadow-md">
          <h2 className="text-5xl font-bold text-blue-800 mb-4">{job.title}</h2>
          <p className="text-lg text-gray-600 mb-4">
            Posted by: {job.client?.username || "Unknown"}
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Created{" "}
            {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
          </p>
          <img
            src={job.image || "https://placehold.co/150x150"}
            alt={job.title}
            className="w-full rounded-lg object-cover shadow-lg mb-6"
          />
          <p className="text-xl text-gray-700 leading-relaxed mb-8">
            {job.description}
          </p>
          {job.info && (
            <div
              className="prose max-w-none mb-8"
              dangerouslySetInnerHTML={{ __html: job.info }}
            />
          )}
          <div className="mb-6">
            <h4 className="text-2xl font-bold text-blue-700">Amount</h4>
            <p className="text-lg text-gray-600 mt-2">
              {formatEther(job.amount)} BNB
            </p>
          </div>
          <div className="mb-6">
            <h4 className="text-2xl font-bold text-blue-700">Job Type</h4>
            <p className="text-lg text-gray-600 mt-2">
              {job.job_type?.name || "Unknown"}
            </p>
          </div>
          <div>
            <h4 className="text-2xl font-bold text-blue-700">Status</h4>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(
                job.status
              )}`}
            >
              {job.status}
            </span>
          </div>
        </div>

        {/* Right Panel: Chat */}
        <div className="w-1/2 bg-white rounded-xl p-8 shadow-md flex flex-col">
          <div className="w-full sticky top-36 self-start">
            <Chat
              messages={chatMessages || []}
              currentUserAddress={walletAddress}
              onSendMessage={handleSendMessage}
              isLoading={isSendingMessage}
              className="flex-grow"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default JobFoundPage;

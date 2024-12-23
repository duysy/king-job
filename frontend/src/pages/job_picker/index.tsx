import { UrlMapping } from "@/commons/url-mapping.common";
import Chat from "@/components/Chat/Chat";
import Footer from "@/components/Footer";
import NavigationBar from "@/components/NavBar";
import { useAcceptJob } from "@/hooks/useAcceptJob";
import { useCompleteJob } from "@/hooks/useCompleteJob";
import {
  IUserInfoProfileSchema,
  JobStatus,
  useFetchChatMessages,
  useJobDetails,
  useJobPickers,
  useSendChatMessage,
} from "@/services/apis/core";
import { useAuthStore } from "@/services/stores/useAuthStore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const JobPickersPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const jobId = Number(id);

  const [selectedPicker, setSelectedPicker] =
    useState<IUserInfoProfileSchema | null>(null);

  const { accept, isLoading: isLoadingAcceptJob } = useAcceptJob();
  const { complete, isLoading: isLoadingCompleteJob } = useCompleteJob();

  const {
    data: job,
    isLoading: isJobLoading,
    error: jobError,
  } = useJobDetails({ variables: { id: jobId } });

  const { data: pickers, isLoading: arePickersLoading } = useJobPickers({
    variables: { jobId },
  });

  const { getWalletAddress } = useAuthStore();
  const walletAddress = getWalletAddress();

  const { data: chatMessages, refetch: refetchChatMessages } =
    useFetchChatMessages({
      variables: {
        jobId,
        userA: selectedPicker?.wallet_address,
        userB: walletAddress,
      },
    });

  const { mutate: sendMessage, isPending: isSendingMessage } =
    useSendChatMessage();

  useEffect(() => {
    if (pickers && pickers.length > 0) {
      setSelectedPicker(pickers[0]);
    }
  }, [pickers]);

  const handleSendMessage = (message: string) => {
    if (!selectedPicker?.wallet_address) return;

    sendMessage(
      {
        jobId,
        content: message,
        receiver_address: selectedPicker.wallet_address,
      },
      {
        onSuccess: () => {
          refetchChatMessages();
        },
        onError: () => alert("Failed to send message."),
      }
    );
  };

  const handleAcceptJob = () => {
    if (!job || !selectedPicker) return;
    accept({
      jobId: Number(job.id),
      freelancer: selectedPicker.wallet_address,
    });
  };

  const handleCompleteJob = () => {
    if (!job || !selectedPicker) return;
    complete({ jobId: Number(job.id) });
  };

  if (isJobLoading) {
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

  const canAcceptJob = job.status === JobStatus.PUSHED && selectedPicker;
  const canCompleteJob =
    job.status === JobStatus.ACCEPTED &&
    selectedPicker &&
    job.freelancer?.wallet_address === selectedPicker.wallet_address;

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <NavigationBar />

      <div className="flex flex-grow container mx-auto py-10">
        {/* Left Sidebar: List of Pickers */}
        <div className="w-1/3 bg-white shadow-md rounded-lg p-6 overflow-auto">
          <h3 className="text-2xl font-bold text-blue-800 mb-6">Job Pickers</h3>
          {arePickersLoading ? (
            <p className="text-gray-600">Loading pickers...</p>
          ) : pickers && pickers.length > 0 ? (
            <ul>
              {pickers.map((picker) => (
                <li
                  key={picker.id}
                  className={`p-4 rounded-lg mb-4 cursor-pointer hover:bg-blue-50 transition ${
                    selectedPicker?.id === picker.id
                      ? "bg-blue-100"
                      : "bg-white"
                  }`}
                  onClick={() => setSelectedPicker(picker)}
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={picker.image || "https://placehold.co/150x150"}
                      alt={picker.name || `${picker.username?.slice(0, 20)}...`}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h4 className="text-lg font-semibold">
                        {picker.name || `${picker.username?.slice(0, 20)}...`}
                      </h4>
                      <p className="text-gray-500 text-sm cursor-pointer">
                        {picker.wallet_address}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No pickers found for this job.</p>
          )}
        </div>

        {/* Right Panel: Picker Info and Chat */}
        <div className="w-2/3 bg-white shadow-md rounded-lg p-6 flex flex-col">
          {selectedPicker ? (
            <>
              {/* Picker Info */}
              <div className="flex items-center mb-6">
                <img
                  src={selectedPicker.image || "https://placehold.co/150x150"}
                  alt={selectedPicker.name || selectedPicker.username}
                  className="w-28 h-28 rounded-full mr-3"
                />
                <div className="ml-4">
                  <h4 className="text-xl font-bold text-blue-800 mb-2">
                    {selectedPicker.name ||
                      `${selectedPicker.username?.slice(0, 20)}...`}
                    <a
                      href={`${UrlMapping.resume}/${selectedPicker.wallet_address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline ml-5"
                    >
                      View Resume
                    </a>
                  </h4>

                  {selectedPicker.bio && (
                    <p className="text-gray-600 mb-2">{selectedPicker.bio}</p>
                  )}
                  <span className="font-mono">
                    <b>{selectedPicker.wallet_address}</b>{" "}
                  </span>
                </div>

                {canAcceptJob && (
                  <button
                    disabled={isLoadingAcceptJob}
                    onClick={handleAcceptJob}
                    className={`${
                      isLoadingAcceptJob
                        ? "bg-yellow-300 cursor-not-allowed"
                        : "bg-yellow-500"
                    }  text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition ml-8`}
                  >
                    Accept Freelancer
                  </button>
                )}
                {canCompleteJob && (
                  <button
                    disabled={isLoadingCompleteJob}
                    onClick={handleCompleteJob}
                    className={`${
                      isLoadingCompleteJob
                        ? "bg-green-300 cursor-not-allowed"
                        : "bg-green-500"
                    } text-white px-4 py-2 rounded-lg hover:bg-green-600 transition ml-8`}
                  >
                    Complete & Pay
                  </button>
                )}
                {job.status && (
                  <div className="bg-green-500 text-white px-4 py-2 rounded-full ml-8">
                    {job.status}
                  </div>
                )}
              </div>

              {/* Chat Section */}
              <Chat
                messages={chatMessages || []}
                currentUserAddress={walletAddress}
                onSendMessage={handleSendMessage}
                isLoading={isSendingMessage}
                className="flex-grow"
              />
            </>
          ) : (
            <p className="text-center text-gray-600">
              Select a picker to view their details and chat.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobPickersPage;

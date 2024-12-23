import NavigationBar from "@/components/NavBar";
import React from "react";

const HowToUsePage: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <NavigationBar />

      <main className="container mx-auto py-16 px-6 md:px-20">
        <h2 className="text-5xl font-bold text-blue-800 mb-12 text-center">
          How to Use King Job
        </h2>

        {/* Getting Started Section */}
        <section className="bg-white p-10 rounded-xl shadow-lg mb-16">
          <h3 className="text-3xl font-bold text-blue-700 mb-6">
            Getting Started
          </h3>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            King Job connects clients and freelancers in a seamless Web3-powered
            platform. To get started, you need to connect your wallet. Click on
            the <strong>"Connect Wallet"</strong> button at the top of the page.
          </p>
          <h4 className="text-2xl font-semibold text-blue-600 mb-4">
            How to Connect Your Wallet
          </h4>
          <ol className="list-decimal list-inside mb-6 text-gray-700">
            <li>
              Click the <strong>"Connect Wallet"</strong> button.
            </li>
            <li>
              Choose a supported wallet option (e.g., Rainbow Wallet, MetaMask,
              Binance Wallet, or others).
            </li>
            <li>
              Follow the instructions to link your wallet to the platform.
            </li>
            <li>Once connected, you can start creating or picking jobs!</li>
          </ol>
        </section>

        {/* Creating a Job Section */}
        <section className="bg-white p-10 rounded-xl shadow-lg mb-16">
          <h3 className="text-3xl font-bold text-blue-700 mb-6">
            Creating a Job
          </h3>
          <ol className="list-decimal list-inside text-gray-700">
            <li>
              Navigate to the <strong>"Create Job"</strong> section.
            </li>
            <li>
              Fill out the job form with the following details:
              <ul className="list-disc list-inside ml-6">
                <li>
                  <strong>Title:</strong> A concise job title.
                </li>
                <li>
                  <strong>Description:</strong> A detailed overview of the work
                  required.
                </li>
                <li>
                  <strong>Payment Amount:</strong> Specify how much you’ll pay
                  the freelancer upon completion.
                </li>
                <li>
                  <strong>Deadline:</strong> Set a timeframe for the job.
                </li>
              </ul>
            </li>
            <li>
              Submit the form. First, your job details will be saved on the
              platform. Then, you can push it to the blockchain to make it
              available for freelancers.
            </li>
          </ol>
        </section>

        {/* Picking a Job Section */}
        <section className="bg-white p-10 rounded-xl shadow-lg mb-16">
          <h3 className="text-3xl font-bold text-blue-700 mb-6">
            Picking a Job
          </h3>
          <ol className="list-decimal list-inside text-gray-700">
            <li>
              Browse jobs in the <strong>"Find Jobs"</strong> section.
            </li>
            <li>
              Click on a job to view details, including requirements and
              payment.
            </li>
            <li>
              If interested, click the <strong>"Pick Job"</strong> button.
            </li>
            <li>
              Initiate a discussion with the client via the built-in chat to
              clarify details and agree on terms.
            </li>
            <li>
              Once the client approves, your address will be added to the job's
              blockchain record.
            </li>
          </ol>
        </section>

        {/* Completing a Job Section */}
        <section className="bg-white p-10 rounded-xl shadow-lg mb-16">
          <h3 className="text-3xl font-bold text-blue-700 mb-6">
            Completing a Job
          </h3>
          <ol className="list-decimal list-inside text-gray-700">
            <li>After reaching an agreement, begin work on the job.</li>
            <li>
              Once completed, submit the deliverables to the client for review.
              You will also need to message the client to ensure they review and
              finalize the result.
            </li>
            <li>
              The client will review your work and, if satisfied, approve the
              job on the blockchain.
            </li>
            <li>
              Upon approval, payment will be released directly to your wallet.
            </li>
          </ol>
        </section>

        {/* Tracking Jobs Section */}
        <section className="bg-white p-10 rounded-xl shadow-lg">
          <h3 className="text-3xl font-bold text-blue-700 mb-6">
            Tracking Jobs
          </h3>
          <ol className="list-decimal list-inside text-gray-700">
            <li>
              Clients can track all active jobs in the{" "}
              <strong>"My Jobs"</strong> section.
            </li>
            <li>
              Freelancers can view the jobs they’ve picked in the{" "}
              <strong>"My Work"</strong> section.
            </li>
            <li>
              Real-time updates for job progress and payment status are visible
              directly on the blockchain.
            </li>
          </ol>
          <p className="text-lg text-gray-700 leading-relaxed mt-4">
            With transparency and security at its core, King Job ensures trust
            between clients and freelancers throughout the process.
          </p>
        </section>
      </main>
    </div>
  );
};

export default HowToUsePage;

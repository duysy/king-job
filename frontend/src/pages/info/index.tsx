import NavigationBar from "@/components/NavBar";
import React from "react";

const InfoPage: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <NavigationBar />

      <main className="container mx-auto py-16 px-6 md:px-20">
        <h2 className="text-5xl font-bold text-blue-800 mb-12 text-center">
          About King Job
        </h2>

        <section className="bg-white p-10 rounded-xl shadow-lg mb-16">
          <h3 className="text-3xl font-bold text-blue-700 mb-6">Our Mission</h3>
          <p className="text-lg text-gray-700 leading-relaxed mb-10">
            At King Job, our mission is to connect clients and freelancers
            seamlessly through the power of Web3 technology. We aim to provide a
            secure, transparent, and efficient platform for job creation and
            collaboration, empowering both clients and freelancers to achieve
            their goals.
          </p>

          <h3 className="text-3xl font-bold text-blue-700 mb-6">Our Vision</h3>
          <p className="text-lg text-gray-700 leading-relaxed mb-10">
            We envision a future where freelancers and clients collaborate
            globally without barriers. Through blockchain technology, we strive
            to build a trustworthy ecosystem where job opportunities are
            accessible to everyone, and payments are secure and instantaneous.
          </p>

          <h3 className="text-3xl font-bold text-blue-700 mb-6">Why Web3?</h3>
          <p className="text-lg text-gray-700 leading-relaxed mb-10">
            Web3 technology underpins our platform, enabling:
          </p>
          <ul className="list-disc list-inside text-lg text-gray-700 mb-10">
            <li>
              <strong>Transparency:</strong> Every transaction is recorded on
              the blockchain, ensuring traceability and trust.
            </li>
            <li>
              <strong>Security:</strong> Smart contracts guarantee that payments
              are released only when agreed-upon conditions are met.
            </li>
            <li>
              <strong>Efficiency:</strong> Direct interactions between clients
              and freelancers reduce delays and middleman fees.
            </li>
          </ul>

          <h3 className="text-3xl font-bold text-blue-700 mb-6">
            How King Job Works
          </h3>
          <p className="text-lg text-gray-700 leading-relaxed mb-10">
            King Job facilitates seamless collaboration between clients and
            freelancers:
          </p>
          <ul className="list-disc list-inside text-lg text-gray-700 mb-10">
            <li>
              <strong>Clients:</strong> Post jobs on the platform, define
              requirements, and set payment terms.
            </li>
            <li>
              <strong>Freelancers:</strong> Browse available jobs, pick the ones
              that match their skills, and communicate with clients to finalize
              terms.
            </li>
            <li>
              <strong>Onchain Transactions:</strong> Once terms are agreed upon,
              smart contracts ensure secure payments upon successful completion.
            </li>
          </ul>

          <h3 className="text-3xl font-bold text-blue-700 mb-6">
            Why Choose King Job?
          </h3>
          <ul className="list-disc list-inside text-lg text-gray-700 mb-10">
            <li>
              <strong>Trust:</strong> Blockchain ensures all interactions and
              transactions are transparent and verifiable.
            </li>
            <li>
              <strong>Global Reach:</strong> Connect with clients and
              freelancers worldwide without geographical limitations.
            </li>
            <li>
              <strong>Innovation:</strong> King Job combines modern technology
              with a user-friendly interface to create a streamlined experience.
            </li>
          </ul>

          <h3 className="text-3xl font-bold text-blue-700 mb-6">
            Future Development
          </h3>
          <p className="text-lg text-gray-700 leading-relaxed mb-10">
            We are continuously improving King Job to provide even more value to
            our users. Our plans include:
          </p>
          <ul className="list-disc list-inside text-lg text-gray-700">
            <li>
              Advanced Analytics: Gain insights into job performance and
              freelancer contributions.
            </li>
            <li>
              Expanded Features: Introduce tools for effective project
              management and collaboration.
            </li>
            <li>
              Enhanced Onboarding: Simplify the process for new users to join
              and engage with the platform.
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default InfoPage;

// components/TransactionSequence.tsx
import React from "react";
import { Check, Clock, ExternalLink } from "lucide-react";
import env from "@/env";

interface TransactionSequenceProps {
  transactionCreate?: string | null;
  transactionAcceptJob?: string | null;
  transactionCompleteJob?: string | null;
}

const TransactionSequence: React.FC<TransactionSequenceProps> = ({
  transactionCreate,
  transactionAcceptJob,
  transactionCompleteJob,
}) => {
  const transactions = [
    { hash: transactionCreate, label: "Job Created", step: 1 },
    { hash: transactionAcceptJob, label: "Job Accepted", step: 2 },
    { hash: transactionCompleteJob, label: "Job Completed", step: 3 },
  ];

  return (
    <div className="w-full">
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute left-6 top-0 h-full w-0.5 bg-gray-200" />

        {/* Transaction Steps */}
        <div className="space-y-8">
          {transactions.map((tx, index) => (
            <div key={index} className="relative flex items-start">
              {/* Status Circle */}
              <div
                className={`
                w-3 h-3 rounded-full mt-2 mr-4 relative z-10
                ${tx.hash ? "bg-green-500" : "bg-gray-300"}
              `}
              />

              {/* Transaction Content */}
              <div className="flex-1">
                <div className="flex items-center">
                  <span className="font-medium text-gray-900">{tx.label}</span>
                  {tx.hash && (
                    <a
                      href={`${env.EXPLORER_SCAN}/tx/${tx.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-blue-500 hover:text-blue-600 inline-flex items-center"
                    >
                      <ExternalLink size={16} className="mr-1" />
                      View Transaction
                    </a>
                  )}
                </div>

                {/* Status */}
                <div className="mt-1 flex items-center text-sm">
                  {tx.hash ? (
                    <span className="text-green-600 flex items-center">
                      <Check size={16} className="mr-1" />
                      Confirmed
                    </span>
                  ) : (
                    <span className="text-gray-500 flex items-center">
                      <Clock size={16} className="mr-1" />
                      Pending
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TransactionSequence;

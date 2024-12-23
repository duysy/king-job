import { UrlMapping } from "@/commons/url-mapping.common";
import Footer from "@/components/Footer";
import NavigationBar from "@/components/NavBar";
import { useJobs, useJobTypes } from "@/services/apis/core";
import { getStatusBadgeClass } from "@/utils/colors";
import { JOB_STATUSES } from "@/utils/const";
import { formatDistanceToNow } from "date-fns";
import { formatEther, parseEther } from "ethers";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface FilterValues {
  page?: number;
  page_size?: number;
  job_type_id?: number;
  min_amount?: number;
  max_amount?: number;
  search?: string;
  status?: string;
}

const AllJobsPage: React.FC = () => {
  const navigate = useNavigate();

  const { data: jobTypes, isLoading: isJobTypesLoading } = useJobTypes();

  const [filterValues, setFilterValues] = useState<FilterValues>({
    page: 1,
    page_size: 10,
    job_type_id: undefined,
    min_amount: undefined,
    max_amount: undefined,
    search: "",
    status: "",
  });

  const {
    data: jobs,
    isLoading,
    error,
  } = useJobs({
    variables: filterValues,
  });

  const handleFilterChange = (
    field: keyof FilterValues,
    value: string | number | undefined
  ) => {
    let parsedValue: number | undefined;

    if (field === "min_amount" || field === "max_amount") {
      parsedValue = value ? Number(parseEther(value.toString())) : undefined;
    } else {
      parsedValue = value as number | undefined;
    }

    setFilterValues((prev) => ({
      ...prev,
      [field]: parsedValue,
      page: 1,
    }));
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <NavigationBar />

      <main className="container mx-auto py-16 px-4 md:px-8 flex gap-8">
        {/* Left Panel: Filters */}

        <div className="rounded-xl flex flex-col">
          <div className="w-full sticky top-36 self-start">
            <aside className="w-full max-w-xs bg-white p-6 rounded-lg shadow-md self-start">
              <h3 className="text-2xl font-bold text-blue-800 mb-4">Filters</h3>

              {/* Search Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Search Title/Description
                </label>
                <input
                  type="text"
                  className="mt-1 w-full border rounded p-2"
                  value={filterValues.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                />
              </div>

              {/* Job Type Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Job Type
                </label>
                <select
                  className="mt-1 w-full border rounded p-2"
                  value={filterValues.job_type_id || ""}
                  onChange={(e) =>
                    handleFilterChange(
                      "job_type_id",
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  disabled={isJobTypesLoading}
                >
                  <option value="">All</option>
                  {!isJobTypesLoading &&
                    jobTypes?.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Min Amount Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Min Amount (BNB)
                </label>
                <input
                  type="number"
                  className="mt-1 w-full border rounded p-2"
                  onChange={(e) =>
                    handleFilterChange(
                      "min_amount",
                      e.target.value || undefined
                    )
                  }
                />
              </div>

              {/* Max Amount Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Max Amount (BNB)
                </label>
                <input
                  type="number"
                  className="mt-1 w-full border rounded p-2"
                  onChange={(e) =>
                    handleFilterChange(
                      "max_amount",
                      e.target.value || undefined
                    )
                  }
                />
              </div>

              {/* Status Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  className="mt-1 w-full border rounded p-2"
                  value={filterValues.status || ""}
                  onChange={(e) =>
                    handleFilterChange("status", e.target.value || undefined)
                  }
                >
                  {JOB_STATUSES.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            </aside>
          </div>
        </div>

        {/* Right Panel: Job List */}
        <section className="flex-1">
          <h2 className="text-4xl font-bold text-blue-800 mb-6 text-left">
            All Jobs
          </h2>

          {isLoading && (
            <p className="text-center text-gray-600">Loading jobs...</p>
          )}
          {error && (
            <p className="text-center text-red-600">Failed to load jobs.</p>
          )}

          {!isLoading && jobs && (
            <ul className="space-y-6">
              {jobs.length === 0 ? (
                <p className="text-gray-500">No jobs found.</p>
              ) : (
                jobs.map((job) => (
                  <li
                    key={job.id}
                    className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition duration-300 flex flex-col md:flex-row gap-6 items-start md:items-center"
                  >
                    <div className="flex-1">
                      <h4 className="text-2xl font-bold text-blue-700">
                        {job.title}
                      </h4>
                      <div className="mt-2 flex flex-wrap gap-2 items-center">
                        <span
                          className={`px-3 py-1 text-sm rounded-full ${getStatusBadgeClass(
                            job.status
                          )}`}
                        >
                          {job.status}
                        </span>
                        <span className="text-sm text-gray-500">
                          Created:{" "}
                          {formatDistanceToNow(new Date(job.created_at), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                      <p className="mt-4 text-gray-600 text-sm line-clamp-2">
                        {job.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-green-700 font-semibold text-xl">
                        {formatEther(job.amount)} BNB
                      </div>
                      <button
                        onClick={() =>
                          navigate(`${UrlMapping.detail}/${job.id}`)
                        }
                        className="mt-4 bg-blue-600 text-white py-2 px-6 rounded-md font-medium hover:bg-blue-700 transition duration-300"
                      >
                        View
                      </button>
                    </div>
                  </li>
                ))
              )}
            </ul>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AllJobsPage;

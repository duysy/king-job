import Footer from "@/components/Footer";
import NavigationBar from "@/components/NavBar";
import { useUploadFile } from "@/services/apis/auth";
import { useCreateJob, useJobTypes } from "@/services/apis/core";
import { Editor } from "@tinymce/tinymce-react";
import { parseEther } from "ethers";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";

const CreateJobPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const editRef = useRef<any>(null);
  const { data: jobTypes, isLoading: isJobTypesLoading } = useJobTypes();
  const { mutate: createJob, isPending } = useCreateJob();
  const { mutate: uploadFile, isPending: isPendingUploadFile } =
    useUploadFile();

  const [uploadedImage, setUploadedImage] = useState<string>("");
  const [infoValue, setInfoValue] = useState<string>("");

  const handleImageUpload = (file: File) => {
    const uploadData = new FormData();
    uploadData.append("file", file);

    uploadFile(uploadData, {
      onSuccess: (data) => {
        setUploadedImage(`${data.file_url}`);
      },
      onError: (error: any) => {
        alert(`Error uploading image: ${error.message}`);
      },
    });
  };

  const onSubmit = (data: any) => {
    data.image = uploadedImage;
    data.job_type = Number(data.job_type);
    data.amount = parseEther(data.amount.toString()).toString();
    data.info = infoValue;
    createJob(data, {
      onSuccess: () => {
        alert("Job created successfully!");
        reset();
        setUploadedImage("");
        setInfoValue("");
      },
      onError: (error: { message: any }) => {
        alert(`Error creating job: ${error.message}`);
      },
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <NavigationBar />
      <div className="flex justify-center items-center flex-1 py-16 px-6">
        <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-3xl">
          <h2 className="text-4xl font-bold text-blue-800 mb-8 text-center">
            Create a Job
          </h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Job Title */}
            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-700">
                Job Title
              </label>
              <input
                type="text"
                className="w-full mt-2 px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Enter job title"
                {...register("title", {
                  required: "Job title is required",
                })}
              />
              {errors.title?.message && (
                <p className="text-red-500">{String(errors.title.message)}</p>
              )}
            </div>

            {/* Job Type */}
            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-700">
                Job Type
              </label>
              <select
                className="w-full mt-2 px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                {...register("job_type", {
                  required: "Job type is required",
                })}
                disabled={isJobTypesLoading}
              >
                <option value="" disabled>
                  {isJobTypesLoading ? "Loading..." : "Select job type"}
                </option>
                {jobTypes?.map((type: any) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
              {errors.job_type?.message && (
                <p className="text-red-500">
                  {String(errors.job_type.message)}
                </p>
              )}
            </div>

            {/* Job Description */}
            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-700">
                Short Description
              </label>
              <textarea
                className="w-full mt-2 px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Short job description (plain text)"
                rows={5}
                {...register("description", {
                  required: "Description is required",
                })}
              ></textarea>
              {errors.description?.message && (
                <p className="text-red-500">
                  {String(errors.description.message)}
                </p>
              )}
            </div>

            {/* Detailed Info (TinyMCE) */}
            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Detailed Info (Rich Content)
              </label>
              <div className="border border-gray-300 rounded-md">
                <Editor
                  ref={editRef}
                  apiKey="7izjmy1cqcphsapox298nx58brynu3kw51ljtoaj677nd7at"
                  value={infoValue}
                  init={{
                    branding: false,
                    height: 500,
                    menubar: false,
                    plugins:
                      "link image media table codesample fullscreen preview code lists",

                    toolbar:
                      "undo redo | bold italic | alignleft aligncenter alignright | bullist numlist | link image media | fullscreen preview code",
                  }}
                  onEditorChange={(content) => {
                    setInfoValue(content);
                  }}
                />
              </div>
            </div>

            {/* Amount */}
            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-700">
                Amount (Payment)
              </label>
              <input
                type="number"
                step="0.00001"
                className="w-full mt-2 px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Enter payment amount"
                {...register("amount", {
                  required: "Amount is required",
                  valueAsNumber: true,
                  validate: (value) =>
                    value > 0 || "Amount must be greater than 0",
                })}
              />
              {errors.amount?.message && (
                <p className="text-red-500">{String(errors.amount.message)}</p>
              )}
            </div>

            {/* Job Image */}
            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-700">
                Job Image (Optional)
              </label>
              <input
                type="file"
                className="w-full mt-2 px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleImageUpload(file);
                  }
                }}
              />
              {isPendingUploadFile ? (
                <div className="mt-4">
                  <h4 className="text-lg font-medium text-gray-700">
                    Uploading...
                  </h4>
                  <div className="animate-pulse flex flex-col space-y-4">
                    <div className="h-48 bg-gray-200 rounded-md"></div>
                  </div>
                </div>
              ) : (
                uploadedImage && (
                  <div className="mt-4">
                    <h4 className="text-lg font-medium text-gray-700">
                      Preview:
                    </h4>
                    <p className="text-green-500 mt-2">
                      Image uploaded successfully!
                    </p>
                    <img
                      src={uploadedImage}
                      alt="Uploaded Preview"
                      className="w-full h-auto rounded-md shadow-md mt-2"
                    />
                  </div>
                )
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-yellow-400 text-blue-800 py-3 px-6 rounded-full font-semibold shadow-md hover:bg-yellow-500 hover:shadow-lg transition-all duration-300 mt-8"
              disabled={isPending}
            >
              {isPending ? "Submitting..." : "Create Job"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CreateJobPage;

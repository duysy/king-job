import NavigationBar from "@/components/NavBar";
import React, { useState } from "react";
import FindJobTab from "./components/FindJobTab";
import MyJobTab from "./components/MyJobTab";
import UserInfoTab from "./components/UserInfoTab";

const UserInfoPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("userInfo");

  return (
    <div className="bg-gradient-to-b from-blue-50 to-gray-50 min-h-screen">
      <NavigationBar />
      <div className="container mx-auto max-w-6xl p-6 mt-10">
        <div className="flex justify-center mb-8">
          <button
            className={`px-6 py-3 rounded-t-lg font-semibold focus:outline-none mx-1 ${
              activeTab === "userInfo"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("userInfo")}
          >
            User Info
          </button>

          <button
            className={`px-6 py-3 rounded-t-lg font-semibold focus:outline-none mx-1 ${
              activeTab === "myJob"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("myJob")}
          >
            My Jobs
          </button>

          <button
            className={`px-6 py-3 rounded-t-lg font-semibold focus:outline-none mx-1 ${
              activeTab === "findJob"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("findJob")}
          >
            My Work
          </button>
        </div>
        {activeTab === "userInfo" && <UserInfoTab />}
        {activeTab === "myJob" && <MyJobTab />}
        {activeTab === "findJob" && <FindJobTab />}
      </div>
    </div>
  );
};

export default UserInfoPage;

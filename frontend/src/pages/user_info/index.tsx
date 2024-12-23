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
      <div className="container mx-auto max-w-8xl p-6 mt-10">
        <div className="flex">
          {/* Left Sidebar */}
          <div className="max-w-xl bg-white shadow-lg rounded-lg p-4">
            <button
              className={`w-full text-left px-4 py-3 rounded-lg mb-2 font-semibold focus:outline-none ${
                activeTab === "userInfo"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setActiveTab("userInfo")}
            >
              User Info
            </button>
            <button
              className={`w-full text-left px-4 py-3 rounded-lg mb-2 font-semibold focus:outline-none ${
                activeTab === "myJob"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setActiveTab("myJob")}
            >
              My Jobs
            </button>
            <button
              className={`w-full text-left px-4 py-3 rounded-lg font-semibold focus:outline-none ${
                activeTab === "findJob"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setActiveTab("findJob")}
            >
              Find Work
            </button>
          </div>

          {/* Right Content Area */}
          <div className="w-3/4 ml-6">
            {activeTab === "userInfo" && <UserInfoTab />}
            {activeTab === "myJob" && <MyJobTab />}
            {activeTab === "findJob" && <FindJobTab />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfoPage;

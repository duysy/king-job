import React from "react";
import { Route, Routes } from "react-router-dom";
import { UrlMapping } from "./commons/url-mapping.common";
import ProtectedRoute from "./components/ProtectedRoute";
import AllJobsPage from "./pages/all_jobs";
import CreateJobPage from "./pages/create_job";
import HomePage from "./pages/home";
import HowToUsePage from "./pages/how_to_use";
import InfoPage from "./pages/info";
import JobDetailsPage from "./pages/job_details";
import JobFoundPage from "./pages/job_found";
import JobPickersPage from "./pages/job_picker";
import ResumePage from "./pages/resume";
import UserInfoPage from "./pages/user_info";

const Router: React.FC = () => {
  return (
    <Routes>
      <Route path={UrlMapping.home} element={<HomePage />} />
      <Route path={`${UrlMapping.detail}/:id`} element={<JobDetailsPage />} />
      <Route
        path={`${UrlMapping.job_picker}/:id`}
        element={<ProtectedRoute component={JobPickersPage} />}
      />{" "}
      <Route
        path={`${UrlMapping.job_found}/:id`}
        element={<ProtectedRoute component={JobFoundPage} />}
      />
      <Route path={UrlMapping.create} element={<CreateJobPage />} />
      <Route path={UrlMapping.info} element={<InfoPage />} />
      <Route path={UrlMapping.how_to_use} element={<HowToUsePage />} />
      <Route path={UrlMapping.jobs} element={<AllJobsPage />} />
      <Route
        path={UrlMapping.user_info}
        element={<ProtectedRoute component={UserInfoPage} />}
      />
      <Route
        path={`${UrlMapping.resume}/:walletAddress`}
        element={<ResumePage />}
      />
    </Routes>
  );
};

export default Router;

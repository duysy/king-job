import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-800 to-purple-800 text-white">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-2xl mb-8 text-center px-3">
        Oops! The page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="bg-purple-500 px-6 py-3 rounded-lg text-white hover:bg-purple-600"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFoundPage;

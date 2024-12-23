import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Router from "./Router";

const App: React.FC = () => {
  return (
    <div className="App">
      <Router />
      <ToastContainer />
    </div>
  );
};

export default App;

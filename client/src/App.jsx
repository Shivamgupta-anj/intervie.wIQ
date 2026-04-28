import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData } from "./redux/userSlice";

import Home from "./pages/Home";
import Auth from "./pages/Auth";
import InterviewPage from "./pages/InterviewPage";
import Step1SetUp from "./components/Step1SetUp";
import InterviewHistory from "./pages/interviewHistory";
import Pricing from "./pages/pricing";
import InterviewReport from "./pages/InterviewReport";


// export const ServerUrl = "http://localhost:5000";
// export const ServerUrl = "https://intervie-wiq.onrender.com"

export const ServerUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:5000"


function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      try {
        const result = await axios.get(
          ServerUrl + "/api/user/current-user",
          { withCredentials: true }
        );
        dispatch(setUserData(result.data));
      } catch (error) {
        console.log(error);
        dispatch(setUserData(null));
      }
    };
    getUser();
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route
        path="/interview"
        element={
          <Step1SetUp
            onStart={(data) => {
              navigate("/interview/start", { state: data });
            }}
          />
        }
      />
      <Route path="/interview/start" element={<InterviewPage />} />


      <Route path="/history" element={<InterviewHistory />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/history/report/:id" element={<InterviewReport />} />
    </Routes>
  );
}

export default App;
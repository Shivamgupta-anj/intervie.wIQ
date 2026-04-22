import React, { useEffect, useState } from "react";
import axios from "axios";

function InterviewPage() {
  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      // const res = await axios.get("http://localhost:5000/api/interview");
      const res = await axios.get("http://localhost:5000/interview");
      console.log(res.data);
      setInterviews(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">AI Mock Interviews</h1>

      {interviews.length === 0 ? (
        <p>No interviews found</p>
      ) : (
        <div className="space-y-4">
          {interviews.map((item, index) => (
            <div key={index} className="p-4 border rounded-lg shadow">
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default InterviewPage;
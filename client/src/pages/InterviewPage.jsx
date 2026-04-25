

// import React from "react";
// import { useLocation } from "react-router-dom";
// import Step2Interview from "../components/Step2Interview";

// function InterviewPage() {
//   const location = useLocation();
//   const data = location.state; // ← gets data passed from Step1SetUp

//   if (!data) {
//     return (
//       <div className="p-6">
//         <p>No interview data found. Please go back and start again.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">
//         Interview: {data.questions?.[0]?.question ? "Questions Ready" : "Loading..."}
//       </h1>

//       <p className="text-gray-600 mb-2">Interview ID: {data.interviewId}</p>
//       <p className="text-gray-600 mb-6">Welcome, {data.userName}</p>

//       <div className="space-y-4">
//         {data.questions?.map((q, index) => (
//           <div key={index} className="p-4 border rounded-lg shadow">
//             <p className="text-sm text-gray-400 mb-1">
//               Question {index + 1} — {q.difficulty} ({q.timeLimit}s)
//             </p>
//             <h2 className="text-lg font-semibold">{q.question}</h2>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default InterviewPage;

import React from "react";
import { useLocation } from "react-router-dom";
import Step2Interview from "../components/Step2Interview";

function InterviewPage() {
  const location = useLocation();
  const data = location.state;

  if (!data) {
    return (
      <div className="p-6">
        <p>No interview data found. Please go back and start again.</p>
      </div>
    );
  }

  return (
    <Step2Interview
      interviewData={data}
      onFinish={() => {
        console.log("Interview finished");
      }}
    />
  );
}

export default InterviewPage;
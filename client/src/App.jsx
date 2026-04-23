// // import React from 'react'
// // import { Route,Routes  } from 'react-router-dom' // 


// // import Home from './pages/Home'
// // import Auth from './pages/Auth'
// // import { useEffect } from 'react'
// // import  axios from 'axios'
// // import { useDispatch } from 'react-redux'
// // import { setUserData } from './redux/userSlice'
// // import InterviewPage from './pages/InterviewPage'

// // export const ServerUrl = "http://localhost:5000"
// // function App(){
// //   const dispatch = useDispatch()
// //   useEffect(()=>{
// //     const getUser = async()=>{
// //       try{
// //         const result = await axios.get(ServerUrl + "/api/user/current-user",{withCredentials:true})
// //         dispatch(setUserData(result.data))

// //       }catch(error){
// //         console.log(error)
// //         dispatch(setUserData(null))

// //       }

// //     }
// //     getUser()
// //   },[dispatch])
// //   return(
// //     <Routes>
// //       <Route path='/' element={<Home />} />
    
// //       <Route path='/auth' element={<Auth />} />

// //       <Route path='/interview' element={<InterviewPage />} />
// //     </Routes>
// //   )
// // }

// // export default App



// import React, { useEffect } from "react";
// import { Route, Routes } from "react-router-dom";
// import axios from "axios";
// import { useDispatch } from "react-redux";
// import { setUserData } from "./redux/userSlice";

// import Home from "./pages/Home";
// import Auth from "./pages/Auth";
// import InterviewPage from "./pages/InterviewPage";
// import Step1SetUp from "./components/Step1SetUp"; //  ADD THIS

// export const ServerUrl = "http://localhost:5000";

// function App() {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const getUser = async () => {
//       try {
//         const result = await axios.get(
//           ServerUrl + "/api/user/current-user",
//           { withCredentials: true }
//         );
//         dispatch(setUserData(result.data));
//       } catch (error) {
//         console.log(error);
//         dispatch(setUserData(null));
//       }
//     };

//     getUser();
//   }, [dispatch]);

//   return (
//     <Routes>
//       <Route path="/" element={<Home />} />
//       <Route path="/auth" element={<Auth />} />

//       {/*  Step 1 UI */}
//       <Route path="/interview" element={<Step1SetUp />} />

//       {/*  Actual Interview Page */}
//       <Route path="/interview/start" element={<InterviewPage />} />
//     </Routes>
//   );
// }

// export default App;


import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData } from "./redux/userSlice";

import Home from "./pages/Home";
import Auth from "./pages/Auth";
import InterviewPage from "./pages/InterviewPage";

// export const ServerUrl = "http://localhost:5000"; // ✅ Must be exactly this — no trailing slash

//  THIS LINE (FIXED IMPORT)
import Step1SetUp from "./components/Step1SetUp";

export const ServerUrl = "http://localhost:5000";

// ✅ Must be exactly this — no trailing slash
// export const ServerUrl = "http://localhost:5000"

function App() {
  const dispatch = useDispatch();

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

      {/*  Step1 Page */}
      <Route path="/interview" element={<Step1SetUp />} />

      {/*  Interview Page */}
      <Route path="/interview/start" element={<InterviewPage />} />
    </Routes>
  );
}

export default App;
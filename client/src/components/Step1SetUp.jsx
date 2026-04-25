
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaChartLine,
  FaFileUpload,
  FaMicrophoneAlt,
  FaUserTie,
  FaBriefcase,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const ServerUrl = "http://localhost:5000";
function Step1SetUp({onStart}) {
  const navigate = useNavigate();
  const {userData}=useSelector((state)=>state.user);
  const dispatch = useDispatch();

  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [mode, setMode] = useState("Technical");
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  // const [analyzing, setAnalyzing] = useState(false);
  // const [analysisDone, setAnalysisDone] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);

  // const handleUploadResume = async ()=>{
  //   if(!resumeFile || analyzing) return;
  //   setAnalyzing(true);
  //   const formData = new FormData();
  //   formData.append("resume", resumeFile);
  //   try{

  //     const result = await axios.post(ServerUrl + "/interview/resume", formData, {withCredentials:true});
  //     console.log(result.data);
  //     setRole(result.data.role || "");
  //     setExperience(result.data.experience || "");
  //     setProjects(result.data.projects || []);
  //     setSkills(result.data.skills || []);
  //     setAnalysisDone(true);
  //     setResumeText(result.data.resumeText || "");
  //     setAnalyzing(false);


  //   }catch(err){
  //     console.log(err)

  //   }
  // }
  // 🚀 Start Interview Handler
  // const handleStart = async() => {
  //   if (!role || !experience) {
  //     alert("Please fill role and experience");
  //     return;
  //   }

  //   navigate("/interview/start", {
  //     state: { role, experience, mode },
  //   });
  // };

  const handleStart = async() => {
    setLoading(true);
    try{

      const result = await axios.post(ServerUrl+"/api/interview/generate-questions",{role,experience,mode,resumeText,projects,skills},{withCredentials:true})

      console.log(result.data);

      if(userData){
        dispatch(setUserData({...userData,credits:result.data.creditsLeft}))
      }

      setLoading(false);
      onStart(result.data);



    }catch(err){

      console.log(err);
      setLoading(false);
    }

  }

  

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4"
    >
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl grid md:grid-cols-2 overflow-hidden">
        
        {/* LEFT SECTION */}
        <motion.div
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="bg-gradient-to-br from-green-50 to-green-100 p-12 flex flex-col justify-center"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            Start Your AI Interview
          </h2>

          <p className="text-gray-600 mb-10">
            Practice real interview scenarios powered by AI. Improve communication,
            technical skills, and confidence with personalized feedback.
          </p>

          <div className="space-y-5">
            {[
              {
                icon: <FaUserTie className="text-green-600 text-xl" />,
                text: "Choose Role & Experience",
              },
              {
                icon: <FaMicrophoneAlt className="text-green-600 text-xl" />,
                text: "Smart Voice Interview",
              },
              {
                icon: <FaChartLine className="text-green-600 text-xl" />,
                text: "Performance Analytics",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.15 }}
                whileHover={{ scale: 1.03 }}
                className="flex items-center space-x-4 bg-white p-4 rounded-xl shadow-sm"
              >
                {item.icon}
                <span className="text-gray-700 font-medium">
                  {item.text}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* RIGHT SECTION */}
        <motion.div
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="p-12 bg-white"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Interview Setup
          </h2>

          <div className="space-y-6">

            {/* Role Input */}
            <div className="relative">
              <FaUserTie className="absolute top-4 left-4 text-gray-400" />
              <input
                type="text"
                placeholder="Enter Role"
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>

            {/* Experience Input */}
            <div className="relative">
              <FaBriefcase className="absolute top-4 left-4 text-gray-400" />
              <input
                type="text"
                placeholder="Experience (e.g. 2 years)"
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              />
            </div>

            {/* Mode Select */}
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="w-full py-3 px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="Technical">Technical Interview</option>
              <option value="HR">HR Interview</option>
            </select>

            {/* Resume Upload */}
            <div
              onClick={() => document.getElementById("resumeUpload").click()}
              className="border-2 border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition"
            >
              <FaFileUpload className="text-4xl mx-auto text-green-600 mb-3" />

              <input
                type="file"
                id="resumeUpload"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => setResumeFile(e.target.files[0])}
              />



              <p className="text-gray-600 font-medium">
                {resumeFile
                  ? resumeFile.name
                  : "Upload Your Resume (PDF)"}
              </p>
            </div>
            {/* {!analysisDone &&(
              <motion.div 
              whileHover={{scale:1.02}}
              onClick={()=> document.getElementById("resumeUpload").click()}
              className="border-2 border-dased border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition">

                <FaFileUpload className="text-4xl mx-auto text-green-600 mb-3"/>

                <input type="file" id="resumeUpload" accept="application/pdf"  className="hidden" onChange={(e)=>setResumeFile(e.target.files[0])}/>

                <p className="text-gray-600 font-medium">
                  {resumeFile ? resumeFile.name : "Upload Your Resume (PDF)"}
                </p>

                {resumeFile&& (<motion.button 
                whileHover={{scale:1.02}}
                onClick={(e)=>{e.stopPropagation(); 
                  handleUploadResume()}}
                className="mt-4 bg-gray-900 text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition">
                  {analyzing ? "Analyzing..." : "Analyze Resume"}

                </motion.button>)}

              </motion.div>
            )}

            {analysisDone && (
              <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Resume Analysis Result
                </h3>

              </motion.div>
            )}
 */} 
            {/* {Projects.lenth > 0 && (
              <div>
                <p className="font-meduim text-gray-700 mb-1">
                  Projects:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  {projects.map((p,i)=>(
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>

            )} */}




            {/* Start Button */}
            <motion.button
              disabled={!role || !experience ||loading}
              onClick={handleStart}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              className="w-full disabled:bg-gray-600 bg-green-600 hover:bg-green-700 text-white py-3 rounded-full text-lg font-semibold transition duration-300 shadow-md"
            >
              {loading ? "Starting Interview..." : "Start Interview"}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Step1SetUp;
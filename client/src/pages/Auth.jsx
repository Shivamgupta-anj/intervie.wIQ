

import React from "react";
import {BsRobot} from "react-icons/bs"
import {IoSparkles} from "react-icons/io5"
import {motion} from "framer-motion"
import {FcGoogle} from "react-icons/fc"
// const {signInWithPopup} = await import("firebase/auth")
import { useNavigate } from "react-router-dom";
import { signInWithRedirect } from "firebase/auth"
import {auth,provider} from "../utils/firebase"
import axios from "axios"
import { ServerUrl } from "../App";
import { signInWithPopup } from "firebase/auth"  // ✅ change Redirect to Popup
import { useDispatch } from "react-redux"          // ✅ add this
import { setUserData } from "../redux/userSlice"   // ✅ add this
// import { useNavigate } from "react-router-dom" 
function Auth (){
  //  const navigate = useNavigate();
  const dispatch = useDispatch()  
   const navigate = useNavigate() 

  const handleGoogleAuth = async()=>{
      try{
        // const response = await signInWithRedirect(auth,provider)
        const response = await signInWithPopup(auth, provider) 
        // console.log(response)
        let User = response.user
        let name = User.displayName
        let email = User.email

        const result = await axios.post("https://intervie-wiq.onrender.com/api/auth/google",{name,email},{withCredentials:true})
        // console.log(result.data)

        //  navigate("/dashboard");
         dispatch(setUserData(result.data))  // ✅ save new user
            navigate("/")


      }catch(error){
        console.log(error)

      }
  }
    return (
      <div className="w-full min-h-creen bg-[#f3f3f3] flex items-center justify-center px-6 py-20">

        <motion.div 
        initial={{opacity : 0 , y:-40}}
        animate={{opacity:1,y:0}} transition={{duration:1.0}}
        
        className="w-full max-w-md p-8 rounded-3xl bg-white shadow-2xl border border-gray-200">

          <div className="flex items-center justify-center gap-3 mb-6">

            <div className="bg-black text-white p-2 rounded-lg">
              <BsRobot size={18}/>

            </div>
            <h2 className="font-semibold text-lg">InterviewIQ.AI</h2>

          </div>

          <h1 className="text-2xl md:text-3xl font-semobold text-center leading-sung mb-4">
            Continue with
            <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full inline-flex items-center gap-2">
              <IoSparkles size={16}/>
              AI Smart Interview
            </span>

          </h1>
          <p className="text-gray-500 text-center text-sm md:text-base leading-relaxed mb-8">
            Sign in to start AI mock interviews,
            track your progress, and unlock detailed performance insights.
          </p>
          

          <motion.button
          onClick={handleGoogleAuth}
          whileHover={{opacity:0.9, scale:1.03}}
          whileTap={{opacity:1,scale:0.98}}
          className="w-full flex item-center justify-center gap-3 py-3 bg-black text-white rounded-full shadow-md">

            <FcGoogle size={20}/>
            Continue with Google


          </motion.button>

        </motion.div>
      </div>
    )
}



export default Auth;

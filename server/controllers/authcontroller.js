
// // // import genToken from "../config/token.js"
// // // import User from "../models/usermodel.js"

// // // export const googleAuth = async(req,res)=>{
// // //     try{
// // //         const {name,email}=req.body
// // //         let user = await User.findOne({email})
// // //         if(!user){
// // //             user = await User.create({
// // //                 name , email
// // //             })
// // //         }

// // //         let token = await genToken(user._id)
// // //         res.cookie("token",token,{
// // //             httpOnly:true,
// // //             secure:false,
// // //             sameSite : "Lax",
// // //             maxAge:7*24*60*60*1000,
// // //         })
// // //         return res.status(200).json(user)

// // //     }catch(error){
// // //         return res.status(500).json({message:`Google auth Error ${error}`})

// // //     }

// // // }

// // // export const logOut = async(req,res)=>{
// // //     try{
// // //         await res.clearCookie("token")
// // //         return res.status(200).json({message:"LogOut Successfully"})

// // //     }catch(error){
// // //         return res.status(500).json({message:`LogOut Error ${error}`})

// // //     }

// // // }

// // import genToken from "../config/token.js"
// // import User from "../models/usermodel.js"

// // export const googleAuth = async (req, res) => {
// //     try {
// //         const { name, email } = req.body

// //         if (!name || !email) {
// //             return res.status(400).json({ message: "Name and email are required" })
// //         }

// //         let user = await User.findOne({ email })

// //         if (!user) {
// //             user = await User.create({ name, email })
// //         }

// //         const token = await genToken(user._id)

// //        res.cookie("token", token, {
// //     httpOnly: true,
// //     secure: false,
// //     sameSite: "lax",     // ✅ lowercase
// //     maxAge: 7 * 24 * 60 * 60 * 1000,
// // })

// //         return res.status(200).json(user)

// //     } catch (error) {
// //         return res.status(500).json({ message: `Google auth Error: ${error.message}` })
// //     }
// // }

// // export const logOut = async (req, res) => {
// //     try {
// //         res.clearCookie("token", {
// //             httpOnly: true,
// //             secure: false,
// //             sameSite: "lax",    // ✅ must match the same options used when setting
// //         })
// //         return res.status(200).json({ message: "Logged out successfully" })

// //     } catch (error) {
// //         return res.status(500).json({ message: `LogOut Error: ${error.message}` })
// //     }
// // }

// import User from "../models/usermodel.js";
// import genToken from "../config/token.js";

// export const googleAuth = async (req, res) => {
//   try {
//     const { name, email } = req.body;

//     // if (!name || !email) {
//     //   return res.status(400).json({ message: "Name and email required" });
//     // }

//     let user = await User.findOne({ email });

//     if (!user) {
//       user = await User.create({ name, email });
//     }

//     let token = await genToken(user._id);

//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: false, // set true in production (https)
//       sameSite: "lax",
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });

//     return res.status(200).json(user);
//   } catch (error) {
//     return res.status(500).json({ message : `Google auth Error: ${error.message}` });
//   }
// };

// export const logOut = async (req, res) => {
//   try {
//     await res.clearCookie("token", {
//       httpOnly: true,
//       secure: false,
//       sameSite: "lax",
//     });

//     return res.status(200).json({ message: "Logged out successfully" });
//   } catch (error) {
//     return res.status(500).json({ message : `LogOut Error: ${error.message}` });
//   }
// };

import User from "../models/usermodel.js";
import genToken from "../config/token.js";

export const googleAuth = async (req, res) => {
  try {
    console.log("✅ googleAuth hit");
    console.log("Body:", req.body);

    const { name, email } = req.body;

    if (!name || !email) {
      console.log("❌ Missing name or email");
      return res.status(400).json({ message: "Name and email required" });
    }

    let user = await User.findOne({ email });
    console.log("User found:", user);

    if (!user) {
      user = await User.create({ name, email });
      console.log("User created:", user);
    }

    let token = await genToken(user._id);
    console.log("Token:", token);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    console.log("✅ Cookie set, sending response");
    return res.status(200).json(user);

  } catch (error) {
    console.log("❌ Error:", error.message);
    return res.status(500).json({ message: `Google auth Error: ${error.message}` });
  }
};

export const logOut = async (req, res) => {
  try {
    res.clearCookie("token", {  // ✅ removed await (clearCookie is not async)
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: `LogOut Error: ${error.message}` });
  }
};
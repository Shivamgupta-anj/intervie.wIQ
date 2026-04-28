// import dotenv from "dotenv"

// dotenv.config()

// import Razorpay from "razorpay"

// const razorpay = new Razorpay({
// key_id: process.env.RAZORPAY_KEY_ID,
// key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// export default razorpay

import dotenv from "dotenv";
dotenv.config(); // ✅ Load env directly here as a safety net

import Razorpay from "razorpay";

console.log("Razorpay KEY:", process.env.RAZORPAY_KEY_ID);
console.log("Razorpay SECRET:", process.env.RAZORPAY_KEY_SECRET);

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export default razorpay;
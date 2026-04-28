// // // import Payment from "../models/payment.model";
// // // import razorpay from "../services/razorpay.service.js";
// // // import crypto from "crypto"

// // // export const createOrder = async (req,res)=>{
// // //     try{
// // //         const {planId,amount,credits}= req.bpdy;
// // //         if(!amount || !credits){
// // //             return res.status(400).json({message:"Invalid plan data"})
// // //         }

// // //         const options = {
// // //             amount : amount*100,
// // //             currency : "INR",
// // //             receipt:`receipt_${Date.now()}`
// // //         }

// // //         const order = await razorpay.orders.create(options)

// // //         await Payment. create({
// // //         userId: req.userId,
// // //         planId,
// // //         amount,
// // //         credits,
// // //         razorpayOrderId: order.id,
// // //         status: "created",
// // //         });

// // //         return res.json(order);

// // //     }catch(err){
// // //         return res.status(500).json({message: `failed to create Razorpay Order ${error} `})

// // //     }
// // // }



// // // export const verifyPayment = async (req,res)=>{
// // //     try{
// // //         const {razorpay_order_id,
// // //             razorpay_payment_id,
// // //             razorpay_signature
// // //         }=req.body

// // //         const body = razorpay_order_id + "|" + razorpay_payment_id;

// // //         const expectedSignature = crypto
// // //         .createHmac("sha256",process.env.RAZORPAY_KEY_SECRET)
// // //         .update(body)
// // //         .digest("hex");

// // //         if(expectedSignature !== razorpay_signature){
// // //             return res.status(400).json({message:"Inavlid signature"})
// // //         }


// // //         const payment = await Payment. findOne({
// // //             razorpayOrderId: razorpay_order_id,
// // //         });

// // //         if (!payment) {
// // //             return res.status(404).json({ message: "Payment not found" });
// // //         }

// // //         if (payment.status === "paid") {
// // //             return res.json({ message: "Already processed" });
// // //         }

// // //         // update payment record
       

// // //         payment.status = "paid";
// // //         payment.razorpayPaymentId = razorpay_payment_id;
// // //         await payment.save();
            
// // //         // Add credits to user
// // //         const updatedUser = await User. findByIdAndUpdate(payment.userId, {
// // //         $inc: { credits: payment.credits }
// // //         }, {new: true});

// // //         res.json({
// // //             success: true,
// // //             message: "Payment verified and credits added",
// // //             user: updatedUser,
// // //         });

// // //     } catch(err){
// // //         return res.status(500).json ({message:`failed to verify Razorpay order ${error}`})

// // //     }
// // // }

// // import Payment from "../models/payment.model.js"; // ✅ Fix 1: Added .js extension
// // import User from "../models/usermodel.js";        // ✅ Fix 2: User was never imported!
// // import razorpay from "../services/razorpay.service.js";
// // import crypto from "crypto";

// // export const createOrder = async (req, res) => {
// //   try {
// //     const { planId, amount, credits } = req.body; // ✅ Fix 3: `req.bpdy` → `req.body`

// //     if (!amount || !credits) {
// //       return res.status(400).json({ message: "Invalid plan data" });
// //     }

// //     const options = {
// //       amount: amount * 100,
// //       currency: "INR",
// //       receipt: `receipt_${Date.now()}`,
// //     };

// //     const order = await razorpay.orders.create(options);

// //     await Payment.create({
// //       userId: req.userId,
// //       planId,
// //       amount,
// //       credits,
// //       razorpayOrderId: order.id,
// //       status: "created",
// //     });

// //     return res.json(order);

// //   } catch (err) {
// //     return res.status(500).json({ message: `Failed to create Razorpay Order: ${err.message}` }); // ✅ Fix 4: `error` → `err.message`
// //   }
// // };


// // export const verifyPayment = async (req, res) => {
// //   try {
// //     const {
// //       razorpay_order_id,
// //       razorpay_payment_id,
// //       razorpay_signature,
// //     } = req.body;

// //     const body = razorpay_order_id + "|" + razorpay_payment_id;

// //     const expectedSignature = crypto
// //       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
// //       .update(body)
// //       .digest("hex");

// //     if (expectedSignature !== razorpay_signature) {
// //       return res.status(400).json({ message: "Invalid signature" });
// //     }

// //     const payment = await Payment.findOne({
// //       razorpayOrderId: razorpay_order_id,
// //     });

// //     if (!payment) {
// //       return res.status(404).json({ message: "Payment not found" });
// //     }

// //     if (payment.status === "paid") {
// //       return res.json({ message: "Already processed" });
// //     }

// //     payment.status = "paid";
// //     payment.razorpayPaymentId = razorpay_payment_id;
// //     await payment.save();

// //     const updatedUser = await User.findByIdAndUpdate(
// //       payment.userId,
// //       { $inc: { credits: payment.credits } },
// //       { new: true }
// //     );

// //     res.json({
// //       success: true,
// //       message: "Payment verified and credits added",
// //       user: updatedUser,
// //     });

// //   } catch (err) {
// //     return res.status(500).json({ message: `Failed to verify Razorpay order: ${err.message}` }); // ✅ Fix 5: `error` → `err.message`
// //   }
// // };

// import Payment from "../models/payment.model.js";
// import User from "../models/user.js";              // ✅ Fix 2: User was never imported!
// import razorpay from "../services/razorpay.service.js";
// import crypto from "crypto";

// export const createOrder = async (req, res) => {
//   try {
//     const { planId, amount, credits } = req.body; // ✅ Fix 3: `req.bpdy` → `req.body`

//     if (!amount || !credits) {
//       return res.status(400).json({ message: "Invalid plan data" });
//     }

//     const options = {
//       amount: amount * 100,
//       currency: "INR",
//       receipt: `receipt_${Date.now()}`,
//     };

//     const order = await razorpay.orders.create(options);

//     await Payment.create({
//       userId: req.userId,
//       planId,
//       amount,
//       credits,
//       razorpayOrderId: order.id,
//       status: "created",
//     });

//     return res.json(order);

//   } catch (err) {
//     return res.status(500).json({ message: `Failed to create Razorpay Order: ${err.message}` }); // ✅ Fix 4: `error` → `err.message`
//   }
// };


// export const verifyPayment = async (req, res) => {
//   try {
//     const {
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//     } = req.body;

//     const body = razorpay_order_id + "|" + razorpay_payment_id;

//     const expectedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(body)
//       .digest("hex");

//     if (expectedSignature !== razorpay_signature) {
//       return res.status(400).json({ message: "Invalid signature" });
//     }

//     const payment = await Payment.findOne({
//       razorpayOrderId: razorpay_order_id,
//     });

//     if (!payment) {
//       return res.status(404).json({ message: "Payment not found" });
//     }

//     if (payment.status === "paid") {
//       return res.json({ message: "Already processed" });
//     }

//     payment.status = "paid";
//     payment.razorpayPaymentId = razorpay_payment_id;
//     await payment.save();

//     const updatedUser = await User.findByIdAndUpdate(
//       payment.userId,
//       { $inc: { credits: payment.credits } },
//       { new: true }
//     );

//     res.json({
//       success: true,
//       message: "Payment verified and credits added",
//       user: updatedUser,
//     });

//   } catch (err) {
//     return res.status(500).json({ message: `Failed to verify Razorpay order: ${err.message}` }); // ✅ Fix 5: `error` → `err.message`
//   }
// };

import Payment from "../models/payment.model.js";
import User from "../models/usermodel.js";
import razorpay from "../services/razorpay.service.js";
import crypto from "crypto";
// ADD THESE TWO LINES HERE ↓
console.log("KEY:", process.env.RAZORPAY_KEY_ID);
console.log("SECRET:", process.env.RAZORPAY_KEY_SECRET);
export const createOrder = async (req, res) => {
  try {
    const { planId, amount, credits } = req.body; // ✅ Fix 3: `req.bpdy` → `req.body`

    if (!amount || !credits) {
      return res.status(400).json({ message: "Invalid plan data" });
    }

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    await Payment.create({
      userId: req.userId,
      planId,
      amount,
      credits,
      razorpayOrderId: order.id,
      status: "created",
    });

    return res.json(order);

  } catch (err) {
    console.error("createOrder error:", err);
    return res.status(500).json({ message: `Failed to create Razorpay Order: ${err.message}` }); // ✅ Fix 4: `error` → `err.message`
  }
};


export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    const payment = await Payment.findOne({
      razorpayOrderId: razorpay_order_id,
    });

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    if (payment.status === "paid") {
      return res.json({ message: "Already processed" });
    }

    payment.status = "paid";
    payment.razorpayPaymentId = razorpay_payment_id;
    await payment.save();

    const updatedUser = await User.findByIdAndUpdate(
      payment.userId,
      { $inc: { credits: payment.credits } },
      { new: true }
    );

    res.json({
      success: true,
      message: "Payment verified and credits added",
      user: updatedUser,
    });

  } catch (err) {
    return res.status(500).json({ message: `Failed to verify Razorpay order: ${err.message}` }); // ✅ Fix 5: `error` → `err.message`
  }
};
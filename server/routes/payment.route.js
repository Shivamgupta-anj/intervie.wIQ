// import express from "express"
// import isAuth from " .. /middlewares/isAuth.js"
// import { createOrder, verifyPayment } from " .. /controllers/payment.controller.js"

// const paymentRouter = express. Router()

// paymentRouter.post("/order" , isAuth , createOrder )
// paymentRouter.post("/verify" , isAuth , verifyPayment)



// export default paymentRouter

import express from "express";
import isAuth from "../middlewares/isAuth.js";     // ✅ Fix 6: Removed spaces in path " .. /" → "../"
import { createOrder, verifyPayment } from "../controllers/payment.controller.js"; // ✅ Fix 6: Same

const paymentRouter = express.Router();

paymentRouter.post("/order", isAuth, createOrder);
paymentRouter.post("/verify", isAuth, verifyPayment);

export default paymentRouter;
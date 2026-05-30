import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();

const RAZORPAY_KEY = process.env.RAZORPAY_KEY;
const RAZORPAY_SECRET = process.env.RAZORPAY_SECRET;

const razorpay = new Razorpay({
    key_id: RAZORPAY_KEY,
    key_secret: RAZORPAY_SECRET,
});

export default razorpay;
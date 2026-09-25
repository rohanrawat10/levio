import payments from "razorpay/dist/types/payments";
import Payment from "../models/payment.mdel";
import razorpay from "../services/razorpay.service";

export const createOrder = async(req,res)=>{
    try{
      const {planId,amount,credits} = req.body;
      if(!amount || !credits){
        return res.status(400).json({message:"Invalid Plan Data"})
      }

      const options = {
        amount:amount * 100,//convert to paise
        currency:"INR",
        receipt:`receipt_${Date.now}`
      }

      const order = await razorpay.orders.create(options);
      await Payment.create({
        userId:req.userId,
        planId,
        amount,
        credits,
        razorpayOrderId:order.id,
        status:"created"
      })
      res.json
    }
    catch(err){
        res.status(500).json({message:`failed ot create Razorpay order: ${err}`})
    }
}

export const verifyPayment = async(req,res)=>{
    try{
        const{razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;
       const body = razorpay_order_id + "|" + razorpay_payment_id;
       const expectedSignature = crypto
       .CreateHmac("sha256",process.env.RAZORPAY_KEY_SECRET)
       .update(body)
       .digest("hex");

       if(expectedSignature !== razorpay_signature){
        return res.status(400).json({message:"Invalid payment signature"})
       }

       const payment = await Payment.findOne({
        razorpayOrderId:razorpay_order_id,
       });
       if(!payment){
        return res.json({message:"Already processed"});
       }

       //update payment record
     payment.status = "paid";
     payment.razorpayPaymentId  = razorpay_payment_id;
     await payment.save();

     // add credits to user
     const updateUser = await User.findByIdAndUpdate(payment.userId,{
        $inc:{credits:payment.credits}
     },{new:true})

     res.json({
        success:true,
        message:"Payment verified and credits added",
        user:updateUser,
     })

    }
    catch(err){
        res.status(500).json({message:`verify payment error ${err}`})
    }
}
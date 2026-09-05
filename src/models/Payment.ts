import mongoose, { Schema, Document, Model } from "mongoose";

export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";
export type PaymentGateway = "RAZORPAY" | "STRIPE";

export interface IPayment extends Document {
  userId: mongoose.Types.ObjectId;
  verificationRequestId?: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  gateway: PaymentGateway;
  transactionId: string;
  orderId?: string;
  paymentSignature?: string;
  status: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    verificationRequestId: { type: Schema.Types.ObjectId, ref: "VerificationRequest" },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "INR" },
    gateway: { type: String, enum: ["RAZORPAY", "STRIPE"], required: true },
    transactionId: { type: String, required: true, unique: true },
    orderId: { type: String },
    paymentSignature: { type: String },
    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED", "REFUNDED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

PaymentSchema.index({ userId: 1, verificationRequestId: 1, transactionId: 1 });

const Payment: Model<IPayment> =
  mongoose.models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema);

export default Payment;

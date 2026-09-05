import mongoose, { Schema, Document, Model } from "mongoose";

export type VerificationRequestStatus =
  | "PENDING"
  | "ACCEPTED"
  | "IN_REVIEW"
  | "NEEDS_CLARIFICATION"
  | "RE_SUBMITTED"
  | "VERIFIED"
  | "REJECTED";

export interface IVerificationRemark {
  authorId: mongoose.Types.ObjectId;
  comment: string;
  createdAt: Date;
}

export interface IVerificationRequest extends Document {
  propertyId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  lawyerId: mongoose.Types.ObjectId;
  documents: mongoose.Types.ObjectId[];
  amount: number;
  status: VerificationRequestStatus;
  remarks: IVerificationRemark[];
  paymentId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const RemarkSchema = new Schema<IVerificationRemark>(
  {
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const VerificationRequestSchema = new Schema<IVerificationRequest>(
  {
    propertyId: { type: Schema.Types.ObjectId, ref: "Property", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    lawyerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    documents: [{ type: Schema.Types.ObjectId, ref: "Document" }],
    amount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: [
        "PENDING",
        "ACCEPTED",
        "IN_REVIEW",
        "NEEDS_CLARIFICATION",
        "RE_SUBMITTED",
        "VERIFIED",
        "REJECTED",
      ],
      default: "PENDING",
    },
    remarks: [RemarkSchema],
    paymentId: { type: Schema.Types.ObjectId, ref: "Payment" },
  },
  { timestamps: true }
);

VerificationRequestSchema.index({ userId: 1, lawyerId: 1, propertyId: 1, status: 1 });

const VerificationRequest: Model<IVerificationRequest> =
  mongoose.models.VerificationRequest ||
  mongoose.model<IVerificationRequest>("VerificationRequest", VerificationRequestSchema);

export default VerificationRequest;

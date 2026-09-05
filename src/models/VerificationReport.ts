import mongoose, { Schema, Document, Model } from "mongoose";

export type ReportDecision = "APPROVED" | "REJECTED";

export interface IVerificationReport extends Document {
  verificationRequestId: mongoose.Types.ObjectId;
  propertyId: mongoose.Types.ObjectId;
  lawyerId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  status: ReportDecision;
  summary: string;
  findings: string[];
  limitations?: string;
  reportFileUrl?: string;
  issuedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const VerificationReportSchema = new Schema<IVerificationReport>(
  {
    verificationRequestId: {
      type: Schema.Types.ObjectId,
      ref: "VerificationRequest",
      required: true,
      unique: true,
    },
    propertyId: { type: Schema.Types.ObjectId, ref: "Property", required: true },
    lawyerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["APPROVED", "REJECTED"], required: true },
    summary: { type: String, required: true },
    findings: [{ type: String }],
    limitations: { type: String },
    reportFileUrl: { type: String },
    issuedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

VerificationReportSchema.index({ propertyId: 1, lawyerId: 1, userId: 1 });

const VerificationReport: Model<IVerificationReport> =
  mongoose.models.VerificationReport ||
  mongoose.model<IVerificationReport>("VerificationReport", VerificationReportSchema);

export default VerificationReport;

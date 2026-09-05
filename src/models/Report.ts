import mongoose, { Schema, Document, Model } from "mongoose";

export type ReportTargetType = "PROPERTY" | "USER" | "LAWYER" | "DOCUMENT";
export type ReportStatus = "PENDING" | "INVESTIGATING" | "RESOLVED" | "DISMISSED";

export interface IReport extends Document {
  reporterId: mongoose.Types.ObjectId;
  targetType: ReportTargetType;
  targetId: mongoose.Types.ObjectId;
  reason: string;
  description?: string;
  status: ReportStatus;
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema = new Schema<IReport>(
  {
    reporterId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    targetType: {
      type: String,
      enum: ["PROPERTY", "USER", "LAWYER", "DOCUMENT"],
      required: true,
    },
    targetId: { type: Schema.Types.ObjectId, required: true },
    reason: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["PENDING", "INVESTIGATING", "RESOLVED", "DISMISSED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

ReportSchema.index({ status: 1, targetType: 1 });

const Report: Model<IReport> =
  mongoose.models.Report || mongoose.model<IReport>("Report", ReportSchema);

export default Report;

import mongoose, { Schema, Document, Model } from "mongoose";

export type AppointmentType = "PROPERTY_VISIT" | "LAWYER_CONSULTATION";
export type AppointmentStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";

export interface IAppointment extends Document {
  userId: mongoose.Types.ObjectId;
  propertyId?: mongoose.Types.ObjectId;
  lawyerId?: mongoose.Types.ObjectId;
  sellerId?: mongoose.Types.ObjectId;
  type: AppointmentType;
  date: Date;
  status: AppointmentStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    propertyId: { type: Schema.Types.ObjectId, ref: "Property" },
    lawyerId: { type: Schema.Types.ObjectId, ref: "User" },
    sellerId: { type: Schema.Types.ObjectId, ref: "User" },
    type: {
      type: String,
      enum: ["PROPERTY_VISIT", "LAWYER_CONSULTATION"],
      required: true,
    },
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"],
      default: "PENDING",
    },
    notes: { type: String },
  },
  { timestamps: true }
);

AppointmentSchema.index({ userId: 1, date: 1 });

const Appointment: Model<IAppointment> =
  mongoose.models.Appointment || mongoose.model<IAppointment>("Appointment", AppointmentSchema);

export default Appointment;

import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISystemConfig extends Document {
  key: string;
  value: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SystemConfigSchema = new Schema<ISystemConfig>(
  {
    key: { type: String, required: true, unique: true },
    value: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

const SystemConfig: Model<ISystemConfig> =
  mongoose.models.SystemConfig ||
  mongoose.model<ISystemConfig>("SystemConfig", SystemConfigSchema);

export default SystemConfig;

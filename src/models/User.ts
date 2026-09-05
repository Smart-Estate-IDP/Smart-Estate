import mongoose, { Schema, Document, Model } from "mongoose";

export type UserRole = "USER" | "LAWYER" | "ADMIN";

export interface IUser extends Document {
  name: string;
  email: string;
  phone?: string;
  password?: string; // Optional if using OAuth in future
  role: UserRole;
  avatar?: string;
  savedProperties: mongoose.Types.ObjectId[];
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    password: { type: String },
    role: { type: String, enum: ["USER", "LAWYER", "ADMIN"], default: "USER" },
    avatar: { type: String },
    savedProperties: [{ type: Schema.Types.ObjectId, ref: "Property" }],
    isEmailVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;

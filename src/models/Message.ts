import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMessage extends Document {
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  verificationRequestId?: mongoose.Types.ObjectId;
  propertyId?: mongoose.Types.ObjectId;
  content: string;
  attachments?: string[];
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    verificationRequestId: { type: Schema.Types.ObjectId, ref: "VerificationRequest" },
    propertyId: { type: Schema.Types.ObjectId, ref: "Property" },
    content: { type: String, required: true },
    attachments: [{ type: String }],
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

MessageSchema.index({ senderId: 1, receiverId: 1 });
MessageSchema.index({ verificationRequestId: 1 });

const Message: Model<IMessage> =
  mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);

export default Message;

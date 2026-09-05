import mongoose, { Schema, Document as MongooseDocument, Model } from "mongoose";

export type DocumentType =
  | "SALE_DEED"
  | "TITLE_DEED"
  | "ENCUMBRANCE_CERTIFICATE"
  | "TAX_RECEIPT"
  | "OWNERSHIP_DOC"
  | "BUILDING_APPROVAL"
  | "OTHER";

export type DocumentStatus = "PENDING" | "VERIFIED" | "REJECTED" | "NEEDS_CLARIFICATION";

export interface IDocument extends MongooseDocument {
  propertyId: mongoose.Types.ObjectId;
  uploaderId: mongoose.Types.ObjectId;
  title: string;
  documentType: DocumentType;
  fileUrl: string;
  fileType: string;
  fileSize?: number;
  status: DocumentStatus;
  remarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DocumentSchema = new Schema<IDocument>(
  {
    propertyId: { type: Schema.Types.ObjectId, ref: "Property", required: true },
    uploaderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    documentType: {
      type: String,
      enum: [
        "SALE_DEED",
        "TITLE_DEED",
        "ENCUMBRANCE_CERTIFICATE",
        "TAX_RECEIPT",
        "OWNERSHIP_DOC",
        "BUILDING_APPROVAL",
        "OTHER",
      ],
      required: true,
    },
    fileUrl: { type: String, required: true },
    fileType: { type: String, required: true },
    fileSize: { type: Number },
    status: {
      type: String,
      enum: ["PENDING", "VERIFIED", "REJECTED", "NEEDS_CLARIFICATION"],
      default: "PENDING",
    },
    remarks: { type: String },
  },
  { timestamps: true }
);

DocumentSchema.index({ propertyId: 1, uploaderId: 1 });

const Document: Model<IDocument> =
  mongoose.models.Document || mongoose.model<IDocument>("Document", DocumentSchema);

export default Document;

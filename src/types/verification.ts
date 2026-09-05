import { UserDTO } from "./user";
import { PropertyDTO } from "./property";

export type VerificationRequestStatus =
  | "PENDING"
  | "ACCEPTED"
  | "IN_REVIEW"
  | "NEEDS_CLARIFICATION"
  | "RE_SUBMITTED"
  | "VERIFIED"
  | "REJECTED";

export interface VerificationRemarkDTO {
  _id?: string;
  authorId: string | UserDTO;
  comment: string;
  createdAt: string;
}

export interface VerificationRequestDTO {
  _id: string;
  id?: string;
  propertyId: string | PropertyDTO;
  userId: string | UserDTO;
  lawyerId: string | UserDTO;
  documents: string[];
  amount: number;
  status: VerificationRequestStatus;
  remarks: VerificationRemarkDTO[];
  paymentId?: string;
  createdAt?: string;
  updatedAt?: string;
}

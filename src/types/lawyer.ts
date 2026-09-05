import { UserDTO } from "./user";

export interface LawyerProfileDTO {
  _id: string;
  id?: string;
  userId: string | UserDTO;
  licenseNumber: string;
  specialization: string[];
  experienceYears: number;
  credentials: string[];
  bio?: string;
  verificationFee: number;
  rating: number;
  reviewCount: number;
  verifiedCount: number;
  verified: boolean;
  createdAt?: string;
  updatedAt?: string;
}

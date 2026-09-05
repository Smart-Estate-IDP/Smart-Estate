import { UserDTO } from "./user";

export type PropertyStatus = "PENDING_APPROVAL" | "PUBLISHED" | "SOLD" | "REJECTED";
export type VerificationStatus = "UNVERIFIED" | "IN_PROGRESS" | "VERIFIED" | "REJECTED";
export type PropertyType = "APARTMENT" | "HOUSE" | "VILLA" | "PLOT" | "COMMERCIAL" | "OTHER";

export interface PropertyDTO {
  _id: string;
  id?: string;
  ownerId: string | UserDTO;
  title: string;
  description: string;
  price: number;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  propertyType: PropertyType;
  area: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  status: PropertyStatus;
  verificationStatus: VerificationStatus;
  images: string[];
  createdAt?: string;
  updatedAt?: string;
}

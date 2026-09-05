export type UserRole = "USER" | "LAWYER" | "ADMIN";

export interface UserDTO {
  _id: string;
  id?: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  savedProperties?: string[];
  isEmailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

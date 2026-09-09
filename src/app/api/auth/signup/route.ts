import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import LawyerProfile from "@/models/LawyerProfile";
import { hashPassword, signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, email, password, phone, role = "USER", licenseNumber, experienceYears, verificationFee } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User with this email already exists" },
        { status: 409 }
      );
    }

    const totalUsersCount = await User.countDocuments();
    // Only the very first registered user on a fresh DB is auto-admin; all others must provide the admin secret key
    const assignedRole =
      totalUsersCount === 0
        ? "ADMIN"
        : (role.toUpperCase() === "LAWYER" ? "LAWYER" : "USER");

    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
      role: assignedRole,
    });

    // If Lawyer role, create LawyerProfile record
    if (user.role === "LAWYER") {
      if (!licenseNumber) {
        await User.findByIdAndDelete(user._id);
        return NextResponse.json(
          { success: false, message: "License number is required for lawyer registration" },
          { status: 400 }
        );
      }

      await LawyerProfile.create({
        userId: user._id,
        licenseNumber,
        experienceYears: experienceYears || 0,
        verificationFee: verificationFee || 1000,
        verified: false, // Must be approved by admin
      });
    }

    const token = await signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });

    // Clear any legacy cookie so browser tabs do not share sessions via shared cookies
    response.cookies.set("token", "", {
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to register user" },
      { status: 500 }
    );
  }
}

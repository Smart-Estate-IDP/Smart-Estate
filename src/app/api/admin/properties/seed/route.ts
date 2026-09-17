import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Property from "@/models/Property";
import User from "@/models/User";
import { getAuthUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser || authUser.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Forbidden: Admin access required" }, { status: 403 });
    }

    await connectDB();

    // Find or fallback to admin user as owner
    let seller = await User.findOne({ role: "USER" });
    if (!seller) {
      seller = await User.findById(authUser.userId);
    }
    if (!seller) {
      return NextResponse.json({ success: false, message: "No user found to associate listings" }, { status: 400 });
    }

    const sampleProperties = [
      {
        ownerId: seller._id,
        title: "Sea-Facing Luxury Sky Villa (Owner Selling)",
        description: "Direct owner listing with clear 30-year mother deed and OC. Panoramic Arabian Sea views with Italian marble flooring and private plunge pool.",
        price: 48500000,
        location: {
          address: "Carter Road, Bandra West",
          city: "Mumbai",
          state: "Maharashtra",
          zipCode: "400050",
        },
        propertyType: "VILLA",
        area: 3200,
        bedrooms: 4,
        bathrooms: 4,
        amenities: ["Sea View", "Private Elevator", "Gym", "Concierge", "2 Car Parks"],
        status: "PUBLISHED",
        verificationStatus: "VERIFIED",
        isFeatured: true,
        images: [
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
        ],
      },
      {
        ownerId: seller._id,
        title: "Greenwood Lakeview Penthouse (Selling/Renting)",
        description: "Corner penthouse overlooking peaceful lake. 100% Vaastu compliant, fully furnished with smart home automation and clubhouse access.",
        price: 24000000,
        location: {
          address: "ITPL Main Road, Whitefield",
          city: "Bangalore",
          state: "Karnataka",
          zipCode: "560066",
        },
        propertyType: "APARTMENT",
        area: 2150,
        bedrooms: 3,
        bathrooms: 3,
        amenities: ["Lake View", "Clubhouse", "Tennis Court", "Power Backup", "RERA Approved"],
        status: "PUBLISHED",
        verificationStatus: "VERIFIED",
        isFeatured: true,
        images: [
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
        ],
      },
      {
        ownerId: seller._id,
        title: "Royal Grand Heritage Manor (Exclusive Sale)",
        description: "Custom architect-designed bungalow on prime corner plot. Clean mutation extract, free from encumbrance or agricultural conversion disputes.",
        price: 65000000,
        location: {
          address: "Road No. 36, Jubilee Hills",
          city: "Hyderabad",
          state: "Telangana",
          zipCode: "500033",
        },
        propertyType: "HOUSE",
        area: 4500,
        bedrooms: 5,
        bathrooms: 5,
        amenities: ["Private Garden", "Servant Quarters", "Solar Power", "Borewell", "Security System"],
        status: "PUBLISHED",
        verificationStatus: "VERIFIED",
        isFeatured: false,
        images: [
          "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
        ],
      },
      {
        ownerId: seller._id,
        title: "Pinnacle Panorama Skyline Residence (For Rent/Lease)",
        description: "Ultra-luxury modern apartment with high-end designer modular kitchen, floor-to-ceiling soundproof glass, and infinity pool access.",
        price: 18500000,
        location: {
          address: "Lane 7, Koregaon Park",
          city: "Pune",
          state: "Maharashtra",
          zipCode: "411001",
        },
        propertyType: "APARTMENT",
        area: 1750,
        bedrooms: 3,
        bathrooms: 3,
        amenities: ["Infinity Pool", "Yoga Deck", "High Speed Lifts", "24x7 Security"],
        status: "PENDING_APPROVAL",
        verificationStatus: "IN_PROGRESS",
        isFeatured: false,
        images: [
          "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=800&q=80",
        ],
      },
    ];

    const created = await Property.insertMany(sampleProperties);

    return NextResponse.json({
      success: true,
      message: `Created ${created.length} sample user listings successfully`,
      count: created.length,
      properties: created,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to seed sample properties" },
      { status: 500 }
    );
  }
}

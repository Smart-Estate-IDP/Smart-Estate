import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Property from "@/models/Property";
import { getAuthUser } from "@/lib/auth";

// GET /api/properties (Filter & Search)
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const city = searchParams.get("city");
    const propertyType = searchParams.get("propertyType");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const status = searchParams.get("status") || "PUBLISHED";

    const filter: any = {};

    if (status !== "ALL") {
      filter.status = status;
    }

    if (city) {
      filter["location.city"] = { $regex: city, $options: "i" };
    }

    if (propertyType) {
      filter.propertyType = propertyType.toUpperCase();
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { "location.address": { $regex: search, $options: "i" } },
        { "location.city": { $regex: search, $options: "i" } },
      ];
    }

    const properties = await Property.find(filter)
      .populate("ownerId", "name email phone avatar")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: properties.length,
      properties,
    });
  } catch (error: any) {
    console.error("Fetch properties error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch properties" },
      { status: 500 }
    );
  }
}

// POST /api/properties (Create Property)
export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();

    const {
      title,
      description,
      price,
      location,
      propertyType,
      area,
      bedrooms,
      bathrooms,
      amenities,
      images,
    } = body;

    if (!title || !description || !price || !location || !propertyType || !area) {
      return NextResponse.json(
        { success: false, message: "Missing required property fields" },
        { status: 400 }
      );
    }

    const newProperty = await Property.create({
      ownerId: authUser.userId,
      title,
      description,
      price,
      location,
      propertyType: propertyType.toUpperCase(),
      area,
      bedrooms: bedrooms || 0,
      bathrooms: bathrooms || 0,
      amenities: amenities || [],
      images: images || [],
      status: "PENDING_APPROVAL", // Requires admin approval or published directly
    });

    return NextResponse.json(
      {
        success: true,
        message: "Property listing created successfully",
        property: newProperty,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Create property error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create property" },
      { status: 500 }
    );
  }
}

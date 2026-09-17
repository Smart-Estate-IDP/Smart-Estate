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
    const listingType = searchParams.get("listingType");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const bedrooms = searchParams.get("bedrooms");
    const status = searchParams.get("status");

    const filter: any = {};

    if (status && status !== "ALL") {
      filter.status = status;
    } else if (!status) {
      // Show published and pending approval by default for user visibility
      filter.status = { $in: ["PUBLISHED", "PENDING_APPROVAL"] };
    }

    if (city && city !== "ALL") {
      filter["location.city"] = { $regex: city, $options: "i" };
    }

    if (propertyType && propertyType !== "ALL") {
      filter.propertyType = propertyType.toUpperCase();
    }

    if (bedrooms && bedrooms !== "ALL") {
      const bedNum = Number(bedrooms);
      if (!isNaN(bedNum)) {
        if (bedNum >= 4) {
          filter.bedrooms = { $gte: 4 };
        } else {
          filter.bedrooms = bedNum;
        }
      }
    }

    if (listingType && listingType !== "ALL") {
      const typeUpper = listingType.toUpperCase();
      if (typeUpper === "RENT") {
        filter.$or = [
          { listingType: "RENT" },
          { title: { $regex: "\\[For Rent\\]", $options: "i" } },
        ];
      } else if (typeUpper === "SALE") {
        filter.listingType = { $ne: "RENT" };
        filter.title = { $not: { $regex: "\\[For Rent\\]", $options: "i" } };
      }
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (search) {
      const searchRegex = { $regex: search, $options: "i" };
      const searchConditions = [
        { title: searchRegex },
        { description: searchRegex },
        { "location.address": searchRegex },
        { "location.city": searchRegex },
        { "location.state": searchRegex },
      ];

      if (filter.$or) {
        filter.$and = filter.$and || [];
        filter.$and.push({ $or: filter.$or });
        filter.$and.push({ $or: searchConditions });
        delete filter.$or;
      } else {
        filter.$or = searchConditions;
      }
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
      return NextResponse.json({ success: false, message: "Unauthorized: Please log in to list a property" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();

    const {
      title,
      description,
      price,
      listingType = "SALE",
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
        { success: false, message: "Missing required property fields (title, description, price, location, propertyType, area)" },
        { status: 400 }
      );
    }

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { success: false, message: "Please upload at least one image of your property via ImageKit before listing." },
        { status: 400 }
      );
    }

    const resolvedListingType = listingType === "RENT" || title.includes("[For Rent]") ? "RENT" : "SALE";

    const newProperty = await Property.create({
      ownerId: authUser.userId,
      title: title.trim(),
      description: description.trim(),
      price: Number(price),
      listingType: resolvedListingType,
      location: {
        address: location.address?.trim() || "",
        city: location.city?.trim() || "",
        state: location.state?.trim() || "",
        zipCode: location.zipCode?.trim() || undefined,
        coordinates: location.coordinates || undefined,
      },
      propertyType: propertyType.toUpperCase(),
      area: Number(area),
      bedrooms: Number(bedrooms) || 0,
      bathrooms: Number(bathrooms) || 0,
      amenities: Array.isArray(amenities) ? amenities : [],
      images: images,
      status: "PUBLISHED", // Published to marketplace immediately
      verificationStatus: "UNVERIFIED", // Awaiting legal verification audit
      isFeatured: false,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Property listing created successfully and published to marketplace",
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

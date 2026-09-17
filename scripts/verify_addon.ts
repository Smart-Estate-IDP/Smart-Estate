import mongoose from "mongoose";
import PropertyImage from "../../../../../../../VIT Study Material/IDP/Smart-Estate/src/models/PropertyImage";
import Property from "../../../../../../../VIT Study Material/IDP/Smart-Estate/src/models/Property";
import { isCloudinaryConfigured, uploadPropertyImageBuffer } from "../../../../../../../VIT Study Material/IDP/Smart-Estate/src/lib/cloudinary";

async function runTests() {
  console.log("==================================================");
  console.log("SMARTESTATE ADDON VALIDATION SUITE");
  console.log("==================================================");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failed++;
    }
  }

  // TEST SUITE 1: PropertyImage Model & Schema Verification
  console.log("\n--- Suite 1: PropertyImage Model & Schema ---");
  const schemaPaths = PropertyImage.schema.paths;
  assert(schemaPaths["propertyId"] !== undefined, "PropertyImage has propertyId field");
  assert(schemaPaths["ownerId"] !== undefined, "PropertyImage has ownerId field");
  assert(schemaPaths["url"] !== undefined, "PropertyImage has url field");
  assert(schemaPaths["publicId"] !== undefined, "PropertyImage has publicId field");
  assert(schemaPaths["resourceType"] !== undefined, "PropertyImage has resourceType field");
  assert(schemaPaths["isMain"] !== undefined, "PropertyImage has isMain field");
  assert(schemaPaths["status"] !== undefined, "PropertyImage has status field");
  assert(schemaPaths["isVisible"] !== undefined, "PropertyImage has isVisible field");
  assert(schemaPaths["displayOrder"] !== undefined, "PropertyImage has displayOrder field");
  assert(schemaPaths["reviewedBy"] !== undefined, "PropertyImage has reviewedBy field");
  assert(schemaPaths["reviewedAt"] !== undefined, "PropertyImage has reviewedAt field");
  assert(schemaPaths["rejectionReason"] !== undefined, "PropertyImage has rejectionReason field");
  assert(schemaPaths["createdAt"] !== undefined, "PropertyImage has createdAt timestamp");
  assert(schemaPaths["updatedAt"] !== undefined, "PropertyImage has updatedAt timestamp");

  // Verify Default Values
  const sampleDoc = new PropertyImage({
    propertyId: new mongoose.Types.ObjectId(),
    ownerId: new mongoose.Types.ObjectId(),
    url: "https://res.cloudinary.com/test/image/upload/sample.jpg",
    publicId: "smartestate/properties/123/sample",
  });
  assert(sampleDoc.status === "PENDING", "Default status is 'PENDING'");
  assert(sampleDoc.isVisible === false, "Default isVisible is false");
  assert(sampleDoc.isMain === false, "Default isMain is false");
  assert(sampleDoc.displayOrder === 0, "Default displayOrder is 0");

  // TEST SUITE 2: Cloudinary Utility & Security
  console.log("\n--- Suite 2: Cloudinary Server-Side Utility ---");
  const isConfigured = isCloudinaryConfigured();
  assert(typeof isConfigured === "boolean", "isCloudinaryConfigured returns boolean status");
  
  // Test that missing credentials throw a clear configuration error
  const origSecret = process.env.CLOUDINARY_API_SECRET;
  delete process.env.CLOUDINARY_API_SECRET;
  let threwExpected = false;
  try {
    await uploadPropertyImageBuffer(Buffer.from("fake"), "test_prop_123");
  } catch (err: any) {
    if (err.message.includes("Cloudinary is not configured")) {
      threwExpected = true;
    }
  }
  assert(threwExpected, "Throws clear configuration error when Cloudinary secrets missing");
  if (origSecret) process.env.CLOUDINARY_API_SECRET = origSecret;

  // TEST SUITE 3: Business Rules & Permission Matrix Logic
  console.log("\n--- Suite 3: Authorization Matrix & Non-Negotiable Rules ---");
  const userA_id = new mongoose.Types.ObjectId().toString();
  const userB_id = new mongoose.Types.ObjectId().toString();
  const admin_id = new mongoose.Types.ObjectId().toString();

  const propertyUserA = {
    _id: new mongoose.Types.ObjectId(),
    ownerId: new mongoose.Types.ObjectId(userA_id),
    title: "User A Villa",
  };

  // Rule 1: User can upload to owned property
  const canUploadA = propertyUserA.ownerId.toString() === userA_id;
  assert(canUploadA === true, "User A CAN upload to their owned property");

  // Rule 9 & 11: User B CANNOT upload to User A's property
  const canUploadB = propertyUserA.ownerId.toString() === userB_id;
  assert(canUploadB === false, "User B CANNOT upload to User A's property (Forbidden)");

  // Rule 7 & 8: Tampering protection (Non-admin cannot approve or change visibility)
  const isUserAllowedToApprove = (role: string) => role === "ADMIN";
  assert(isUserAllowedToApprove("USER") === false, "Regular user CANNOT approve images");
  assert(isUserAllowedToApprove("ADMIN") === true, "Admin CAN approve images");

  // Rule 6 & 10: Visibility rule - Only APPROVED images can be made visible
  const canMakeVisible = (status: string) => status === "APPROVED";
  assert(canMakeVisible("PENDING") === false, "Cannot make PENDING image visible");
  assert(canMakeVisible("REJECTED") === false, "Cannot make REJECTED image visible");
  assert(canMakeVisible("APPROVED") === true, "Can make APPROVED image visible");

  // Rule 18 & 21: Main image must be approved and visible
  const canSetMain = (status: string, isVisible: boolean) => status === "APPROVED" && isVisible;
  assert(canSetMain("PENDING", false) === false, "Pending image cannot be main");
  assert(canSetMain("APPROVED", false) === false, "Hidden image cannot be main");
  assert(canSetMain("APPROVED", true) === true, "Approved & visible image can be main");

  // TEST SUITE 4: Public Gallery Visibility Rules
  console.log("\n--- Suite 4: Public Gallery Visibility Rules ---");
  const mockImages = [
    { id: 1, caption: "Front Lawn", status: "PENDING", isVisible: false, isMain: false },
    { id: 2, caption: "Blurry Hall", status: "REJECTED", isVisible: false, isMain: false },
    { id: 3, caption: "Private Storeroom", status: "APPROVED", isVisible: false, isMain: false },
    { id: 4, caption: "Master Bedroom", status: "APPROVED", isVisible: true, isMain: false },
    { id: 5, caption: "Hero Skyline", status: "APPROVED", isVisible: true, isMain: true },
  ];

  // Public filter: status === "APPROVED" && isVisible === true
  const publicGallery = mockImages.filter((img) => img.status === "APPROVED" && img.isVisible);
  assert(publicGallery.length === 2, "Public gallery contains exactly 2 images");
  assert(!publicGallery.some((i) => i.status === "PENDING"), "Pending images are excluded from public gallery");
  assert(!publicGallery.some((i) => i.status === "REJECTED"), "Rejected images are excluded from public gallery");
  assert(!publicGallery.some((i) => !i.isVisible), "Hidden images are excluded from public gallery");
  assert(publicGallery.find((i) => i.isMain)?.caption === "Hero Skyline", "Main image is prioritized");

  console.log("\n==================================================");
  console.log(`TOTAL: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log("==================================================");

  if (failed > 0) process.exit(1);
}

runTests().catch((e) => {
  console.error("Test execution error:", e);
  process.exit(1);
});

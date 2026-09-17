const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

async function seedLocal() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/IDP");
    console.log("Connected to local MongoDB (mongodb://127.0.0.1:27017/IDP)");

    const adminHash = await bcrypt.hash("Pokemon@2006", 10);
    const userHash = await bcrypt.hash("Password@123", 10);

    // 1. Admin User
    const adminUser = await mongoose.connection.collection("users").findOneAndUpdate(
      { email: "om@gmail.com" },
      {
        $set: {
          name: "Om Admin",
          email: "om@gmail.com",
          password: adminHash,
          role: "ADMIN",
          isEmailVerified: true,
          savedProperties: [],
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true, returnDocument: "after" }
    );
    console.log("Admin user seeded: om@gmail.com (Password: Pokemon@2006)");

    // 2. Regular User
    const regUser = await mongoose.connection.collection("users").findOneAndUpdate(
      { email: "himmanshu@gmail.com" },
      {
        $set: {
          name: "Himanshu",
          email: "himmanshu@gmail.com",
          password: userHash,
          role: "USER",
          isEmailVerified: true,
          savedProperties: [],
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true, returnDocument: "after" }
    );

    // 3. Lawyer User
    const lawyerUser = await mongoose.connection.collection("users").findOneAndUpdate(
      { email: "advocate.sharma@gmail.com" },
      {
        $set: {
          name: "Adv. Rajesh Sharma",
          email: "advocate.sharma@gmail.com",
          phone: "+91 98765 43210",
          password: userHash,
          role: "LAWYER",
          isEmailVerified: true,
          savedProperties: [],
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true, returnDocument: "after" }
    );

    const lawyerId = lawyerUser?._id || lawyerUser?.value?._id;
    if (lawyerId) {
      await mongoose.connection.collection("lawyerprofiles").updateOne(
        { userId: lawyerId },
        {
          $set: {
            userId: lawyerId,
            licenseNumber: "BAR/DL/2015/88921",
            experienceYears: 10,
            verificationFee: 1500,
            verified: true,
            updatedAt: new Date(),
          },
          $setOnInsert: {
            createdAt: new Date(),
          },
        },
        { upsert: true }
      );
      console.log("Verified Lawyer Profile seeded: Adv. Rajesh Sharma");
    }

    // 4. Admin Secret Key
    await mongoose.connection.collection("systemconfigs").updateOne(
      { key: "admin_secret_key" },
      {
        $set: {
          key: "admin_secret_key",
          value: "Pokemon@2006",
          description: "Secret key required to claim administrator access",
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );
    console.log("Admin Secret Key seeded: Pokemon@2006");

    // 5. Sample Properties
    const ownerId = adminUser?._id || adminUser?.value?._id || new mongoose.Types.ObjectId();
    const existingProps = await mongoose.connection.collection("properties").countDocuments();
    if (existingProps === 0) {
      await mongoose.connection.collection("properties").insertMany([
        {
          ownerId,
          title: "Luxury 3 BHK Apartment in Cyber City",
          description: "Spacious 3 BHK apartment with modular kitchen, private balcony, and 24/7 power backup.",
          price: 8500000,
          location: {
            address: "Tower 4, Golf Course Road",
            city: "Gurugram",
            state: "Haryana",
            zipCode: "122002",
          },
          propertyType: "APARTMENT",
          area: 1850,
          bedrooms: 3,
          bathrooms: 3,
          amenities: ["Swimming Pool", "Gym", "Clubhouse", "24/7 Security", "Covered Parking"],
          status: "PUBLISHED",
          verificationStatus: "VERIFIED",
          images: [
            "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80",
          ],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          ownerId,
          title: "Contemporary 4 BHK Villa with Garden",
          description: "Independent luxury villa with landscaped lawn, Italian marble flooring, and smart home automation.",
          price: 24000000,
          location: {
            address: "Emerald Enclave, Whitefield",
            city: "Bengaluru",
            state: "Karnataka",
            zipCode: "560066",
          },
          propertyType: "VILLA",
          area: 3200,
          bedrooms: 4,
          bathrooms: 4,
          amenities: ["Private Garden", "Solar Power", "EV Charging", "Home Theater"],
          status: "PUBLISHED",
          verificationStatus: "VERIFIED",
          images: [
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80",
          ],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          ownerId,
          title: "Premium Commercial Office Space",
          description: "Grade-A commercial workspace ready for fit-outs in business hub.",
          price: 15000000,
          location: {
            address: "Bandra Kurla Complex",
            city: "Mumbai",
            state: "Maharashtra",
            zipCode: "400051",
          },
          propertyType: "COMMERCIAL",
          area: 1200,
          bedrooms: 0,
          bathrooms: 2,
          amenities: ["High Speed Elevators", "Central AC", "Fire Safety", "Cafeteria"],
          status: "PENDING_APPROVAL",
          verificationStatus: "IN_PROGRESS",
          images: [
            "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80",
          ],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
      console.log("3 Sample properties seeded successfully!");
    }

    console.log("Local database ready for full offline / local testing!");
  } catch (err) {
    console.error("Local seed error:", err);
  } finally {
    await mongoose.disconnect();
  }
}

seedLocal();

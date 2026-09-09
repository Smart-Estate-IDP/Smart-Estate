import { connectDB } from "@/lib/mongodb";
import SystemConfig from "@/models/SystemConfig";

export const DEFAULT_ADMIN_SECRET =
  process.env.ADMIN_SECRET || "smartestate_admin_2026";

export async function getAdminSecretKey(): Promise<string> {
  await connectDB();
  const config = await SystemConfig.findOne({ key: "admin_secret_key" });
  if (!config) {
    try {
      await SystemConfig.create({
        key: "admin_secret_key",
        value: DEFAULT_ADMIN_SECRET,
        description: "Secret key required to claim administrator access",
      });
    } catch {
      // Catch potential race condition duplicate key
    }
    return DEFAULT_ADMIN_SECRET;
  }
  return config.value;
}

export async function setAdminSecretKey(newSecret: string): Promise<string> {
  await connectDB();
  const updated = await SystemConfig.findOneAndUpdate(
    { key: "admin_secret_key" },
    {
      value: newSecret.trim(),
      description: "Secret key required to claim administrator access",
    },
    { new: true, upsert: true }
  );
  return updated.value;
}

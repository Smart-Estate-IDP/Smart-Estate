import mongoose from "mongoose";
import dns from "dns";
import fs from "fs";
import path from "path";

// Fix for Node.js querySrv ECONNREFUSED with MongoDB Atlas on Windows / ISP DNS servers
try {
  dns.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);
  if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder("ipv4first");
  }
} catch {
  // Ignore in unsupported environments
}

export function getMongoUri(): string {
  try {
    const envPath = path.resolve(process.cwd(), ".env.local");
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf8");
      const match = content.match(/^MONGODB_URI=(.+)$/m);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
  } catch {}
  return process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/IDP";
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  uri?: string;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

// Ensure old cached Atlas promises are wiped clean
const targetUri = getMongoUri();
if (global.mongooseCache && global.mongooseCache.uri !== targetUri) {
  try {
    mongoose.disconnect();
  } catch {}
  global.mongooseCache = { conn: null, promise: null, uri: targetUri };
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null, uri: targetUri };
global.mongooseCache = cached;

export async function connectDB() {
  const currentUri = getMongoUri();

  // If already connected to the current URI, return existing connection
  if (mongoose.connection.readyState === 1 && cached.uri === currentUri && cached.conn) {
    return cached.conn;
  }

  // Reset if URI changed or connection is dead
  if (cached.uri !== currentUri || mongoose.connection.readyState !== 1) {
    try {
      await mongoose.disconnect();
    } catch {}
    cached.conn = null;
    cached.promise = null;
    cached.uri = currentUri;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 4000,
    };

    cached.promise = mongoose
      .connect(currentUri, opts)
      .then((m) => {
        console.log("MongoDB connected successfully to:", currentUri.replace(/\/\/[^@]+@/, "//***@"));
        return m;
      })
      .catch(async (primaryError) => {
        cached.promise = null;
        cached.conn = null;

        // Fallback to local MongoDB if external URI fails
        if (currentUri !== "mongodb://127.0.0.1:27017/IDP") {
          console.warn("Atlas connection failed. Falling back to local MongoDB...");
          const localUri = "mongodb://127.0.0.1:27017/IDP";
          try {
            const localM = await mongoose.connect(localUri, {
              bufferCommands: false,
              serverSelectionTimeoutMS: 2000,
            });
            cached.uri = localUri;
            cached.conn = localM;
            return localM;
          } catch (localErr: any) {
            console.error("Local MongoDB also failed:", localErr.message);
          }
        }
        throw primaryError;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    cached.conn = null;
    console.error("MongoDB connection error:", e);
    throw e;
  }

  return cached.conn;
}
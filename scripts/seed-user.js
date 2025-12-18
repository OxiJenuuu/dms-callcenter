/* Simple seed script: inserts/updates a dummy user with password "admin". */
const mongoose = require("mongoose");
const { hash } = require("bcryptjs");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/dms-callcenter";

if (!MONGODB_URI) {
  console.error("Set MONGODB_URI in your environment before running this script.");
  process.exit(1);
}

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true, sparse: true },
    password: String,
    image: String,
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

async function main() {
  await mongoose.connect(MONGODB_URI);

  const email = "dummy@example.com";
  const password = await hash("admin", 10);

  const user = await User.findOneAndUpdate(
    { email },
    { email, name: "Dummy User", password },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  console.log("Seeded user:", { email: user.email, password: "admin" });
}

main()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await mongoose.disconnect();
  });

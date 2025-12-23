import mongoose from "mongoose";

const pagesSchema = new mongoose.Schema(
    {
        page: { type: String, default: 'dashboard', lowercase: true, trim: true },
        permissions: { type: [String], default: ['page.view'] },
        href: { type: String, required: true, lowercase: true, default: "/dashboard" },
        tooltip: { type: String, default: "Acasa", trim: true },
    },
    { _id: false }
);

const codesSchema = new mongoose.Schema(
    {
        resetPassword: { type: Boolean, default: false },
        createPassword: { type: String, default: "" },
    },
    { _id: false }
)

const userSchema = new mongoose.Schema(
  {
      name: String,
      username: { type: String, unique: true, sparse: true },
      email: { type: String, unique: true, sparse: true },
      password: { type: String, required: true },
      phone: String,
      verifications: { type: codesSchema, default: {
              resetPassword: false,
              createPassword: "",
          } },
      access: { type: [pagesSchema], default: [{
              page: "dashboard",
              permissions: ["page.view"],
              href: "/dashboard",
              tooltip: "Acasa",
          }] },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);

/* Simple seed script: inserts/updates a dummy users user with password "users" */
const mongoose = require("mongoose");
const { hash } = require("bcryptjs");

const MONGODB_URI =
    process.env.MONGODB_URI || "mongodb://localhost:27017/dms-callcenter";

if (!MONGODB_URI) {
    console.error("Set MONGODB_URI before running this script.");
    process.exit(1);
}

/* ================= SCHEMAS ================= */

const pagesSchema = new mongoose.Schema(
    {
        page: { type: String, default: "dashboard", lowercase: true, trim: true },
        permissions: {
            type: [String],
            default: () => ["page.view"],
        },
        href: { type: String, default: "/dashboard", lowercase: true, trim: true },
        tooltip: { type: String, default: "", trim: true },
    },
    { _id: false }
);

const codesSchema = new mongoose.Schema(
    {
        resetPassword: { type: Boolean, default: false },
        createPassword: { type: Boolean, default: false },
    },
    { _id: false }
);

const userSchema = new mongoose.Schema(
    {
        name: String,

        username: {
            type: String,
            unique: true,
            sparse: true,
            lowercase: true,
            trim: true,
        },

        email: {
            type: String,
            unique: true,
            sparse: true,
            lowercase: true,
            trim: true,
        },

        password: { type: String, required: true },

        image: { type: String },

        verifications: {
            type: codesSchema,
            default: {
                resetPassword: false,
                createPassword: false,
            },
        },

        access: {
            type: [pagesSchema],
            default: [
                {
                    page: "dashboard",
                    permissions: ["page.view"],
                    href: "/dashboard",
                    tooltip: "Acasa",
                },
                {
                    page: "admin",
                    permissions: ["page.view", "user.modify", "user.delete", "user.add", "app.restart"],
                    href: "/dashboard/users",
                    tooltip: "Mangment",
                },
            ],
        },
    },
    { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

/* ================= SEED ================= */

async function main() {
    await mongoose.connect(MONGODB_URI);

    const passwordHash = await hash("admin", 10);

    const user = await User.findOneAndUpdate(
        { email: "users@example.com" },
        {
            name: "Admin",
            username: "admin",
            email: "users@example.com",
            password: passwordHash,

            // IMPORTANT: seteaza explicit access ca sa se aplice si daca userul exista deja
            access: [
                {
                    page: "dashboard",
                    permissions: ["page.view"],
                    href: "/dashboard",
                    tooltip: "Acasa",
                },
                {
                    page: "admin",
                    permissions: ["page.view", "user.modify", "user.delete", "user.add", "app.restart"],
                    href: "/dashboard/users",
                    tooltip: "Mangment",
                },
            ],
        },
        {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
        }
    );

    console.log("Seed OK");
    console.log({
        email: user.email,
        username: user.username,
        password: "admin",
    });
}

main()
    .catch((err) => {
        console.error("Seed failed:", err);
        process.exit(1);
    })
    .finally(async () => {
        await mongoose.disconnect();
    });

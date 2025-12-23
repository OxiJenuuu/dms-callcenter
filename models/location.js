import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
    {
        zone: { type: String, required: true },
        location: { type: String, required: true },
        phone: { type: [String], required: true}
    },
    { timestamps: false }
);

export default mongoose.models.Location || mongoose.model("Location", locationSchema);

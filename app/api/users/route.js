import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/user";

export async function GET() {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ message: "Nu ai permisiunile necesare" }, { status: 403 });
    }

    const usersAccess = session.user.access?.find((a) => a.page === "users");
    if (!usersAccess?.permissions?.includes("user.view")) {
        return NextResponse.json({ message: "Nu ai permisiunile necesare" }, { status: 403 });
    }

    await dbConnect();

    const users = await User.find({})
        .select("_id name username email image createdAt verifications access")
        .lean();

    return NextResponse.json({ users }, { status: 200 });
}

export async function PATCH(req) {
    function generateCode(length = 6) {
        const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        let code = "";
        for (let i = 0; i < length; i++) {
            code += chars[Math.floor(Math.random() * chars.length)];
        }
        return code;
    }

    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ message: "Nu ai permisiunile necesare" }, { status: 403 });
    }

    const usersAccess = session.user.access?.find((a) => a.page === "users");
    if (!usersAccess?.permissions?.includes("user.modify")) {
        return NextResponse.json({ message: "Nu ai permisiunile necesare" }, { status: 403 });
    }

    await dbConnect();

    const body = await req.json().catch(() => null);
    if (!body?.id) {
        return NextResponse.json({ message: "Datele trimise sunt invalide" }, { status: 400 });
    }

    const { id, ...updateData } = body;

    if (updateData?.verifications?.resetPassword === true) {
        updateData.verifications.createPassword = generateCode(6);
    }

    if (updateData?.verifications?.resetPassword === false) {
        updateData.verifications.createPassword = "";
    }

    const user = await User.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
    );

    if (!user) {
        return NextResponse.json({ message: "Nu am gasit acest utilizator" }, { status: 404 });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
}


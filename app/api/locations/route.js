import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Location from "@/models/location";

export async function GET(req){
    const session = await auth();

    if(!session?.user) {
        return NextResponse.json({ message: "Nu ai permisiunile necesare" }, { status: 403 });
    }

    const usersAccess = session.user.access?.find((a) => a.page === "locations");
    if (!usersAccess?.permissions?.includes("location.view")) {
        return NextResponse.json({ message: "Nu ai permisiunile necesare" }, { status: 403 });
    }

    await dbConnect();

    const locations = await Location.find({})
        .select("_id zone location phone")
        .lean()

    return NextResponse.json({ locations }, { status: 200 });
}

export async function POST(req) {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ message: "Nu ai permisiunile necesare" }, { status: 403 });
    }

    const usersAccess = session.user.access?.find((a) => a.page === "locations");
    if (!usersAccess?.permissions?.includes("location.add")) {
        return NextResponse.json({ message: "Nu ai permisiunile necesare" }, { status: 403 });
    }

    await dbConnect();

    const body = await req.json().catch(() => null);
    if (!body?.zone || !body?.location || !Array.isArray(body?.phone)) {
        return NextResponse.json({ message: "Datele trimise sunt invalide" }, { status: 400 });
    }

    const existingLocation = await Location.findOne({
        zone: body.zone,
        phone: { $in: body.phone },
    }).select("_id zone phone");

    if (existingLocation) {
        return NextResponse.json(
            { message: "Exista deja o locatie pentru aceasta zona si acest numar de telefon" },
            { status: 409 }
        );
    }

    const newLocation = new Location({
        zone: body.zone,
        location: body.location,
        phone: body.phone,
    });

    await newLocation.save();

    return NextResponse.json({ message: "Locatie creata cu success" }, { status: 200 });
}

export async function PATCH(req) {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ message: "Nu ai permisiunile necesare" }, { status: 403 });
    }

    const usersAccess = session.user.access?.find((a) => a.page === "locations");
    if (!usersAccess?.permissions?.includes("location.modify")) {
        return NextResponse.json({ message: "Nu ai permisiunile necesare" }, { status: 403 });
    }

    await dbConnect();

    const body = await req.json().catch(() => null);
    if (!body?.id) {
        return NextResponse.json({ message: "Datele trimise sunt invalide" }, { status: 400 });
    }

    const { id, ...updateData } = body;

    if (updateData?.zone && Array.isArray(updateData?.phone)) {
        const existingLocation = await Location.findOne({
            _id: { $ne: id },
            zone: updateData.zone,
            phone: { $in: updateData.phone },
        }).select("_id zone phone");

        if (existingLocation) {
            return NextResponse.json(
                { message: "Exista deja o locatie pentru aceasta zona si acest numar de telefon" },
                { status: 409 }
            );
        }
    }

    const location = await Location.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
    );

    if (!location) {
        return NextResponse.json({ message: "Nu am gasit aceasta locatie" }, { status: 404 });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
}

export async function DELETE(req) {
    const session = await auth();

    const usersAccess = session.user.access?.find((a) => a.page === "locations");
    if (!usersAccess?.permissions?.includes("location.delete")) {
        return NextResponse.json({ message: "Nu ai permisiunile necesare" }, { status: 403 });
    }

    const body = await req.json().catch(() => null);
    if (!body?.id) {
        return NextResponse.json({ message: "Datele trimise sunt invalide" }, { status: 400 });
    }

    const location = await Location.findByIdAndDelete({ _id: body.id });
    if(!location) return NextResponse.json({ message: "Aceasta locatie nu exista" }, { status: 404 });

    return NextResponse.json({ message: "A fost sters cu succes" }, { status: 200 });
}
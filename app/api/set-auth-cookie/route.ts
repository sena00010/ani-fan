// app/api/set-auth-cookie/route.ts
import { NextRequest, NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST(req: NextRequest) {
    const { uid, token } = await req.json();

    if (!uid) {
        return NextResponse.json({ error: "Eksik veri" }, { status: 400 });
    }

    const uidCookie = serialize("user_uid", uid, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1 hafta
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production"
    });

    const tokenCookie = serialize("user_token", token, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production"
    });

    const res = new NextResponse(JSON.stringify({ message: "Cookie setlendi" }));
    res.headers.set("Set-Cookie", [uidCookie, tokenCookie].join(", "));

    return res;
}

import { fetchStartggUserDetails } from "@/lib/startgg";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { slug } = await request.json();

        if (!slug) {
            return NextResponse.json({ error: "Slug is required" }, { status: 400 });
        }

        const data = await fetchStartggUserDetails(slug);

        if (!data) {
            return NextResponse.json({ error: "User not found or Start.gg API error" }, { status: 404 });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("Sync error:", error);
        return NextResponse.json({ error: "Failed to sync" }, { status: 500 });
    }
}

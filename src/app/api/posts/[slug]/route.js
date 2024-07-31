import prisma from "@/utils/connect";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    const { slug } = params;

    const searchParams = new URL(req.url).searchParams;
    const incrementViews = searchParams.get("incrementViews") === "true";
    
    try {
        const post = await prisma.post.update({
            where: { slug },
            data: { views: { increment: incrementViews ? 1 : 0 } },
            include: { user: true },
        });

        const response = new NextResponse(JSON.stringify(post, { status: 200 }));

        return response;
    } catch (err) {
        console.error(err);
        return new NextResponse(
            JSON.stringify({ message: "Something went wrong!" }, { status: 500 })
        );
    }
}
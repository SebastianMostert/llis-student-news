import { getAuthSession } from "@/utils/auth";
import prisma from "@/utils/connect";
import { NextResponse } from "next/server";

export const POST = async (req) => {
    const session = await getAuthSession();

    if (!session) {
        return new NextResponse(
            JSON.stringify({ message: "Not Authenticated!" }, { status: 401 })
        );
    }

    try {
        const { commentId, like, dislike } = await req.json();

        const userEmail = session?.user?.email;

        if (!userEmail) {
            return new NextResponse({ message: "User email not found" }, { status: 401 });
        }

        const query = {
            data: {
                userEmail,
                commentId,
            }
        }

        if (like) await prisma.like.create(query);
        if (dislike) await prisma.dislike.create(query);

        return new NextResponse(JSON.stringify("Engagement successful registered", { status: 200 }));
    } catch (err) {
        console.log(err);
        return new NextResponse(
            JSON.stringify({ message: "Something went wrong!" }, { status: 500 })
        );
    }
};

export const DELETE = async (req) => {
    const session = await getAuthSession();

    if (!session) {
        return new NextResponse(
            JSON.stringify({ message: "Not Authenticated!" }, { status: 401 })
        );
    }

    try {
        const { id, like, dislike } = await req.json();

        const userEmail = session?.user?.email;

        if (!userEmail) {
            return new NextResponse({ message: "User email not found" }, { status: 401 });
        }

        const query = {
            where: {
                id
            }
        }

        if (like) await prisma.like.delete(query);
        if (dislike) await prisma.dislike.delete(query);

        return new NextResponse(JSON.stringify("Engagement successful deleted", { status: 200 }));
    } catch (err) {
        console.log(err);
        return new NextResponse(
            JSON.stringify({ message: "Something went wrong!" }, { status: 500 })
        );
    }
}
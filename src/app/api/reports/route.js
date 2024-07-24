import { getAuthSession } from "@/utils/auth";
import prisma from "@/utils/connect";
import { NextResponse } from "next/server";

// FETCH REPORTS
export const GET = async (req) => {
    // Construct the query object for fetching reports
    const query = {
        where: {},
        include: {
            user: true,
            comment: {
                include: {
                    user: true,
                    Report: true,
                }
            }
        },
    };

    try {
        const reports = await prisma.report.findMany(query);

        // Return the response as JSON with a 200 status code
        return NextResponse.json(reports, { status: 200 });
    } catch (err) {
        // Log the error for debugging purposes
        console.error(err);
        // Return an error message as JSON with a 500 status code if something goes wrong
        return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });
    }
};

// CREATE A POST
export const POST = async (req) => {
    const session = await getAuthSession();

    if (!session) {
        return NextResponse.json({ message: "Not Authenticated!" }, { status: 401 });
    }

    try {
        // TODO: Ensure that the user has permission to create posts
        const body = await req.json();
        const post = await prisma.post.create({
            data: { ...body, userEmail: session.user.email },
        });

        return NextResponse.json(post, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });
    }
};

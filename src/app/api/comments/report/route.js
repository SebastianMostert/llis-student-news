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
        const { commentId, reportOptions } = await req.json();

        const userEmail = session?.user?.email;

        if (!userEmail) {
            return new NextResponse({ message: "User email not found" }, { status: 401 });
        }

        const query = {
            data: {
                userEmail,
                commentId,
                reportOptions
            }
        }

        await prisma.report.create(query);

        return new NextResponse(JSON.stringify("Report successfully submitted", { status: 200 }));
    } catch (err) {
        console.log(err);
        return new NextResponse(
            JSON.stringify({ message: "Something went wrong!" }, { status: 500 })
        );
    }
};
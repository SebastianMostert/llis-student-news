import { getAuthSession } from "@/utils/auth";
import prisma from "@/utils/connect";
import { NextResponse } from "next/server";

// FETCH USER
export const GET = async (req) => {
    // Get the session
    const session = await getAuthSession();

    // If there is no session, return an error
    if (!session) {
        return NextResponse.json({ message: "Not Authenticated!" }, { status: 401 });
    }

    const query = {
        where: {
            email: session?.user?.email
        },
        include: {
            roles: {
                include: {
                    rolePermissions: {
                        include: {
                            permission: true
                        }
                    }
                }
            }
        }
    }

    try {
        // Fetch the user from the database
        const user = await prisma.user.findUnique(query)

        // Return the response as JSON with a 200 status code
        return NextResponse.json(user, { status: 200 });
    } catch (err) {
        // Log the error for debugging purposes
        console.error(err);
        // Return an error message as JSON with a 500 status code if something goes wrong
        return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });
    }
};
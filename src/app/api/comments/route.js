import { getAuthSession } from "@/utils/auth";
import prisma from "@/utils/connect";
import { NextResponse } from "next/server";
import { PerspectiveClient } from "toxicity-analyzer";

// GET ALL COMMENTS OF A POST
export const GET = async (req) => {
    const { searchParams } = new URL(req.url);

    const postSlug = searchParams.get("postSlug");

    try {
        const comments = await prisma.comment.findMany({
            where: {
                ...(postSlug && { postSlug }),
            },
            include: { user: true, Like: true, Dislike: true, Report: true },
        });

        return new NextResponse(JSON.stringify(comments, { status: 200 }));
    } catch (err) {
        console.log(err);
        return new NextResponse(
            JSON.stringify({ message: "Something went wrong!" }, { status: 500 })
        );
    }
};

// CREATE A COMMENT
export const POST = async (req) => {
    const session = await getAuthSession();

    if (!session) {
        return new NextResponse(
            JSON.stringify({ message: "Not Authenticated!" }, { status: 401 })
        );
    }

    try {
        const body = await req.json();

        const perspectiveApiKey = process.env.PERSPECTIVE_API_KEY;
        const rapidApiKey = process.env.RAPID_API_KEY;

        // Do the validation here
        const client = new PerspectiveClient(perspectiveApiKey, rapidApiKey);

        const options = {
            comment: body.desc,
            language: "en",
            autoLanguage: true, // Optional, default is false
        };

        const result = await client.analyzeComment(options);

        const attributeScores = result.attributeScores;

        // Define thresholds for the scores
        const thresholds = {
            TOXICITY: 0.75,
            INSULT: 0.75,
            PROFANITY: 0.75,
            IDENTITY_ATTACK: 0.75,
            SEVERE_TOXICITY: 0.75,
            THREAT: 0.75,
        };

        // Check if any of the attribute scores exceed the thresholds
        const isContentInappropriate = Object.keys(thresholds).some(attribute => {
            const score = attributeScores[attribute]?.summaryScore?.value || 0;
            return score >= thresholds[attribute];
        });

        // If the content is inappropriate, return an error response
        if (isContentInappropriate) {
            return NextResponse.json({ message: "Your comment was not submitted as it was found to contain inappropriate language." }, { status: 400 });
        }

        const comment = await prisma.comment.create({
            data: { ...body, userEmail: session.user.email },
        });

        return new NextResponse(JSON.stringify(comment, { status: 200 }));
    } catch (err) {
        console.log(err);
        return new NextResponse(
            JSON.stringify({ message: "Something went wrong!" }, { status: 500 })
        );
    }
};

// DELETE A COMMENT
export const DELETE = async (req) => {
    const session = await getAuthSession();

    if (!session) {
        return new NextResponse(
            JSON.stringify({ message: "Not Authenticated!" }, { status: 401 })
        );
    }

    try {
        // Get the user 
        const user = await prisma.user.findUnique({
            where: {
                email: session.user.email,
            },
            include: {
                Comment: true
            }
        });

        if (!user) {
            return new NextResponse(JSON.stringify({ message: "The current user does not exist" }, { status: 401 }))
        }

        // Get the request body
        const { commentId } = await req.json();

        // Get all the roles of the user
        const roles = user.roles;

        // Check if the current user is a moderator or an admin
        const isModerator = roles.some((role) => role.name === "Moderator" || role.name === "Admin");

        // Check if the current user is the author of the comment
        const isAuthor = user.Comment.some((comment) => comment.id === commentId);

        if (!isModerator && !isAuthor) {
            return new NextResponse(JSON.stringify({ message: "You do not have permission to delete this comment" }, { status: 401 }))
        }

        // Delete the comment and all the attached likes and dislikes
        const comment = await prisma.comment.delete({
            where: {
                id: commentId,
            }
        });
        return new NextResponse(JSON.stringify(comment, { status: 200 }));
    } catch (err) {
        console.log(err);
        return new NextResponse(
            JSON.stringify({ message: "Something went wrong!" }, { status: 500 })
        );
    }
}
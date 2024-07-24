import { getAuthSession } from "@/utils/auth";
import prisma from "@/utils/connect";
import { NextResponse } from "next/server";

// FETCH POSTS
export const GET = async (req) => {
    // Parse the request URL and extract search parameters
    const { searchParams } = new URL(req.url);

    // Get the 'page' parameter, default to 1 if not provided
    const page = parseInt(searchParams.get("page"), 10) || 1;

    // Get the 'cat', 'featured', 'editorsPick', and 'popular' parameters
    // Convert 'featured', 'editorsPick', and 'popular' to boolean values
    const cat = searchParams.get("cat");
    const featured = searchParams.get("featured") === 'true';
    const editorsPick = searchParams.get("editorsPick") === 'true';
    const popular = searchParams.get("popular") === 'true';

    // Define constants for the number of posts per page for different types of queries
    const POST_PER_PAGE = 2;
    const FEATURED_POST_PER_PAGE = 1;
    const EDITORS_PICK_POST_PER_PAGE = 4;
    const POPULAR_POST_PER_PAGE = 4;

    // Determine the number of posts to take based on the type of query
    let take = POST_PER_PAGE;
    if (editorsPick) {
        take = EDITORS_PICK_POST_PER_PAGE;
    } else if (featured) {
        take = FEATURED_POST_PER_PAGE;
    } else if (popular) {
        take = POPULAR_POST_PER_PAGE;
    }

    // Construct the query object for fetching posts
    // 'take' determines the number of posts to retrieve
    // 'skip' determines the number of posts to skip based on the current page and the number of posts per page
    const query = {
        take,
        skip: (page - 1) * take,
        where: {
            // Conditionally add the category filter if 'cat' is provided
            ...(cat && { catSlug: cat }),
            // Add the 'featured' filter if 'featured' is true
            ...(featured && { featured: true }),
            // Add the 'editorsPick' filter if 'editorsPick' is true
            ...(editorsPick && { editorsPick: true }),
        },
        // Include the related 'user' data in the fetched posts
        include: { user: true },
        // Sort by views if 'popular' is true
        ...(popular && { orderBy: { views: 'desc' } }),
    };

    try {
        // Execute the database transaction to fetch posts and count the total number of posts
        const [posts, count] = await prisma.$transaction([
            // Fetch the posts based on the query
            prisma.post.findMany(query),
            // Count the total number of posts that match the query criteria
            prisma.post.count({ where: query.where }),
        ]);

        // Construct the response object
        // Include the posts in the response
        const response = { posts };
        // Only include the 'count' in the response if 'featured' is not true
        if (!featured) {
            response.count = count;
        }

        // Return the response as JSON with a 200 status code
        return NextResponse.json(response, { status: 200 });
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

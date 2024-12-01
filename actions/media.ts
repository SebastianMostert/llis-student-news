"use server";

import fsP from "fs/promises";
import fs from 'fs';
import path from 'path';
import { Image } from "@prisma/client";
import { Buffer } from 'buffer';

export type TransformedImage = Omit<Image, 'content'> & { content: string };

const subFolder = "/user-uploads"
const uploadedFilesDir = path.join(process.cwd(), `public/${subFolder}`);

// Fetch the list of media files
export async function getMedia(): Promise<string[]> {
    // Read the contents of the media directory
    const files = fs.readdirSync(uploadedFilesDir);
    // Return the list of file paths
    return files.map(file => `${subFolder}/${file}`);
}

// Handle the file upload in a server action
export async function uploadMedia(file: File): Promise<string> {
    // Ensure the directory exists
    if (!fs.existsSync(uploadedFilesDir)) {
        fs.mkdirSync(uploadedFilesDir, { recursive: true });
    }

    const fileName = new Date().toISOString().replace(/:/g, '-') + path.extname(file.name);
    const filePath = path.join(uploadedFilesDir, fileName);

    // Write the file to the public/media directory
    const buffer = await file.arrayBuffer();  // Convert the file to buffer
    fs.writeFileSync(filePath, Buffer.from(buffer));  // Save the file to disk

    // Return the file path that can be used to access the file
    return `${subFolder}/${fileName}`;
}

export async function deleteMedia(fileUrl: string): Promise<void> {
    try {
        // Extract the file name from the URL
        const fileName = fileUrl.split("/").pop();

        if (!fileName) {
            throw new Error("Invalid file URL.");
        }

        // Construct the file path
        const filePath = path.join(uploadedFilesDir, fileName);

        // Ensure the file exists and delete it
        await fsP.access(filePath); // Check if the file exists
        await fsP.unlink(filePath); // Delete the file

        console.log(`Media deleted successfully: ${filePath}`);
    } catch (error) {
        console.error("Error deleting media:", error);
        throw new Error("Failed to delete media.");
    }
}


///////////////////////////////////
// On the server: Encode Uint8Array to Base64

export async function uploadImage(file: File): Promise<TransformedImage> {
    // Convert File to Buffer
    const buffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(buffer);

    // Save to MongoDB
    const image = await db.image.create({
        data: {
            name: file.name,
            mimeType: file.type,
            size: file.size,
            content: fileBuffer, // Binary data of the image
        },
    });

    return {
        id: image.id,
        name: image.name,
        mimeType: image.mimeType,
        size: image.size,
        createdAt: image.createdAt,
        content: Buffer.from(image.content).toString('base64'),
    };
}

export async function getImages(): Promise<TransformedImage[]> {
    const images = await db.image.findMany();

    return images.map((image) => ({
        id: image.id,
        name: image.name,
        mimeType: image.mimeType,
        size: image.size,
        createdAt: image.createdAt,
        content: Buffer.from(image.content).toString('base64'),
    }));
}

export async function deleteImage(imageId: string): Promise<void> {
    await db.image.delete({ where: { id: imageId } });
}

export async function checkImageUsage(imageId: string): Promise<number> {
    const count = await db.post.count({
        where: {
            imageId: imageId,
        },
    });

    return count;
}
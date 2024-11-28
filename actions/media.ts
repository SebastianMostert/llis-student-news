"use server";

import fsP from "fs/promises";
import fs from 'fs';
import path from 'path';

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

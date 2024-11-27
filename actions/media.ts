"use server";

import fs from 'fs';
import path from 'path';

const subFolder = "/user-uploads"
const uploadedFilesDir = path.join(process.cwd(), `public/${subFolder}`);

// Fetch the list of media files
export async function getMedia(): Promise<string[]> {
    const mediaDir = uploadedFilesDir;
    // Read the contents of the media directory
    const files = fs.readdirSync(mediaDir);
    // Return the list of file paths
    return files.map(file => `${subFolder}/${file}`);
}

// Handle the file upload in a server action
export async function uploadMedia(file: File): Promise<string> {
    const mediaDir = uploadedFilesDir;

    // Ensure the directory exists
    if (!fs.existsSync(mediaDir)) {
        fs.mkdirSync(mediaDir, { recursive: true });
    }

    const fileName = new Date().toISOString().replace(/:/g, '-') + path.extname(file.name);
    const filePath = path.join(mediaDir, fileName);

    // Write the file to the public/media directory
    const buffer = await file.arrayBuffer();  // Convert the file to buffer
    fs.writeFileSync(filePath, Buffer.from(buffer));  // Save the file to disk

    // Return the file path that can be used to access the file
    return `/media/${fileName}`;
}

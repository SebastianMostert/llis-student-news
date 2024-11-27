"use client";

import { getMedia, uploadMedia } from '@/actions/media';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { IoAddCircleOutline } from 'react-icons/io5';

const MediaSelectorPopUp = ({ onSelect, selected }: { onSelect: (url: string) => void, selected?: string }) => {
    const [mediaFiles, setMediaFiles] = useState<string[]>([]);
    const [newFile, setNewFile] = useState<File | null>(null); // For handling file upload
    const [isUploading, setIsUploading] = useState(false); // Track upload status

    useEffect(() => {
        // Fetch the list of images, which can be external links or from /public/media folder
        const fetchMediaFiles = async () => {
            try {
                const urls = await getMedia();
                console.log('Fetched media files:', urls);
                setMediaFiles(urls);
            } catch (error) {
                console.error('Error fetching media files:', error);
            }
        };

        fetchMediaFiles();
    }, []);

    // Handle file selection
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file) {
            setNewFile(file);
            setIsUploading(true);

            try {
                // Upload the file
                const uploadedUrl = await uploadMedia(file);
                console.log('File uploaded successfully:', uploadedUrl);

                // Add the newly uploaded media file to the mediaFiles list
                setMediaFiles(prevMediaFiles => [...prevMediaFiles, uploadedUrl]);

                // Call the onSelect with the uploaded media URL
                onSelect(uploadedUrl);
            } catch (error) {
                console.error('Error uploading file:', error);
            } finally {
                setIsUploading(false); // Reset uploading state
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-primaryBg-light dark:bg-primaryBg-dark rounded-lg shadow-lg w-3/4 max-w-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Select Media</h2>

                {/* Media files grid */}
                <div className="grid grid-cols-3 gap-4">
                    {/* Show placeholder to upload new media */}
                    <div
                        className="cursor-pointer rounded-md overflow-hidden flex justify-center items-center bg-gray-200 dark:bg-gray-800"
                        onClick={() => document.getElementById("file-upload")?.click()}
                    >
                        <IoAddCircleOutline className="text-4xl text-gray-500" />
                    </div>

                    {/* Show existing media files */}
                    {mediaFiles.map((file, index) => (
                        <div
                            key={index}
                            className={`cursor-pointer border rounded-md overflow-hidden hover:shadow-lg ${file === selected ? 'border-blue-500' : 'border-none'}`}
                            onClick={() => onSelect(file)}
                        >
                            <Image
                                src={file}
                                alt={`Media ${index}`}
                                className="w-full h-full object-cover"
                                width={200} // Setting a base width for image
                                height={200} // Keeping a square aspect ratio, adjust as needed
                            />
                        </div>
                    ))}
                </div>

                {/* File upload input */}
                <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={isUploading} // Disable input while uploading
                />

                {/* Optional: Show a loading spinner while uploading */}
                {isUploading && (
                    <div className="mt-4 text-center text-gray-600 dark:text-gray-300">Uploading...</div>
                )}

                <button
                    className="mt-4 w-full bg-accent-light dark:bg-accent-dark hover:bg-accent-hover-light dark:hover:bg-accent-hover-dark text-white py-2 px-4 rounded-lg"
                    onClick={() => onSelect(selected || '')}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default MediaSelectorPopUp;

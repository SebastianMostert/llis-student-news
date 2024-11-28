"use client";

import { getMedia, uploadMedia, deleteMedia } from '@/actions/media'; // Add deleteMedia to handle server deletion
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { IoAddCircleOutline } from 'react-icons/io5';

const MediaSelectorPopUp = ({ onSelect, selected }: { onSelect: (url: string) => void, selected?: string }) => {
    const [mediaFiles, setMediaFiles] = useState<string[]>([]);
    const [newFile, setNewFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; file: string } | null>(null);

    useEffect(() => {
        const fetchMediaFiles = async () => {
            try {
                const urls = await getMedia();
                setMediaFiles(urls);
            } catch (error) {
                console.error('Error fetching media files:', error);
            }
        };

        fetchMediaFiles();
    }, []);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file) {
            setNewFile(file);
            setIsUploading(true);

            try {
                const uploadedUrl = await uploadMedia(file);
                setMediaFiles(prevMediaFiles => [...prevMediaFiles, uploadedUrl]);
                onSelect(uploadedUrl);
            } catch (error) {
                console.error('Error uploading file:', error);
            } finally {
                setIsUploading(false);
            }
        }
    };

    const handleDelete = async (file: string) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this media?');
        if (confirmDelete) {
            try {
                // Remove file on the server (if applicable)
                await deleteMedia(file);
                // Update the local state
                setMediaFiles(prevMediaFiles => prevMediaFiles.filter(media => media !== file));
                if (selected === file) {
                    onSelect(''); // Deselect the deleted file
                }
            } catch (error) {
                console.error('Error deleting file:', error);
            }
        }
        setContextMenu(null); // Close the context menu
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-primaryBg-light dark:bg-primaryBg-dark rounded-lg shadow-lg w-3/4 max-w-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Select Media</h2>

                {/* Media files grid */}
                <div className="grid grid-cols-3 gap-4">
                    <div
                        className="cursor-pointer rounded-md overflow-hidden flex justify-center items-center bg-gray-200 dark:bg-gray-800"
                        onClick={() => document.getElementById("file-upload")?.click()}
                    >
                        <IoAddCircleOutline className="text-4xl text-gray-500" />
                    </div>

                    {mediaFiles.map((file, index) => (
                        <div
                            key={index}
                            className={`relative cursor-pointer border rounded-md overflow-hidden hover:shadow-lg ${
                                file === selected ? 'border-blue-500' : 'border-none'
                            }`}
                            onClick={() => onSelect(file)}
                            onContextMenu={(e) => {
                                e.preventDefault();
                                setContextMenu({ x: e.clientX, y: e.clientY, file });
                            }}
                        >
                            <Image
                                src={file}
                                alt={`Media ${index}`}
                                className="w-full h-full object-cover"
                                width={200}
                                height={200}
                            />
                        </div>
                    ))}
                </div>

                <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={isUploading}
                />

                {isUploading && (
                    <div className="mt-4 text-center text-gray-600 dark:text-gray-300">Uploading...</div>
                )}

                {contextMenu && (
                    <div
                        className="fixed bg-white dark:bg-gray-800 text-black dark:text-white rounded shadow-lg py-2 z-50"
                        style={{ top: contextMenu.y, left: contextMenu.x }}
                        onClick={() => setContextMenu(null)}
                    >
                        <button
                            className="block w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700"
                            onClick={() => handleDelete(contextMenu.file)}
                        >
                            Delete
                        </button>
                    </div>
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

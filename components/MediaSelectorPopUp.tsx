"use client";

import { getImages, uploadImage, deleteImage, TransformedImage, checkImageUsage } from '@/actions/media'; // Add deleteImage to handle server deletion
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { IoAddCircleOutline } from 'react-icons/io5';
import imageCompression from 'browser-image-compression';
import { useTranslations } from 'next-intl';

// Maximum file size limit in bytes (e.g., 5MB)
const FILE_MAX_SIZE = 5 * 1024 * 1024; // 5 MB

const MediaSelectorPopUp = ({ onSelect, selected, selectedId }: { onSelect: (id: string, url: string) => void; selected?: string; selectedId?: string }) => {
    const t = useTranslations('MediaSelectorPopUp');
    const [mediaFiles, setMediaFiles] = useState<TransformedImage[]>([]);
    const [newFile, setNewFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; id: string } | null>(null);

    useEffect(() => {
        const fetchMediaFiles = async () => {
            try {
                const images = await getImages();
                setMediaFiles(images);
            } catch (error) {
                console.error('Error fetching media files:', error);
            }
        };

        fetchMediaFiles();
    }, []);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;

        if (file) {
            // Check original file size
            if (file.size > FILE_MAX_SIZE) {
                alert('File size exceeds the 5MB limit. Compressing...');
            }

            try {
                // Compress the image
                const compressedFile = await imageCompression(file, {
                    maxSizeMB: 5, // Target maximum size in MB
                    maxWidthOrHeight: 1920, // Resize the image to fit within a max dimension
                    useWebWorker: true, // Speed up compression using Web Workers
                });

                // Ensure compressed file size is within limit
                if (compressedFile.size > FILE_MAX_SIZE) {
                    alert('Compressed file size still exceeds the limit. Please choose a smaller file.');
                    return;
                }

                setNewFile(compressedFile);
                setIsUploading(true);

                const uploadedImage = await uploadImage(compressedFile);
                setMediaFiles((prevMediaFiles) => [...prevMediaFiles, uploadedImage]);
                onSelect(uploadedImage.id, `data:${uploadedImage.mimeType};base64,${uploadedImage.content}`);
            } catch (error) {
                console.error('Error compressing or uploading file:', error);
            } finally {
                setIsUploading(false);
            }
        }
    };

    const handleDelete = async (id: string) => {
        try {
            // Check how many posts are using this image
            const usageCount = await checkImageUsage(id);

            if (usageCount > 0) {
                const confirmDelete = window.confirm(t('imageUsedInPosts', { usageCount }));

                if (!confirmDelete) {
                    return; // Cancel the deletion if the user doesn't confirm
                }
            } else {
                const confirmDelete = window.confirm(t('deleteMedia'));
                if (!confirmDelete) return; // Cancel the deletion if the user doesn't confirm
            }

            // Remove file on the server
            await deleteImage(id);

            // Update the local state to remove the image
            setMediaFiles((prevMediaFiles) => prevMediaFiles.filter((media) => media.id !== id));

            // If the deleted image is currently selected, deselect it
            if (selected === id) {
                onSelect('', ''); // Deselect the deleted file
            }

        } catch (error) {
            console.error('Error deleting file:', error);
        }
        setContextMenu(null); // Close the context menu
    };

    // Function to clear the selection
    const clearSelection = () => {
        onSelect('', ''); // Deselect the image
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-primaryBg-light dark:bg-primaryBg-dark rounded-lg shadow-lg w-3/4 max-w-lg p-6">
                <h2 className="text-xl font-semibold mb-4">{t('selectMedia')}</h2>

                {/* Media files grid */}
                <div className="grid grid-cols-3 gap-4">
                    <div
                        className="cursor-pointer rounded-md overflow-hidden flex justify-center items-center bg-gray-200 dark:bg-gray-800"
                        onClick={() => document.getElementById("file-upload")?.click()}
                    >
                        <IoAddCircleOutline className="text-4xl text-gray-500" />
                    </div>

                    {mediaFiles.map(({ id, mimeType, content }, index) => (
                        <div
                            key={id}
                            className={`relative cursor-pointer border rounded-md overflow-hidden hover:shadow-lg ${`data:${mimeType};base64,${content}` === selected ? 'border-blue-500' : 'border-none'
                                }`}
                            onClick={() => onSelect(id, `data:${mimeType};base64,${content}`)}
                            onContextMenu={(e) => {
                                e.preventDefault();
                                setContextMenu({ x: e.clientX, y: e.clientY, id });
                            }}
                        >
                            <Image
                                src={`data:${mimeType};base64,${content}`}
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
                    <div className="mt-4 text-center text-gray-600 dark:text-gray-300">{t('uploading')}</div>
                )}

                {contextMenu && (
                    <div
                        className="fixed bg-white dark:bg-gray-800 text-black dark:text-white rounded shadow-lg py-2 z-50"
                        style={{ top: contextMenu.y, left: contextMenu.x }}
                        onClick={() => setContextMenu(null)}
                    >
                        <button
                            className="block w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700"
                            onClick={() => handleDelete(contextMenu.id)}
                        >
                            {t('delete')}
                        </button>
                    </div>
                )}

                <div className="mt-4 space-y-4">
                    <button
                        className="w-full bg-accent-light dark:bg-accent-dark hover:bg-accent-hover-light dark:hover:bg-accent-hover-dark text-white py-2 px-4 rounded-lg"
                        onClick={() => onSelect(selectedId || '', selected || '')}
                    >
                        {t('cancel')}
                    </button>
                    <button
                        className="w-full bg-accent-light dark:bg-accent-dark hover:bg-accent-hover-light dark:hover:bg-accent-hover-dark text-white py-2 px-4 rounded-lg"
                        onClick={clearSelection}
                    >
                        {t('clearSelection')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MediaSelectorPopUp;
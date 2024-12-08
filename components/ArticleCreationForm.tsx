"use client";

import { useEffect, useState, ChangeEvent } from "react";
import dynamic from "next/dynamic";
import { getCategories } from "@/actions/categories";
import MediaSelectorPopUp from "@/components/MediaSelectorPopUp";
import { Category } from "@prisma/client";
import { IoAddCircleOutline } from "react-icons/io5";
import Image from "next/image";
import { commands, ICommand } from "@uiw/react-md-editor";
import { checkSlugExists, createPost } from "@/actions/post";
import rehypeRaw from "rehype-raw";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

// Dynamically import MDEditor
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const listCommands: ICommand[] = [
    commands.unorderedListCommand,
    commands.orderedListCommand,
    commands.checkedListCommand,
];

const miscCommands: ICommand[] = [
    commands.link,
    commands.quote,
    commands.code,
    commands.codeBlock,
    commands.comment,
    commands.image,
    commands.table,
];

const fontCommands: ICommand[] = [
    commands.group([commands.title1, commands.title2, commands.title3, commands.title4, commands.title5, commands.title6], {
        name: 'title',
        groupName: 'title',
        buttonProps: { 'aria-label': 'Insert title' },
    }),
    commands.bold,
    commands.italic,
    commands.strikethrough,
    commands.hr,
];

const finalCommands: ICommand[] = [
    ...fontCommands,
    commands.divider,
    ...miscCommands,
    commands.divider,
    ...listCommands,
    commands.divider,
    commands.help,
];

export default function ArticleCreationForm({ authorId }: { authorId: string; }) {
    const t = useTranslations('ArticleCreationForm');
    const locale = useLocale();

    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>(""); // Markdown content
    const [imageURL, setImageURL] = useState<string | null>(null);
    const [selectedImageID, setSelectedImageID] = useState<string | null>(null);
    const [showMediaPopup, setShowMediaPopup] = useState(false);
    const [slug, setSlug] = useState<string>("");  // State for the slug
    const [titleExists, setTitleExists] = useState<boolean>(false);  // State to track if the slug exists


    useEffect(() => {
        if (categories.length === 0) {
            const fetchCategories = async () => {
                const data = await getCategories();
                setCategories(data);
                setSelectedCategory(data[0]);
            };
            fetchCategories();
        }
    }, [categories]);

    const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const selectedCategory = categories.find((category) => category.name === e.target.value);
        setSelectedCategory(selectedCategory || null);
    };

    const handleMediaSelect = (selectedImageID: string, selectedImage: string) => {
        setSelectedImageID(selectedImageID);
        setImageURL(selectedImage);
        setShowMediaPopup(false);
    };

    // Handle title change
    const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setTitle(newTitle);

        // Convert title to slug and check if the slug already exists
        const newSlug = newTitle.replace(/\s+/g, '-').toLowerCase();
        setSlug(newSlug);  // Set the initial slug

        const checkSlugUniqueness = async () => {
            let finalSlug = newSlug;
            let suffix = 1;

            // Check if the slug already exists, and keep appending numbers until a unique slug is found
            while (await checkSlugExists(finalSlug)) {
                finalSlug = `${newSlug}-${suffix}`;
                suffix++;
            }

            // Update state with the unique slug
            setSlug(finalSlug);
            setTitleExists(finalSlug !== newSlug);  // Indicate if the slug was modified
        };

        checkSlugUniqueness();
    };

    const router = useRouter();
    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent the default form submission

        const catID = selectedCategory ? selectedCategory.id : null;
        if (!title || !content || !catID) {
            alert("Please fill in all required fields.");
            return;
        }

        const res = await createPost({
            content,
            title,
            categoryId: catID,
            imageId: selectedImageID ? selectedImageID : null,
            createdAt: new Date(),
            authorId,
            slug,  // Use the generated slug (original or modified)
        });

        // Redirect to the newly created article page
        router.push(`/article/${res.slug}`);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">{t('title')}</h1>
            <form onSubmit={handleFormSubmit} className="space-y-6">
                {/* Image Section */}
                <div className="relative mb-6 flex justify-start">
                    {imageURL ? (
                        <Image
                            src={imageURL}
                            alt="Selected Media"
                            className="w-full h-auto md:w-96 object-cover rounded-lg"
                            width={500}
                            height={500}
                            onClick={() => setShowMediaPopup(true)}
                            priority // Preload this image
                            placeholder="empty" // Lazy loading with blur effect
                        />
                    ) : (
                        <div
                            className="w-full md:w-96 h-48 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700"
                            onClick={() => setShowMediaPopup(true)}
                        >
                            <IoAddCircleOutline className="text-4xl text-gray-500" />
                        </div>
                    )}
                </div>
                {/* Category */}
                <div className="mb-4">
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('category')}
                    </label>
                    <select
                        id="category"
                        value={selectedCategory?.name}
                        onChange={(e) => handleCategoryChange(e)}
                        className="mt-1 block w-full bg-transparent text-gray-700 dark:text-gray-300 text-lg rounded-lg border border-gray-300 dark:border-gray-700 p-2"
                        required
                    >
                        <option value="" disabled>
                            {t('selectACategory')}
                        </option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Title */}
                <div className="mb-4">
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={handleTitleChange}
                        className="mt-1 block w-full bg-transparent outline-none text-black dark:text-white text-2xl font-semibold rounded-lg p-2"
                        placeholder={t('enterArticleTitle')}
                        required
                    />
                    {titleExists && <p className="text-yellow-600 text-sm mt-2">{t('savedAsSlug', { slug })}</p>}
                </div>

                {/* Markdown Editor */}
                <div className="mb-6">
                    <MDEditor
                        lang={locale}
                        value={content}
                        onChange={(value) => setContent(value || "")}
                        height={400}
                        className="mt-2 block w-full text-black dark:text-white text-2xl font-semibold rounded-lg p-2 bg-transparent"
                        commands={finalCommands.length > 0 ? finalCommands : undefined}
                        preview="live"
                        previewOptions={{
                            rehypePlugins: [[rehypeRaw]],
                        }}
                    />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        {t('createArticle')}
                    </button>
                </div>
            </form>

            {showMediaPopup && <MediaSelectorPopUp onSelect={handleMediaSelect} selected={imageURL || undefined} selectedId={selectedImageID || undefined} />}
        </div>
    );
}

"use client";

import { useEffect, useState, ChangeEvent } from "react";
import dynamic from "next/dynamic";
import { getCategories } from "@/actions/categories";
import MediaSelectorPopUp from "@/components/MediaSelectorPopUp";
import { Category } from "@prisma/client";
import { IoAddCircleOutline } from "react-icons/io5";
import Image from "next/image";
import { commands, ICommand } from "@uiw/react-md-editor";
import { createPost, checkSlugExists } from "@/actions/post";
import rehypeRaw from "rehype-raw";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { toast } from "sonner";

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

const LANGUAGES = [
    { code: "en", name: "English" },
    { code: "de", name: "German" },
    { code: "fr", name: "French" },
    { code: "lu", name: "Luxembourgish" },
];

export default function ArticleCreationForm({ authorId }: { authorId: string }) {
    const t = useTranslations("ArticleCreationForm");
    const locale = useLocale();

    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [translations, setTranslations] = useState<{ [key: string]: { title: string; content: string } }>(
        {
            en: { title: "", content: "" },
        }
    );
    const [imageURL, setImageURL] = useState<string | null>(null);
    const [selectedImageID, setSelectedImageID] = useState<string | null>(null);
    const [showMediaPopup, setShowMediaPopup] = useState(false);
    const [selectedLang, setSelectedLang] = useState<string>("en");

    useEffect(() => {
        const fetchCategories = async () => {
            const data = await getCategories();
            setCategories(data);
            setSelectedCategory(data[0]);
        };
        fetchCategories();
    }, []);

    const handleTranslationChange = (lang: string, field: "title" | "content", value: string) => {
        setTranslations((prev) => ({
            ...prev,
            [lang]: { ...prev[lang], [field]: value },
        }));
    };

    const handleMediaSelect = (selectedImageID: string, selectedImage: string) => {
        setSelectedImageID(selectedImageID);
        setImageURL(selectedImage);
        setShowMediaPopup(false);
    };

    const generateUniqueSlug = async (title: string): Promise<string> => {
        let baseSlug = title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-");
        let uniqueSlug = baseSlug;
        let counter = 1;

        while (await checkSlugExists(uniqueSlug)) {
            uniqueSlug = `${baseSlug}-${counter}`;
            counter++;
        }

        return uniqueSlug;
    };

    const router = useRouter();

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const catID = selectedCategory ? selectedCategory.id : null;

        if (!catID) return toast.error(t("selectCategory"), { position: "top-center" });

        const english = translations.en;

        // Check if any english fields are empty
        if (!english.title) return toast.error(t("enterArticleTitleEn"), { position: "top-center" });
        if (!english.content) return toast.error(t("enterArticleContentEn"), { position: "top-center" });

        // Loop over all other languages and check if any fields are empty
        for (const [lang, { title, content }] of Object.entries(translations)) {
            if (lang == "en") continue;

            if (!title) return toast.error(t("enterArticleTitle", { lang }), { position: "top-center" });
            if (!content) return toast.error(t("enterArticleContent", { lang }), { position: "top-center" });
        }

        try {
            const slug = await generateUniqueSlug(english.title);

            await toast.promise(
                createPost({
                    content: english.content,
                    title: translations.en.title,
                    categoryId: catID,
                    imageId: selectedImageID || null,
                    createdAt: new Date(),
                    authorId,
                    slug,
                }),
                {
                    loading: t("creatingPostLoading"),
                    success: t("creatingPostSuccess"),
                    error: t("creatingPostError"),
                    position: "top-center",
                },
            );

            // Redirect to the created article
            router.push(`/article/${slug}`);
        } catch (error) {
            console.error("Error creating post:", error);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">{t("title")}</h1>
            <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="relative mb-6 flex justify-start">
                    {imageURL ? (
                        <Image
                            src={imageURL}
                            alt="Selected Media"
                            className="w-full h-auto md:w-96 object-cover rounded-lg"
                            width={500}
                            height={500}
                            onClick={() => setShowMediaPopup(true)}
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

                <div className="mb-4">
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t("category")}
                    </label>
                    <select
                        id="category"
                        value={selectedCategory?.name}
                        onChange={(e) => setSelectedCategory(categories.find((c) => c.id === e.target.value) || null)}
                        className="mt-1 block w-full bg-transparent text-gray-700 dark:text-gray-300 text-lg rounded-lg border border-gray-300 dark:border-gray-700 p-2"
                        required
                    >
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center space-x-2">
                            <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                {t("currentLanguage")}:
                            </span>
                            <select
                                value={selectedLang}
                                onChange={(e) => setSelectedLang(e.target.value)}
                                className="p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:outline-none"
                            >
                                {LANGUAGES.map((lang) => (
                                    <option key={lang.code} value={lang.code}>
                                        {lang.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {LANGUAGES.map((lang) => (
                        <div
                            id={`lang-${lang.code}`}
                            key={lang.code}
                            className={
                                selectedLang === lang.code
                                    ? "block border-2 border-blue-500 rounded-lg p-4 bg-gray-50 dark:bg-gray-800"
                                    : "hidden"
                            }
                        >
                            <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-200">
                                {t("editingLanguage")}: {lang.name}
                            </h2>
                            <input
                                type="text"
                                value={translations[lang.code]?.title || ""}
                                onChange={(e) => handleTranslationChange(lang.code, "title", e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg mb-4 focus:ring focus:ring-blue-500 focus:outline-none"
                                placeholder={t("enterArticleTitle")}
                            />
                            <MDEditor
                                value={translations[lang.code]?.content || ""}
                                onChange={(value) => handleTranslationChange(lang.code, "content", value || "")}
                                height={300}
                                commands={finalCommands}
                                preview="live"
                                previewOptions={{ rehypePlugins: [[rehypeRaw]] }}
                            />
                        </div>
                    ))}
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        {t("createArticle")}
                    </button>
                </div>
            </form>

            {showMediaPopup && (
                <MediaSelectorPopUp
                    onSelect={handleMediaSelect}
                    selected={imageURL || undefined}
                    selectedId={selectedImageID || undefined}
                />
            )}
        </div>
    );
}
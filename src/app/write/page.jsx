"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import dynamic from "next/dynamic"; // Import dynamic from next/dynamic
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
} from "firebase/storage";
import { app } from "@/utils/firebase";
import styles from "./writePage.module.css";
import "react-quill/dist/quill.bubble.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false }); // Dynamically import ReactQuill with no SSR

const getUser = async () => {
    const res = await fetch('/api/user/', { cache: "no-store" });
    if (res.ok) return { data: await res.json(), authenticated: true };
    if (res.status === 401) return { data: null, authenticated: false };
    throw new Error();
};

const getCategories = async () => {
    const res = await fetch('/api/categories', { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch categories");
    return res.json();
};

const getData = async () => {
    const [userData, categoriesData] = await Promise.all([getUser(), getCategories()]);
    return { userData, categoriesData };
};

const WritePage = () => {
    const [categories, setCategories] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [file, setFile] = useState(null);
    const [media, setMedia] = useState("");
    const [value, setValue] = useState("");
    const [title, setTitle] = useState("");
    const [catSlug, setCatSlug] = useState("");

    const { status } = useSession();
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { userData, categoriesData } = await getData();
                if (!userData.authenticated) router.push("/");
                setCategories(categoriesData);

                // Set a default category
                if (categoriesData.length > 0) {
                    setCatSlug(categoriesData[0].slug);
                }

                setUser(userData.data);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    useEffect(() => {
        if (!file) return;

        const storage = getStorage(app);

        const isImageOrVideoFile = (file) => {
            const acceptedImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
            const acceptedVideoTypes = ["video/mp4", "video/ogg", "video/webm"];
            return file && (acceptedImageTypes.includes(file.type) || acceptedVideoTypes.includes(file.type));
        };

        const uploadFile = () => {
            if (!isImageOrVideoFile(file)) {
                console.error("File is not an accepted image or video type");
                return;
            }

            const name = `${Date.now()}_${file.name}`;
            const storageRef = ref(storage, name);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload is ${progress}% done`);
                },
                (error) => {
                    console.error("Upload error:", error);
                },
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    setMedia(downloadURL);
                }
            );
        };

        uploadFile();
    }, [file]);

    const isWriter = useMemo(() => user?.roles.includes('writer') || user?.roles.includes('admin'), [user]);

    const handleTitleChange = useCallback((e) => setTitle(e.target.value), []);
    const handleCategoryChange = useCallback((e) => setCatSlug(e.target.value), []);
    const handleFileChange = useCallback((e) => setFile(e.target.files[0]), []);
    const toggleOpen = useCallback(() => setOpen((prev) => !prev), []);
    const slugify = useCallback((str) => str.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, ""), []);

    const handleSubmit = async () => {
        if (!title) {
            alert("Please enter a title");
            return;
        }

        if (!value) {
            alert("Please enter some content");
            return;
        }

        if (!catSlug) {
            alert("Please select a category");
            return;
        }

        const res = await fetch("/api/posts", {
            method: "POST",
            body: JSON.stringify({
                title,
                desc: value,
                img: media,
                slug: slugify(title),
                catSlug,
            }),
        });

        if (res.ok) {
            const data = await res.json();
            router.push(`/posts/${data.slug}`);
        }
    };

    if (loading) return null;
    if (!isWriter) router.push("/");

    const toolbarOptions = [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
        ["clean"],
    ];

    return (
        <div className={styles.container}>
            <input
                type="text"
                placeholder="Title"
                className={styles.input}
                onChange={handleTitleChange}
            />
            <select className={styles.select} onChange={handleCategoryChange} value={catSlug}>
                {categories.map((category) => (
                    <option key={category.slug} value={category.slug}>
                        {category.title}
                    </option>
                ))}
            </select>
            <div className={styles.editor}>
                <button className={styles.button} onClick={toggleOpen}>
                    <Image src="/plus.png" alt="Add" width={16} height={16} />
                </button>
                {open && (
                    <div className={styles.add}>
                        <input
                            type="file"
                            id="media"
                            accept="image/*,video/*"
                            onChange={handleFileChange}
                            style={{ display: "none" }}
                        />
                        <label htmlFor="media" className={styles.addButton}>
                            <Image src="/image.png" alt="Add Image" width={16} height={16} />
                        </label>
                        <button className={styles.addButton}>
                            <Image src="/external.png" alt="Add Link" width={16} height={16} />
                        </button>
                        <button className={styles.addButton}>
                            <Image src="/video.png" alt="Add Video" width={16} height={16} />
                        </button>
                    </div>
                )}
                <ReactQuill
                    className={styles.textArea}
                    theme="bubble"
                    value={value}
                    onChange={setValue}
                    placeholder="Tell your story..."
                    modules={{
                        toolbar: toolbarOptions,
                    }}
                />
            </div>
            <button className={styles.publish} onClick={handleSubmit}>
                Publish
            </button>
        </div>
    );
};

export default WritePage;
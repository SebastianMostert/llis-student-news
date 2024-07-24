import React from 'react'
import styles from './footer.module.css'
import Image from 'next/image'
import Link from 'next/link'
import { getBaseUrl } from "@/utils/config";

const getData = async () => {
    const res = await fetch(`${getBaseUrl()}/api/categories`, {
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Failed");
    }

    return res.json();
};

const Footer = async () => {

    const categories = await getData();

    return (
        <div className={styles.container}>
            <div className={styles.info}>
                <div className={styles.logo}>
                    <Image src="/logo.png" alt="logo" width={50} height={50} />
                    <h1>LLIS - Student News</h1>
                </div>
                <p className={styles.desc}>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Commodi at, sunt, corrupti enim eligendi vitae recusandae
                    quas aut consequuntur libero, mollitia reiciendis. Provident
                    voluptate nulla iure quae explicabo quaerat unde?
                </p>
                <div className={styles.icons}>
                    <Image src="/facebook.png" alt="facebook" width={18} height={18} />
                    <Image src="/instagram.png" alt="instagram" width={18} height={18} />
                    <Image src="/youtube.png" alt="youtube" width={18} height={18} />
                </div>
            </div>
            <div className={styles.links}>
                <div className={styles.list}>
                    <span className={styles.listTitle}>Links</span>
                    <Link href="/">Homepage</Link>
                    <Link href="/about">About</Link>
                    <Link href="/contact">Contact</Link>
                </div>
                <div className={styles.list}>
                    <span className={styles.listTitle}>Tags</span>
                    {categories.map((category) => (
                        <Link href={`/blog?cat=${category.slug}`} key={category._id}> {category.title}</Link>
                    ))}
                </div>
                <div className={styles.list}>
                    <span className={styles.listTitle}>Social</span>
                    <Link href="https://facebook.com">Facebook</Link>
                    <Link href="https://instagram.com">Instagram</Link>
                    <Link href="https://youtube.com">Youtube</Link>
                </div>
            </div>
        </div>
    )
}

export default Footer
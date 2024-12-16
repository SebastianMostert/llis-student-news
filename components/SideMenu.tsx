"use client";

import { Bars3Icon, UserMinusIcon, UserPlusIcon, XMarkIcon } from "@heroicons/react/16/solid";
import React, { useState } from "react";
import {
    Drawer,
    IconButton,
    List,
    ListItemButton,
    ListItemText,
    Button,
    ListSubheader,
} from "@mui/material";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { useTranslations } from "next-intl";

const Links: SideMenuCategory[] = [
    {
        categoryNameTranslationKey: "editor",
        protected: true,
        links: [{ titleTranslationKey: "newArticle", href: "/new-article", protected: true }],
    },
];

const SideMenu = () => {
    const t = useTranslations('SideMenu');
    const [open, setOpen] = useState(false);
    const { data: session } = useSession();
    const user = session?.user;

    const toggleDrawer = (open: boolean) => () => {
        setOpen(open);
    };

    const filteredLinks = Links.filter((category) => {
        if (category.protected && !user) return false;

        category.links = category.links.filter((link) => {
            if (link.protected && !user) return false;
            return true;
        });

        return true;
    });

    const showDrawer = !(filteredLinks.length <= 0)

    return (
        <div>
            {/* Burger Icon */}
            {showDrawer ? (
                <IconButton onClick={toggleDrawer(true)} className="h-10 w-10" disabled={!showDrawer}>
                    <Bars3Icon className="h-8 w-8 cursor-pointer text-black dark:text-white" />
                </IconButton>
            ) : !user ? (
                <IconButton onClick={() => signIn()} className="h-10 w-10" disabled={showDrawer}>
                    <UserPlusIcon className="h-8 w-8 cursor-pointer text-black dark:text-white" />
                </IconButton>
            ) : (
                <IconButton onClick={() => signOut()} className="h-10 w-10" disabled={showDrawer}>
                    <UserMinusIcon className="h-8 w-8 cursor-pointer text-black dark:text-white" />
                </IconButton>
            )}

            {/* Drawer for Side Menu */}
            {showDrawer && (
                <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
                    <div className="bg-secondaryBg-light dark:bg-secondaryBg-dark p-2 h-full text-black dark:text-white flex flex-col justify-between w-svw sm:w-64">
                        {/* Close Button */}
                        <div className="flex justify-end mb-4">
                            <IconButton
                                onClick={toggleDrawer(false)}
                                className="text-black dark:text-white"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </IconButton>
                        </div>
                        {/* List of Links */}
                        <List className="flex-grow">
                            {filteredLinks.map((category, index) => {
                                if (category.protected && !user) return null;
                                return (
                                    <div key={index} className="mb-4">
                                        {category.categoryNameTranslationKey && (
                                            <ListSubheader
                                                key={category.categoryNameTranslationKey}
                                                className="bg-secondaryBg-light dark:bg-secondaryBg-dark text-black dark:text-white font-semibold text-lg tracking-wide uppercase py-2 px-4 border-b border-gray-300 dark:border-gray-700"
                                            >
                                                {t(category.categoryNameTranslationKey)}
                                            </ListSubheader>
                                        )}
                                        {category.links.map((link, i) => {
                                            if (link.protected && !user) return null;
                                            return (
                                                <Link href={link.href} passHref key={i}>
                                                    <ListItemButton
                                                        onClick={toggleDrawer(false)}
                                                        className="hover:bg-primaryBg-light dark:hover:bg-primaryBg-dark rounded px-4"
                                                    >
                                                        <ListItemText
                                                            primary={t(link.titleTranslationKey)}
                                                            className="flex items-center justify-center sm:justify-start"
                                                        />
                                                    </ListItemButton>
                                                </Link>
                                            )
                                        })}
                                    </div>
                                )
                            })}
                        </List>
                        {/* Sign In / Sign Out */}
                        <div className="border-t border-gray-300 dark:border-gray-700 mt-4 pt-4 px-4">
                            {user ? (
                                <Button
                                    onClick={() => signOut()}
                                    fullWidth
                                    variant="contained"
                                    className="bg-accent-light dark:bg-accent-dark hover:bg-accent-hover-light dark:hover:bg-accent-hover-dark text-white"
                                >
                                    {t('signOut')}
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => signIn()}
                                    fullWidth
                                    variant="contained"
                                    className="bg-accent-light dark:bg-accent-dark hover:bg-accent-hover-light dark:hover:bg-accent-hover-dark text-white"
                                >
                                    {t('signIn')}
                                </Button>
                            )}
                        </div>
                    </div>
                </Drawer>
            )}
        </div>
    )
};

export default SideMenu;

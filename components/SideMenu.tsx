"use client";

import { Bars3Icon, XMarkIcon } from "@heroicons/react/16/solid";
import React, { useState } from "react";
import { Drawer, IconButton, List, ListItemButton, ListItemText, Button, ListSubheader } from "@mui/material";
import Link from "next/link";

const Links: SideMenuCategory[] = [
    {
        links: [
            { title: "Home", href: "/" },
        ],
    },
    {
        categoryName: "Editor",
        links: [
            { title: "New Article", href: "/new-article" },
        ],
    },
];

const SideMenu = () => {
    const [open, setOpen] = useState(false);

    const toggleDrawer = (open: boolean) => () => {
        setOpen(open);
    };

    return (
        <div>
            {/* Burger Icon */}
            <IconButton onClick={toggleDrawer(true)} className="h-10 w-10">
                <Bars3Icon className="h-8 w-8 cursor-pointer text-black dark:text-white" />
            </IconButton>
            {/* Drawer for Side Menu */}
            <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
                <div
                    className="bg-secondaryBg-light dark:bg-secondaryBg-dark p-2 h-full text-black dark:text-white flex flex-col justify-between w-svw sm:w-64"
                >
                    {/* Close Button */}
                    <div className="flex justify-end mb-4">
                        <IconButton onClick={toggleDrawer(false)} className="text-black dark:text-white">
                            <XMarkIcon className="h-6 w-6" />
                        </IconButton>
                    </div>
                    {/* List of Links */}
                    <List className="flex-grow">
                        {Links.map((category, index) => (
                            <div key={index} className="mb-4">
                                {category.categoryName && (
                                    <ListSubheader
                                        key={category.categoryName}
                                        className="bg-secondaryBg-light dark:bg-secondaryBg-dark text-black dark:text-white font-semibold text-lg tracking-wide uppercase py-2 px-4 border-b border-gray-300 dark:border-gray-700"
                                    >
                                        {category.categoryName}
                                    </ListSubheader>
                                )}
                                {category.links.map((link, i) => (
                                    <Link href={link.href} passHref key={i}>
                                        <ListItemButton
                                            onClick={toggleDrawer(false)}
                                            className="hover:bg-primaryBg-light dark:hover:bg-primaryBg-dark rounded px-4"
                                        >
                                            <ListItemText
                                                primary={link.title}
                                                className="flex items-center justify-center sm:justify-start"
                                            />
                                        </ListItemButton>
                                    </Link>
                                ))}
                            </div>
                        ))}
                    </List>

                </div>
            </Drawer>
        </div>
    );
};

export default SideMenu;

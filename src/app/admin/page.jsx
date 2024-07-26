"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { FaComment, FaNewspaper, FaUsers } from 'react-icons/fa';
import { Box, Typography, Grid, Card, CardContent, CardMedia, Skeleton } from '@mui/material';
import styles from './adminPage.module.css';

const getData = async () => {
    const res = await fetch('/api/user/', {
        cache: "no-store",
    });

    if (res.ok) return { data: await res.json(), authenticated: true };
    else if (res.status === 401) return { data: null, authenticated: false };
    else throw new Error();
};

const cardData = [
    {
        title: "Posts",
        url: "/admin/posts",
        description: "See all posts, delete them, select featured posts and choose editors pick",
        icon: <FaNewspaper className={styles.icon} />,
    },
    {
        title: "Comments",
        url: "/admin/comments",
        description: "See the comments that have been flagged by users or the AI",
        icon: <FaComment className={styles.icon} />,
    },
    {
        title: "Users",
        url: "/admin/users",
        description: "See all users and delete them or edit their roles",
        icon: <FaUsers className={styles.icon} />,
    },
];

const AdminCard = ({ card, router }) => {
    return (
        <Grid item xs={12} sm={6} md={4}>
            <Card
                onClick={() => router.push(card.url)}
                sx={{
                    backgroundColor: 'var(--softBg)',
                    color: 'var(--textColor)',
                    textAlign: 'center',
                    borderRadius: '8px',
                    boxShadow: 3,
                    cursor: 'pointer',
                    margin: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%', // Ensure the card stretches to fill the container height
                    '&:hover': {
                        transform: 'scale(1.05)',
                    },
                    transition: 'transform 0.3s',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 2,
                    }}
                >
                    {card.icon}
                </Box>
                <CardContent
                    sx={{
                        padding: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexGrow: 1, // Allow content to expand
                    }}
                >
                    <Typography variant="h6" component="h3">
                        {card.title}
                    </Typography>
                    <Typography variant="body2">
                        {card.description}
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
    );
};

const SkeletonCard = () => {
    return (
        <Grid item xs={12} sm={6} md={4}>
            <Card sx={{
                backgroundColor: 'var(--softBg)',
                color: 'var(--textColor)',
                textAlign: 'center',
                borderRadius: '8px',
                boxShadow: 3,
                cursor: 'pointer',
                margin: 'auto',
                transition: 'transform 0.3s',
                height: '100%', // Ensure the card stretches to fill the container height
                '&:hover': {
                    transform: 'scale(1.05)',
                },
            }}>
                <Box sx={{
                    height: 140,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: 'auto',
                }}>
                    <Skeleton variant="circular" height={80} width={80} />
                </Box>
                <CardContent sx={{
                    paddingTop: 0, // Remove extra padding from the top
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Skeleton variant="text" height={30} width="80%" />
                    <Skeleton variant="text" height={20} width="60%" />
                </CardContent>
            </Card>
        </Grid>
    );
};


const AdminPage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        getData().then(({ data, authenticated }) => {
            if (!authenticated) router.push("/login");
            setUser(data);
            setLoading(false);
        });
    }, [router]);

    if (loading) {
        return (
            <Box sx={{ backgroundColor: 'var(--bg)', color: 'var(--textColor)', padding: 4 }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 4 }}>
                    <Skeleton variant="text" component={"h3"} width="25%" sx={{ marginLeft: 'auto', marginRight: 'auto' }} />
                </Typography>
                <Typography variant="h6" component="h2" sx={{ textAlign: 'center', mb: 4 }}>
                    <Skeleton variant="text" component={"h5"} width="20%" sx={{ marginLeft: 'auto', marginRight: 'auto' }} />
                </Typography>
                <Grid container spacing={4}>
                    {cardData.map((_, index) => (
                        <SkeletonCard key={index} />
                    ))}
                </Grid>
            </Box>
        );
    }

    const isAdmin = user?.roles.includes("admin");

    if (!isAdmin) {
        router.push("/");
        return null;
    }

    return (
        <Box sx={{ backgroundColor: 'var(--bg)', color: 'var(--textColor)', padding: 4 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 4 }}>
                Admin Dashboard
            </Typography>
            <Typography variant="h6" component="h2" sx={{ textAlign: 'center', mb: 4 }}>
                Manage your site&apos;s content
            </Typography>
            <Grid container spacing={4}>
                {cardData.map((card, index) => (
                    <AdminCard key={index} card={card} router={router} />
                ))}
            </Grid>
        </Box>
    );
};

export default AdminPage;

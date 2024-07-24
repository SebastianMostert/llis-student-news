"use client";

import { useCallback, useEffect, useMemo, useState } from 'react'
import styles from './authLinks.module.css'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react';

const getData = async () => {
  const res = await fetch('/api/user/', {
    cache: "no-store",
  });

  if (res.ok) return { data: await res.json(), authenticated: true };
  else if (res.status === 401) return { data: null, authenticated: false };
  else throw new Error();
};

const AuthLinks = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const { status } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, authenticated } = await getData();
        if (authenticated) {
          setUser(data);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const isAuthenticated = useMemo(() => status === 'authenticated', [status]);
  const isAdmin = useMemo(() => user?.roles.includes('admin'), [user]);
  const isWriter = useMemo(() => user?.roles.includes('writer') || isAdmin, [user, isAdmin]);

  const toggleMenu = useCallback(() => setOpen(prev => !prev), []);

  if (loading) return null;

  const renderLinks = () => (
    <>
      {isAdmin && (
        <Link href="/admin" className={styles.link}>
          Admin
        </Link>
      )}
      {isWriter && (
        <Link href="/write" className={styles.link}>
          Write
        </Link>
      )}
      <span className={styles.link} onClick={signOut}>
        Logout
      </span>
    </>
  );

  return (
    <>
      {isAuthenticated ? renderLinks() : (
        <Link href="/login" className={styles.link}>
          Login
        </Link>
      )}
      <div className={styles.burger} onClick={toggleMenu}>
        <div className={styles.line}></div>
        <div className={styles.line}></div>
        <div className={styles.line}></div>
      </div>
      {open && (
        <div className={styles.responsiveMenu}>
          <Link href="/">Homepage</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          {isAuthenticated ? renderLinks() : (
            <Link href="/login">Login</Link>
          )}
        </div>
      )}
    </>
  );
};

export default AuthLinks;
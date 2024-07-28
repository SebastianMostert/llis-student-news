// Ensure this runs only on the client
"use client";

import { useEffect, useState, useMemo, useCallback } from 'react';
import styles from './authLinks.module.css';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { checkPermissions } from '@/utils/checkPermissions';
import { Permissions } from '@/utils/constant';

const AuthLinks = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isWriter, setIsWriter] = useState(false);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const { status } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsAdmin(await checkPermissions({
          permissionsToCheck: [
            Permissions.Administrator
          ],
        }));

        setIsWriter(await checkPermissions({
          permissionsToCheck: [
            Permissions.WritePost
          ],
        }));
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const isAuthenticated = useMemo(() => status === 'authenticated', [status]);

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
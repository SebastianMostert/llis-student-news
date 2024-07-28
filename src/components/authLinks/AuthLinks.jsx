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
          ]
        }));

        setIsWriter(await checkPermissions({
          permissionsToCheck: [
            Permissions.WritePost
          ]
        }));
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (open) {
      document.body.classList.add(styles.noScroll);
    } else {
      document.body.classList.remove(styles.noScroll);
    }

    // Cleanup the effect by removing the class when the component unmounts
    return () => {
      document.body.classList.remove(styles.noScroll);
    };
  }, [open]);

  const isAuthenticated = useMemo(() => status === 'authenticated', [status]);

  const toggleMenu = useCallback(() => setOpen(prev => !prev), []);

  const closeMenu = useCallback(() => setOpen(false), []);

  if (loading) return null;

  return (
    <>
      {isAuthenticated ? (
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
      ) : (
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
          <Link href="/" onClick={closeMenu}>Homepage</Link>
          <Link href="/about" onClick={closeMenu}>About</Link>
          <Link href="/contact" onClick={closeMenu}>Contact</Link>
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <Link href="/admin" onClick={closeMenu}>
                  Admin
                </Link>
              )}
              {isWriter && (
                <Link href="/write" onClick={closeMenu}>
                  Write
                </Link>
              )}
              <span onClick={() => {
                signOut();
                closeMenu();
              }}>
                Logout
              </span>
            </>
          ) : (
            <Link href="/login" onClick={closeMenu}>Login</Link>
          )}
        </div>
      )}
    </>
  );
};

export default AuthLinks;

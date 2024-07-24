"use client";

import React, { useEffect, useState } from 'react'
import styles from './commentsPage.module.css'
import useSWR from 'swr';
import Comment from '@/components/Comment/Comment';
import ReportCard from '@/components/reportCard/ReportCard';

const fetcher = async (url) => {
  const res = await fetch(url);

  const data = await res.json();

  if (!res.ok) {
    const error = new Error(data.message);
    throw error;
  }

  return data;
};

const getUser = async () => {
  const res = await fetch('/api/user/', { cache: "no-store", });
  if (res.ok) return { data: await res.json(), authenticated: true };
  if (res.status === 401) return { data: null, authenticated: false };
  throw new Error();
};

const CommentsPage = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUser().then(({ data, authenticated }) => {
      if (!authenticated) return;
      setUser(data);
      setLoading(false);
    })
  }, []);

  const { data, mutate, isLoading } = useSWR(
    '/api/comments',
    fetcher
  );

  if (loading) return null;
  if (isLoading) return <div>Loading...</div>

  // Sort based on the number of data.Report.length
  let sortedData = data.sort((a, b) => b.Report.length - a.Report.length);

  // Remove comments with no reports
  sortedData = sortedData.filter((comment) => comment.Report.length > 0);

  if(sortedData.length === 0) return <h1>Wow! You&apos;re all caught up, nothing has been reported.</h1>

  return (
    <div>
      <h2>Reported Comments</h2>
      <br />
      {sortedData?.map((comment) => {
        return <ReportCard item={comment} key={comment.id} mutate={mutate} />
      })}
    </div>
  )
}

export default CommentsPage
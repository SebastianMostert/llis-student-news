"use client";

import React from 'react';
import { useLocale } from 'next-intl';

import TimeAgo from 'javascript-time-ago'
import ReactTimeAgo from 'react-time-ago'

import en from 'javascript-time-ago/locale/en'
import de from 'javascript-time-ago/locale/de'
import fr from 'javascript-time-ago/locale/fr'

TimeAgo.addLocale(en)
TimeAgo.addLocale(de)
TimeAgo.addLocale(fr)

type Props = {
  time: Date;
};

function LiveTimestamp({ time }: Props) {
  const locale = useLocale();

  return <ReactTimeAgo date={time} locale={locale} />
}

export default LiveTimestamp;

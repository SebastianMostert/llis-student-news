"use client"
import TimeAgo from 'react-timeago'

type Props = {
    time: Date
}

function LiveTimestamp({ time }: Props) {
  return (
    <TimeAgo date={time} />
  )
}

export default LiveTimestamp
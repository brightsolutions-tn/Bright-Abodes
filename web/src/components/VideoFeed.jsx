import React from 'react'
import MuxPlayer from '@mux/mux-player-react'

export default function VideoFeed({ playbackId }) {
  if (!playbackId) return <div className="text-gray-500 italic">No video to display</div>

  return (
    <div className="max-w-md mx-auto my-8">
      <MuxPlayer
        playbackId={playbackId}
        metadata={{
          video_id: 'video-id-123',
          video_title: 'Apartment Tour',
          viewer_user_id: 'user-id-007',
        }}
      />
    </div>
  )
}

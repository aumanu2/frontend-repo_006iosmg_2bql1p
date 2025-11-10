import React from 'react'

const isImage = (type) => type && type.startsWith('image/')
const isVideo = (type) => type && type.startsWith('video/')

export default function ChatMessage({ message }) {
  return (
    <div className="flex gap-3 items-start">
      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
        {message.username?.slice(0,1)?.toUpperCase() || 'U'}
      </div>
      <div className="flex-1">
        <div className="text-sm font-semibold text-gray-800">{message.username}</div>
        {message.text && (
          <div className="mt-1 text-sm text-gray-700 whitespace-pre-wrap">{message.text}</div>
        )}
        {message.file_url && (
          <div className="mt-2">
            {isImage(message.content_type) && (
              <img src={message.file_url} alt="upload" className="rounded-lg max-h-64 object-cover" />
            )}
            {isVideo(message.content_type) && (
              <video src={message.file_url} controls className="rounded-lg max-h-64" />
            )}
            {!isImage(message.content_type) && !isVideo(message.content_type) && (
              <a href={message.file_url} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">
                Download file
              </a>
            )}
          </div>
        )}
        {message.created_at && (
          <div className="mt-1 text-xs text-gray-400">{new Date(message.created_at).toLocaleString()}</div>
        )}
      </div>
    </div>
  )
}

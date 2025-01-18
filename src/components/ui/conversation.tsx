import React from 'react'

interface ConversationProps {
  avatar: string
  name: string
  message: string
  time: string
}

export function Conversation({ avatar, name, message, time }: ConversationProps) {
  return (
    <div className="h-15 flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg cursor-pointer">
      <img 
        src={avatar || "/placeholder.svg"} 
        alt={name} 
        className="w-14 h-14 rounded-full object-cover"
      />
      <div className="flex-1 min-w-0 pl-1">
        <h3 className="font-medium text-sm text-left">{name}</h3>
        <p className="text-sm text-gray-500 truncate text-left">{message}</p>
      </div>
      <span className="text-xs text-gray-400">{time}</span>
    </div>
  )
}


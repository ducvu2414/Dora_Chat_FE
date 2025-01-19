import React from 'react'
import { Users, UserPlus } from 'lucide-react'

interface DropdownProps {
  isOpen: boolean
  onClose: () => void
}

export function Dropdown({ isOpen, onClose }: DropdownProps) {
  if (!isOpen) return null

  return (
    <>
      <div 
        className="fixed inset-0" 
        onClick={onClose}
      />
      <div className="absolute left-0 top-full mt-1 w-48 rounded-lg border bg-white shadow-lg z-50">
        <div className="p-1">
          <button
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-regal-blue bg-gray-100 rounded-md"
            onClick={onClose}
          >
            <UserPlus className="w-4 h-4" />
            Add friend
          </button>
          <button
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-regal-blue bg-gray-100 rounded-md"
            onClick={onClose}
          >
            <Users className="w-4 h-4" />
            Create chat group
          </button>
        </div>
      </div>
    </>
  )
}


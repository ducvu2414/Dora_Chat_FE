/* eslint-disable react/prop-types */
import { useRef } from "react"
import { Trash2, Pencil } from "lucide-react"

export function ChannelContextMenu({ x, y, channelId, onDelete }) {
  const menuRef = useRef(null)

  return (
    <div
      ref={menuRef}
      className="fixed z-50 min-w-[160px] bg-white rounded-md shadow-lg border border-gray-200 py-1"
      style={{ left: `${x}px`, top: `${y}px` }}
    >
      <button
        className="w-full flex items-center px-4 py-2 text-sm text-regal-blue hover:bg-gray-100 border-b"
        onClick={() => onDelete(channelId)}
      >
        <Pencil className="mr-2 h-4 w-4" />
        Rename
      </button>
      <button
        className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 border-b"
        onClick={() => onDelete(channelId)}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Delete
      </button>
    </div>
  )
}

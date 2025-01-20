import { X } from 'lucide-react'

// data: { isOpen, onClose, children, title }
export function Modal(data) {
  if (!data.isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50"
        onClick={data.onClose}
      />
      
      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-lg shadow-lg z-50">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-regal-blue">{data.title}</h2>
          <button 
            onClick={data.onClose}
            className="p-1 hover:bg-gray-100 rounded-full bg-white"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4">
          {data.children}
        </div>
      </div>
    </>
  )
}


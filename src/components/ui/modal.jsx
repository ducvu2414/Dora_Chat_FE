import { X } from "lucide-react";

// eslint-disable-next-line react/prop-types
export function Modal({ isOpen, onClose, children, title }) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[1000] bg-black/50" onClick={onClose} />
      {/* Modal */}
      <div className="fixed z-[1000] w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg left-1/2 top-1/2">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-regal-blue">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 bg-white rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">{children}</div>
      </div>
    </>
  );
}

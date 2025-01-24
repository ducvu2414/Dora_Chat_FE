
// eslint-disable-next-line react/prop-types
export function Dropdown({ isOpen, onClose, children, align = "left", verticalAlign = "bottom" }) {
  if (!isOpen) return null
  // if (!align || align === undefined || align === null) align = "left"
  // if (!verticalAlign || verticalAlign === undefined || verticalAlign === null) verticalAlign = "bottom"
  const getAlignment = () => {
    let alignment = ""
    if (align === "left") alignment += "right-0 "
    if (align === "right") alignment += "left-0 "
    if (verticalAlign === "top") alignment += "bottom-full mb-1 "
    if (verticalAlign === "bottom") alignment += "top-full mt-1 "
    return alignment
  }

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className={`absolute ${getAlignment()} w-48 rounded-lg border bg-white shadow-lg z-50`}>
        <div className="p-1">{children}</div>
      </div>
    </>
  )
}

// eslint-disable-next-line react/prop-types
export function DropdownItem({ icon: Icon, children, onClick }) {
  return (
    <button
      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-regal-blue bg-gray-100 rounded-md focus:outline-none"
      onClick={onClick}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  )
}


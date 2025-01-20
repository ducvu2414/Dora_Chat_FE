
// data: { isOpen, onClose, children, align = "left", verticalAlign = "bottom" }
export function Dropdown(data) {
  if (!data.isOpen) return null
  // if (!data.align || data.align === undefined || data.align === null) data.align = "left"
  // if (!data.verticalAlign || data.verticalAlign === undefined || data.verticalAlign === null) data.verticalAlign = "bottom"
  const getAlignment = () => {
    let alignment = ""
    if (data.align === "left") alignment += "right-0 "
    if (data.align === "right") alignment += "left-0 "
    if (data.verticalAlign === "top") alignment += "bottom-full mb-1 "
    if (data.verticalAlign === "bottom") alignment += "top-full mt-1 "
    return alignment
  }

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={data.onClose} />
      <div className={`absolute ${getAlignment()} w-48 rounded-lg border bg-white shadow-lg z-50`}>
        <div className="p-1">{data.children}</div>
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


/* eslint-disable react/prop-types */
export function Dropdown({
  isOpen,
  onClose,
  children,
  align = "left",
  verticalAlign = "bottom",
}) {
  if (!isOpen) return null;
  // if (!align || align === undefined || align === null) align = "left"
  // if (!verticalAlign || verticalAlign === undefined || verticalAlign === null) verticalAlign = "bottom"
  const getAlignment = () => {
    let alignment = "";
    if (align === "left") alignment += "right-0 ";
    if (align === "right") alignment += "left-0 ";
    if (verticalAlign === "top") alignment += "bottom-full mb-1 ";
    if (verticalAlign === "bottom") alignment += "top-full mt-1 ";
    return alignment;
  };

  return (
    <>
      <div
        className="fixed inset-0 z-[200] cursor-default"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      />

      <div
        className={`absolute ${getAlignment()} w-48 rounded-lg border bg-white shadow-lg z-[200]`}
      >
        <div className="p-1">{children}</div>
      </div>
    </>
  );
}

export function DropdownItem({ icon: Icon, children, onClick }) {
  return (
    <button
      className="flex items-center w-full gap-2 px-3 py-2 mt-1 text-sm bg-gray-100 rounded-md text-regal-blue focus:outline-none first:mt-0"
      onClick={onClick}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
}

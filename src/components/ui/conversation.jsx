// data: { avatar, name, message, time, onClick, isActive }

export function Conversation(data) {
  return (
    <div
      onClick={data.onClick}
      className={`h-15 flex items-center gap-3 p-3 rounded-lg cursor-pointer ${
        data.isActive ? "bg-blue-100" : "hover:bg-gray-100"
      }`}
    >
      <img
        src={data.avatar || "/placeholder.svg"}
        alt={data.name}
        className="w-14 h-14 rounded-full object-cover"
      />
      <div className="flex-1 min-w-0 pl-1">
        <h3 className="font-medium text-sm text-left">{data.name}</h3>
        <p className="text-sm text-gray-500 truncate text-left">{data.message}</p>
      </div>
      <span className="text-xs text-gray-400">{data.time}</span>
    </div>
  );
}

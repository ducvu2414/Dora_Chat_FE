/* eslint-disable react/prop-types */
import { useState } from "react";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { Search } from "lucide-react";
import Avatar from "@assets/chat/avatar.png";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";

export default function UserSelectionModal({
  buttonText = "Add",
  onSubmit = () => {},
  initialSelectedUsers = [],
  users = [],
  message = "",
  type = "add",
  channels = {},
  onGroupSelect,
  disabled = false,
  loading = false,
}) {
  const [search, setSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState(initialSelectedUsers);
  const [selectedChannels, setSelectedChannels] = useState({});

  const toggleSelect = (id) => {
    if (type.includes("transfer")) {
      // Transfer chỉ cho phép chọn một user/group
      setSelectedUsers([id]);
      if (type.includes("forward_group") && onGroupSelect) {
        onGroupSelect(id);
      }
    } else if (type.includes("forward_group")) {
      // Forward group cho phép chọn nhiều groups
      setSelectedUsers((prev) =>
        prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
      );
      if (onGroupSelect) {
        onGroupSelect(id);
      }
    } else {
      // Default behavior cho các type khác
      setSelectedUsers((prev) =>
        prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
      );
    }
  };

  const handleChannelSelect = (groupId, channelId) => {
    setSelectedChannels((prev) => ({
      ...prev,
      [groupId]: channelId,
    }));
  };

  const handleSubmit = () => {
    const selections = selectedUsers.map((id) => ({
      id,
      type: users.find((user) => user.id === id)?.type || "unknown",
      userId: type === "forward_individual" ? id : undefined,
      groupId: type === "forward_group" ? id : undefined,
      channelId: type === "forward_group" ? selectedChannels[id] : undefined,
    }));
    console.log("Selected Users:", selections);
    if (onSubmit) {
      onSubmit(selections);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(search.toLowerCase())
  );

  // Kiểm tra xem tất cả groups đã chọn đều có channel được chọn chưa
  const isSubmitDisabled = () => {
    if (disabled) return true;
    if (type === "forward_group") {
      return selectedUsers.some((id) => !selectedChannels[id]);
    }
    return false;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32 text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)]">
      {message && (
        <div className="p-2 mb-3 border-l-4 border-blue-500 rounded bg-gray-50">
          <span className="text-sm font-medium text-gray-600">
            Message Preview:
          </span>
          <p className="mt-1 text-sm text-gray-700 break-words">{message}</p>
        </div>
      )}

      <div className="relative mt-1">
        <Search className="absolute w-5 h-5 text-[#086DC0] translate-middle-y left-4 top-2" />
        <Input
          type="search"
          placeholder="Search..."
          className="w-full border rounded-full pl-12 py-2 bg-gray-50 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-[#086DC0] focus:border-[#086DC0]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex-1 mt-4 overflow-y-auto">
        {filteredUsers?.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className={`flex items-center justify-between border-b border-gray-200 ${
                selectedUsers.includes(user.id) ? "bg-blue-50" : ""
              }`}
            >
              <label className="flex items-center w-full gap-3 p-3 cursor-pointer hover:bg-gray-100">
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user.id)}
                  onChange={() => toggleSelect(user.id)}
                  className="w-5 h-5 border-2 border-[#086DC0] rounded-full appearance-none cursor-pointer focus:ring-0 checked:bg-[#086dc0] checked:border-[#086dc0] relative after:content-['✔']
                  after:absolute after:top-[0.5px] after:left-[2px] after:text-white after:text-sm after:font-bold after:opacity-0 checked:after:opacity-100"
                />

                <div className="flex items-center gap-3">
                  <img
                    src={user.avatar || Avatar}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="text-left">
                    <p className="text-base font-semibold">{user.name}</p>
                    <p className="text-xs text-gray-500">
                      {user.email ||
                        `${user.name
                          .toLowerCase()
                          .replace(/\s+/g, "")}@mail.com`}
                    </p>
                  </div>
                </div>
              </label>
              {type === "forward_group" &&
                selectedUsers.includes(user.id) &&
                channels[user.id] && (
                  <div className="mr-3">
                    <Select
                      onValueChange={(value) =>
                        handleChannelSelect(user.id, value)
                      }
                      value={selectedChannels[user.id] || ""}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a channel" />
                      </SelectTrigger>
                      <SelectContent className="z-[10000]">
                        {channels[user.id].map((channel) => (
                          <SelectItem key={channel.id} value={channel.id}>
                            {channel.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {!selectedChannels[user.id] && (
                      <p className="mt-1 text-xs text-red-500">
                        Please select a channel
                      </p>
                    )}
                  </div>
                )}
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-32 text-gray-500">
            No {type.includes("forward_group") ? "groups" : "users"} found
          </div>
        )}
      </div>

      {selectedUsers.length > 0 && (
        <div className="mt-4 space-y-2">
          {type === "forward_group" && (
            <div className="text-sm text-gray-600">
              Selected {selectedUsers.length} group(s).
              {selectedUsers.filter((id) => !selectedChannels[id]).length >
                0 && (
                <span className="ml-1 text-red-500">
                  Please select channels for all groups.
                </span>
              )}
            </div>
          )}
          <Button
            className="w-full bg-[#086DC0] text-white px-6 py-2 rounded-md hover:bg-[#065a9d] disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSubmit}
            disabled={isSubmitDisabled()}
          >
            {buttonText}{" "}
            {selectedUsers.length > 0 && `(${selectedUsers.length})`}
          </Button>
        </div>
      )}
    </div>
  );
}

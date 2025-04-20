/* eslint-disable react/prop-types */
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Avatar from "@assets/chat/avatar.png";

export default function UserSelectionModal({
  buttonText = "Add",
  onSubmit,
  initialSelectedUsers = [],
  users = [],
  message = null,
}) {
  const [search, setSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState(initialSelectedUsers);


  const toggleSelectUser = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(selectedUsers);
    } else {
      console.log("Selected users:", selectedUsers);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)]">
      {message && (
        <span className="mb-2 text-sm text-gray-500">Tin nhắn: {message}</span>
      )}

      {/* Search Input */}
      <div className="relative mt-1">
        <Search className="absolute w-5 h-5 text-[#086DC0] -translate-y-1/2 left-4 top-1/2" />
        <Input
          type="search"
          placeholder="Search..."
          className="w-full border rounded-full pl-12 py-2 bg-gray-50 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-[#086DC0] focus:border-[#086DC0]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* User List */}
      <div className="flex-1 mt-4 overflow-y-auto">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between border-b border-gray-200"
            >
              <label className="flex items-center w-full gap-3 p-3 cursor-pointer hover:bg-gray-100">
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user.id)}
                  onChange={() => toggleSelectUser(user.id)}
                  className="w-5 h-5 border-2 border-[#086DC0] rounded-full appearance-none cursor-pointer focus:ring-0 checked:bg-[#086DC0] checked:border-[#086DC0] relative 
                    after:content-['✔'] after:absolute after:top-[-0.5px] after:left-1 after:text-white after:text-sm after:font-bold after:opacity-0 checked:after:opacity-100"
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
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-32 text-gray-500">
            Không tìm thấy người dùng nào
          </div>
        )}
      </div>

      {/* Action Button */}
      {selectedUsers.length > 0 && (
        <Button
          className="mt-4 bg-[#086DC0] text-white px-6 py-2 rounded-md hover:bg-[#065a9d]"
          onClick={handleSubmit}
        >
          {buttonText} {selectedUsers.length > 0 && `(${selectedUsers.length})`}
        </Button>
      )}
    </div>
  );
}

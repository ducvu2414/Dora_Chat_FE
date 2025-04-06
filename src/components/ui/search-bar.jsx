import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AddDropdown } from "@/components/ui/add-dropdown";
import { AddFriendModal } from "@/components/ui/add-friend-modal";
import { AddGroupModal } from "@/components/ui/add-group-modal";

export function SearchBar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);
  const [isAddGroupOpen, setIsAddGroupOpen] = useState(false);

  return (
    <div className="relative flex items-center gap-2 p-2">
      <div className="relative flex-1">
        <Search className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-regal-blue" />
        <Input
          type="search"
          placeholder="Search"
          className="rounded-full pl-9 bg-gray-50 text-regal-blue placeholder:text-regal-blue border-regal-blue"
        />
      </div>
      <div className="relative">
        <Button
          size="icon"
          className="shrink-0 rounded-full bg-regal-blue text-white hover:scale-105 hover:bg-regal-blue/80 transition-all duration-200 border-none"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <Plus className="!h-6 !w-6" />
        </Button>
        <AddDropdown
          isOpen={isDropdownOpen}
          onClose={() => setIsDropdownOpen(false)}
          onAddFriend={() => setIsAddFriendOpen(true)}
          onCreateGroup={() => setIsAddGroupOpen(true)}
        />
      </div>
      <AddFriendModal
        isOpen={isAddFriendOpen}
        onClose={() => setIsAddFriendOpen(false)}
      />
      <AddGroupModal
        isOpen={isAddGroupOpen}
        onClose={() => setIsAddGroupOpen(false)}
      />
    </div>
  );
}

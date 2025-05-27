/* eslint-disable react/prop-types */
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

const ContactCardDropdown = ({
  onViewInfo,
  onSetNickname,
  onDelete,
}) => {

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-2 text-gray-400 bg-white rounded-full hover:text-gray-600 focus:outline-none">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-[200] w-56">
        <DropdownMenuItem onClick={onViewInfo}>
          <span>View info</span>
        </DropdownMenuItem>
        {/* <DropdownMenuItem
          onClick={onSetNickname}
          className="flex items-center cursor-pointer"
        >
          <span>Set nickname</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onDelete}
          className="flex items-center text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
        >
          <span className="text-red-500">Delete contact</span>
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ContactCardDropdown;

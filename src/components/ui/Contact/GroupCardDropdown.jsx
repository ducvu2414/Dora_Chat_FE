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

const GroupCardDropdown = ({ onLeaveGroup }) => {

    return (
        <DropdownMenu className="z-50">
            <DropdownMenuTrigger asChild>
                <button
                    className="text-gray-400 hover:text-gray-600 focus:outline-none bg-white rounded-full p-2"
                >
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="z-[9999] w-56">
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={onLeaveGroup}
                >
                    <span className="text-red"> </span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default GroupCardDropdown;
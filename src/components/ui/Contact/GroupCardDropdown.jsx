import React from "react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
} from "../dropdown-menu";
import { MoreVertical } from "lucide-react";

const GroupCardDropdown = ({ onCategoryChange, onLeaveGroup }) => {
    const categories = [
        { id: "customer", label: "Customer", color: "bg-red-500" },
        { id: "family", label: "Family", color: "bg-pink-500" },
        { id: "work", label: "Work", color: "bg-orange-500" },
        { id: "friends", label: "Friends", color: "bg-yellow-500" },
        { id: "reply-later", label: "Reply Later", color: "bg-green-500" },
        { id: "study", label: "Study", color: "bg-blue-500" },
    ];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="bg-white text-gray-400 hover:text-gray-600 border-none focus:outline-none flex-shrink-0">
                    <MoreVertical className="w-5 h-5" />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                        <span>Classify as</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                        {categories.map((category) => (
                            <DropdownMenuItem
                                key={category.id}
                                onClick={() => onCategoryChange(category.id)}
                            >
                                <div className={`z-10 w-3 h-3 rounded-full ${category.color} mr-2`} />
                                <span>{category.label}</span>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="text-red-600"
                    onClick={onLeaveGroup}
                >
                    <span>Leave group</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
export default GroupCardDropdown;
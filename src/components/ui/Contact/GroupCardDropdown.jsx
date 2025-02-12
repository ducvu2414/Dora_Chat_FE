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

const GroupCardDropdown = ({ onCategoryChange, onLeaveGroup }) => {
    const categories = [
        { id: "customer", label: "Customer", color: "bg-red-500" },
        { id: "family", label: "Family", color: "bg-pink-500" },
        { id: "work", label: "Work", color: "bg-orange-500" },
        { id: "friends", label: "Friends", color: "bg-yellow-500" },
        { id: "reply-later", label: "Reply Later", color: "bg-green-500" },
        { id: "study", label: "Study", color: "bg-blue-500" },
    ];

    const handleCategoryClick = (categoryId) => {
        if (onCategoryChange) {
            onCategoryChange(categoryId);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className="text-gray-400 hover:text-gray-600 focus:outline-none bg-white rounded-full p-2"
                >
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="flex items-center cursor-pointer">
                        <span>Classify as</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                        {categories.map((category) => (
                            <DropdownMenuItem
                                key={category.id}
                                onClick={() => handleCategoryClick(category.id)}
                                className="flex items-center cursor-pointer"
                            >
                                <div className={`w-3 h-3 rounded-full ${category.color} mr-2`} />
                                <span>{category.label}</span>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={onLeaveGroup}
                >
                    <span className="text-red">Leave group</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default GroupCardDropdown;
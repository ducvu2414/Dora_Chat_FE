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
import { MoreVertical } from "lucide-react";

const ContactCardDropdown = ({ onViewInfo, onCategoryChange, onSetNickname, onDelete }) => {
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
                <div className="bg-white text-gray-400 hover:text-gray-600 border-none focus:outline-none flex-shrink-0 cursor-pointer">
                    <MoreVertical className="w-5 h-5" />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuItem onClick={onViewInfo}>
                    <span>View info</span>
                </DropdownMenuItem>
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
                                <div className={`w-3 h-3 rounded-full ${category.color} mr-2`} />
                                <span>{category.label}</span>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuItem onClick={onSetNickname}>
                    <span>Sets nickname</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600" onClick={onDelete}>
                    <span>Delete contact</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

    );
};

export default ContactCardDropdown;
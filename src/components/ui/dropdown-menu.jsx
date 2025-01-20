import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { forwardRef } from "react";
import { ChevronRight } from "lucide-react";

export const DropdownMenu = DropdownMenuPrimitive.Root;

export const DropdownMenuTrigger = forwardRef(({ children, ...props }, ref) => (
    <DropdownMenuPrimitive.Trigger ref={ref} {...props}>
        {children}
    </DropdownMenuPrimitive.Trigger>
));
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

export const DropdownMenuContent = forwardRef(({ children, ...props }, ref) => (
    <DropdownMenuPrimitive.Content
        ref={ref}
        {...props}
        className="min-w-[220px] bg-white rounded-md p-1 shadow-lg z-50" // Thêm z-50 để đảm bảo nó nằm trên các thành phần khác
        style={{ position: 'absolute' }} // Đảm bảo dropdown được định vị chính xác
    >
        {children}
    </DropdownMenuPrimitive.Content>
));
DropdownMenuContent.displayName = "DropdownMenuContent";

export const DropdownMenuItem = forwardRef(({ children, ...props }, ref) => (
    <DropdownMenuPrimitive.Item
        ref={ref}
        {...props}
        className="text-sm text-gray-700 rounded-md px-2 py-1.5 hover:bg-gray-100 cursor-pointer outline-none flex items-center"
    >
        {children}
    </DropdownMenuPrimitive.Item>
));
DropdownMenuItem.displayName = "DropdownMenuItem";

export const DropdownMenuSeparator = () => (
    <DropdownMenuPrimitive.Separator className="h-px bg-gray-200 my-1" />
);

export const DropdownMenuSub = DropdownMenuPrimitive.Sub;

export const DropdownMenuSubTrigger = forwardRef(({ children, ...props }, ref) => (
    <DropdownMenuPrimitive.SubTrigger
        ref={ref}
        {...props}
        className="text-sm text-gray-700 rounded-md px-2 py-1.5 hover:bg-gray-100 cursor-pointer outline-none flex items-center justify-between"
    >
        {children}
        <ChevronRight className="w-4 h-4" />
    </DropdownMenuPrimitive.SubTrigger>
));
DropdownMenuSubTrigger.displayName = "DropdownMenuSubTrigger";

export const DropdownMenuSubContent = forwardRef(({ children, ...props }, ref) => (
    <DropdownMenuPrimitive.SubContent
        ref={ref}
        {...props}
        className="min-w-[220px] bg-white rounded-md p-1 shadow-lg z-50"
        style={{ position: 'absolute' }}
    >
        {children}
    </DropdownMenuPrimitive.SubContent>
));
DropdownMenuSubContent.displayName = "DropdownMenuSubContent";
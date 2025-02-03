import * as React from "react";
import { cn } from "@/lib/utils";

// eslint-disable-next-line react/prop-types
const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input border-regal-blue bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder-gray-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm appearance-auto ",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

export { Input };
import * as React from "react"

export function Line() {
    return (
        <svg
            viewBox="0 0 24 24"
            className="w-6 h-6 fill-current text-blue-700"
        >
            <line x1="2" y1="12" x2="502" y2="12" stroke="currentColor" strokeWidth="2" />
        </svg>
    );
}
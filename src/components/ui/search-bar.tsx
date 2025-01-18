import React from 'react'
import { Search, Plus } from 'lucide-react'
import { Input } from "./input"
import { Button } from "./button"

export function SearchBar() {
  return (
    <div className="relative flex items-center gap-2 p-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 text-regal-blue" />
        <Input 
          type="search" 
          placeholder="Search" 
          className="pl-9 bg-gray-50 text-regal-blue placeholder:text-regal-blue rounded-full "
        />
      </div>
      <Button size="icon" className="shrink-0 rounded-full bg-gradient-to-r from-sky-700 from-5% via-blue-400 via-55% to-blue-300 to-90% text-white">
        <Plus className="!h-6 !w-6" />
      </Button>
    </div>
  )
}

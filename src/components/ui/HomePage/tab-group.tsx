import React from 'react'

// data: {
//   activeTab: 'messages' | 'group'
//   onTabChange: (tab: 'messages' | 'group') => void
// }

export function TabGroup(data) {
  return (
    <div className="flex items-center gap-4 px-6 py-3">
      <button
        onClick={() => data.onTabChange('messages')}
        className={`text-sm font-bold relative rounded-full bg-white ${
          data.activeTab === 'messages' 
            ? 'text-regal-blue border-regal-blue' 
            : 'text-gray-500 hover:text-regal-blue'
            // ? 'text-white !bg-regal-blue border-regal-blue' 
            // : 'text-regal-blue !bg-white hover:text-regal-blue'
        }`}
      >
        Messages
        {data.activeTab === 'messages' && (
          <div className="absolute -bottom-3 left-0 right-0 h-0.5 bg-regal-blue rounded-full" />
        )}
      </button>
      <button
        onClick={() => data.onTabChange('group')}
        className={`text-sm font-bold relative rounded-full bg-white ${
          data.activeTab === 'group' 
            ? 'text-regal-blue border-regal-blue' 
            : 'text-gray-500 hover:text-regal-blue'
            // ? 'text-white !bg-regal-blue border-regal-blue' 
            // : 'text-regal-blue !bg-white hover:text-regal-blue'
        }`}
      >
        Group
        {data.activeTab === 'group' && (
          <div className="absolute -bottom-3 left-0 right-0 h-0.5 bg-regal-blue rounded-full" />
        )}
      </button>
      <div className="ml-auto">
        <span className="text-regal-blue text-sm hover:underline cursor-pointer">Request (2)</span>
      </div>
    </div>
  )
}
  
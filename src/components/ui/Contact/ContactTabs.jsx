import React from 'react';

export function ContactTabs({ activeTab, onTabChange }) {
    const tabs = [
        { id: 'friend-list', label: 'Friend list', count: 22 },
        { id: 'friend-requests', label: 'Friend requests', count: 1 },
        { id: 'group-list', label: 'Group list' },
        { id: 'group-requests', label: 'Group requests', count: 1 }
    ];

    return (
        <div className="flex flex-col space-y-4">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    className={`flex items-center px-4 py-2 rounded-lg transition-colors
                        hover:bg-[#D0EAFF80] hover:bg-opacity-50 hover:text-blue-600 hover:outline-none
                        focus:outline-none border-none
                        ${activeTab === tab.id
                            ? 'bg-[#D0EAFF80] bg-opacity-50 text-blue-600'
                            : 'bg-white text-gray-500 hover:bg-gray-50'
                        }
                        `}
                    onClick={() => onTabChange(tab.id)}
                >
                    <span className="text-sm font-medium">
                        {tab.label} {tab.count && `(${tab.count})`}
                    </span>
                </button>
            ))}
        </div>
    );
}
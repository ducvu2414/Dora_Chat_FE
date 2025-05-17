/* eslint-disable react/prop-types */
import { useSelector } from "react-redux";

export function ContactTabs({ activeTab, onTabChange }) {
    const friendList = useSelector(state => state.friend.friends);
    const friendRequests = useSelector(state => state.friend.requestFriends);
    const sentRequests = useSelector(state => state.friend.myRequestFriends);

    const tabs = [
        { id: 'friend-list', label: 'Friend list', count: friendList.length },
        { id: 'friend-requests', label: 'Friend requests', count: friendRequests.length },
        { id: 'sent-requests', label: 'Sent requests', count: sentRequests.length },
        { id: 'group-list', label: 'Group list', count: 3 },
        { id: 'group-requests', label: 'Group requests', count: 1 }
    ];

    return (
        <div className="flex flex-col space-y-4">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    className={`flex items-center px-4 py-2 rounded-lg transition-colors
                        hover:bg-[#D0EAFF80] bg-opacity-50 hover:text-blue-600 hover:outline-none
                        focus:outline-none border-none
                        ${activeTab === tab.id
                            ? 'bg-[#D0EAFF80] bg-opacity-50 text-blue-600'
                            : 'bg-white text-gray-500 hover:bg-gray-50'
                        }
                        `}
                    onClick={() => onTabChange(tab.id)}
                >
                    <span className="text-sm font-medium">
                        {tab.label} {`(${tab.count})`}
                    </span>
                </button>
            ))}
        </div>
    );
}
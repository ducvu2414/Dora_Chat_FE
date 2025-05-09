/* eslint-disable react/prop-types */
import ContactCardDropdown from '@/components/ui/Contact/ContactCardDropdown';
import { useNavigate } from 'react-router-dom';

export function ContactCard({ contact, onDeleteFriend }) {
    const navigate = useNavigate();

    function onViewInfo() {
        navigate("/friend-information");
    }

    function onSetNickname() {
        console.log('Set nickname');
    }

    function onDelete() {
        if (onDeleteFriend && contact._id) {
            onDeleteFriend(contact._id);
        } else {
            console.error("Contact ID is undefined:", contact);
        }
    }

    // Get first letter of name for avatar placeholder
    const getInitials = (name) => {
        return name ? name.charAt(0).toUpperCase() : '?';
    };

    // Convert color name to actual CSS color
    const getColorFromName = (colorName) => {
        console.log('Color name:', colorName);
        const colorMap = {
            'red': '#f87171',
            'blue': '#60a5fa',
            'green': '#4ade80',
            'yellow': '#facc15',
            'purple': '#c084fc',
            'pink': '#f472b6',
            'orange': '#fb923c',
            'teal': '#2dd4bf',
            'cyan': '#22d3ee',
            'white': '#f8fafc',
            'black': '#1e293b',
        };

        return colorMap[colorName.toLowerCase()] || colorName;
    };

    return (
        <div
            className="w-full focus:outline-none border-none p-0 cursor-pointer"
            onClick={() => console.log('View group')}
        >
            <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <div>
                        {contact.avatar !== "" ? (
                            <img
                                src={contact.avatar}
                                className="object-cover w-24 h-24 mb-4 border-4 border-white rounded-full"
                            />
                        ) : (
                            <div
                                className="flex items-center justify-center w-20 h-20 mb-4 border-4 border-white rounded-full"
                                style={{
                                    backgroundColor: contact.avatarColor ?
                                        getColorFromName(contact.avatarColor) : '#e2e8f0'
                                }}
                            >
                                <span className="text-2xl font-semibold text-white">{getInitials(contact.name)}</span>
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">{contact.name}</h3>
                        <p className="text-xs text-gray-500 truncate">{contact.username}</p>
                    </div>
                </div>
                <ContactCardDropdown
                    onViewInfo={onViewInfo}
                    onSetNickname={onSetNickname}
                    onDelete={onDelete}
                />
            </div>
        </div>
    );
}
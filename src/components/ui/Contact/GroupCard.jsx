/* eslint-disable react/prop-types */
import GroupCardDropdown from '@/components/ui/Contact/GroupCardDropdown';

const GroupCard = ({ group, onLeaveGroup }) => {
    return (
        <div className="w-full focus:outline-none border-none p-0" onClick={() => console.log('View group')}>
            <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <div className="relative">
                        <img
                            src={group.avatar}
                            alt={group.name}
                            className="w-12 h-12 rounded-full flex-shrink-0 object-cover"
                        />
                        {group.memberAvatars && (
                            <div className="absolute -bottom-1 -right-1 flex -space-x-2">
                                {group.memberAvatars.slice(0, 3).map((avatar, index) => (
                                    <img
                                        key={index}
                                        src={avatar}
                                        alt="member"
                                        className="w-4 h-4 rounded-full border border-white"
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">{group.name}</h3>
                        <p className="text-sm text-gray-500 truncate">{group.members} members</p>
                    </div>
                </div>
                <div className="flex-shrink-0">
                    <GroupCardDropdown onLeaveGroup={onLeaveGroup} />
                </div>
            </div>
        </div>
    );
};


export default GroupCard;
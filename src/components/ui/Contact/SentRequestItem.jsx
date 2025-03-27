/* eslint-disable react/prop-types */
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function SentRequestItem({ request, onCancel }) {
    function handleCancel() {
        if (onCancel) {
            onCancel(request._id);
        } else {
            console.log('Cancel friend request to', request.name);
        }
    }

    function handleViewProfile() {
        console.log('View profile of', request.name);
    }

    // Get first letter of name for avatar placeholder
    const getInitials = (name) => {
        return name ? name.charAt(0).toUpperCase() : '?';
    };

    const getColorFromName = (colorName) => {
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

        return colorMap[colorName?.toLowerCase()] || colorName;
    };

    return (
        <Card className="p-4" onClick={handleViewProfile}>
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center"
                    style={{
                        backgroundColor: !request.avatar && request.avatarColor ?
                            getColorFromName(request.avatarColor) : '#e2e8f0'
                    }}>
                    {request.avatar ? (
                        <img
                            src={request.avatar}
                            alt={request.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-white font-medium">
                            {getInitials(request.name)}
                        </span>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{request.name}</h3>
                    <p className="text-xs text-gray-500 truncate">Đã gửi lời mời kết bạn</p>
                </div>
                <div className="text-xs text-gray-400">
                    {request.time || "Vừa gửi"}
                </div>
            </div>
            <div className="flex justify-end mt-4">
                <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-300 hover:bg-gray-50 text-gray-700"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleCancel();
                    }}
                >
                    Hủy lời mời
                </Button>
            </div>
        </Card>
    );
}
/* eslint-disable react/prop-types */
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export function FriendRequestItem({ request, onAccept, onReject }) {
    function handleAccept() {
        if (onAccept) {
            onAccept(request.id);
        } else {
            console.log('Accept friend request from', request.name);
        }
    }

    function handleReject() {
        if (onReject) {
            onReject(request.id);
        } else {
            console.log('Reject friend request from', request.name);
        }
    }

    function handleViewMessage() {
        console.log('View message from', request.name);
    }

    function handleViewProfile() {
        console.log('View profile of', request.name);
    }

    return (
        <Card className="p-4" onClick={handleViewProfile}>
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                    <img
                        src={request.avatar || "https://picsum.photos/id/237/200/300"}
                        alt={request.name}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{request.name}</h3>
                    <p className="text-xs text-gray-500 truncate">{request.message}</p>
                </div>
            </div>
            <div className="flex justify-between mt-4 gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-gray-300 hover:bg-gray-50"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleReject();
                    }}
                >
                    Reject
                </Button>
                <Button
                    variant="primary"
                    size="sm"
                    className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleAccept();
                    }}
                >
                    Accept
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-blue-600 hover:bg-blue-50"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleViewMessage();
                    }}
                >
                    <MessageCircle className="h-4 w-4" />
                </Button>
            </div>
        </Card>
    );
}
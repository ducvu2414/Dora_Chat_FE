/* eslint-disable react/prop-types */
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export function FriendRequestItem({ request }) {
    function handleAccept() {
        console.log('Accept friend request from', request.name);
    }

    function handleReject() {
        console.log('Reject friend request from', request.name);
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
                        className="w-12 h-12 rounded-full flex-shrink-0 object-cover"
                    />
                </div>
                <div className="flex-1">
                    <h3 className="font-medium">{request.name}</h3>
                    <p className="text-sm text-gray-500">{request.time}</p>
                </div>
                <button
                    className="btn btn-primary bg-white focus:outline-none border-none p-0   "
                    onClick={handleViewMessage}
                >
                    <MessageCircle className="text-blue-500 w-5 h-5" />
                </button>
            </div>
            <p className="mt-3 text-gray-600 bg-slate-50 p-3 rounded-lg">
                {request.message}
            </p>
            <div className="flex gap-3 mt-4">
                <Button
                    variant="outline"
                    className="flex-1 px-4 py-2 rounded-lg transition-colors
                        bg-[#D0EAFF80] bg-opacity-50 text-blue-600
                        outline-none border-none
                        focus:outline-none 
                        hover:bg-blue-100 hover:text-blue-600
                        "
                    onClick={handleReject}
                >
                    Reject
                </Button>
                <Button
                    className="flex-1  px-4 py-2 rounded-lg transition-colors
                        bg-[#086DC0] text-white
                        outline-none border-none
                        focus:outline-none 
                        hover:bg-blue-500"
                    onClick={handleAccept}
                >
                    Accept
                </Button>
            </div>
        </Card>
    );
}
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function GroupRequestItem({ request }) {
    function handleAccept() {
        console.log('Accept group request from', request.name);
    }

    function handleReject() {
        console.log('Reject group request from', request.name);
    }

    return (
        <Card className="p-4">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                    <div className="relative">
                        <img
                            src={request.avatar}
                            alt={request.name}
                            className="w-12 h-12 rounded-full flex-shrink-0 object-cover"
                        />
                        {request.memberAvatars && (
                            <div className="absolute -bottom-1 -right-1 flex -space-x-2">
                                {request.memberAvatars.slice(0, 3).map((avatar, index) => (
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
                </div>
                <div className="flex-1">
                    <h3 className="font-medium">{request.name}</h3>
                    <p className="text-sm text-gray-500">{request.time}</p>
                </div>
            </div>
            <div className="flex gap-3 mt-4">
                <Button
                    variant="outline"
                    className="flex-1 px-4 py-2 rounded-lg transition-colors
                        bg-[#D0EAFF80] bg-opacity-50 text-blue-600
                        outline-none border-none
                        focus:outline-none 
                        hover:bg-blue-100 hover:text-blue-600"
                    onClick={handleReject}
                >
                    Reject
                </Button>
                <Button
                    className="flex-1 px-4 py-2 rounded-lg transition-colors
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
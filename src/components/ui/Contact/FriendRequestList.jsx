/* eslint-disable react/prop-types */
import { FriendRequestItem } from '@/components/ui/Contact/FriendRequestItem';

export function FriendRequestList({ friendRequests, onAccept, onReject }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-5 ">
            {friendRequests !== undefined && friendRequests.length > 0 ? (
                friendRequests.map((request, index) => (
                    <FriendRequestItem
                        key={index}
                        request={request}
                        onAccept={onAccept}
                        onReject={onReject}
                    />
                ))
            ) : (
                <div className="col-span-2 flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-sm">
                    <div className="text-6xl mb-4">📩</div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">Không có lời mời kết bạn</h3>
                    <p className="text-gray-500 text-center">
                        Hiện tại bạn không có lời mời kết bạn nào.
                    </p>
                </div>
            )}
        </div>
    );
}
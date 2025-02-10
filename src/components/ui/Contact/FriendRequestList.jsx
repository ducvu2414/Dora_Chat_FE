import { FriendRequestItem } from '@/components/ui/Contact/FriendRequestItem';

export function FriendRequestList({ friendRequests }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-5 ">
            {friendRequests !== undefined &&
                friendRequests.map((request, index) => (
                    <FriendRequestItem
                        key={index}
                        request={request}
                    />
                ))
            }
        </div>
    );
}
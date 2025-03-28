/* eslint-disable react/prop-types */
import { SentRequestItem } from '@/components/ui/Contact/SentRequestItem';

export function SentRequestList({ sentRequests, onCancel }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-5">
            {sentRequests !== undefined && sentRequests.length > 0 ? (
                sentRequests.map((request, index) => (
                    <SentRequestItem
                        key={index}
                        request={request}
                        onCancel={onCancel}
                    />
                ))
            ) : (
                <div className="col-span-2 flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-sm">
                    <div className="text-6xl mb-4">📤</div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">Không có lời mời đã gửi</h3>
                    <p className="text-gray-500 text-center">
                        Bạn chưa gửi lời mời kết bạn nào.
                    </p>
                </div>
            )}
        </div>
    );
}
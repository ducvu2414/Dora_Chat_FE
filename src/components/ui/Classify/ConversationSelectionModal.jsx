/* eslint-disable react/prop-types */
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Avatar from "@assets/chat/avatar.png";

const currentUser = JSON.parse(localStorage.getItem("user"));
const currentUserId = currentUser?._id || currentUser?.current?._id;

export default function ConversationSelectionModal({
    buttonText = "Gán",
    onSubmit,
    initialSelected = [],
    conversations = [],
    message = null,
    onClose,
}) {
    const [search, setSearch] = useState("");
    const [selectedIds, setSelectedIds] = useState(initialSelected);

    const toggleSelect = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const handleSubmit = () => {
        if (onSubmit) onSubmit(selectedIds);
        if (onClose) onClose();
    };

    const getConversationDisplay = (c) => {
        if (c.type) return c.name || c.title || "Nhóm không tên";
        const partner = c.members?.find((m) => m.userId !== currentUserId);
        return partner?.name || "Không tên";
    };

    const getConversationAvatar = (c) => {
        if (c.type) return c.avatar || Avatar;
        const partner = c.members?.find((m) => m.userId !== currentUserId);
        return partner?.avatar || Avatar;
    };

    const filtered = conversations.filter((c) =>
        getConversationDisplay(c).toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white w-[500px] max-h-[90vh] rounded-lg shadow-lg flex flex-col">
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold">Chọn hội thoại</h2>
                    <button onClick={onClose}>
                        <span className="text-gray-500 hover:text-gray-700 text-xl">&times;</span>
                    </button>
                </div>

                {message && (
                    <span className="px-4 mt-2 text-sm text-gray-500">Ghi chú: {message}</span>
                )}

                <div className="p-4 pt-2">
                    <div className="relative">
                        <Search className="absolute w-5 h-5 text-[#086DC0] -translate-y-1/2 left-4 top-1/2" />
                        <Input
                            type="search"
                            placeholder="Tìm kiếm hội thoại..."
                            className="w-full border rounded-full pl-12 py-2 bg-gray-50 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-[#086DC0] focus:border-[#086DC0]"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="mt-4 overflow-y-auto max-h-[50vh] space-y-2">
                        {filtered.length > 0 ? (
                            filtered.map((c) => (
                                <label
                                    key={c._id}
                                    className="flex items-center gap-3 px-3 py-2 border rounded cursor-pointer hover:bg-gray-100"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(c._id)}
                                        onChange={() => toggleSelect(c._id)}
                                        className="w-4 h-4 rounded border border-gray-400 bg-white appearance-none
                      checked:bg-blue-600 checked:border-blue-600
                      relative cursor-pointer
                      after:content-['✔'] after:absolute after:top-[1px] after:left-[3px]
                      after:text-white after:text-xs after:font-bold after:opacity-0
                      checked:after:opacity-100"
                                    />
                                    <img
                                        src={getConversationAvatar(c)}
                                        alt="Avatar"
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <div className="text-left">
                                        <p className="text-sm font-semibold">
                                            {getConversationDisplay(c)}
                                        </p>
                                    </div>
                                </label>
                            ))
                        ) : (
                            <div className="text-center text-gray-500 py-8">
                                Không có hội thoại phù hợp
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-4 border-t flex justify-end space-x-2">
                    <Button variant="outline" onClick={onClose}>
                        Hủy
                    </Button>
                    <Button
                        className="bg-blue-600 text-white hover:bg-blue-700"
                        onClick={handleSubmit}
                        disabled={selectedIds.length === 0}
                    >
                        {buttonText} ({selectedIds.length})
                    </Button>
                </div>
            </div>
        </div>
    );
}

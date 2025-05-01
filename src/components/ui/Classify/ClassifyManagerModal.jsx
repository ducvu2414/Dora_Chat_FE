import { useEffect, useState } from "react";
import { X, Pencil, Trash2, Plus } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import classifiesApi from "@/api/classifies";
import ClassifyFormModal from "./ClassifyFormModal";
import { setClassifies } from "@/features/chat/chatSlice";

export default function ClassifyManagerModal({ onClose }) {
    const dispatch = useDispatch();
    const classifies = useSelector((state) => state.chat.classifies || []);

    const [editingItem, setEditingItem] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const refreshClassifies = async () => {
        try {
            const res = await classifiesApi.getAllByUserId();
            dispatch(setClassifies(res));
        } catch (err) {
            console.error("Lỗi khi tải phân loại:", err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa thẻ phân loại này?")) return;
        try {
            await classifiesApi.deleteClassify(id);
            refreshClassifies();
        } catch (err) {
            console.error("Lỗi khi xóa phân loại:", err);
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setShowForm(true);
    };

    const handleAdd = () => {
        setEditingItem(null);
        setShowForm(true);
    };

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
                <div className="bg-white w-[500px] rounded-lg shadow-lg max-h-[90vh] overflow-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b">
                        <h2 className="text-lg font-semibold">Quản lý thẻ phân loại</h2>
                        <button onClick={onClose}>
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-5 space-y-3">
                        {classifies.length === 0 ? (
                            <p className="text-sm text-gray-500">Chưa có thẻ phân loại nào.</p>
                        ) : (
                            Array.isArray(classifies) && classifies.map((cls) => (

                                <div
                                    key={cls._id}
                                    className="flex items-center justify-between bg-gray-50 p-3 rounded border"
                                >
                                    <div className="flex items-center gap-3">
                                        <span
                                            className="inline-block w-4 h-4 rounded-full"
                                            style={{ backgroundColor: cls.color?.code || "#ccc" }}
                                        />
                                        <span className="text-sm font-medium">{cls.name}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEdit(cls)} className="text-gray-500 hover:text-blue-600">
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(cls._id)} className="text-gray-500 hover:text-red-600">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end px-5 py-4 border-t">
                        <button
                            className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                            onClick={handleAdd}
                        >
                            <Plus className="w-4 h-4" /> Thêm thẻ phân loại
                        </button>
                    </div>
                </div>
            </div>

            {showForm && (
                <ClassifyFormModal
                    initialData={editingItem}
                    onClose={() => setShowForm(false)}
                    onSubmit={() => {
                        setShowForm(false);
                        refreshClassifies();
                    }}
                />
            )}
        </>
    );
}

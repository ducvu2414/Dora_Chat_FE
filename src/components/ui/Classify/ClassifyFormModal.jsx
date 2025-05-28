/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { X, Plus, Check, AlertCircle, Loader2 } from "lucide-react";
import colorsApi from "@/api/color";
import classifiesApi from "@/api/classifies";
import { useSelector } from "react-redux";
import ConversationSelectionModal from "@/components/ui/classify/ConversationSelectionModal";

export default function ClassifyFormModal({
  onClose,
  onSubmit,
  initialData = {},
}) {
  const [name, setName] = useState("");
  const [colorId, setColorId] = useState(null);
  const [colors, setColors] = useState([]);
  const [selectedConversations, setSelectedConversations] = useState([]);
  const [showConversationModal, setShowConversationModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const allConversations = useSelector(
    (state) => state.chat.conversations || []
  );
  const isEditing = Boolean(initialData?._id);
  const user = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    const fetchColors = async () => {
      setIsLoading(true);
      setError("");
      try {
        const res = await colorsApi.getAll();
        if (res && Array.isArray(res)) {
          setColors(res);

          if (isEditing) {
            setColorId(initialData.colorId?._id || initialData.colorId);
            setName(initialData.name);
            setSelectedConversations(initialData.conversationIds);
          } else if (!colorId && res.length > 0) {
            setColorId(res[0]._id);
          }
        } else {
          throw new Error("Not found color");
        }
      } catch (error) {
        console.error("Failed to fetch colors", error);
        setError("Not found color.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchColors();
  }, []);

  // useEffect(() => {
  //     if (isEditing) {
  //         setName(initialData.name || "");
  //         setColorId(initialData.colorId?._id || initialData.colorId);
  //         setSelectedConversations(initialData.conversationIds || []);
  //     }
  // }, [initialData, isEditing]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Please enter a name");
      return;
    }

    if (!colorId) {
      setError("Please select a color");
      return;
    }

    if (selectedConversations.length === 0) {
      setError("Please select at least one conversation");
      return;
    }

    setError("");
    setIsSubmitting(true);

    const payload = {
      name: name.trim(),
      colorId,
      conversationIds: selectedConversations,
    };

    try {
      if (isEditing) {
        await classifiesApi.updateClassify(payload, initialData._id);
      } else {
        await classifiesApi.addClassify(payload);
      }
      onSubmit();
    } catch (error) {
      console.error("Failed to save classify", error);
      const errorMessage =
        error.response?.data?.message || "Failed to save classify";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getConversationName = (id) => {
    const conv = allConversations.find((c) => c._id === id);
    if (!conv) return "Conversation not found";

    if (conv.type || conv.name) return conv.name;

    const userId = user?._id || user?.current?._id;
    const partner = conv.members?.find((m) => m.userId !== userId);
    return partner?.name || "Not found name for this conversation";
  };

  const removeConversation = (id) => {
    setSelectedConversations((prev) => prev.filter((convId) => convId !== id));
  };

  return (
    <>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white w-[450px] max-w-[95vw] rounded-lg shadow-lg max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">
              {isEditing ? "Update" : "Add"} classify
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-4 overflow-y-auto flex-grow">
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-md flex items-start">
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Tên */}
            <div>
              <label
                htmlFor="classify-name"
                className="block text-sm font-medium mb-1 text-gray-700"
              >
                Classify name <span className="text-red-500">*</span>
              </label>
              <input
                id="classify-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Enter classify name"
                disabled={isSubmitting}
              />
            </div>

            {/* Màu */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Select color <span className="text-red-500">*</span>
              </label>
              {isLoading ? (
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Loading...</span>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {colors.length > 0 ? (
                    colors.map((color) => (
                      <button
                        key={color._id}
                        onClick={() => setColorId(color._id)}
                        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center ${colorId === color._id
                          ? "border-black"
                          : "border-transparent"
                          }`}
                        style={{ backgroundColor: color.code }}
                        aria-label={`Chọn màu ${color.name || color.code}`}
                        disabled={isSubmitting}
                        title={color.name || color.code}
                      >
                        {colorId === color._id && (
                          <Check className="w-4 h-4 text-white drop-shadow-md" />
                        )}
                      </button>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">Not found color</p>
                  )}
                </div>
              )}
            </div>

            {/* Hội thoại */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Select conversations
                </label>
                <button
                  className="text-blue-600 text-sm hover:underline flex items-center"
                  onClick={() => setShowConversationModal(true)}
                  disabled={isSubmitting}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </button>
              </div>
              <div className="mt-2 space-y-1 max-h-32 overflow-y-auto bg-gray-50 rounded-md p-2">
                {selectedConversations.length === 0 ? (
                  <p className="text-sm text-gray-500 p-1">
                    No conversation selected yet
                  </p>
                ) : (
                  selectedConversations.map((id) => (
                    <div
                      key={id}
                      className="text-sm bg-white border rounded px-2 py-1 flex justify-between items-center"
                    >
                      <span className="truncate pr-2">
                        {getConversationName(id)}
                      </span>
                      <button
                        onClick={() => removeConversation(id)}
                        className="text-gray-400 hover:text-red-600"
                        disabled={isSubmitting}
                        aria-label="Delete conversation"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end p-4 border-t space-x-2 bg-gray-50">
            <button
              className="px-4 py-2 text-sm rounded bg-gray-200 hover:bg-gray-300 transition-colors disabled:opacity-50"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
              onClick={handleSubmit}
              disabled={
                isSubmitting ||
                !name.trim() ||
                !colorId ||
                selectedConversations.length === 0
              }
            >
              {isSubmitting && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              {isEditing ? "Update" : "Add"}
            </button>
          </div>
        </div>
      </div>

      {showConversationModal && (
        <ConversationSelectionModal
          initialSelected={selectedConversations}
          conversations={allConversations}
          onSubmit={(ids) => setSelectedConversations(ids)}
          onClose={() => setShowConversationModal(false)}
        />
      )}
    </>
  );
}

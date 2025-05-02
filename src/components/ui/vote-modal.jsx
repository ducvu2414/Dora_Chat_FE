/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Modal } from "./modal";
import { Button } from "./button";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { Plus, Settings, X } from "lucide-react";

export default function VoteModal({ isOpen, onClose, onSubmit }) {
  const [content, setContent] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [showSettings, setShowSettings] = useState(false);
  const [isMultipleChoice, setIsMultipleChoice] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Reset form when modal is opened
  useEffect(() => {
    if (isOpen) {
      setContent("");
      setOptions(["", ""]);
      setShowSettings(false);
      setIsMultipleChoice(false);
      setIsAnonymous(false);
    }
  }, [isOpen]);

  const handlecontentChange = (e) => {
    const value = e.target.value;
    if (value.length <= 200) {
      setContent(value);
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    if (options.length < 10) {
      setOptions([...options, ""]);
    }
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const handleSubmit = () => {
    // Validate form
    if (!content.trim()) {
      alert("Please enter a topic");
      return;
    }

    const validOptions = options.filter((opt) => opt.trim() !== "");
    if (validOptions.length < 2) {
      alert("Please enter at least 2 options");
      return;
    }

    onSubmit({
      content,
      options: validOptions,
      isMultipleChoice,
      isAnonymous,
    });

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Poll">
      <div className="space-y-4">
        {/* Poll content */}
        <div>
          <label className="block mb-1 text-sm font-medium text-left">
            Poll Topic
          </label>
          <div className="relative">
            <Textarea
              placeholder="Enter your poll topic here..."
              value={content}
              onChange={handlecontentChange}
              className="resize-none bg-gray-50 min-h-[80px]"
            />
            <div className="absolute bottom-2 right-2 text-xs text-gray-500">
              {content.length}/200
            </div>
          </div>
        </div>

        {/* Poll Options */}
        <div>
          <label className="block mb-2 text-sm font-medium text-left">
            Options
          </label>
          <div className="space-y-2">
            {options.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="bg-gray-50"
                />
                {options.length > 2 && (
                  <button
                    onClick={() => removeOption(index)}
                    className="p-1 text-gray-500 hover:text-gray-700"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add Option Button */}
          {options.length < 10 && (
            <button
              onClick={addOption}
              className="flex items-center gap-1 mt-2 text-sm text-blue-600 hover:text-blue-800"
            >
              <Plus size={16} />
              Add option
            </button>
          )}
        </div>

        {/* Settings */}
        <div className="pt-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800"
          >
            <Settings size={16} />
            Poll settings
          </button>

          {showSettings && (
            <div className="mt-2 p-3 bg-gray-50 rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  id="multipleChoice"
                  checked={isMultipleChoice}
                  onChange={() => setIsMultipleChoice(!isMultipleChoice)}
                  className="rounded text-blue-600"
                />
                <label htmlFor="multipleChoice" className="text-sm">
                  Allow multiple choices
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={isAnonymous}
                  onChange={() => setIsAnonymous(!isAnonymous)}
                  className="rounded text-blue-600"
                />
                <label htmlFor="anonymous" className="text-sm">
                  Anonymous voting
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 border-0"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Create Poll
          </Button>
        </div>
      </div>
    </Modal>
  );
}

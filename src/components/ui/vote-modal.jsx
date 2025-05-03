/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Modal } from "./modal";
import { Button } from "./button";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { Plus, Settings, X } from "lucide-react";

export default function VoteModal({ isOpen, onClose, onSubmit, vote }) {
  const [content, setContent] = useState(vote ? vote.content : "");
  const [options, setOptions] = useState(
    vote ? vote.options.map((option) => option.name) : ["", ""]
  );
  const [showSettings, setShowSettings] = useState(false);
  const [isMultipleChoice, setIsMultipleChoice] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [duplicateGroups, setDuplicateGroups] = useState([]);

  // Reset form when modal is opened
  useEffect(() => {
    if (isOpen && !vote) {
      setContent("");
      setOptions(["", ""]);
      setShowSettings(false);
      setIsMultipleChoice(false);
      setIsAnonymous(false);
    }
  }, [isOpen, vote]);

  const handleContentChange = (e) => {
    const value = e.target.value;
    if (value.length <= 200) {
      setContent(value);
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);

    // tìm các nhóm trùng
    const duplicates = findDuplicateGroups(newOptions);
    setDuplicateGroups(duplicates);
  };

  const isOptionDuplicate = (index) => {
    return duplicateGroups.some((group) => group.includes(index));
  };

  const findDuplicateGroups = (options) => {
    const optionMap = {};
    const duplicates = [];

    options.forEach((option, index) => {
      const trimmedOption = option.trim().toLowerCase();
      if (trimmedOption && trimmedOption !== "") {
        if (!optionMap[trimmedOption]) {
          optionMap[trimmedOption] = [];
        }
        optionMap[trimmedOption].push(index);
      }
    });

    Object.values(optionMap).forEach((indices) => {
      if (indices.length > 1) {
        duplicates.push(indices);
      }
    });

    return duplicates;
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

    const duplicates = findDuplicateGroups(validOptions);
    if (duplicates.length > 0) {
      setDuplicateGroups(duplicates);
      alert("Please remove duplicate options before submitting");
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
    <Modal isOpen={isOpen} onClose={onClose} title="Create Vote">
      <div className="space-y-4">
        {/* Poll content */}
        <div>
          <label className="block mb-1 text-sm font-medium text-left">
            Poll Topic
          </label>
          <div className="relative">
            {vote ? (
              <Textarea
                placeholder={vote.content}
                // font size="sm"
                className="resize-none bg-gray-50 min-h-[80px] !text-lg"
                disabled
              />
            ) : (
              <Textarea
                placeholder="Enter your poll topic here..."
                value={content}
                onChange={handleContentChange}
                className="resize-none bg-gray-50 min-h-[80px]"
              />
            )}

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
            {options.map((option, index) => {
              const isDuplicate = isOptionDuplicate(index);
              return (
                <div key={index} className="flex items-start gap-2 mb-1">
                  <div className="flex-1">
                    <Input
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) =>
                        handleOptionChange(index, e.target.value)
                      }
                      className={`bg-gray-50 ${
                        isDuplicate ? "border-red-500" : ""
                      }`}
                    />
                    {isDuplicate && (
                      <div className="text-xs text-red-500 mt-1 text-left ml-2">
                        Duplicate options detected
                      </div>
                    )}
                  </div>
                  {options.length > 2 && (
                    <button
                      onClick={() => removeOption(index)}
                      className="p-1 text-gray-500 hover:text-gray-700"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              );
            })}
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
        {!vote && (
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
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 border-0"
          >
            Cancel
          </Button>
          {vote ? (
            <Button
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={
                !content.trim() || options.some((opt) => opt.trim() === "")
              }
            >
              Save
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={
                !content.trim() || options.some((opt) => opt.trim() === "")
              }
            >
              Create
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}

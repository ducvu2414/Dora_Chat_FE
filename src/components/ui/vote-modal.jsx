/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Modal } from "./modal";
import { Button } from "./button";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { Plus, Settings, X } from "lucide-react";
import { AlertMessage } from "@/components/ui/alert-message";

export default function VoteModal({
  isOpen,
  onClose,
  onSubmit,
  onSave,
  onLock,
  vote,
}) {
  const [content, setContent] = useState(vote ? vote.content : "");
  const [options, setOptions] = useState(
    vote ? vote.options.map((option) => option.name) : ["", ""]
  );
  const [newOptions, setNewOptions] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [isMultipleChoice, setIsMultipleChoice] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [duplicateGroups, setDuplicateGroups] = useState([]);
  const [allOptionsCombined, setAllOptionsCombined] = useState([]);

  const allOptions = [
    ...(vote
      ? vote.options.map((option) => ({
          ...option,
          isExisting: true, // Đánh dấu option có sẵn
        }))
      : []),
    ...newOptions.map((option) => ({
      name: option,
      isExisting: false, // Đánh dấu option mới thêm
    })),
  ];

  useEffect(() => {
    const combined = [
      ...(vote ? vote.options.map((o) => o.name) : []),
      ...newOptions,
    ];
    setAllOptionsCombined(combined);

    // Kiểm tra trùng lặp mỗi khi options thay đổi
    const duplicates = findDuplicateGroups(combined);
    setDuplicateGroups(duplicates);
  }, [vote, newOptions]);

  // Reset form when modal is opened
  useEffect(() => {
    if (isOpen && !vote) {
      setContent("");
      setOptions(["", ""]);
      setShowSettings(false);
      setIsMultipleChoice(false);
      setIsAnonymous(false);
    }
    setNewOptions([]);
  }, [isOpen, vote]);

  const handleContentChange = (e) => {
    const value = e.target.value;
    if (value.length <= 200) {
      setContent(value);
    }
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
      setNewOptions([...newOptions, ""]);
    }
  };

  const removeNewOption = (index) => {
    // const optionIndex = vote ? vote.options.length + index : index;
    if (allOptions.length > 2) {
      const updatedNewOptions = [...newOptions];
      updatedNewOptions.splice(index, 1);
      setNewOptions(updatedNewOptions);
    }
  };

  const handleNewOptionChange = (index, value) => {
    const updatedNewOptions = [...newOptions];
    updatedNewOptions[index] = value;
    setNewOptions(updatedNewOptions);
  };

  const handleSubmit = () => {
    // Validate form
    if (!content.trim()) {
      AlertMessage({
        type: "error",
        message: "Please enter a topic",
      });
      return;
    }

    const validNewOptions = newOptions.filter((opt) => opt.trim() !== "");

    if (vote) {
      if (validNewOptions.length < 1 && newOptions.length > 0) {
        AlertMessage({
          type: "error",
          message: "Please enter valid options",
        });
        return;
      }
    } else {
      if (allOptionsCombined.filter((opt) => opt.trim() !== "").length < 2) {
        AlertMessage({
          type: "error",
          message: "Please enter at least 2 options",
        });
        return;
      }
    }

    const duplicates = findDuplicateGroups(allOptionsCombined);
    if (duplicates.length > 0) {
      setDuplicateGroups(duplicates);
      AlertMessage({
        type: "error",
        message: "Please remove duplicate options before submitting",
      });
      return;
    }

    if (vote) {
      onSave({
        options: allOptions.map((option) => option.name),
        oldOptions: vote,
      });
    } else {
      onSubmit({
        content,
        options: validNewOptions.filter((opt) => opt.trim() !== ""),
        isMultipleChoice,
        isAnonymous,
      });
    }

    onClose();
  };

  const handleLock = () => {
    if (confirm("Are you sure you want to lock this vote?")) {
      onLock(vote);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={vote ? "Vote" : "Create Vote"}
    >
      <div className="space-y-4">
        {/* Vote content */}
        <div>
          <label className="block mb-1 text-sm font-medium text-left">
            Vote Topic
          </label>
          <div className="relative">
            {vote ? (
              <Textarea
                placeholder={vote.content}
                className="resize-none bg-gray-50 min-h-[80px] !text-lg"
                disabled
              />
            ) : (
              <Textarea
                placeholder="Enter your vote topic here..."
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

        {/* Vote Options */}
        <div>
          <label className="block mb-2 text-sm font-medium text-left">
            Options
          </label>
          <div className="space-y-2">
            {allOptions.map((option, index) => {
              const isExisting = option.isExisting;
              const isDuplicate = isOptionDuplicate(index);

              return (
                <div key={index} className="flex items-start gap-2 mb-1">
                  <div className="flex-1">
                    <Input
                      placeholder={`Option ${index + 1}`}
                      value={option.name}
                      onChange={
                        isExisting
                          ? null
                          : (e) =>
                              handleNewOptionChange(
                                index - (vote ? vote.options.length : 0),
                                e.target.value
                              )
                      }
                      className={`bg-gray-50 ${
                        isDuplicate ? "border-red-500" : ""
                      }`}
                      disabled={isExisting}
                    />
                    {isDuplicate && (
                      <div className="text-xs text-red-500 mt-1 text-left ml-2">
                        Duplicate options detected
                      </div>
                    )}
                  </div>
                  {!isExisting && allOptions.length > 2 && (
                    <div className="mt-2">
                      <button
                        onClick={() =>
                          removeNewOption(
                            index - (vote ? vote.options.length : 0)
                          )
                        }
                        className="p-1 text-gray-500 hover:text-gray-700"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Add Option Button */}
          {allOptions.length < 10 && (
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
              Vote settings
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
        <div className="flex justify-between gap-3 pt-2">
          <div>
            <Button
              variant="outline"
              onClick={handleLock}
              className="bg-red-600 hover:bg-red-700 border-0"
            >
              Lock
            </Button>
          </div>
          <div className="flex gap-3 justify-end">
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
                  newOptions.length < 1 ||
                  newOptions.some((opt) => opt.trim() === "") ||
                  duplicateGroups.length > 0
                }
              >
                Save
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                // content not empty,  at least 2 options and no duplicate options
                disabled={
                  content.trim() === "" ||
                  allOptionsCombined.filter((opt) => opt.trim() !== "").length <
                    2 ||
                  duplicateGroups.length > 0
                }
              >
                Create
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

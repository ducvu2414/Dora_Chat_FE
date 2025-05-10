/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Button } from "./button";
import { Settings } from "lucide-react";
import { createPortal } from "react-dom";
import VoteModal from "@/components/ui/vote-modal";

export default function VoteDisplay({
  vote,
  onSelected,
  showResults = false,
  member,
  onSave,
  onLock,
}) {
  // Calculate total votes
  const totalVotes = vote.options.reduce((acc, option) => {
    return acc + (option.members ? option.members.length : 0);
  }, 0);

  const currentUserVoteIds = vote.options.reduce((acc, option) => {
    const userVote = option.members?.find(
      (memberTemp) => memberTemp.memberId === member?._id
    );
    if (userVote) {
      acc.push(option._id);
    }
    return acc;
  }, []);

  const [selectedOptions, setSelectedOptions] = useState([
    ...currentUserVoteIds,
  ]);
  const [viewingResults, setViewingResults] = useState(showResults);
  const [showSettings, setShowSettings] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (vote.lockedVote.lockedStatus) {
      setViewingResults(true);
    }
  }, [vote]);

  // Thêm hàm kiểm tra xem selectedOptions có khác với giá trị ban đầu không
  const hasSelectionChanged = () => {
    if (selectedOptions.length !== currentUserVoteIds.length) return true;
    return !selectedOptions.every((optionId) =>
      currentUserVoteIds.includes(optionId)
    );
  };

  const handleOptionSelect = (optionId) => {
    if (vote.isMultipleChoice) {
      setSelectedOptions((prev) =>
        prev.includes(optionId)
          ? prev.filter((id) => id !== optionId)
          : [...prev, optionId]
      );
    } else {
      setSelectedOptions((prev) => (prev.includes(optionId) ? [] : [optionId]));
    }
  };

  const handleVote = () => {
    onSelected(selectedOptions, vote);
    setViewingResults(true);
  };

  const handleCancel = () => {
    setSelectedOptions(currentUserVoteIds);
    setViewingResults(false);
  };

  const calculatePercentage = (votes) => {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
  };

  // Function to handle tooltip display
  const showTooltip = (memberId, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      top: rect.top - 10, // Position above the avatar
      left: rect.left + rect.width / 2, // Center horizontally
    });
    setActiveTooltip(memberId);
  };

  const hideTooltip = () => {
    setActiveTooltip(null);
  };

  // Maximum number of avatars to display before showing "+X more"
  const MAX_AVATARS = 5;

  const Tooltip = ({ voter }) => {
    if (!activeTooltip || activeTooltip !== voter.memberId || !isMounted)
      return null;

    return createPortal(
      <div
        className="fixed px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-[9999] pointer-events-none mt-2"
        style={{
          top: `${tooltipPosition.top - 30}px`,
          left: `${tooltipPosition.left}px`,
          transform: "translateX(-50%)",
        }}
      >
        {voter.name || "Unknown member"}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
      </div>,
      document.body
    );
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border w-72 w-full">
      {/* vote Content */}
      <h3
        className="font-medium text-lg mb-3 cursor-pointer select-none"
        onClick={() => {
          if (!vote.lockedVote.lockedStatus) {
            setViewingResults(!viewingResults);
          }
        }}
      >
        {vote.content}
      </h3>

      {/* vote Options */}
      <div className="space-y-3 mb-4">
        {vote.options.map((option, index) => {
          const optionVotes = option.members?.length || 0;
          const percentage = calculatePercentage(optionVotes);
          const isSelected = selectedOptions.includes(option._id);

          return (
            <div key={option._id || index} className="relative">
              {viewingResults ? (
                // Results view
                <div className="rounded-lg border">
                  <div className="flex items-center p-3 relative z-10">
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span
                          className={`font-medium ${
                            isSelected ? "text-blue-600" : ""
                          }`}
                        >
                          {option.name}
                          {isSelected && " ✓"}
                        </span>
                        <span className="text-sm text-gray-500">
                          {percentage}%
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {optionVotes} {optionVotes === 1 ? "vote" : "votes"}
                      </div>

                      {/* Member Avatars */}
                      {option.members &&
                        option.members.length > 0 &&
                        !vote.isAnonymous && (
                          <div className="flex justify-end flex-wrap mt-2">
                            {option.members
                              .slice(0, MAX_AVATARS)
                              .map((voter) => (
                                <div
                                  key={voter.memberId}
                                  className="relative -mr-2 first:ml-0"
                                  onMouseEnter={(e) =>
                                    showTooltip(voter.memberId, e)
                                  }
                                  onMouseLeave={hideTooltip}
                                >
                                  <img
                                    src={
                                      voter.avatar ||
                                      "/placeholder.svg?height=32&width=32"
                                    }
                                    alt={voter.name || "Member"}
                                    className="w-6 h-6 rounded-full border-2 border-white object-cover"
                                  />

                                  {/* Tooltip */}
                                  <Tooltip voter={voter} />
                                </div>
                              ))}

                            {option.members.length > MAX_AVATARS && (
                              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600 border-2 border-white">
                                +{option.members.length - MAX_AVATARS}
                              </div>
                            )}
                          </div>
                        )}
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div
                    className="absolute top-0 left-0 h-full bg-blue-100 z-0"
                    style={{
                      width: `${percentage}%`,
                      transition: "width 0.5s ease-in-out",
                    }}
                  />
                </div>
              ) : (
                // Voting view
                <button
                  onClick={() => handleOptionSelect(option._id)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    isSelected
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-5 h-5 rounded-${
                        vote.isMultipleChoice ? "md" : "full"
                      } border flex items-center justify-center mr-3 ${
                        isSelected
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      {isSelected && (
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10 3L4.5 8.5L2 6"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                    {option.name}
                  </div>
                  {/* Hiển thị avatars của người đã chọn (chỉ khi không phải vote ẩn danh) */}
                  {!vote.isAnonymous &&
                    option.members &&
                    option.members.length > 0 && (
                      <div className="flex justify-end items-center">
                        <div className="text-xs text-gray-500 mr-2">
                          {option.members.length}
                        </div>
                        <div className="flex -space-x-2">
                          {option.members.slice(0, 3).map((voter) => (
                            <div
                              key={voter.memberId}
                              className="relative"
                              onMouseEnter={(e) =>
                                showTooltip(voter.memberId, e)
                              }
                              onMouseLeave={hideTooltip}
                            >
                              <img
                                src={
                                  voter.avatar ||
                                  "/placeholder.svg?height=32&width=32"
                                }
                                alt={voter.name || "Member"}
                                className="w-6 h-6 rounded-full border-2 border-white object-cover"
                              />
                              <Tooltip voter={voter} />
                            </div>
                          ))}
                          {option.members.length > 3 && (
                            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600 border-2 border-white">
                              +{option.members.length - 3}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        {!vote.lockedVote.lockedStatus && (
          <>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800"
            >
              <Settings size={16} />
            </button>

            <VoteModal
              isOpen={showSettings}
              onClose={() => setShowSettings(false)}
              vote={vote}
              onSave={onSave}
              onLock={onLock}
            />
          </>
        )}

        <div className="text-sm text-gray-500">
          {totalVotes} {totalVotes === 0 || totalVotes === 1 ? "vote" : "votes"}
          {vote.isAnonymous && " • Anonymous"}
        </div>

        {!viewingResults ? (
          <div className="flex justify-end gap-2">
            <Button
              onClick={handleCancel}
              disabled={!hasSelectionChanged()}
              className="bg-gray-500 hover:bg-gray-400 text-white border-none"
            >
              Cancel
            </Button>
            <Button
              onClick={handleVote}
              disabled={!hasSelectionChanged()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Vote
            </Button>
          </div>
        ) : (
          !vote.lockedVote.lockedStatus && (
            <Button
              variant="outline"
              onClick={() => {
                setViewingResults(false);
              }}
              className="text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              Change Vote
            </Button>
          )
        )}
      </div>
    </div>
  );
}

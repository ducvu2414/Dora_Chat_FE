/* eslint-disable react/prop-types */
import { useState } from "react";
import { Button } from "./button";

export default function VoteDisplay({
  vote,
  onSelected,
  onDeselected,
  currentUserVotes = [],
  totalVotes = 0,
  showResults = false,
}) {
  const [selectedOptions, setSelectedOptions] = useState([...currentUserVotes]);
  const [viewingResults, setViewingResults] = useState(showResults);

  const handleOptionSelect = (optionId) => {
    if (vote.isMultipleChoice) {
      // For multiple choice, toggle the selection
      setSelectedOptions((prev) =>
        prev.includes(optionId)
          ? prev.filter((id) => id !== optionId)
          : [...prev, optionId]
      );
    } else {
      // For single choice, replace the selection
      setSelectedOptions((prev) => (prev.includes(optionId) ? [] : [optionId]));
    }
  };

  const handleVote = () => {
    if (selectedOptions.length > 0) {
      onSelected(selectedOptions);
      setViewingResults(true);
    }
  };

  const handleCancelVote = () => {
    onDeselected(selectedOptions);
    setSelectedOptions([]);
    setViewingResults(false);
  };

  const calculatePercentage = (votes) => {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border w-72">
      {/* vote Content */}
      <h3 className="font-medium text-lg mb-3">{vote.content}</h3>

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
                <div className="rounded-lg border overflow-hidden">
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
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div
                    className="absolute top-0 left-0 h-full bg-blue-100"
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
                      className={`w-5 h-5 rounded-${vote.isMultipleChoice ? "md" : "full"} border flex items-center justify-center mr-3 ${
                        isSelected ? "border-blue-500 bg-blue-500" : "border-gray-300"
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
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {totalVotes} {totalVotes === 0 || totalVotes === 1 ? "vote" : "votes"}
          {vote.isAnonymous && " • Anonymous"}
        </div>

        {!viewingResults ? (
          <Button
            onClick={handleVote}
            disabled={selectedOptions.length === 0}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Vote
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={() => {
              setViewingResults(false);
              handleCancelVote();
            }}
            className="text-blue-600 border-blue-600 hover:bg-blue-50"
          >
            Change Vote
          </Button>
        )}
      </div>
    </div>
  );
}

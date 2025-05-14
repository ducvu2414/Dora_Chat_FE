/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import PictureIcon from "@assets/chat/picture_icon.svg";
import EmojiIcon from "@assets/chat/emoji_icon.svg";
import SendIcon from "@assets/chat/send_icon.svg";
import EmojiPicker from "emoji-picker-react"; // dùng thư viện emoji-picker-react
import MoreMessageDropdown from "@/components/ui/more-message-dropdown";

export default function MessageInput({
  onSend,
  isMember,
  setIsVoteModalOpen,
  isGroup,
  members,
  member,
}) {
  const [input, setInput] = useState("");
  const [showMentionDropdown, setShowMentionDropdown] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionPosition, setMentionPosition] = useState(null);
  const [selectedMentionIndex, setSelectedMentionIndex] = useState(0);
  const [imageFiles, setImageFiles] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [videoPreviews, setVideoPreviews] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMemberState, setIsMember] = useState(isMember);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const editableRef = useRef(null); // dùng để thao tác con trỏ input

  useEffect(() => {
    if (editableRef.current?.innerText.trim() === "") {
      editableRef.current.classList.add("show-placeholder");
    }
  }, []);

  // ignore member._id
  const filteredMembers = members
    .filter((m) => m._id.toString() !== member._id.toString())
    .filter((m) => m.name.toLowerCase().includes(mentionQuery.toLowerCase()));

  useEffect(() => {
    setIsMember(isMember);
  }, [isMember]);

  useEffect(() => {
    if (imageFiles.length > 0) {
      const previews = imageFiles.map((file) => URL.createObjectURL(file));
      setImagePreviews(previews);
      return () => {
        previews.forEach((url) => URL.revokeObjectURL(url));
      };
    }
  }, [imageFiles]);

  useEffect(() => {
    if (videoFiles.length > 0) {
      const previews = videoFiles.map((file) => URL.createObjectURL(file));
      setVideoPreviews(previews);
      return () => {
        previews.forEach((url) => URL.revokeObjectURL(url));
      };
    }
  }, [videoFiles]);

  useEffect(() => {
    if (file) {
      const filePreview = {
        name: file.name,
        size: formatFileSize(file.size),
        type: file.type,
      };
      setFilePreviews([filePreview]);
    } else {
      setFilePreviews([]);
    }
  }, [file]);

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  const handleImageOrVideoSelect = (e) => {
    const files = Array.from(e.target.files);
    // nếu file là ảnh
    if (files.some((file) => file.type.startsWith("image/"))) {
      setImageFiles(files);
    }
    // nếu file là video
    else if (files.some((file) => file.type.startsWith("video/"))) {
      setVideoFiles(files);
    }
  };

  const handleFileSelect = (file) => {
    const selectedFile = file[0];
    setFile(selectedFile);
  };

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeVideo = (index) => {
    setVideoFiles((prev) => prev.filter((_, i) => i !== index));
    setVideoPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeFile = () => {
    setFile(null);
    setFilePreviews([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSend = async () => {
    console.log("click send");
    if (
      !editableRef.current?.innerText.trim() &&
      !imageFiles.length &&
      !file &&
      !videoFiles.length
    )
      return;
    console.log("click send 2");

    setIsLoading(true);
    try {
      // Lấy plain text từ contentEditable (đã bỏ các tag HTML)
      const plainText = editableRef.current?.innerText || "";

      // Xử lý tags như cũ
      const tags = [];
      const tagPositions = [];

      if (editableRef.current) {
        const spans = editableRef.current.querySelectorAll(".mention");

        spans.forEach((span) => {
          const memberName = span.textContent.replace(/^@/, "").trim();

          const foundMember = members.find(
            (m) =>
              m.name.trim().toLowerCase() === memberName.toLowerCase() &&
              m._id.toString() !== member._id.toString()
          );

          if (foundMember) {
            tags.push(foundMember._id);

            // Tính vị trí start/end dựa trên plainText
            const plainText = editableRef.current.innerText;
            const mentionText = span.innerText;
            const start = plainText.indexOf(mentionText);
            const end = start + mentionText.length;

            tagPositions.push({
              memberId: foundMember._id,
              start,
              end,
              name: foundMember.name,
            });
          }
        });
      }

      // Gửi tin nhắn (giữ nguyên phần còn lại)
      if (plainText.trim()) {
        await onSend({
          content: plainText.trim(),
          type: "TEXT",
          tags,
          tagPositions,
        });
      }

      if (imageFiles.length > 0) {
        await onSend({
          type: "IMAGE",
          files: imageFiles,
        });
      }

      if (videoFiles.length > 0) {
        await onSend({
          type: "VIDEO",
          files: videoFiles,
        });
      }

      if (file) {
        await onSend({
          type: "FILE",
          files: [file],
        });
      }

      setImageFiles([]);
      setVideoFiles([]);
      setImagePreviews([]);
      setVideoPreviews([]);
      setFile(null);
      setFilePreviews([]);
      if (imageInputRef.current) imageInputRef.current.value = "";
      if (videoInputRef.current) videoInputRef.current.value = "";
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Send message error:", error);
      alert("Send message error!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    // Xử lý navigation trong dropdown mention
    if (showMentionDropdown) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedMentionIndex((prev) =>
          Math.min(prev + 1, filteredMembers.length - 1)
        );
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedMentionIndex((prev) => Math.max(prev - 1, 0));
        return;
      }

      if (e.key === "Enter") {
        e.preventDefault();
        if (filteredMembers[selectedMentionIndex]) {
          handleSelectMention(filteredMembers[selectedMentionIndex]);
        }
        return;
      }

      if (e.key === "Escape") {
        e.preventDefault();
        setShowMentionDropdown(false);
        return;
      }
    }

    // Xử lý gửi tin nhắn như cũ
    if (e.key === "Enter" && !e.shiftKey && !showMentionDropdown) {
      e.preventDefault();
      handleSend();
    }
  };

  const onEmojiClick = (emojiData) => {
    if (!editableRef.current) return;

    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const emojiNode = document.createTextNode(emojiData.emoji);
    range.deleteContents();
    range.insertNode(emojiNode);

    // Di chuyển cursor sau emoji
    const newRange = document.createRange();
    newRange.setStartAfter(emojiNode);
    newRange.collapse(true);
    selection.removeAllRanges();
    selection.addRange(newRange);
  };

  const handleInputChange = () => {
    if (!editableRef.current) return;

    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    let cursorPos = 0;
    try {
      const range = selection.getRangeAt(0);
      const node = selection.anchorNode;

      if (editableRef.current.contains(node)) {
        // Tính vị trí cursorPos tương đối với đầu contentEditable
        let pos = 0;

        const traverse = (currentNode) => {
          if (currentNode === node) {
            pos += range.startOffset;
            throw pos; // stop recursion with result
          }

          if (currentNode.nodeType === Node.TEXT_NODE) {
            pos += currentNode.textContent.length;
          }

          currentNode.childNodes.forEach(traverse);
        };

        try {
          traverse(editableRef.current);
        } catch (result) {
          cursorPos = result;
        }
      }

      setInput(editableRef.current.innerText);
    } catch (error) {
      console.error("Error getting cursor position:", error);
    }

    const text = editableRef.current.innerText || "";

    // Toggle show-placeholder class
    if (editableRef.current) {
      if (text.trim() === "") {
        editableRef.current.classList.add("show-placeholder");
      } else {
        editableRef.current.classList.remove("show-placeholder");
      }
    }

    const textBeforeCursor = text.substring(0, cursorPos);
    const lastAtPos = textBeforeCursor.lastIndexOf("@");

    if (
      lastAtPos >= 0 &&
      (cursorPos === lastAtPos + 1 ||
        /^[\\w\\s]*$/.test(textBeforeCursor.substring(lastAtPos + 1)))
    ) {
      const query = textBeforeCursor.substring(lastAtPos + 1);
      setMentionQuery(query);
      setShowMentionDropdown(true);
      setMentionPosition({
        start: lastAtPos,
        end: cursorPos,
      });
      setSelectedMentionIndex(0);
    } else {
      setShowMentionDropdown(false);
    }
  };

  const handleSelectMention = (selectedMember) => {
    if (!mentionPosition || !editableRef.current) {
      setShowMentionDropdown(false);
      return;
    }

    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = document.createRange();
    let charIndex = 0;
    let found = false;

    const traverseNodes = (node) => {
      if (found) return;

      if (node.nodeType === Node.TEXT_NODE) {
        const nextCharIndex = charIndex + node.textContent.length;

        if (
          mentionPosition.start >= charIndex &&
          mentionPosition.end <= nextCharIndex
        ) {
          const startOffset = mentionPosition.start - charIndex;
          const endOffset = mentionPosition.end - charIndex;

          range.setStart(node, startOffset);
          range.setEnd(node, endOffset);

          found = true;
          return;
        }

        charIndex = nextCharIndex;
      } else {
        node.childNodes.forEach(traverseNodes);
      }
    };

    traverseNodes(editableRef.current);

    if (!found) {
      console.error("Failed to locate mention position");
      return;
    }

    // Chèn mention span như cũ
    const span = document.createElement("span");
    span.style.color = "#1a73e8";
    span.className = "mention";
    span.textContent = `@${selectedMember.name}`;
    range.deleteContents();
    range.insertNode(span);

    const spaceNode = document.createTextNode("\u00A0");
    span.after(spaceNode);

    const newRange = document.createRange();
    newRange.setStartAfter(spaceNode);
    newRange.collapse(true);
    selection.removeAllRanges();
    selection.addRange(newRange);

    setShowMentionDropdown(false);
    setMentionPosition(null);
  };

  return (
    <div className="relative flex flex-col w-full">
      {/* Previews (chỉ hiển thị 1 trong 2: image hoặc video) */}
      {(imagePreviews.length > 0 ||
        videoPreviews.length > 0 ||
        filePreviews.length > 0) && (
        <div className="p-2 mx-3 border-t border-gray-200">
          {/* Hiển thị image previews nếu có */}
          {imagePreviews.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt={`Preview ${index}`}
                    className="object-cover w-16 h-16 rounded"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full -top-2 -right-2"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Hiển thị video previews nếu có */}
          {videoPreviews.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {videoPreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <video
                    src={preview}
                    controls
                    className="object-cover w-16 h-16 rounded"
                  />
                  <button
                    onClick={() => removeVideo(index)}
                    className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full -top-2 -right-2"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Hiển thị file preview nếu có */}
          {filePreviews.length > 0 && (
            <div className="flex items-center justify-between p-2 bg-gray-100 rounded">
              <div className="flex items-center">
                <div className="mr-2">📄</div>
                <div>
                  <div className="max-w-xs text-sm font-medium truncate">
                    {filePreviews[0].name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {filePreviews[0].size}
                  </div>
                </div>
              </div>
              <button
                onClick={removeFile}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          )}
        </div>
      )}

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-[70px] right-4 z-10">
          <EmojiPicker onEmojiClick={onEmojiClick} theme="light" />
        </div>
      )}

      {/* Mention Dropdown */}
      {showMentionDropdown && filteredMembers.length > 0 && (
        <div
          className="absolute bottom-[70px] left-4 z-10 w-64 bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-auto"
          style={{
            left: mentionPosition ? `${mentionPosition.start * 8}px` : "0",
          }}
        >
          {filteredMembers.length === 0 ? (
            <div className="p-2 text-gray-500">No members to mention</div>
          ) : (
            filteredMembers.map((member, index) => (
              <div
                key={member._id}
                className={`p-2 hover:bg-gray-100 cursor-pointer ${
                  selectedMentionIndex === index ? "bg-blue-50" : ""
                }`}
                onClick={() => handleSelectMention(member)}
              >
                <div className="flex items-center">
                  <div className="mr-2">
                    {member.avatar ? (
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor: member.avatarColor || "#ccc",
                        }}
                      >
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{member.name}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <div className="flex items-center p-3 border-t">
        {!isMemberState ? (
          <input
            type="text"
            placeholder="You cannot message this conversation"
            className="w-full text-sm italic outline-none bg-inherit placeholder:text-center"
            disabled={true}
          />
        ) : (
          // !isLoading && (
          <>
            <Button
              size="icon"
              className="shrink-0 rounded-full bg-regal-blue text-white hover:scale-105 hover:bg-regal-blue/80 transition-all duration-200 border-none focus:outline-none mr-3"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <Plus className="!h-6 !w-6" />
            </Button>
            <MoreMessageDropdown
              isOpen={isDropdownOpen}
              onClose={() => setIsDropdownOpen(false)}
              onFileSelect={handleFileSelect}
              setIsVoteModalOpen={setIsVoteModalOpen}
              isGroup={isGroup}
            />
          </>

          // )
        )}

        <div
          className="flex-1 flex h-12 border rounded-[32px] items-center bg-[#F6F6F6] px-4 relative
           focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-300"
        >
          {!isMemberState ? (
            <input
              type="text"
              placeholder="You cannot message this conversation"
              className="w-full text-sm italic outline-none bg-inherit placeholder:text-center"
              disabled={true}
            />
          ) : (
            // !isLoading && (
            <>
              <div className="relative w-full">
                {/* Placeholder giả */}
                {input.trim() === "" && (
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none select-none text-sm">
                    Type a message...
                  </div>
                )}

                <div
                  ref={editableRef}
                  contentEditable
                  onInput={handleInputChange}
                  onKeyDown={handleKeyDown}
                  data-placeholder="Type a message..."
                  suppressContentEditableWarning={true}
                  className="text-sm bg-inherit py-2 text-left w-full outline-none ml-4"
                  style={{
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    minHeight: "24px",
                  }}
                />
              </div>

              <label className="cursor-pointer hover:opacity-70">
                <img src={PictureIcon} className="p-2" alt="Picture" />
                <input
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  multiple
                  ref={imageInputRef}
                  onChange={handleImageOrVideoSelect}
                  disabled={isLoading}
                />
              </label>
              <button
                onClick={() => setShowEmojiPicker((prev) => !prev)}
                className="px-2 bg-inherit hover:border-transparent hover:opacity-70"
              >
                <img src={EmojiIcon} alt="Emoji" />
              </button>
            </>
            // )
          )}
        </div>
        {!isMemberState ? (
          <></>
        ) : (
          // !isLoading && (
          <div
            onClick={handleSend}
            className={`px-4 py-2 ml-1 duration-200 ease-in-out cursor-pointer hover:translate-x-2 ${
              isLoading ? "opacity-50" : ""
            }`}
          >
            <img src={SendIcon} alt="Send" />
          </div>
          // )
        )}
      </div>
    </div>
  );
}

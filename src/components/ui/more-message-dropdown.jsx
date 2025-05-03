/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Dropdown, DropdownItem } from "@/components/ui/dropdown";
import { Vote, FileUp } from "lucide-react";
import { useDispatch } from "react-redux";
import { useRef } from "react";

export default function MoreMessageDropdown({
  isOpen,
  onClose,
  onFileSelect,
  setIsVoteModalOpen,
}) {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const handleFileInputClick = () => {
    fileInputRef.current.click();
    onClose();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <>
      <Dropdown
        isOpen={isOpen}
        onClose={onClose}
        align="right"
        verticalAlign="top"
      >
        <DropdownItem icon={FileUp} onClick={handleFileInputClick}>
          Upload a file
        </DropdownItem>
        <DropdownItem
          icon={Vote}
          onClick={() => {
            setIsVoteModalOpen(true);
            onClose();
          }}
        >
          Create vote
        </DropdownItem>
      </Dropdown>
      <input
        type="file"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
    </>
  );
}

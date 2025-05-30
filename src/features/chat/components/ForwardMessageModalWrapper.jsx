/* eslint-disable react/prop-types */
import { useState } from "react";
import ForwardMessageModal from "./ForwardMessageModal";

export default function ForwardMessageModalWrapper({ message, onClose }) {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  if (!isOpen) return null;

  return <ForwardMessageModal message={message} onClose={handleClose} />;
}

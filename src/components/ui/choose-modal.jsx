/* eslint-disable react/prop-types */
"use client"

import { Modal } from "./modal"
import { Button } from "./button"

export function ChooseModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmation",
  message = "Are you sure you want to proceed?",
  confirmText = "Yes",
  cancelText = "Cancel",
  confirmButtonClass = "bg-blue-600 hover:bg-blue-700 text-white",
  cancelButtonClass = "bg-gray-200 hover:bg-gray-300 text-gray-800",
}) {
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm()
    }
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-6">
        {/* Message */}
        <p className="text-center text-gray-700">{message}</p>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button className={confirmButtonClass} onClick={handleConfirm}>
            {confirmText}
          </Button>
          <Button className={cancelButtonClass} onClick={onClose}>
            {cancelText}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

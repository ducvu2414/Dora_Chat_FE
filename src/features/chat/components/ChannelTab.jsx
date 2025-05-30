/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChannelContextMenu } from "@/components/ui/channel-context-menu";
import { AddChannelModal } from "@/components/ui/add-channel-modal";
import { motion } from "framer-motion";

export function ChannelTab({
  channels = [],
  activeChannel,
  onChannelChange,
  onDeleteChannel,
  onAddChannel,
}) {
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    channelId: null,
    channelName: "",
  });
  const [isAddChannelOpen, setIsAddChannelOpen] = useState(false);
  const [underlineStyle, setUnderlineStyle] = useState({});
  const [editingChannel, setEditingChannel] = useState(null);

  const tabsRef = useRef(null);

  useEffect(() => {
    if (channels.length > 0 && !channels.some((channel) => channel._id === activeChannel)) {
      onChannelChange(channels[0]._id);
    }
  }, [channels, activeChannel, onChannelChange]);

  useEffect(() => {
    if (tabsRef.current) {
      const activeButton = tabsRef.current.querySelector(
        `[data-id="${activeChannel}"]`
      );
      if (activeButton) {
        setUnderlineStyle({
          left: activeButton.offsetLeft,
          width: activeButton.offsetWidth,
        });
      }
    }
  }, [activeChannel]);

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu.visible) {
        setContextMenu({ ...contextMenu, visible: false });
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [contextMenu]);

  // Handle right click on channel tab
  const handleContextMenu = (e, channelId) => {
    e.preventDefault(); // Prevent default browser context menu

    const tabElement = e.currentTarget;
    const tabRect = tabElement.getBoundingClientRect();

    // Use exact cursor position without adjustment
    setContextMenu({
      visible: true,
      x: tabRect.left,
      y: tabRect.bottom,
      channelId,
      channelName: tabElement.innerText,
    });
    setTimeout(() => {
      setContextMenu((prev) => ({ ...prev, visible: true }));
    }, 0); // Delay to allow for context menu to be positioned correctly
  };

  // Handle delete channel
  const handleDeleteChannel = (channelId) => {
    if (onDeleteChannel) {
      onDeleteChannel(channelId);
    }
    setContextMenu({ ...contextMenu, visible: false });
  };

  const handleAddAndUpdateChannel = (channelData) => {
    if (onAddChannel) {
      onAddChannel(channelData, editingChannel?.channelId);
    }
    setIsAddChannelOpen(false);
    setEditingChannel(null);
  };

  const handleEditChannel = () => {
    setEditingChannel({
      channelId: contextMenu.channelId,
      channelName: contextMenu.channelName,
    });
    setIsAddChannelOpen(true);
    setContextMenu({ ...contextMenu, visible: false });
  };

  return (
    <div
      className="relative flex items-center border-b border-gray-200"
      ref={tabsRef}
    >
      <div className="flex-1 overflow-x-auto">
        <div className="relative flex items-center gap-4 px-6 py-3 border-b border-gray-300 max-w-md">
          {channels.map((channel) => (
            <button
              key={channel._id}
              data-id={channel._id}
              onClick={() => onChannelChange(channel._id)}
              onContextMenu={(e) => handleContextMenu(e, channel._id)}
              className={`text-sm font-bold relative rounded-full bg-white focus:outline-none ${
                activeChannel === channel._id
                  ? "text-regal-blue border-regal-blue"
                  : "text-gray-500 hover:text-regal-blue"
              }`}
            >
              {channel.name}
            </button>
          ))}

          {/* Thanh underline động */}
          <motion.div
            className="absolute bottom-0 h-0.5 bg-regal-blue rounded-full"
            animate={underlineStyle}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>
      </div>

      {/* Add Channel Button */}
      <Button
        variant="ghost"
        size="icon"
        className="ml-2 mr-2 text-gray-500 hover:text-blue-600 hover:bg-gray-50"
        onClick={() => setIsAddChannelOpen(true)}
      >
        <Plus className="h-5 w-5" />
      </Button>

      {/* Context Menu */}
      {contextMenu.visible && (
        <ChannelContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          channel={contextMenu}
          onDelete={handleDeleteChannel}
          onEdit={handleEditChannel}
        />
      )}

      {/* Add Channel Modal */}
      <AddChannelModal
        isOpen={isAddChannelOpen}
        onClose={() => {
          setIsAddChannelOpen(false);
          setEditingChannel(null);
        }}
        onAdd={handleAddAndUpdateChannel}
        initialName={editingChannel?.channelName}
        isEditing={!!editingChannel}
      />
    </div>
  );
}

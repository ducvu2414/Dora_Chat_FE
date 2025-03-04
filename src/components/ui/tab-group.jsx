/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

export function TabGroup({ tabs, activeTab, onTabChange, rightContent }) {
  const [underlineStyle, setUnderlineStyle] = useState({});
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      const activeButton = containerRef.current.querySelector(
        `[data-id="${activeTab}"]`
      );
      if (activeButton) {
        setUnderlineStyle({
          left: activeButton.offsetLeft,
          width: activeButton.offsetWidth,
        });
      }
    }
  }, [activeTab]);

  return (
    <div
      className="relative flex items-center gap-4 px-6 py-3 border-b border-gray-300"
      ref={containerRef}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          data-id={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`text-sm font-bold relative rounded-full bg-white focus:outline-none ${
            activeTab === tab.id
              ? "text-regal-blue border-regal-blue"
              : "text-gray-500 hover:text-regal-blue"
          } `}
        >
          {tab.label}
        </button>
      ))}

      {rightContent && <div className="ml-auto">{rightContent}</div>}

      {/* Thanh underline động */}
      <motion.div
        className="absolute bottom-0 h-0.5 bg-regal-blue rounded-full"
        animate={underlineStyle}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
    </div>
  );
}

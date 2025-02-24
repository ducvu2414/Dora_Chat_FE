/* eslint-disable react/prop-types */

// data: { tabs: {}[], activeTab, onTabChange, rightContent }
export function TabGroup({ tabs, activeTab, onTabChange, rightContent }) {
  return (
    <div className="flex items-center gap-4 px-6 py-3">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`text-sm font-bold relative rounded-full bg-white focus:outline-none ${
            activeTab === tab.id
              ? "text-regal-blue border-regal-blue"
              : "text-gray-500 hover:text-regal-blue"
          }`}
        >
          {tab.label}
          {activeTab === tab.id && (
            <div className="absolute -bottom-3 left-0 right-0 h-0.5 bg-regal-blue rounded-full" />
          )}
        </button>
      ))}
      {rightContent && <div className="ml-auto">{rightContent}</div>}
    </div>
  );
}

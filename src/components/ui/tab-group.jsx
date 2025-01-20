// data: { tabs: {}[], activeTab, onTabChange, rightContent }
export function TabGroup(data) {
  return (
    <div className="flex items-center gap-4 px-6 py-3">
      {data.tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => data.onTabChange(tab.id)}
          className={`text-sm font-bold relative rounded-full bg-white focus:outline-none ${
            data.activeTab === tab.id 
            ? "text-regal-blue border-regal-blue"
            : "text-gray-500 hover:text-regal-blue"
            // ? 'text-white !bg-regal-blue border-regal-blue' 
            // : 'text-regal-blue !bg-white hover:text-regal-blue'
          }`}
        >
          {tab.label}
          {data.activeTab === tab.id && (
            <div className="absolute -bottom-3 left-0 right-0 h-0.5 bg-regal-blue rounded-full" />
          )}
        </button>
      ))}
      {data.rightContent && <div className="ml-auto">{data.rightContent}</div>}
    </div>
  )
}

import React, { useState } from 'react';

const Tabs = ({ 
  tabs, 
  activeTab, 
  onChange, 
  className = '',
  tabClassName = '',
  activeTabClassName = '',
  contentClassName = ''
}) => {
  const [activeIndex, setActiveIndex] = useState(activeTab || 0);

  const handleTabClick = (index) => {
    setActiveIndex(index);
    if (onChange) {
      onChange(index);
    }
  };

  return (
    <div className={className}>
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab, index) => (
            <button
              key={index}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm
                ${
                  index === activeIndex
                    ? `border-primary text-primary ${activeTabClassName}`
                    : `border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 ${tabClassName}`
                }
              `}
              onClick={() => handleTabClick(index)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div className={`py-4 ${contentClassName}`}>
        {tabs[activeIndex]?.content}
      </div>
    </div>
  );
};

// Tab item component for better organization
Tabs.Tab = ({ label, content }) => {
  return { label, content };
};

export default Tabs;

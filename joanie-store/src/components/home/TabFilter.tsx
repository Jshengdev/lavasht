'use client';

import { motion } from 'framer-motion';

type TabCategory = 'new-arrivals' | 'trending';

interface TabFilterProps {
  activeTab: TabCategory;
  onTabChange: (tab: TabCategory) => void;
}

const tabs: { id: TabCategory; label: string }[] = [
  { id: 'new-arrivals', label: 'NEW ARRIVALS' },
  { id: 'trending', label: "WHAT'S TRENDING" },
];

export default function TabFilter({ activeTab, onTabChange }: TabFilterProps) {
  return (
    <div data-animate="tabs" className="flex items-center gap-[16px]">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <motion.button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              text-[14px] font-medium transition-all duration-300
              ${
                isActive
                  ? 'h-[45px] px-[20px] pt-[12px] pb-[11px] bg-[#333333] text-white border border-[#F4F4F4] rounded-[5px]'
                  : 'h-[57px] px-[33px] py-[16px] bg-transparent text-[#77794E] border-4 border-[#77794E] rounded-[100px] hover:border-[#9FA16D] hover:text-[#9FA16D]'
              }
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            layout
            transition={{
              layout: { duration: 0.3, ease: [0.68, -0.55, 0.265, 1.55] },
            }}
          >
            {tab.label}
          </motion.button>
        );
      })}
    </div>
  );
}

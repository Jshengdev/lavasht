'use client';

import { motion } from 'framer-motion';

type TabCategory = 'new-arrivals' | 'trending';

interface TabFilterProps {
  activeTab: TabCategory;
  onTabChange: (tab: TabCategory) => void;
}

const TABS = [
  { id: 'new-arrivals' as const, label: 'NEW ARRIVALS', color: '#4A4C6C', border: '#7C7EA1' },
  { id: 'trending' as const, label: "WHAT'S TRENDING", color: '#77794E', border: '#9FA16D' },
];

export default function TabFilter({ activeTab, onTabChange }: TabFilterProps) {
  return (
    <div data-animate="tabs" className="flex items-center gap-[10px]">
      {TABS.map(({ id, label, color, border }) => {
        const isActive = activeTab === id;

        return (
          <motion.button
            key={id}
            onClick={() => onTabChange(id)}
            className="rounded-full border-4"
            style={{
              fontFamily: "'Cabinet Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: '20px',
              letterSpacing: '0.05em',
              padding: '16px 33px',
              backgroundColor: isActive ? color : 'transparent',
              borderColor: border,
              color: isActive ? '#FFFFFF' : color,
              boxShadow: `0 5px 8px ${color}66`,
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {label}
          </motion.button>
        );
      })}
    </div>
  );
}

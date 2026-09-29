import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Trash2 } from 'lucide-react';
import './AnimatedList.css';

export default function AnimatedList({
  items = [],
  onItemSelect,
  onItemDelete,
  className = '',
  emptyText = 'No previous conversations'
}) {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isListFocused, setIsListFocused] = useState(false);
  const containerRef = useRef(null);

  // Keyboard navigation SCOPED strictly to container focus
  const handleKeyDown = (e) => {
    if (!isListFocused && document.activeElement !== containerRef.current && !containerRef.current?.contains(document.activeElement)) {
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0 && selectedIndex < items.length) {
        e.preventDefault();
        onItemSelect?.(items[selectedIndex]);
      }
    }
  };

  if (!items || items.length === 0) {
    return (
      <div className="text-[11px] text-slate-400 dark:text-slate-500/80 px-3 py-4 text-center italic font-sans select-none">
        {emptyText}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onFocus={() => setIsListFocused(true)}
      onBlur={() => {
        setIsListFocused(false);
        setSelectedIndex(-1);
      }}
      onKeyDown={handleKeyDown}
      className={`animated-list-container flex flex-col gap-0.5 outline-none ${className}`}
      role="listbox"
      aria-label="Recent Conversations"
    >
      <AnimatePresence initial={false}>
        {items.map((item, index) => {
          const isSelected = selectedIndex === index;
          return (
            <motion.div
              key={item + '-' + index}
              layout
              initial={{ opacity: 0, y: -4, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.12 } }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className={`group/row relative flex items-center justify-between rounded-lg px-2.5 py-1.5 transition-colors cursor-pointer select-none text-left ${
                isSelected
                  ? 'bg-slate-200 dark:bg-white/[0.08] text-slate-900 dark:text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.04]'
              }`}
              onClick={() => onItemSelect?.(item)}
              role="option"
              aria-selected={isSelected}
            >
              <div className="flex items-center gap-2 min-w-0 flex-1 pr-1.5">
                <MessageSquare
                  size={13}
                  className="text-slate-400 dark:text-slate-500 group-hover/row:text-indigo-600 dark:group-hover/row:text-indigo-400 flex-shrink-0 transition-colors"
                />
                <span className="text-[12px] font-normal truncate tracking-tight">
                  {item}
                </span>
              </div>

              {onItemDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onItemDelete(item);
                  }}
                  className="opacity-0 group-hover/row:opacity-100 hover:opacity-100 p-1 -mr-1 text-slate-400 dark:text-slate-500 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded transition-all cursor-pointer flex-shrink-0"
                  title="Remove conversation"
                  aria-label="Delete item"
                >
                  <Trash2 size={11} />
                </button>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

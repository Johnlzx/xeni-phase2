import { motion, AnimatePresence } from 'motion/react';
import { PageThumbnail } from './PageThumbnail';
import { DragLayer } from './DragLayer';
import { ReviewPage } from './types';
import { SPRING_CONFIG, FADE_CONFIG } from './constants';

interface ReviewDialogSidebarProps {
  pages: ReviewPage[];
  selectedPageIndex: number;
  onPageSelect: (index: number) => void;
  onPageReorder: (dragIndex: number, hoverIndex: number) => void;
}

export function ReviewDialogSidebar({
  pages,
  selectedPageIndex,
  onPageSelect,
  onPageReorder,
}: ReviewDialogSidebarProps) {
  return (
    <div className="w-28 bg-gray-50 border-r border-gray-200 flex flex-col shrink-0">
      {/* Sidebar Header */}
      <div className="px-3 py-2 border-b border-gray-200">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
          Thumbnails
        </p>
      </div>

      {/* Thumbnails List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        <AnimatePresence mode="popLayout">
          {pages.map((page, index) => (
            <motion.div
              key={page.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                layout: SPRING_CONFIG,
                opacity: FADE_CONFIG,
                scale: FADE_CONFIG,
              }}
            >
              <PageThumbnail
                page={page}
                index={index}
                isSelected={selectedPageIndex === index}
                onClick={() => onPageSelect(index)}
                onMove={onPageReorder}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Custom drag layer for smooth preview */}
        <DragLayer pages={pages} />
      </div>
    </div>
  );
}

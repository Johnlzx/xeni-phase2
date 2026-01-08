import { useDragLayer, XYCoord } from 'react-dnd';
import { motion, AnimatePresence } from 'motion/react';
import { ReviewPage } from './types';
import { DRAG_ITEM_TYPE, SPRING_FAST, THEME_COLOR } from './constants';

interface DragLayerProps {
  pages: ReviewPage[];
}

function getItemStyles(
  initialOffset: XYCoord | null,
  currentOffset: XYCoord | null
) {
  if (!initialOffset || !currentOffset) {
    return { display: 'none' };
  }

  const { x, y } = currentOffset;
  return {
    transform: `translate(${x}px, ${y}px)`,
  };
}

export function DragLayer({ pages }: DragLayerProps) {
  const { itemType, isDragging, item, initialOffset, currentOffset } =
    useDragLayer((monitor) => ({
      item: monitor.getItem(),
      itemType: monitor.getItemType(),
      initialOffset: monitor.getInitialSourceClientOffset(),
      currentOffset: monitor.getSourceClientOffset(),
      isDragging: monitor.isDragging(),
    }));

  if (!isDragging || itemType !== DRAG_ITEM_TYPE) {
    return null;
  }

  const draggedPage = pages.find((p) => p.id === item?.id);
  if (!draggedPage) return null;

  return (
    <div
      style={{
        position: 'fixed',
        pointerEvents: 'none',
        zIndex: 9999,
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
      }}
    >
      <div style={getItemStyles(initialOffset, currentOffset)}>
        <AnimatePresence>
          <motion.div
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{
              scale: 1.08,
              opacity: 1,
              rotate: 2,
            }}
            exit={{ scale: 1, opacity: 0 }}
            transition={SPRING_FAST}
            className="relative w-16 aspect-[3/4] rounded-lg overflow-hidden"
            style={{
              boxShadow: '0 20px 40px rgba(0,0,0,0.25), 0 8px 16px rgba(0,0,0,0.15)',
            }}
          >
            {/* Page background */}
            <div
              className="w-full h-full"
              style={{ backgroundColor: draggedPage.color }}
            />

            {/* Position badge */}
            <div
              className="absolute bottom-1.5 right-1.5 text-white text-[10px] px-1.5 py-0.5 rounded font-bold"
              style={{ backgroundColor: THEME_COLOR }}
            >
              {item.index + 1}
            </div>

            {/* Drag indicator glow */}
            <div
              className="absolute inset-0 ring-2 ring-offset-2 rounded-lg pointer-events-none"
              style={{ '--tw-ring-color': THEME_COLOR } as React.CSSProperties}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

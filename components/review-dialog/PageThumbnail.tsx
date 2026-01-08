import { useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/components/ui/utils';
import { ReviewPage, DragItem } from './types';
import { DRAG_ITEM_TYPE, SPRING_CONFIG, SPRING_FAST, THEME_COLOR } from './constants';

// Re-export for backwards compatibility
export type { ReviewPage };

interface PageThumbnailProps {
  page: ReviewPage;
  index: number;
  isSelected?: boolean;
  onClick?: () => void;
  onMove: (dragIndex: number, hoverIndex: number) => void;
  disabled?: boolean;
}

export function PageThumbnail({
  page,
  index,
  isSelected = false,
  onClick,
  onMove,
  disabled = false,
}: PageThumbnailProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [dropPosition, setDropPosition] = useState<'before' | 'after' | null>(null);

  const [{ handlerId, isOver, canDrop }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: string | symbol | null; isOver: boolean; canDrop: boolean }
  >({
    accept: DRAG_ITEM_TYPE,
    canDrop: () => !disabled,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
        isOver: monitor.isOver({ shallow: true }),
        canDrop: monitor.canDrop(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current || disabled) {
        setDropPosition(null);
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        setDropPosition(null);
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();

      if (!clientOffset) {
        setDropPosition(null);
        return;
      }

      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Determine drop position
      if (hoverClientY < hoverMiddleY) {
        setDropPosition('before');
      } else {
        setDropPosition('after');
      }

      // Only perform the move when we've crossed the middle
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      onMove(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
    drop() {
      setDropPosition(null);
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: DRAG_ITEM_TYPE,
    canDrag: () => !disabled,
    item: () => ({ id: page.id, index, type: DRAG_ITEM_TYPE }),
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    end: () => setDropPosition(null),
  });

  drag(drop(ref));

  const showDropIndicator = isOver && canDrop && dropPosition !== null;

  return (
    <div className="relative">
      {/* Drop indicator - before */}
      <AnimatePresence>
        {showDropIndicator && dropPosition === 'before' && (
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ scaleX: 0, opacity: 0 }}
            transition={SPRING_CONFIG}
            className="absolute -top-1.5 left-1 right-1 h-0.5 rounded-full origin-center z-10"
            style={{
              backgroundColor: THEME_COLOR,
              boxShadow: `0 0 8px ${THEME_COLOR}80`
            }}
          />
        )}
      </AnimatePresence>

      <motion.div
        ref={ref}
        data-handler-id={handlerId}
        onClick={onClick}
        animate={{
          scale: isOver && canDrop ? 1.02 : 1,
          opacity: isDragging ? 0.3 : 1,
        }}
        transition={SPRING_FAST}
        className={cn(
          'relative cursor-grab active:cursor-grabbing transition-shadow duration-200 rounded-lg overflow-hidden',
          'aspect-[3/4]',
          isDragging && 'border-2 border-dashed border-[#0E4268]/50 bg-[#0E4268]/5',
          isSelected
            ? 'ring-2 ring-[#0E4268] ring-offset-2 shadow-md'
            : 'hover:ring-2 hover:ring-gray-300 hover:ring-offset-1',
          isOver && canDrop && !isDragging && 'shadow-lg ring-2 ring-[#0E4268]/30',
          disabled && 'cursor-not-allowed opacity-60'
        )}
      >
        {/* Page background/thumbnail */}
        <div
          className={cn(
            'w-full h-full transition-opacity duration-150',
            isDragging && 'opacity-50'
          )}
          style={{ backgroundColor: page.color }}
        />

        {/* Position number badge */}
        <motion.div
          animate={{
            scale: isSelected ? 1.1 : 1,
            backgroundColor: isSelected ? THEME_COLOR : 'rgba(0,0,0,0.6)',
          }}
          className="absolute bottom-1.5 right-1.5 text-white text-[10px] px-1.5 py-0.5 rounded font-bold backdrop-blur-sm"
        >
          {index + 1}
        </motion.div>

        {/* Status indicators */}
        {page.isNew && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-1 left-1"
          >
            <span className="bg-emerald-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow-sm">
              NEW
            </span>
          </motion.div>
        )}
        {page.isRemoved && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-1 left-1"
          >
            <span className="bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow-sm">
              DEL
            </span>
          </motion.div>
        )}

        {/* Selection overlay */}
        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#0E4268]/10 pointer-events-none"
            />
          )}
        </AnimatePresence>

        {/* Drag hover glow */}
        <AnimatePresence>
          {isOver && canDrop && !isDragging && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#0E4268]/5 pointer-events-none"
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Drop indicator - after */}
      <AnimatePresence>
        {showDropIndicator && dropPosition === 'after' && (
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ scaleX: 0, opacity: 0 }}
            transition={SPRING_CONFIG}
            className="absolute -bottom-1.5 left-1 right-1 h-0.5 rounded-full origin-center z-10"
            style={{
              backgroundColor: THEME_COLOR,
              boxShadow: `0 0 8px ${THEME_COLOR}80`
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

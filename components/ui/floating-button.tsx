"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, PanInfo } from "motion/react";
import { Sparkles, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingButtonProps {
  children?: React.ReactNode;
  onPluginActivate?: () => void;
  className?: string;
}

type EdgePosition = "left" | "right";

const EDGE_MARGIN = 12;
const BUTTON_SIZE = 36; // Smaller like Vercel's widget
const DROP_ZONE_HEIGHT = 100;

export function FloatingButton({
  children,
  onPluginActivate,
  className,
}: FloatingButtonProps) {
  const [mounted, setMounted] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);
  const [isInDropZone, setIsInDropZone] = React.useState(false);
  const [edgePosition, setEdgePosition] = React.useState<EdgePosition>("left");
  const [verticalPosition, setVerticalPosition] = React.useState(0.85);

  const springConfig = { stiffness: 400, damping: 30 };
  const x = useMotionValue(EDGE_MARGIN);
  const y = useMotionValue(400);
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const getSnapPosition = React.useCallback(
    (edge: EdgePosition, vPos: number) => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      const xPos =
        edge === "left"
          ? EDGE_MARGIN
          : windowWidth - BUTTON_SIZE - EDGE_MARGIN;
      const yPos = Math.min(
        Math.max(EDGE_MARGIN, windowHeight * vPos - BUTTON_SIZE / 2),
        windowHeight - BUTTON_SIZE - EDGE_MARGIN
      );

      return { x: xPos, y: yPos };
    },
    []
  );

  React.useEffect(() => {
    setMounted(true);
    const pos = getSnapPosition(edgePosition, verticalPosition);
    x.set(pos.x);
    y.set(pos.y);
  }, []);

  React.useEffect(() => {
    if (!mounted) return;

    const handleResize = () => {
      if (!isDragging) {
        const pos = getSnapPosition(edgePosition, verticalPosition);
        x.set(pos.x);
        y.set(pos.y);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mounted, edgePosition, verticalPosition, isDragging, getSnapPosition, x, y]);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDrag = (_: unknown, info: PanInfo) => {
    const windowHeight = window.innerHeight;
    const currentY = info.point.y;

    // Check if near bottom drop zone
    if (currentY > windowHeight - DROP_ZONE_HEIGHT) {
      if (!isInDropZone) {
        setIsInDropZone(true);
      }
    } else {
      if (isInDropZone) {
        setIsInDropZone(false);
      }
    }
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    setIsDragging(false);

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const currentX = info.point.x;
    const currentY = info.point.y;

    if (isInDropZone) {
      setIsInDropZone(false);
      onPluginActivate?.();
      // Snap back to original position
      const pos = getSnapPosition(edgePosition, verticalPosition);
      x.set(pos.x);
      y.set(pos.y);
      return;
    }

    // Determine which edge to snap to
    const newEdge: EdgePosition = currentX < windowWidth / 2 ? "left" : "right";

    // Clamp vertical position
    const clampedY = Math.max(
      EDGE_MARGIN,
      Math.min(currentY - BUTTON_SIZE / 2, windowHeight - BUTTON_SIZE - EDGE_MARGIN)
    );
    const newVerticalPosition = (clampedY + BUTTON_SIZE / 2) / windowHeight;

    // Calculate snap position
    const snapX =
      newEdge === "left"
        ? EDGE_MARGIN
        : windowWidth - BUTTON_SIZE - EDGE_MARGIN;

    setEdgePosition(newEdge);
    setVerticalPosition(newVerticalPosition);

    // Animate to snap position
    x.set(snapX);
    y.set(clampedY);
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Bottom Drop Zone Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isDragging ? 1 : 0 }}
        transition={{ duration: 0.15 }}
        className="fixed inset-x-0 bottom-0 z-40 pointer-events-none"
        style={{ height: DROP_ZONE_HEIGHT }}
      >
        {/* Gradient background */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.2) 60%, transparent 100%)",
          }}
        />

        {/* Circle slot */}
        <div className="absolute inset-0 flex items-center justify-center pb-4">
          <motion.div
            animate={{
              scale: isInDropZone ? 1.1 : 1,
              borderColor: isInDropZone
                ? "rgba(255, 255, 255, 0.9)"
                : "rgba(255, 255, 255, 0.4)",
            }}
            transition={{ duration: 0.15 }}
            className={cn(
              "size-12 rounded-full flex items-center justify-center",
              "border-2 border-dashed",
              "bg-white/10 backdrop-blur-sm"
            )}
          >
            <motion.div
              animate={{
                scale: isInDropZone ? 1.2 : 1,
                opacity: isInDropZone ? 1 : 0.6,
              }}
              transition={{ duration: 0.15 }}
            >
              <Sparkles
                className={cn(
                  "size-5",
                  isInDropZone ? "text-white" : "text-white/70"
                )}
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating Button */}
      <motion.button
        drag
        dragMomentum={false}
        dragElastic={0.1}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        whileDrag={{ scale: 1.08, cursor: "grabbing" }}
        whileTap={{ scale: 0.95 }}
        aria-label="Plugin launcher"
        className={cn(
          "fixed top-0 left-0 z-50 cursor-grab",
          "size-9 rounded-full",
          "bg-slate-800 text-white",
          "flex items-center justify-center",
          "shadow-md hover:shadow-lg",
          "hover:bg-slate-700",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "touch-none select-none",
          className
        )}
        style={{ x: springX, y: springY }}
      >
        {children || <Menu className="size-4" />}
      </motion.button>
    </>
  );
}

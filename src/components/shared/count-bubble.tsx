"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export function CountBubble({ count }: { count: number }) {
  return (
    <AnimatePresence mode="popLayout">
      {count > 0 && (
        <motion.div
          key={count}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: 1,
            scale: [1, 1.2, 1],
          }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{
            opacity: { duration: 0.15 },
            scale: {
              duration: 0.35,
              ease: "easeOut",
            },
          }}
          className="absolute top-0.5 right-0.5"
        >
          <Badge className="grid min-w-5 place-items-center rounded-full bg-primary px-1 text-xs font-semibold text-primary-foreground">
            {count}
          </Badge>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

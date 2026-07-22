import { motion } from "motion/react";

type Props = {
  thinking?: boolean;
};

export default function AuroraBackground({ thinking = false }: Props) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Aurora 1 */}
      <motion.div
        animate={{
          x: [0, 120, -80, 0],
          y: [0, -60, 40, 0],
          scale: [1, 1.15, 0.95, 1],
          opacity: thinking ? [0.22, 0.38, 0.25] : [0.12, 0.08, 0.12],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-[-15%] top-[-10%] h-[700px] w-[700px] rounded-full bg-purple-600 blur-[220px]"
      />

      {/* Aurora 2 */}
      <motion.div
        animate={{
          x: [0, -100, 60, 0],
          y: [0, 60, -50, 0],
          scale: [1, 0.9, 1.1, 1],
          opacity: thinking ? [0.2, 0.35, 0.22] : [0.1, 0.16, 0.1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute right-[-15%] bottom-[-10%] h-[450px] w-[450px] rounded-full bg-blue-500 blur-[140px]"
      />

      {/* Aurora 3 */}
      <motion.div
        animate={{
          x: [0, 80, -50, 0],
          y: [0, -30, 50, 0],
          opacity: thinking ? [0.14, 0.25, 0.16] : [0.06, 0.1, 0.06],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-1/2 top-1/3 h-[350px] w-[350px] -translate-x-1/2 rounded-full bg-fuchsia-500 blur-[120px]"
      />
    </div>
  );
}

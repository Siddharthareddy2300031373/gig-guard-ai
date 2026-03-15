import { motion } from "framer-motion";
import { ReactNode } from "react";

interface MetricCardProps {
  label: string;
  value: number;
  threshold: number;
  unit: string;
  icon: ReactNode;
}

const MetricCard = ({ label, value, threshold, unit, icon }: MetricCardProps) => {
  const progress = Math.min((value / threshold) * 100, 100);
  const triggered = value >= threshold;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-xl p-4 shadow-card transition-colors ${
        triggered ? "bg-success/5" : "bg-card"
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
        <span className="text-primary">{icon}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold tabular-nums">{value}</span>
        <span className="text-muted-foreground text-sm">{unit}</span>
      </div>
      <div className="mt-3 h-1.5 w-full bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: [0.2, 0, 0, 1] }}
          className={`h-full rounded-full ${triggered ? "bg-success" : "bg-primary"}`}
        />
      </div>
      <p className="mt-1.5 text-xs text-muted-foreground">
        Trigger: {threshold}{unit} {triggered && <span className="text-success font-semibold ml-1">● Triggered</span>}
      </p>
    </motion.div>
  );
};

export default MetricCard;

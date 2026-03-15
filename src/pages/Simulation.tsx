import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CloudRain, Thermometer, Wind, Check, X, Zap } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useEffect, useState } from "react";
import MetricCard from "@/components/MetricCard";

interface SimResult {
  trigger: string;
  value: number;
  threshold: number;
  unit: string;
  payout: number;
  triggered: boolean;
}

const scenarios: { label: string; icon: React.ReactNode; trigger: string; unit: string; threshold: number; range: [number, number]; payout: number }[] = [
  { label: "Heavy Rain", icon: <CloudRain className="w-5 h-5" />, trigger: "Rainfall", unit: "mm", threshold: 50, range: [40, 85], payout: 500 },
  { label: "Extreme Heat", icon: <Thermometer className="w-5 h-5" />, trigger: "Temperature", unit: "°C", threshold: 45, range: [42, 52], payout: 400 },
  { label: "High Pollution", icon: <Wind className="w-5 h-5" />, trigger: "Air Quality", unit: "AQI", threshold: 400, range: [350, 500], payout: 450 },
];

const Simulation = () => {
  const navigate = useNavigate();
  const { worker, policy, addClaim } = useAppStore();
  const [result, setResult] = useState<SimResult | null>(null);
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    if (!worker) navigate("/");
  }, [worker, navigate]);

  if (!worker) return null;

  const simulate = async (scenario: typeof scenarios[0]) => {
    setSimulating(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 1500));
    const value = Math.floor(Math.random() * (scenario.range[1] - scenario.range[0])) + scenario.range[0];
    const triggered = value >= scenario.threshold;
    const sim: SimResult = {
      trigger: scenario.trigger,
      value,
      threshold: scenario.threshold,
      unit: scenario.unit,
      payout: triggered ? scenario.payout : 0,
      triggered,
    };
    setResult(sim);
    setSimulating(false);

    if (triggered && policy?.active) {
      addClaim({
        trigger: scenario.trigger,
        value: sim.value,
        threshold: sim.threshold,
        unit: sim.unit,
        payout: sim.payout,
        status: "approved",
      });
    }
  };

  return (
    <div className="px-4 py-6 max-w-lg mx-auto pb-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
        <div>
          <h1 className="text-xl font-bold mb-1">Claim Simulation</h1>
          <p className="text-sm text-muted-foreground">
            {policy?.active ? "Test automatic weather triggers" : "Activate a policy first to simulate claims"}
          </p>
        </div>

        {!policy?.active && (
          <div className="rounded-xl p-5 bg-warning/10 shadow-card">
            <p className="text-sm text-foreground font-medium mb-2">No active policy</p>
            <p className="text-xs text-muted-foreground mb-3">You need an active policy to simulate claims.</p>
            <button onClick={() => navigate("/policy")} className="text-sm font-semibold text-primary">
              Activate Policy →
            </button>
          </div>
        )}

        {/* Scenario Buttons */}
        <div className="space-y-3">
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Simulate Event</h2>
          {scenarios.map((s) => (
            <motion.button
              key={s.label}
              whileTap={{ scale: 0.98 }}
              onClick={() => simulate(s)}
              disabled={simulating || !policy?.active}
              className="w-full h-14 rounded-xl bg-card shadow-card font-medium text-sm flex items-center gap-3 px-4 text-left disabled:opacity-50 transition-all hover:shadow-elevated"
            >
              <span className="text-primary">{s.icon}</span>
              <span className="flex-1">{s.label}</span>
              <Zap className="w-4 h-4 text-muted-foreground" />
            </motion.button>
          ))}
        </div>

        {/* Loading */}
        {simulating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl p-6 bg-card shadow-card flex flex-col items-center gap-3"
          >
            <div className="w-8 h-8 border-3 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">Checking weather data...</p>
          </motion.div>
        )}

        {/* Result */}
        <AnimatePresence>
          {result && !simulating && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="space-y-4"
            >
              <MetricCard
                label={result.trigger}
                value={result.value}
                threshold={result.threshold}
                unit={result.unit}
                icon={result.trigger === "Rainfall" ? <CloudRain className="w-5 h-5" /> : result.trigger === "Temperature" ? <Thermometer className="w-5 h-5" /> : <Wind className="w-5 h-5" />}
              />

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`rounded-xl p-5 shadow-card ${result.triggered ? "bg-success/10" : "bg-muted"}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {result.triggered ? (
                    <Check className="w-5 h-5 text-success" />
                  ) : (
                    <X className="w-5 h-5 text-muted-foreground" />
                  )}
                  <span className={`text-sm font-bold ${result.triggered ? "text-success" : "text-muted-foreground"}`}>
                    {result.triggered ? "Claim Approved!" : "No Claim Triggered"}
                  </span>
                </div>
                {result.triggered ? (
                  <p className="text-3xl font-bold tabular-nums text-success">₹{result.payout}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {result.trigger} of {result.value}{result.unit} did not reach the {result.threshold}{result.unit} threshold.
                  </p>
                )}
                {result.triggered && (
                  <p className="text-xs text-muted-foreground mt-2">Sent to your linked wallet</p>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Simulation;

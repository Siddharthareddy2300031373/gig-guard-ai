import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, TrendingUp, CloudRain, Thermometer, Wind, Check } from "lucide-react";
import { useAppStore, calculatePremium } from "@/lib/store";
import MetricCard from "@/components/MetricCard";
import { useEffect } from "react";

const PolicyPage = () => {
  const navigate = useNavigate();
  const { worker, risk, activatePolicy, policy } = useAppStore();

  useEffect(() => {
    if (!worker || !risk) navigate("/");
  }, [worker, risk, navigate]);

  if (!worker || !risk) return null;

  const { premium, coverage } = calculatePremium(worker.weeklyIncome, risk.score);

  const handleActivate = () => {
    activatePolicy(premium, coverage);
    navigate("/dashboard");
  };

  const riskColor = risk.level === "Low" ? "text-risk-low" : risk.level === "Medium" ? "text-risk-medium" : "text-risk-high";
  const riskBg = risk.level === "Low" ? "bg-success/10" : risk.level === "Medium" ? "bg-warning/10" : "bg-destructive/10";

  return (
    <div className="px-4 py-6 max-w-lg mx-auto pb-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
        <div>
          <h1 className="text-xl font-bold mb-1">Your Risk Assessment</h1>
          <p className="text-sm text-muted-foreground">AI-powered analysis for {worker.city}</p>
        </div>

        {/* Risk Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className={`rounded-xl p-5 shadow-card ${riskBg}`}
        >
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className={`w-5 h-5 ${riskColor}`} />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">AI Risk Score</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-4xl font-bold tabular-nums ${riskColor}`}>{risk.score}</span>
            <span className="text-sm text-muted-foreground">/ 100</span>
          </div>
          <p className={`mt-1 text-sm font-semibold ${riskColor}`}>{risk.level} Risk</p>
        </motion.div>

        {/* Weather Metrics */}
        <div className="grid gap-3">
          <MetricCard label="Rainfall" value={risk.rainfall} threshold={50} unit="mm" icon={<CloudRain className="w-5 h-5" />} />
          <MetricCard label="Temperature" value={risk.temperature} threshold={45} unit="°C" icon={<Thermometer className="w-5 h-5" />} />
          <MetricCard label="Air Quality" value={risk.aqi} threshold={400} unit="AQI" icon={<Wind className="w-5 h-5" />} />
        </div>

        {/* Premium Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl p-5 bg-card shadow-card"
        >
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Your Plan</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="text-sm text-muted-foreground">Weekly Premium</span>
              <span className="text-2xl font-bold tabular-nums">₹{premium}</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-sm text-muted-foreground">Max Coverage</span>
              <span className="text-2xl font-bold tabular-nums text-success">₹{coverage}</span>
            </div>
          </div>
        </motion.div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleActivate}
          disabled={policy?.active}
          className="w-full h-14 rounded-xl bg-primary text-primary-foreground font-semibold text-base flex items-center justify-center gap-2 shadow-button disabled:opacity-60 transition-all"
        >
          {policy?.active ? (
            <><Check className="w-5 h-5" /> Policy Active</>
          ) : (
            <><Shield className="w-5 h-5" /> Activate Policy</>
          )}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default PolicyPage;

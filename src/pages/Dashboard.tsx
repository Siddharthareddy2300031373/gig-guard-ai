import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Calendar, IndianRupee, Clock, Zap, FileText } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useEffect } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { worker, policy, risk, claims } = useAppStore();

  useEffect(() => {
    if (!worker) navigate("/");
  }, [worker, navigate]);

  if (!worker) return null;

  const totalPayouts = claims.reduce((sum, c) => sum + c.payout, 0);

  return (
    <div className="px-4 py-6 max-w-lg mx-auto pb-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
        <div>
          <h1 className="text-xl font-bold mb-1">Hello, {worker.name.split(" ")[0]}</h1>
          <p className="text-sm text-muted-foreground">{worker.platform} · {worker.city}</p>
        </div>

        {/* Policy Status */}
        {policy?.active ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-xl p-5 bg-primary/5 shadow-card"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2.5 h-2.5 rounded-full bg-success animate-pulse-slow" />
              <span className="text-sm font-semibold text-success">Policy Active</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Stat icon={<IndianRupee className="w-4 h-4" />} label="Premium" value={`₹${policy.premium}/wk`} />
              <Stat icon={<Shield className="w-4 h-4" />} label="Coverage" value={`₹${policy.coverage}`} />
              <Stat icon={<Calendar className="w-4 h-4" />} label="Expires" value={new Date(policy.expiresAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} />
              <Stat icon={<FileText className="w-4 h-4" />} label="Policy ID" value={policy.id} />
            </div>
          </motion.div>
        ) : (
          <div className="rounded-xl p-5 bg-muted shadow-card text-center">
            <p className="text-sm text-muted-foreground mb-3">No active policy</p>
            <button onClick={() => navigate("/policy")} className="text-sm font-semibold text-primary">
              Activate Now →
            </button>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl p-4 bg-card shadow-card">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Claims</p>
            <p className="text-2xl font-bold tabular-nums">{claims.length}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-xl p-4 bg-card shadow-card">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Payouts</p>
            <p className="text-2xl font-bold tabular-nums text-success">₹{totalPayouts}</p>
          </motion.div>
        </div>

        {/* Simulate CTA */}
        {policy?.active && (
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/simulate")}
            className="w-full h-14 rounded-xl bg-primary text-primary-foreground font-semibold text-base flex items-center justify-center gap-2 shadow-button"
          >
            <Zap className="w-5 h-5" /> Simulate Weather Event
          </motion.button>
        )}

        {/* Claims History */}
        {claims.length > 0 && (
          <div>
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">Claims History</h2>
            <div className="space-y-2">
              {claims.map((claim, i) => (
                <motion.div
                  key={claim.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-xl p-4 bg-card shadow-card flex justify-between items-center"
                >
                  <div>
                    <p className="text-sm font-semibold">{claim.trigger}</p>
                    <p className="text-xs text-muted-foreground">
                      {claim.value}{claim.unit} · {new Date(claim.timestamp).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold tabular-nums text-success">₹{claim.payout}</p>
                    <p className="text-xs text-success font-medium">{claim.status}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

const Stat = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-start gap-2">
    <span className="text-muted-foreground mt-0.5">{icon}</span>
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold tabular-nums">{value}</p>
    </div>
  </div>
);

export default Dashboard;

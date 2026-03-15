import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Phone, MapPin, Bike, IndianRupee, ArrowRight } from "lucide-react";
import { useAppStore, calculateRisk, calculatePremium } from "@/lib/store";

const platforms = ["Zomato", "Swiggy", "Dunzo", "Zepto", "Blinkit"];
const cities = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Kolkata", "Pune", "Jaipur"];

const Register = () => {
  const navigate = useNavigate();
  const { setWorker, setRisk } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", phone: "", platform: "", city: "", weeklyIncome: "",
  });

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));
  const valid = form.name && form.phone && form.platform && form.city && form.weeklyIncome;

  const handleSubmit = async () => {
    if (!valid) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    const income = parseInt(form.weeklyIncome);
    const worker = { ...form, weeklyIncome: income };
    const risk = calculateRisk(form.city, income);
    setWorker(worker);
    setRisk(risk);
    setLoading(false);
    navigate("/policy");
  };

  return (
    <div className="px-4 py-6 max-w-lg mx-auto pb-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold mb-1">Protect your earnings</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Register to get automatic weather protection for your delivery income.
        </p>

        <div className="space-y-4">
          <InputField icon={<User className="w-4 h-4" />} placeholder="Full Name" value={form.name} onChange={(v) => update("name", v)} />
          <InputField icon={<Phone className="w-4 h-4" />} placeholder="Phone Number" value={form.phone} onChange={(v) => update("phone", v)} type="tel" />

          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">Platform</label>
            <div className="flex flex-wrap gap-2">
              {platforms.map((p) => (
                <button
                  key={p}
                  onClick={() => update("platform", p)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    form.platform === p
                      ? "bg-primary text-primary-foreground shadow-button"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">City</label>
            <div className="flex flex-wrap gap-2">
              {cities.map((c) => (
                <button
                  key={c}
                  onClick={() => update("city", c)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    form.city === c
                      ? "bg-primary text-primary-foreground shadow-button"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <InputField icon={<IndianRupee className="w-4 h-4" />} placeholder="Weekly Income (₹)" value={form.weeklyIncome} onChange={(v) => update("weeklyIncome", v)} type="number" />
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={!valid || loading}
          className={`mt-8 w-full h-14 rounded-xl font-semibold text-base flex items-center justify-center gap-2 transition-all ${
            valid
              ? "bg-primary text-primary-foreground shadow-button"
              : "bg-muted text-muted-foreground"
          } disabled:opacity-60`}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
          ) : (
            <>Calculate Risk <ArrowRight className="w-4 h-4" /></>
          )}
        </motion.button>
      </motion.div>
    </div>
  );
};

const InputField = ({ icon, placeholder, value, onChange, type = "text" }: {
  icon: React.ReactNode; placeholder: string; value: string; onChange: (v: string) => void; type?: string;
}) => (
  <div className="relative">
    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</div>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-12 pl-10 pr-4 rounded-lg bg-card shadow-card text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
    />
  </div>
);

export default Register;

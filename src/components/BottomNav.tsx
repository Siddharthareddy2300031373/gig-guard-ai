import { Link, useLocation } from "react-router-dom";
import { Shield, Home, FileText, LayoutDashboard, Zap } from "lucide-react";
import { useAppStore } from "@/lib/store";

const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/policy", icon: FileText, label: "Policy" },
  { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/simulate", icon: Zap, label: "Simulate" },
];

const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card shadow-elevated border-t border-border">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {navItems.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg transition-colors ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[0.65rem] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export const SafetyHeader = () => {
  const { policy } = useAppStore();
  return (
    <header className="sticky top-0 z-50 bg-card shadow-card">
      <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-primary" />
          <span className="font-semibold text-sm tracking-tight">ShieldGig</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${policy?.active ? "bg-success animate-pulse-slow" : "bg-muted-foreground"}`} />
          <span className="text-xs font-medium text-muted-foreground">
            {policy?.active ? "Protected" : "No Policy"}
          </span>
        </div>
      </div>
    </header>
  );
};

export default BottomNav;

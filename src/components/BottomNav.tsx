import { NavLink } from "react-router-dom";
import { Home, History, User, Sparkles, Droplet, Activity } from "lucide-react";

const BottomNav = () => {
  const navItems = [
    { path: "/dashboard", icon: Home, label: "Dashboard" },
    { path: "/activity", icon: Activity, label: "Aktivitas" },
    { path: "/history", icon: History, label: "History" },
    { path: "/kalori-water", icon: Droplet, label: "Kalori" },
    { path: "/ai", icon: Sparkles, label: "AI" },
    { path: "/account", icon: User, label: "Account" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;

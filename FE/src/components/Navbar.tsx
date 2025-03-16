import { useLocation, Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { Code, Database, LucideIcon, Settings } from "lucide-react";
import { motion } from "framer-motion";

interface NavItem {
  path: string;
  label: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  {
    path: "/dashboard",
    label: "Contests",
    icon: Code,
  },
  {
    path: "/admin",
    label: "Admin",
    icon: Settings,
  },
];

const Navbar = () => {
  const location = useLocation();

  return (
    <motion.header
      className="sticky top-0 z-10 glass-card bg-opacity-70 dark:bg-opacity-70 backdrop-blur-lg"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <motion.div
              className="flex-shrink-0 flex items-center"
              whileHover={{ scale: 1.05 }}
            >
              <Link to="/" className="flex items-center">
                <Database className="h-6 w-6 text-primary mr-2" />
                <span className="font-semibold text-lg">Contesto</span>
              </Link>
            </motion.div>

            <nav className="ml-10 hidden md:flex space-x-4">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? "text-white bg-primary"
                        : "text-foreground hover:bg-secondary/50"
                    }`}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-border/50">
        <div className="flex justify-around">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center py-3 px-4 ${
                  isActive
                    ? "text-primary"
                    : "text-foreground/70 hover:text-foreground"
                }`}
              >
                <item.icon
                  className={`h-5 w-5 ${isActive ? "text-primary" : ""}`}
                />
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;

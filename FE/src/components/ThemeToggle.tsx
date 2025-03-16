import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={toggleTheme}
      className="p-2 rounded-full bg-background border border-border transition-colors duration-300 hover:bg-secondary"
      aria-label="Toggle theme"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {theme === "light" ? (
        <Sun className="h-5 w-5 text-amber-500" />
      ) : (
        <Moon className="h-5 w-5 text-blue-400" />
      )}
    </motion.button>
  );
};

export default ThemeToggle;

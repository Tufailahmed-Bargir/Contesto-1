import { motion } from "framer-motion";

import Dashboard from "./Test";

export default function DashboardComponent() {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        className="mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-2">Coding Contest Tracker</h1>
        <p className="text-lg text-foreground/70">
          Track upcoming and past coding contests from popular platforms
        </p>
      </motion.div>

      <Dashboard />
    </div>
  );
}

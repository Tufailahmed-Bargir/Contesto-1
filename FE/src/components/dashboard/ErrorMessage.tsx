import { motion } from "framer-motion";

interface ErrorMessageProps {
  error: string | null;
  onRetry: () => void;
}

const ErrorMessage = ({ error, onRetry }: ErrorMessageProps) => {
  if (!error) return null;

  return (
    <motion.div
      className="p-4 mb-6 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 rounded-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <p>{error}</p>
      <button
        onClick={onRetry}
        className="mt-2 px-3 py-1 bg-red-200 dark:bg-red-800 rounded-full text-sm"
      >
        Try Again
      </button>
    </motion.div>
  );
};

export default ErrorMessage;

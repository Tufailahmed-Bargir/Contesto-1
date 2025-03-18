import { RefreshCw } from "lucide-react";

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <RefreshCw className="animate-spin text-blue-500 w-10 h-10" />
      <h2 className="mt-4 text-xl font-semibold">Loading contests...</h2>
      <p className="text-gray-600">
        We're fetching the latest contest information from all platforms.
      </p>
    </div>
  );
};

export default Loader;

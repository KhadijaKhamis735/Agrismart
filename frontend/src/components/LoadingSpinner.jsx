export default function LoadingSpinner({ label = "Loading..." }) {
  return (
    <div className="flex items-center justify-center gap-3 py-4 text-green-700 dark:text-green-300">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-gray-700 dark:border-gray-600 dark:border-t-gray-300" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}


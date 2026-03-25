const resultStyles = {
  High: "bg-green-100 text-green-800 border-green-300",
  Medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
  Low: "bg-red-100 text-red-800 border-red-300",
};

export default function ResultBadge({ result }) {
  if (!result) return null;
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold ${
        resultStyles[result] || "bg-green-100 text-green-700 border-green-300"
      }`}
    >
      {result}
    </span>
  );
}

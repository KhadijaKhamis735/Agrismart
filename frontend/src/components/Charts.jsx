import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = {
  High: "#16a34a",
  Medium: "#eab308",
  Low: "#dc2626",
};

export function PieResultChart({ data, title = "Result Distribution" }) {
  return (
    <div className="app-card h-72 w-full rounded-xl p-3">
      <h3 className="mb-2 text-sm font-semibold text-green-700 dark:text-green-300">{title}</h3>
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={90} label>
            {data.map((entry) => (
              <Cell key={entry.name} fill={COLORS[entry.name]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TrendLineChart({ data, title = "Prediction Trend" }) {
  return (
    <div className="app-card h-72 w-full rounded-xl p-3">
      <h3 className="mb-2 text-sm font-semibold text-green-700 dark:text-green-300">{title}</h3>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="High" stroke={COLORS.High} strokeWidth={2} />
          <Line type="monotone" dataKey="Medium" stroke={COLORS.Medium} strokeWidth={2} />
          <Line type="monotone" dataKey="Low" stroke={COLORS.Low} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SoilBarChart({ data, title = "Results by Soil Type" }) {
  return (
    <div className="app-card h-72 w-full rounded-xl p-3">
      <h3 className="mb-2 text-sm font-semibold text-green-700 dark:text-green-300">{title}</h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="soil_type" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="High" fill={COLORS.High} />
          <Bar dataKey="Medium" fill={COLORS.Medium} />
          <Bar dataKey="Low" fill={COLORS.Low} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

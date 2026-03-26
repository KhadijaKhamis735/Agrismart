import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Label,
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
  Total: "#15803d",
};

export function PieResultChart({ data, title = "Result Distribution" }) {
  return (
    <div className="app-card h-64 w-full rounded-xl p-3 sm:h-72">
      <h3 className="mb-2 text-sm font-semibold text-green-700 dark:text-green-300">{title}</h3>
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={80} label>
            {data.map((entry) => (
              <Cell key={entry.name} fill={COLORS[entry.resultKey] || COLORS.Low} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TrendLineChart({
  data,
  title = "Prediction Trend",
  xLabel = "Date",
  yLabel = "Predictions",
}) {
  return (
    <div className="app-card h-64 w-full rounded-xl p-3 sm:h-80">
      <h3 className="mb-2 text-sm font-semibold text-green-700 dark:text-green-300">{title}</h3>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data} margin={{ top: 8, right: 16, left: 4, bottom: 28 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} minTickGap={22}>
            <Label value={xLabel} position="insideBottom" offset={-18} />
          </XAxis>
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }}>
            <Label value={yLabel} angle={-90} position="insideLeft" style={{ textAnchor: "middle" }} />
          </YAxis>
          <Tooltip />
          <Line type="monotone" dataKey="total" stroke={COLORS.Total} strokeWidth={3} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SoilBarChart({
  data,
  title = "Results by Soil Type",
  soilTickFormatter,
  resultLabelFormatter,
}) {
  return (
    <div className="app-card h-72 w-full rounded-xl p-3 sm:h-80">
      <h3 className="mb-2 text-sm font-semibold text-green-700 dark:text-green-300">{title}</h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 12 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="soil_type" tick={{ fontSize: 12 }} tickFormatter={soilTickFormatter} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(value, name) => [value, resultLabelFormatter ? resultLabelFormatter(name) : name]}
            labelFormatter={(value) => (soilTickFormatter ? soilTickFormatter(value) : value)}
          />
          <Legend formatter={(value) => (resultLabelFormatter ? resultLabelFormatter(value) : value)} />
          <Bar dataKey="High" fill={COLORS.High} />
          <Bar dataKey="Medium" fill={COLORS.Medium} />
          <Bar dataKey="Low" fill={COLORS.Low} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

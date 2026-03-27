import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  LabelList,
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

export const COLORS = {
  High: "#16a34a",
  Medium: "#eab308",
  Low: "#dc2626",
  Total: "#15803d",
};

export const YIELD_RANGES = {
  High: "> 5.67 t/ac",
  Medium: "3.34 - 5.67 t/ac",
  Low: "< 3.34 t/ac",
};

const RESULT_LEGEND = [
  { name: "High", color: COLORS.High, range: YIELD_RANGES.High },
  { name: "Medium", color: COLORS.Medium, range: YIELD_RANGES.Medium },
  { name: "Low", color: COLORS.Low, range: YIELD_RANGES.Low },
];

const renderCustomLabel = (entry) => {
  const total = entry.payload.reduce((sum, item) => sum + item.value, 0);
  const percent = total > 0 ? ((entry.value / total) * 100).toFixed(1) : 0;
  return `${percent}%`;
};

export function PieResultChart({ data, title = "Result Distribution" }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="app-card h-72 w-full rounded-xl p-3 sm:h-80">
      <h3 className="mb-2 text-sm font-semibold text-green-700 dark:text-green-300">{title}</h3>
      <div className="flex h-[90%] flex-col gap-3 sm:flex-row">
        <ResponsiveContainer width="60%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={90}
              label={(entry) => `${((entry.value / total) * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={COLORS[entry.resultKey] || COLORS.Low} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value} (${((value / total) * 100).toFixed(1)}%)`} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-col justify-center gap-2 text-sm">
          {data.map((item) => (
            <div key={item.name} className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: COLORS[item.resultKey] || COLORS.Low }}
                />
                <span className="text-gray-700 dark:text-gray-300">
                  {item.name}: {item.value} ({((item.value / total) * 100).toFixed(1)}%)
                </span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-5">
                {YIELD_RANGES[item.resultKey]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function TrendLineChart({
  data,
  title = "Prediction Trend",
  xLabel = "Date",
  yLabel = "Predictions",
}) {
  const hasData = data && data.length > 1;

  if (!hasData) {
    return (
      <div className="app-card h-64 w-full rounded-xl p-3 sm:h-80">
        <h3 className="mb-2 text-sm font-semibold text-green-700 dark:text-green-300">{title}</h3>
        <div className="flex h-[90%] items-center justify-center">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Not enough data to display trend. Make multiple predictions over time.
          </p>
        </div>
      </div>
    );
  }

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
  xLabel,
  yLabel,
}) {
  const hasData = data && data.length > 0;

  if (!hasData) {
    return (
      <div className="app-card h-72 w-full rounded-xl p-3 sm:h-80">
        <h3 className="mb-2 text-sm font-semibold text-green-700 dark:text-green-300">{title}</h3>
        <div className="flex h-[90%] items-center justify-center">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            No soil type data available yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-card rounded-xl p-3 sm:p-4">
      <div className="mb-4">
        <h3 className="mb-2 text-sm font-semibold text-green-700 dark:text-green-300">{title}</h3>
        {/* Consistent Legend with Yield Ranges */}
        <div className="flex flex-wrap gap-4">
          {RESULT_LEGEND.map((item) => (
            <div key={item.name} className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  {resultLabelFormatter ? resultLabelFormatter(item.name) : item.name}
                </span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-5">{item.range}</span>
            </div>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="soil_type" 
            tick={{ fontSize: 12 }} 
            tickFormatter={soilTickFormatter}
            angle={-45}
            textAnchor="end"
            height={80}
          >
            {xLabel ? <Label value={xLabel} position="bottom" offset={8} /> : null}
          </XAxis>
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }}>
            {yLabel ? <Label value={yLabel} angle={-90} position="insideLeft" style={{ textAnchor: "middle" }} /> : null}
          </YAxis>
          <Tooltip
            formatter={(value, name) => [value, resultLabelFormatter ? resultLabelFormatter(name) : name]}
            labelFormatter={(value) => (soilTickFormatter ? soilTickFormatter(value) : value)}
            contentStyle={{
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "4px",
              padding: "8px",
            }}
          />
          <Bar dataKey="High" fill={COLORS.High} />
          <Bar dataKey="Medium" fill={COLORS.Medium} />
          <Bar dataKey="Low" fill={COLORS.Low} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MixedTrendChart({
  data,
  title = "Prediction Trend",
  xLabel = "Date",
  yLabel = "Predictions",
  totalLabel = "Total",
}) {
  const hasData = data && data.length > 0;

  if (!hasData) {
    return (
      <div className="app-card h-72 w-full rounded-xl p-3 sm:h-80">
        <h3 className="mb-2 text-sm font-semibold text-green-700 dark:text-green-300">{title}</h3>
        <div className="flex h-[90%] items-center justify-center">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            No trend data available yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-card h-72 w-full rounded-xl p-3 sm:h-80">
      <h3 className="mb-2 text-sm font-semibold text-green-700 dark:text-green-300">{title}</h3>
      <ResponsiveContainer width="100%" height="90%">
        <ComposedChart data={data} margin={{ top: 8, right: 16, left: 4, bottom: 28 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} minTickGap={22}>
            <Label value={xLabel} position="insideBottom" offset={-18} />
          </XAxis>
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }}>
            <Label value={yLabel} angle={-90} position="insideLeft" style={{ textAnchor: "middle" }} />
          </YAxis>
          <Tooltip />
          <Legend />
          <Bar dataKey="High" stackId="results" fill={COLORS.High} />
          <Bar dataKey="Medium" stackId="results" fill={COLORS.Medium} />
          <Bar dataKey="Low" stackId="results" fill={COLORS.Low} />
          <Line type="monotone" dataKey="total" name={totalLabel} stroke={COLORS.Total} strokeWidth={3} dot={{ r: 2 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export function InputImpactBarChart({
  data,
  title = "Impact of Inputs",
  xLabel = "Input",
  yLabel = "Impact Score (%)",
  countLabel = "Sample Size",
  impactLegendLabel = "High Yield Share",
  countLegendLabel = "Predictions",
}) {
  const hasData = data && data.length > 0;

  if (!hasData) {
    return (
      <div className="app-card h-72 w-full rounded-xl p-3 sm:h-80">
        <h3 className="mb-2 text-sm font-semibold text-green-700 dark:text-green-300">{title}</h3>
        <div className="flex h-[90%] items-center justify-center">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            No input impact data available yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-card h-72 w-full rounded-xl p-3 sm:h-80">
      <h3 className="mb-2 text-sm font-semibold text-green-700 dark:text-green-300">{title}</h3>
      <ResponsiveContainer width="100%" height="90%">
        <ComposedChart data={data} margin={{ top: 10, right: 16, left: 4, bottom: 28 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }}>
            <Label value={xLabel} position="insideBottom" offset={-18} />
          </XAxis>
          <YAxis yAxisId="left" domain={[0, 100]} tick={{ fontSize: 12 }}>
            <Label value={yLabel} angle={-90} position="insideLeft" style={{ textAnchor: "middle" }} />
          </YAxis>
          <YAxis yAxisId="right" orientation="right" allowDecimals={false} tick={{ fontSize: 12 }}>
            <Label value={countLabel} angle={90} position="insideRight" style={{ textAnchor: "middle" }} />
          </YAxis>
          <Tooltip
            formatter={(value, name) => {
              if (name === "impact") return [`${Number(value).toFixed(1)}%`, impactLegendLabel];
              if (name === "sampleCount") return [Number(value), countLegendLabel];
              return [value, name];
            }}
            labelFormatter={(value) => `${xLabel}: ${value}`}
          />
          <Legend
            formatter={(value) => {
              if (value === "impact") return impactLegendLabel;
              if (value === "sampleCount") return countLegendLabel;
              return value;
            }}
          />
          <Bar yAxisId="left" dataKey="impact" fill={COLORS.Total} radius={[8, 8, 0, 0]}>
            <LabelList dataKey="impact" position="top" formatter={(value) => `${Number(value).toFixed(0)}%`} />
          </Bar>
          <Line yAxisId="right" type="monotone" dataKey="sampleCount" stroke={COLORS.Medium} strokeWidth={3} dot={{ r: 3 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

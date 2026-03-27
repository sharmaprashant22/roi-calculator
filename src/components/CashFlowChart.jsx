import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Legend,
  ResponsiveContainer,
} from 'recharts';

function formatTick(value) {
  if (Math.abs(value) >= 1000) {
    return '$' + (value / 1000).toFixed(0) + 'k';
  }
  return '$' + value;
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <div className="chart-tooltip-month">Month {label}</div>
        {payload.map((entry) => {
          const positive = entry.value >= 0;
          return (
            <div key={entry.name} className="chart-tooltip-row">
              <span className="chart-tooltip-name" style={{ color: entry.color }}>
                {entry.name}
              </span>
              <span className={`chart-tooltip-value ${positive ? 'positive' : 'negative'}`}>
                {positive ? '' : '-'}${Math.abs(entry.value).toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </span>
            </div>
          );
        })}
      </div>
    );
  }
  return null;
}

export default function CashFlowChart({ series }) {
  const maxPeriod = Math.max(...series.map((s) => s.data.length));

  const mergedData = Array.from({ length: maxPeriod }, (_, i) => {
    const point = { month: i + 1 };
    series.forEach((s) => {
      if (s.data[i] !== undefined) point[s.name] = s.data[i].value;
    });
    return point;
  });

  return (
    <div className="card">
      <div className="chart-title">Cumulative Cash Flow</div>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={mergedData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="month"
            label={{ value: 'Month', position: 'insideBottom', offset: -2, fontSize: 12, fill: '#666' }}
            tick={{ fontSize: 11, fill: '#666' }}
            height={36}
          />
          <YAxis tickFormatter={formatTick} tick={{ fontSize: 11, fill: '#666' }} width={60} />
          <Tooltip content={<CustomTooltip />} />
          {series.length > 1 && (
            <Legend
              wrapperStyle={{ fontSize: '0.8rem', paddingTop: '0.5rem' }}
              formatter={(value, entry) => (
                <span style={{ color: entry.color }}>{value}</span>
              )}
            />
          )}
          <ReferenceLine
            y={0}
            stroke="#999"
            strokeDasharray="4 4"
            label={{ value: 'Break-even', fontSize: 11, fill: '#999' }}
          />
          {series.map((s) => (
            <Line
              key={s.name}
              type="monotone"
              dataKey={s.name}
              stroke={s.color}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: s.color }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

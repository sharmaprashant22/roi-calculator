import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
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
    const val = payload[0].value;
    const positive = val >= 0;
    return (
      <div className="chart-tooltip">
        <div className="chart-tooltip-month">Month {label}</div>
        <div className={`chart-tooltip-value ${positive ? 'positive' : 'negative'}`}>
          {positive ? '' : '-'}${Math.abs(val).toLocaleString('en-US', { maximumFractionDigits: 0 })}
        </div>
      </div>
    );
  }
  return null;
}

export default function CashFlowChart({ data }) {
  return (
    <div className="card">
      <div className="chart-title">Cumulative Cash Flow</div>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="month"
            label={{ value: 'Month', position: 'insideBottom', offset: -2, fontSize: 12, fill: '#666' }}
            tick={{ fontSize: 11, fill: '#666' }}
            height={36}
          />
          <YAxis tickFormatter={formatTick} tick={{ fontSize: 11, fill: '#666' }} width={60} />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={0} stroke="#999" strokeDasharray="4 4" label={{ value: 'Break-even', fontSize: 11, fill: '#999' }} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#3399ff"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, fill: '#3399ff' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

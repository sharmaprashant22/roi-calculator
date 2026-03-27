function fmt(n) {
  return '$' + Math.abs(n).toLocaleString('en-US', { maximumFractionDigits: 0 });
}

export default function Results({ result, label, color = '#3399ff' }) {
  const { roi, paybackPeriod, totalNetProfit, monthlyNetProfit } = result;

  return (
    <div className="card">
      <div className="results-title" style={{ color }}>{label || 'ROI Summary'}</div>
      <div className="metrics-grid">
        <div className="metric" style={{ borderLeftColor: color }}>
          <div className="metric-label">ROI</div>
          <div className={`metric-value ${roi >= 0 ? 'positive' : 'negative'}`}>
            {roi >= 0 ? '+' : '-'}{Math.abs(roi).toFixed(1)}%
          </div>
        </div>

        <div className="metric" style={{ borderLeftColor: color }}>
          <div className="metric-label">Payback Period</div>
          <div className="metric-value">
            {paybackPeriod === 'Never' ? 'Never' : `${paybackPeriod} mo`}
          </div>
        </div>

        <div className="metric" style={{ borderLeftColor: color }}>
          <div className="metric-label">Total Net Profit</div>
          <div className={`metric-value ${totalNetProfit >= 0 ? 'positive' : 'negative'}`}>
            {totalNetProfit >= 0 ? '' : '-'}{fmt(totalNetProfit)}
          </div>
        </div>

        <div className="metric" style={{ borderLeftColor: color }}>
          <div className="metric-label">Monthly Net Profit</div>
          <div className={`metric-value ${monthlyNetProfit >= 0 ? 'positive' : 'negative'}`}>
            {monthlyNetProfit >= 0 ? '' : '-'}{fmt(monthlyNetProfit)}
          </div>
        </div>
      </div>
    </div>
  );
}

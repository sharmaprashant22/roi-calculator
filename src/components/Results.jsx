function fmt(n) {
  return '$' + Math.abs(n).toLocaleString('en-US', { maximumFractionDigits: 0 });
}

export default function Results({ result }) {
  const { roi, paybackPeriod, totalNetProfit, monthlyNetProfit } = result;
  const roiPositive = roi >= 0;
  const profitPositive = totalNetProfit >= 0;
  const monthlyPositive = monthlyNetProfit >= 0;

  return (
    <div className="card">
      <div className="results-title">ROI Summary</div>
      <div className="metrics-grid">
        <div className="metric">
          <div className="metric-label">ROI</div>
          <div className={`metric-value ${roiPositive ? 'positive' : 'negative'}`}>
            {roiPositive ? '+' : '-'}{Math.abs(roi).toFixed(1)}%
          </div>
        </div>

        <div className="metric">
          <div className="metric-label">Payback Period</div>
          <div className="metric-value">
            {paybackPeriod === 'Never' ? 'Never' : `${paybackPeriod} mo`}
          </div>
        </div>

        <div className="metric">
          <div className="metric-label">Total Net Profit</div>
          <div className={`metric-value ${profitPositive ? 'positive' : 'negative'}`}>
            {profitPositive ? '' : '-'}{fmt(totalNetProfit)}
          </div>
        </div>

        <div className="metric">
          <div className="metric-label">Monthly Net Profit</div>
          <div className={`metric-value ${monthlyPositive ? 'positive' : 'negative'}`}>
            {monthlyPositive ? '' : '-'}{fmt(monthlyNetProfit)}
          </div>
        </div>
      </div>
    </div>
  );
}

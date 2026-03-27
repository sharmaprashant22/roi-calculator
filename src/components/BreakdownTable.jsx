function fmt(n) {
  return '$' + Math.abs(n).toLocaleString('en-US', { maximumFractionDigits: 0 });
}

function fmtSigned(n) {
  return (n >= 0 ? '' : '-') + fmt(n);
}

export default function BreakdownTable({ result, values, label, color = '#3399ff' }) {
  const { cashFlow, paybackPeriod } = result;
  const { monthlyRevenue, monthlyCosts, initialInvestment } = values;
  const netProfit = monthlyRevenue - monthlyCosts;

  return (
    <div className="card">
      {label && <div className="table-title" style={{ color }}>{label}</div>}
      <div className="table-wrapper">
        <table className="breakdown-table">
          <thead>
            <tr>
              <th>Month</th>
              <th>Revenue</th>
              <th>Costs</th>
              <th>Net Profit</th>
              <th>Cumulative Cash Flow</th>
              <th>ROI %</th>
            </tr>
          </thead>
          <tbody>
            {cashFlow.map(({ month, value }) => {
              const roi = (value / initialInvestment) * 100;
              const isBreakEven = paybackPeriod !== 'Never' && month === paybackPeriod;
              return (
                <tr key={month} className={isBreakEven ? 'break-even-row' : ''}>
                  <td className="month-cell">
                    {month}
                    {isBreakEven && <span className="break-even-badge">Break-even</span>}
                  </td>
                  <td>{fmt(monthlyRevenue)}</td>
                  <td>{fmt(monthlyCosts)}</td>
                  <td className={netProfit >= 0 ? 'positive' : 'negative'}>{fmtSigned(netProfit)}</td>
                  <td className={value >= 0 ? 'positive' : 'negative'}>{fmtSigned(value)}</td>
                  <td className={roi >= 0 ? 'positive' : 'negative'}>
                    {(roi >= 0 ? '+' : '') + roi.toFixed(1)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

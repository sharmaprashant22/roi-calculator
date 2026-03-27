export function calculateROI({ initialInvestment, monthlyRevenue, monthlyCosts, period }) {
  const monthlyNetProfit = monthlyRevenue - monthlyCosts;

  const cashFlow = Array.from({ length: period }, (_, i) => ({
    month: i + 1,
    value: monthlyNetProfit * (i + 1) - initialInvestment,
  }));

  const paybackPeriod =
    monthlyNetProfit <= 0
      ? 'Never'
      : Math.ceil(initialInvestment / monthlyNetProfit);

  const totalNetProfit = monthlyNetProfit * period - initialInvestment;
  const roi = (totalNetProfit / initialInvestment) * 100;

  return { monthlyNetProfit, cashFlow, paybackPeriod, totalNetProfit, roi };
}

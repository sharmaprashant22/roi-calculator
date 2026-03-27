import { useState } from 'react';
import InputForm from './components/InputForm';
import Results from './components/Results';
import CashFlowChart from './components/CashFlowChart';
import { calculateROI } from './utils/calculations';
import './App.css';

const DEFAULT_VALUES = {
  initialInvestment: 100000,
  monthlyRevenue: 15000,
  monthlyCosts: 5000,
  period: 12,
};

export default function App() {
  const [values, setValues] = useState(DEFAULT_VALUES);
  const result = calculateROI(values);

  return (
    <div className="app">
      <header className="app-header">
        <span className="epam-badge">EPAM</span>
        <h1>ROI Calculator</h1>
      </header>

      <main className="app-content">
        <InputForm values={values} onChange={setValues} />

        <div className="results-panel">
          <Results result={result} />
          <CashFlowChart data={result.cashFlow} />
        </div>
      </main>
    </div>
  );
}

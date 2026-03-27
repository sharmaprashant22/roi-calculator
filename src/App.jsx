import { useState } from 'react';
import InputForm from './components/InputForm';
import Results from './components/Results';
import CashFlowChart from './components/CashFlowChart';
import BreakdownTable from './components/BreakdownTable';
import { calculateROI } from './utils/calculations';
import './App.css';

const SCENARIO_1_DEFAULTS = {
  initialInvestment: 100000,
  monthlyRevenue: 15000,
  monthlyCosts: 5000,
  period: 12,
};

const SCENARIO_2_DEFAULTS = {
  initialInvestment: 150000,
  monthlyRevenue: 18000,
  monthlyCosts: 8000,
  period: 12,
};

function isValid(vals) {
  return vals.initialInvestment > 0 && vals.monthlyRevenue > 0 && vals.monthlyCosts > 0;
}

export default function App() {
  const [values, setValues] = useState(SCENARIO_1_DEFAULTS);
  const [values2, setValues2] = useState(SCENARIO_2_DEFAULTS);
  const [compareMode, setCompareMode] = useState(false);
  const [showTable, setShowTable] = useState(false);

  const result = calculateROI(values);
  const result2 = calculateROI(values2);

  const resultsDisabled = !isValid(values) || (compareMode && !isValid(values2));

  const chartSeries = compareMode
    ? [
        { name: 'Scenario 1', data: result.cashFlow, color: '#3399ff' },
        { name: 'Scenario 2', data: result2.cashFlow, color: '#ff6b35' },
      ]
    : [{ name: 'Scenario 1', data: result.cashFlow, color: '#3399ff' }];

  return (
    <div className="app">
      <header className="app-header">
        <span className="epam-badge">EPAM</span>
        <h1>ROI Calculator</h1>
      </header>

      <main className="app-content">
        <div className="forms-wrapper">
          <InputForm
            values={values}
            onChange={setValues}
            label={compareMode ? 'Scenario 1' : 'Project Inputs'}
            color="#3399ff"
          />
          {compareMode ? (
            <InputForm
              values={values2}
              onChange={setValues2}
              label="Scenario 2"
              color="#ff6b35"
              onRemove={() => setCompareMode(false)}
            />
          ) : (
            <button className="add-scenario-btn" onClick={() => setCompareMode(true)}>
              + Add Scenario
            </button>
          )}
        </div>

        <div className={`results-panel ${resultsDisabled ? 'results-disabled' : ''}`}>
          {compareMode ? (
            <div className="results-row">
              <Results result={result} label="Scenario 1" color="#3399ff" />
              <Results result={result2} label="Scenario 2" color="#ff6b35" />
            </div>
          ) : (
            <Results result={result} />
          )}
          <CashFlowChart series={chartSeries} />

          <button className="table-toggle-btn" onClick={() => setShowTable((v) => !v)}>
            {showTable ? 'Hide Table' : 'Show Monthly Breakdown'}
          </button>

          {showTable && (
            compareMode ? (
              <div className="tables-row">
                <BreakdownTable result={result} values={values} label="Scenario 1" color="#3399ff" />
                <BreakdownTable result={result2} values={values2} label="Scenario 2" color="#ff6b35" />
              </div>
            ) : (
              <BreakdownTable result={result} values={values} />
            )
          )}
        </div>
      </main>
    </div>
  );
}

import { useState } from 'react';

const NUMERIC_FIELDS = ['initialInvestment', 'monthlyRevenue', 'monthlyCosts'];

function getError(name, value) {
  if (!NUMERIC_FIELDS.includes(name)) return null;
  if (isNaN(value) || value <= 0) return 'Must be a positive number';
  return null;
}

export default function InputForm({ values, onChange, label = 'Project Inputs', color = '#3399ff', onRemove }) {
  const [touched, setTouched] = useState({});

  function handle(e) {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    onChange({ ...values, [name]: Number(value) });
  }

  function field(name, labelText, id) {
    const error = touched[name] ? getError(name, values[name]) : null;
    return (
      <div className={`form-group ${error ? 'has-error' : ''}`}>
        <label htmlFor={id}>{labelText}</label>
        <input
          id={id}
          name={name}
          type="number"
          min="0"
          value={values[name]}
          onChange={handle}
        />
        {error && <div className="field-error">{error}</div>}
      </div>
    );
  }

  return (
    <div className="form-panel" style={{ '--accent': color }}>
      <div className="form-header">
        <div className="form-title">{label}</div>
        {onRemove && (
          <button className="remove-scenario-btn" onClick={onRemove} title="Remove scenario">
            ×
          </button>
        )}
      </div>

      {field('initialInvestment', 'Initial Investment ($)', `initialInvestment-${label}`)}
      {field('monthlyRevenue', 'Expected Monthly Revenue ($)', `monthlyRevenue-${label}`)}
      {field('monthlyCosts', 'Monthly Operating Costs ($)', `monthlyCosts-${label}`)}

      <div className="form-group">
        <label htmlFor={`period-${label}`}>Calculation Period (months)</label>
        <select
          id={`period-${label}`}
          name="period"
          value={values.period}
          onChange={handle}
        >
          <option value={12}>12 months</option>
          <option value={24}>24 months</option>
          <option value={36}>36 months</option>
        </select>
      </div>
    </div>
  );
}

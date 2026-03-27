import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';

function fmtUSD(n) {
  return '$' + Math.abs(n).toLocaleString('en-US', { maximumFractionDigits: 0 });
}

function fmtSigned(n) {
  return (n >= 0 ? '' : '-') + fmtUSD(n);
}

function sectionTitle(doc, text, y, margin) {
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(51, 153, 255);
  doc.text(text.toUpperCase(), margin, y);
  return y + 5;
}

function divider(doc, y, margin, pageW) {
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageW - margin, y);
  return y + 6;
}

function inputRows(values) {
  return [
    ['Initial Investment', fmtUSD(values.initialInvestment)],
    ['Monthly Revenue', fmtUSD(values.monthlyRevenue)],
    ['Monthly Costs', fmtUSD(values.monthlyCosts)],
    ['Calculation Period', `${values.period} months`],
  ];
}

function metricRows(result) {
  const { roi, paybackPeriod, totalNetProfit, monthlyNetProfit } = result;
  return [
    ['ROI', (roi >= 0 ? '+' : '') + roi.toFixed(1) + '%'],
    ['Payback Period', paybackPeriod === 'Never' ? 'Never' : `${paybackPeriod} months`],
    ['Total Net Profit', fmtSigned(totalNetProfit)],
    ['Monthly Net Profit', fmtSigned(monthlyNetProfit)],
  ];
}

function writeKeyValueBlock(doc, rows, x, y, labelW) {
  rows.forEach(([key, val]) => {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(120);
    doc.text(key + ':', x, y);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(26, 26, 46);
    doc.text(val, x + labelW, y);
    y += 5;
  });
  return y;
}

function tableBody(result, values) {
  const net = values.monthlyRevenue - values.monthlyCosts;
  return result.cashFlow.map(({ month, value }) => {
    const roi = (value / values.initialInvestment) * 100;
    return [
      month,
      fmtUSD(values.monthlyRevenue),
      fmtUSD(values.monthlyCosts),
      fmtSigned(net),
      fmtSigned(value),
      (roi >= 0 ? '+' : '') + roi.toFixed(1) + '%',
    ];
  });
}

function addBreakdownTable(doc, result, values, startY, margin, headColor) {
  const breakEvenIdx = result.paybackPeriod !== 'Never' ? result.paybackPeriod - 1 : -1;
  autoTable(doc, {
    startY,
    head: [['Month', 'Revenue', 'Costs', 'Net Profit', 'Cum. Cash Flow', 'ROI %']],
    body: tableBody(result, values),
    margin: { left: margin, right: margin },
    styles: { fontSize: 8, cellPadding: 2, halign: 'right' },
    columnStyles: { 0: { halign: 'center' } },
    headStyles: { fillColor: headColor, textColor: [255, 255, 255], fontSize: 7, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 249, 252] },
    didParseCell(data) {
      if (data.section === 'body' && data.row.index === breakEvenIdx) {
        data.cell.styles.fillColor = [220, 252, 231];
        data.cell.styles.fontStyle = 'bold';
      }
    },
  });
  return doc.lastAutoTable.finalY;
}

export async function exportToPdf({ values, values2, result, result2, compareMode, chartRef }) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentW = pageW - margin * 2;
  let y = margin;

  // ── Header ──────────────────────────────────────────
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(26, 26, 46);
  doc.text('ROI Analysis Report', margin, y);

  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100);
  doc.text(dateStr, pageW - margin, y, { align: 'right' });

  y += 4;
  doc.setDrawColor(51, 153, 255);
  doc.setLineWidth(0.8);
  doc.line(margin, y, pageW - margin, y);
  y += 8;

  // ── Input Parameters ────────────────────────────────
  y = sectionTitle(doc, 'Input Parameters', y, margin);

  if (compareMode) {
    const colW = contentW / 2;
    const col2X = margin + colW;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(51, 153, 255);
    doc.text('Scenario 1', margin, y);
    doc.setTextColor(255, 107, 53);
    doc.text('Scenario 2', col2X, y);
    y += 5;

    const rows1 = inputRows(values);
    const rows2 = inputRows(values2);
    const labelW = colW * 0.6;

    rows1.forEach(([key, val], i) => {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(120);
      doc.text(key + ':', margin, y);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(26, 26, 46);
      doc.text(val, margin + labelW, y);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(120);
      doc.text(rows2[i][0] + ':', col2X, y);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(26, 26, 46);
      doc.text(rows2[i][1], col2X + labelW, y);
      y += 5;
    });
  } else {
    y = writeKeyValueBlock(doc, inputRows(values), margin, y, 55);
  }

  y += 2;
  y = divider(doc, y, margin, pageW);

  // ── ROI Summary ─────────────────────────────────────
  y = sectionTitle(doc, 'ROI Summary', y, margin);

  if (compareMode) {
    const colW = contentW / 2;
    const col2X = margin + colW;
    const labelW = colW * 0.58;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(51, 153, 255);
    doc.text('Scenario 1', margin, y);
    doc.setTextColor(255, 107, 53);
    doc.text('Scenario 2', col2X, y);
    y += 5;

    const m1 = metricRows(result);
    const m2 = metricRows(result2);

    m1.forEach(([key, val], i) => {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(120);
      doc.text(key + ':', margin, y);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(26, 26, 46);
      doc.text(val, margin + labelW, y);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(120);
      doc.text(m2[i][0] + ':', col2X, y);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(26, 26, 46);
      doc.text(m2[i][1], col2X + labelW, y);
      y += 5;
    });
  } else {
    y = writeKeyValueBlock(doc, metricRows(result), margin, y, 55);
  }

  y += 2;
  y = divider(doc, y, margin, pageW);

  // ── Chart ────────────────────────────────────────────
  y = sectionTitle(doc, 'Cash Flow Chart', y, margin);

  if (chartRef?.current) {
    const canvas = await html2canvas(chartRef.current, {
      scale: 2,
      backgroundColor: '#ffffff',
      logging: false,
    });
    const chartImg = canvas.toDataURL('image/png');
    const chartH = (canvas.height / canvas.width) * contentW;

    if (y + chartH > pageH - margin) {
      doc.addPage();
      y = margin;
    }

    doc.addImage(chartImg, 'PNG', margin, y, contentW, chartH);
    y += chartH + 4;
  }

  y = divider(doc, y, margin, pageW);

  // ── Monthly Breakdown ────────────────────────────────
  y = sectionTitle(
    doc,
    compareMode ? 'Scenario 1 — Monthly Breakdown' : 'Monthly Breakdown',
    y,
    margin
  );
  y = addBreakdownTable(doc, result, values, y, margin, [26, 26, 46]) + 2;

  if (compareMode) {
    if (y > pageH - 40) { doc.addPage(); y = margin; }
    y = sectionTitle(doc, 'Scenario 2 — Monthly Breakdown', y + 4, margin);
    addBreakdownTable(doc, result2, values2, y, margin, [255, 107, 53]);
  }

  // ── Save ─────────────────────────────────────────────
  const fileName = `ROI-Analysis-${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(fileName);
}

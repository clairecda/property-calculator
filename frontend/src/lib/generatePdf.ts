import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { PropertyCosts, ForecastRow, ScenarioResult, InputState, CostOfLivingResult } from '@/types';
import { formatDollar, formatPercent } from './formatters';

interface ReportData {
  costs: PropertyCosts;
  forecast: ForecastRow[];
  scenarios: ScenarioResult[];
  inputs: InputState;
  costOfLiving?: CostOfLivingResult;
}

type Color3 = [number, number, number];
const SKY: Color3 = [2, 132, 199];    // #0284c7 sky-600
const GRAY: Color3 = [100, 116, 139];  // #64748b slate-500
const DARK: Color3 = [15, 23, 42];     // #0f172a slate-900
const LIGHT_SKY: Color3 = [224, 242, 254]; // #e0f2fe sky-100
const WHITE: Color3 = [255, 255, 255];
const AMBER: Color3 = [180, 130, 50];

function getFinalY(doc: jsPDF): number {
  return (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;
}

export function generatePdf(data: ReportData): jsPDF {
  const { costs, forecast, scenarios, inputs } = data;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 18;
  let y = 20;

  // ========== PAGE 1: Summary ==========

  // --- Header ---
  doc.setFontSize(22);
  doc.setTextColor(...SKY);
  doc.text('Property Purchase Report', margin, y);
  y += 8;

  doc.setFontSize(10);
  doc.setTextColor(...GRAY);
  doc.text(`Generated ${new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}`, margin, y);
  y += 4;

  doc.setDrawColor(...SKY);
  doc.setLineWidth(0.8);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  // --- Property Overview ---
  doc.setFontSize(14);
  doc.setTextColor(...DARK);
  doc.text('Property Overview', margin, y);
  y += 8;

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    theme: 'plain',
    styles: { fontSize: 10, cellPadding: 3 },
    columnStyles: {
      0: { textColor: GRAY, fontStyle: 'normal' },
      1: { textColor: DARK, fontStyle: 'bold', halign: 'right' },
    },
    body: [
      ['Property', costs.propertyName],
      ['State', costs.state],
      ['Purchase Price', formatDollar(costs.purchasePrice)],
      ['Total Deposit', formatDollar(costs.totalDeposit)],
      ['Loan Amount', formatDollar(costs.totalLoan)],
      ['LVR', formatPercent(costs.lvr)],
      ['Interest Rate', `${costs.interestRate}%`],
      ['Loan Term', `${costs.loanTerm} years`],
    ],
  });

  y = getFinalY(doc) + 10;

  // --- Key Numbers ---
  doc.setFontSize(14);
  doc.setTextColor(...DARK);
  doc.text('Key Numbers', margin, y);
  y += 8;

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    theme: 'grid',
    headStyles: { fillColor: SKY, textColor: WHITE, fontStyle: 'bold', fontSize: 10 },
    styles: { fontSize: 10, cellPadding: 4 },
    head: [['', 'Amount']],
    body: [
      ['Cash needed on day one', formatDollar(costs.upfrontCashNeeded)],
      ['Monthly repayments', formatDollar(costs.totalMonthly)],
      ['Annual costs', formatDollar(costs.annualCosts)],
      ['First home grant', formatDollar(costs.firstHomeGrant)],
      ['Stamp duty (after concessions)', formatDollar(costs.stampDutyAfter)],
    ],
  });

  y = getFinalY(doc) + 10;

  // --- Monthly Breakdown ---
  doc.setFontSize(14);
  doc.setTextColor(...DARK);
  doc.text('Monthly Costs Breakdown', margin, y);
  y += 8;

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    theme: 'striped',
    headStyles: { fillColor: SKY, textColor: WHITE, fontStyle: 'bold' },
    styles: { fontSize: 10, cellPadding: 3 },
    head: [['Item', 'Monthly']],
    body: [
      ['Mortgage (P&I)', formatDollar(costs.monthlyMortgage)],
      ['Council & water rates', formatDollar(costs.monthlyRates)],
      ['Strata', formatDollar(costs.monthlyStrata)],
      ['Insurance', formatDollar(costs.monthlyInsurance)],
      ['Maintenance (est.)', formatDollar(costs.monthlyMaintenance)],
    ],
    foot: [['Total', formatDollar(costs.totalMonthly)]],
    footStyles: { fillColor: LIGHT_SKY, textColor: SKY, fontStyle: 'bold' },
  });

  // ========== PAGE 2: Forecast + Scenarios ==========
  doc.addPage();
  y = 20;

  doc.setFontSize(14);
  doc.setTextColor(...DARK);
  doc.text('10-Year Forecast', margin, y);
  y += 8;

  const row10 = forecast[10];
  const paidOffIdx = forecast.findIndex((r) => r.year > 0 && r.loanBalance <= 100);
  const paidOffLabel = paidOffIdx > 0 ? `Year ${forecast[paidOffIdx].year}` : 'After 30 years';

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    theme: 'grid',
    headStyles: { fillColor: SKY, textColor: WHITE, fontStyle: 'bold' },
    styles: { fontSize: 10, cellPadding: 4 },
    head: [['Milestone', 'Value']],
    body: [
      ['Property value after 10 years', formatDollar(row10?.propertyValue ?? 0)],
      ['Your equity after 10 years', formatDollar(row10?.equity ?? 0)],
      ['Loan fully paid off', paidOffLabel],
    ],
  });

  y = getFinalY(doc) + 10;

  // --- Year-by-Year ---
  doc.setFontSize(14);
  doc.setTextColor(...DARK);
  doc.text('Year-by-Year Snapshot', margin, y);
  y += 8;

  const keyYears = [1, 5, 10, 15, 20, 25, 30];
  const forecastRows = forecast
    .filter((r) => keyYears.includes(r.year))
    .map((r) => [
      `Year ${r.year}`,
      formatDollar(r.propertyValue),
      formatDollar(r.loanBalance),
      formatDollar(r.equity),
    ]);

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    theme: 'striped',
    headStyles: { fillColor: SKY, textColor: WHITE, fontStyle: 'bold' },
    styles: { fontSize: 9, cellPadding: 3 },
    head: [['Year', 'Property Value', 'Loan Balance', 'Your Equity']],
    body: forecastRows,
  });

  y = getFinalY(doc) + 12;

  // --- Scenarios ---
  doc.setFontSize(14);
  doc.setTextColor(...DARK);
  doc.text('What-If Scenarios', margin, y);
  y += 3;
  doc.setFontSize(9);
  doc.setTextColor(...GRAY);
  doc.text('How your numbers change if the house costs more or rates rise.', margin, y);
  y += 7;

  const current = scenarios.find((s) => s.name === 'Current');
  const scenarioRows = scenarios.map((s) => {
    const monthlyDiff = current ? s.totalMonthly - current.totalMonthly : 0;
    const diffLabel = s.name === 'Current' ? '(baseline)' : `${monthlyDiff >= 0 ? '+' : ''}${formatDollar(monthlyDiff)}/mo`;
    return [
      s.name,
      formatDollar(s.totalMonthly),
      formatDollar(s.upfrontCash),
      diffLabel,
    ];
  });

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    theme: 'striped',
    headStyles: { fillColor: SKY, textColor: WHITE, fontStyle: 'bold' },
    styles: { fontSize: 9, cellPadding: 3 },
    head: [['Scenario', 'Monthly', 'Day-One Cash', 'vs. Current']],
    body: scenarioRows,
  });

  // ========== PAGE 3: Cost of Living ==========
  if (data.costOfLiving) {
    const col = data.costOfLiving;
    doc.addPage();
    y = 20;

    doc.setFontSize(18);
    doc.setTextColor(...SKY);
    doc.text('The Real Cost of Living Here', margin, y);
    y += 8;

    doc.setFontSize(9);
    doc.setTextColor(...GRAY);
    doc.text('Property costs are just the start. Here\'s what it actually costs when you add transport and everyday life.', margin, y);
    y += 4;

    doc.setDrawColor(...SKY);
    doc.setLineWidth(0.8);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    // --- The Big Picture ---
    const monthlyIncome = inputs.yourAnnualIncome / 12 + (inputs.hasPartner ? inputs.partnerAnnualIncome / 12 : 0);
    const housingPct = monthlyIncome > 0 ? (costs.totalMonthly / monthlyIncome) * 100 : 0;
    const totalPct = monthlyIncome > 0 ? (col.totalMonthlyAllIn / monthlyIncome) * 100 : 0;
    const leftover = monthlyIncome - col.totalMonthlyAllIn;
    const annualDays = Math.round(col.annualCommuteHours / 24);
    const tenYearDays = Math.round(col.tenYearCommuteHours / 24);

    doc.setFontSize(14);
    doc.setTextColor(...DARK);
    doc.text('The Big Picture', margin, y);
    y += 8;

    const GREEN: Color3 = [22, 163, 74];
    const RED: Color3 = [220, 38, 38];

    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      theme: 'plain',
      styles: { fontSize: 11, cellPadding: 5 },
      columnStyles: {
        0: { textColor: GRAY, fontStyle: 'normal' },
        1: { textColor: DARK, fontStyle: 'bold', halign: 'right' },
      },
      body: [
        ['Total monthly cost (property + transport + living)', formatDollar(col.totalMonthlyAllIn)],
        ['Total annual cost', formatDollar(col.annualAllIn)],
        ['Over 10 years', formatDollar(col.tenYearAllIn)],
        ...(monthlyIncome > 0 ? [
          ['Left over each month after all costs', formatDollar(leftover)],
        ] : []),
      ],
    });

    y = getFinalY(doc) + 10;

    // --- Income & Affordability ---
    if (monthlyIncome > 0) {
      doc.setFontSize(14);
      doc.setTextColor(...DARK);
      doc.text('Income & Affordability', margin, y);
      y += 3;
      doc.setFontSize(9);
      doc.setTextColor(...GRAY);
      const incomeLabel = inputs.hasPartner
        ? `Based on combined take-home pay of ${formatDollar(inputs.yourAnnualIncome + inputs.partnerAnnualIncome)}/yr (${formatDollar(monthlyIncome)}/mo)`
        : `Based on take-home pay of ${formatDollar(inputs.yourAnnualIncome)}/yr (${formatDollar(monthlyIncome)}/mo)`;
      doc.text(incomeLabel, margin, y);
      y += 7;

      const transportPct = monthlyIncome > 0 ? (col.monthlyTransportCost / monthlyIncome) * 100 : 0;
      const livingPct = monthlyIncome > 0 ? (col.monthlyLivingExpenses / monthlyIncome) * 100 : 0;

      autoTable(doc, {
        startY: y,
        margin: { left: margin, right: margin },
        theme: 'grid',
        headStyles: { fillColor: SKY, textColor: WHITE, fontStyle: 'bold', fontSize: 10 },
        styles: { fontSize: 10, cellPadding: 4 },
        head: [['Category', 'Monthly', '% of income']],
        body: [
          ['Housing costs', formatDollar(costs.totalMonthly), `${housingPct.toFixed(0)}%`],
          ['Transport', formatDollar(col.monthlyTransportCost), `${transportPct.toFixed(0)}%`],
          ['Living expenses', formatDollar(col.monthlyLivingExpenses), `${livingPct.toFixed(0)}%`],
        ],
        foot: [['All-in total', formatDollar(col.totalMonthlyAllIn), `${totalPct.toFixed(0)}%`]],
        footStyles: { fillColor: LIGHT_SKY, textColor: SKY, fontStyle: 'bold' },
      });

      y = getFinalY(doc) + 4;

      // Affordability verdict
      doc.setFontSize(9);
      if (housingPct > 40) {
        doc.setTextColor(...RED);
        doc.text(`Housing alone is ${housingPct.toFixed(0)}% of your income — well above the 30% guideline.`, margin, y);
      } else if (housingPct > 30) {
        doc.setTextColor(...AMBER);
        doc.text(`Housing is ${housingPct.toFixed(0)}% of your income — above the 30% guideline but still manageable.`, margin, y);
      } else {
        doc.setTextColor(...GREEN);
        doc.text(`Housing is ${housingPct.toFixed(0)}% of your income — within the 30% guideline.`, margin, y);
      }
      y += 4;
      doc.setTextColor(leftover >= 0 ? GREEN[0] : RED[0], leftover >= 0 ? GREEN[1] : RED[1], leftover >= 0 ? GREEN[2] : RED[2]);
      doc.text(`After all costs you have ${formatDollar(Math.abs(leftover))}/mo ${leftover >= 0 ? 'left over' : 'short'}.`, margin, y);
      y += 10;
    }

    // --- Time Cost ---
    doc.setFontSize(14);
    doc.setTextColor(...DARK);
    doc.text('The Time Cost', margin, y);
    y += 3;
    doc.setFontSize(9);
    doc.setTextColor(...GRAY);
    doc.text(`${inputs.commuteDistanceKm} km each way, ${inputs.commuteDaysPerWeek} days a week`, margin, y);
    y += 7;

    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      theme: 'plain',
      styles: { fontSize: 10, cellPadding: 4 },
      columnStyles: {
        0: { textColor: GRAY, fontStyle: 'normal' },
        1: { textColor: DARK, fontStyle: 'bold', halign: 'right' },
      },
      body: [
        ['Weekly commute (return trips)', `${col.weeklyCommuteHours.toFixed(1)} hrs`],
        ['Annual commute', `${Math.round(col.annualCommuteHours)} hrs — that\'s ${annualDays} full days`],
        ['Over 10 years', `${Math.round(col.tenYearCommuteHours).toLocaleString()} hrs — ${tenYearDays} full days`],
      ],
    });

    y = getFinalY(doc) + 4;
    doc.setFontSize(9);
    doc.setTextColor(...AMBER);
    if (annualDays > 20) {
      doc.text(`You\'d spend more time commuting each year (${annualDays} days) than most people get in annual leave.`, margin, y);
    } else {
      doc.text(`That\'s ${annualDays} full 24-hour days per year on the road.`, margin, y);
    }
    y += 10;

    // --- Cost Breakdown ---
    doc.setFontSize(14);
    doc.setTextColor(...DARK);
    doc.text('Monthly Cost Breakdown', margin, y);
    y += 8;

    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      theme: 'grid',
      headStyles: { fillColor: SKY, textColor: WHITE, fontStyle: 'bold', fontSize: 10 },
      styles: { fontSize: 10, cellPadding: 4 },
      head: [['Category', 'Monthly', 'Annual']],
      body: [
        ['Property costs', formatDollar(costs.totalMonthly), formatDollar(costs.annualCosts)],
        ['Transport', formatDollar(col.monthlyTransportCost), formatDollar(col.annualTransportCost)],
        ['Living expenses', formatDollar(col.monthlyLivingExpenses), formatDollar(col.monthlyLivingExpenses * 12)],
      ],
      foot: [['Total', formatDollar(col.totalMonthlyAllIn), formatDollar(col.annualAllIn)]],
      footStyles: { fillColor: LIGHT_SKY, textColor: SKY, fontStyle: 'bold' },
    });

    y = getFinalY(doc) + 10;

    // Check if we need a new page for the detailed breakdowns
    if (y > 180) {
      doc.addPage();
      y = 20;
    }

    // --- Transport Details ---
    const transportMode = inputs.transportMode === 'drive' ? 'Driving' :
      inputs.transportMode === 'transit' ? 'Public transport' : 'Mix (drive + transit)';

    doc.setFontSize(12);
    doc.setTextColor(...DARK);
    doc.text('Transport Details', margin, y);
    y += 6;

    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      theme: 'striped',
      headStyles: { fillColor: SKY, textColor: WHITE, fontStyle: 'bold' },
      styles: { fontSize: 9, cellPadding: 3 },
      head: [['Detail', 'Value']],
      body: [
        ['Transport mode', transportMode],
        ['One-way distance', `${inputs.commuteDistanceKm} km`],
        ['One-way travel time', `${inputs.commuteDurationMinutes} min`],
        ['Days per week', `${inputs.commuteDaysPerWeek}`],
        ['Monthly transport cost', formatDollar(col.monthlyTransportCost)],
        ['Annual transport cost', formatDollar(col.annualTransportCost)],
      ],
    });

    y = getFinalY(doc) + 8;

    // --- Living Expenses ---
    doc.setFontSize(12);
    doc.setTextColor(...DARK);
    doc.text('Living Expenses', margin, y);
    y += 6;

    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      theme: 'striped',
      headStyles: { fillColor: SKY, textColor: WHITE, fontStyle: 'bold' },
      styles: { fontSize: 9, cellPadding: 3 },
      head: [['Expense', 'Monthly']],
      body: [
        ['Groceries', formatDollar(inputs.monthlyGroceries)],
        ['Dining out & takeaway', formatDollar(inputs.monthlyDiningOut)],
        ['Utilities', formatDollar(inputs.monthlyUtilities)],
        ['Internet', formatDollar(inputs.monthlyInternet)],
        ['Subscriptions', formatDollar(inputs.monthlySubscriptions)],
        ['Health insurance', formatDollar(inputs.monthlyHealthInsurance)],
        ['Other', formatDollar(inputs.monthlyOtherExpenses)],
      ],
      foot: [['Total', formatDollar(col.monthlyLivingExpenses)]],
      footStyles: { fillColor: LIGHT_SKY, textColor: SKY, fontStyle: 'bold' },
    });
  }

  // ========== PAGE 4: Annex — All Inputs & Assumptions ==========
  doc.addPage();
  y = 20;

  doc.setFontSize(18);
  doc.setTextColor(...SKY);
  doc.text('Annex: All Inputs & Assumptions', margin, y);
  y += 5;
  doc.setFontSize(9);
  doc.setTextColor(...AMBER);
  doc.text('Every number in this report is based on the inputs below. Review and adjust them to match your situation.', margin, y);
  y += 8;

  doc.setDrawColor(...SKY);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  // Property inputs
  doc.setFontSize(12);
  doc.setTextColor(...DARK);
  doc.text('Property & Location', margin, y);
  y += 6;

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    theme: 'striped',
    headStyles: { fillColor: SKY, textColor: WHITE, fontStyle: 'bold' },
    styles: { fontSize: 9, cellPadding: 3 },
    head: [['Input', 'Value', 'What this means']],
    body: [
      ['State', inputs.state, 'Determines which grants and stamp duty rules apply'],
      ['First home buyer', inputs.isFirstHome ? 'Yes' : 'No', 'Unlocks government grants and stamp duty concessions'],
      ['Property name', inputs.propertyName, 'Your label for this property'],
      ['Purchase price', formatDollar(inputs.purchasePrice), 'The agreed contract price'],
      ['Stamp duty (before concessions)', formatDollar(inputs.stampDuty), 'Government tax on the purchase — check your state calculator'],
      ['LMI', formatDollar(inputs.lmi), 'Lenders Mortgage Insurance — usually required if deposit < 20%'],
    ],
  });

  y = getFinalY(doc) + 8;

  // Deposit inputs
  doc.setFontSize(12);
  doc.setTextColor(...DARK);
  doc.text('Deposits', margin, y);
  y += 6;

  const depositRows: string[][] = [
    ['Your deposit', formatDollar(inputs.yourDeposit), 'Cash you are putting toward the purchase'],
  ];
  if (inputs.hasPartner) {
    depositRows.push(['Partner deposit', formatDollar(inputs.partnerDeposit), "Your partner's contribution"]);
  }
  depositRows.push(['Total deposit', formatDollar(inputs.yourDeposit + (inputs.hasPartner ? inputs.partnerDeposit : 0)), 'Combined cash toward the property']);

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    theme: 'striped',
    headStyles: { fillColor: SKY, textColor: WHITE, fontStyle: 'bold' },
    styles: { fontSize: 9, cellPadding: 3 },
    head: [['Input', 'Value', 'What this means']],
    body: depositRows,
  });

  y = getFinalY(doc) + 8;

  // Loan inputs
  doc.setFontSize(12);
  doc.setTextColor(...DARK);
  doc.text('Loan Settings', margin, y);
  y += 6;

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    theme: 'striped',
    headStyles: { fillColor: SKY, textColor: WHITE, fontStyle: 'bold' },
    styles: { fontSize: 9, cellPadding: 3 },
    head: [['Input', 'Value', 'What this means']],
    body: [
      ['Interest rate', `${inputs.interestRate}% p.a.`, 'Annual rate your lender charges — most variable rates are ~6-7%'],
      ['Loan term', `${inputs.loanTerm} years`, 'How long to repay — 30 years is standard in Australia'],
    ],
  });

  y = getFinalY(doc) + 8;

  // Ongoing costs
  doc.setFontSize(12);
  doc.setTextColor(...DARK);
  doc.text('Ongoing Costs (Annual)', margin, y);
  y += 6;

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    theme: 'striped',
    headStyles: { fillColor: SKY, textColor: WHITE, fontStyle: 'bold' },
    styles: { fontSize: 9, cellPadding: 3 },
    head: [['Input', 'Value', 'What this means']],
    body: [
      ['Council rates', `${formatDollar(inputs.councilRates)}/yr`, 'Local government rates — varies by council area'],
      ['Water rates', `${formatDollar(inputs.waterRates)}/yr`, 'Water supply and usage charges'],
      ['Strata fees', `${formatDollar(inputs.strataFees)}/yr`, 'Body corporate fees for apartments/townhouses'],
      ['Insurance', `${formatDollar(inputs.insurance)}/yr`, 'Building and contents insurance'],
      ['Maintenance', `${inputs.maintenancePercent}% of value/yr`, 'Rule-of-thumb allowance for repairs and upkeep'],
    ],
  });

  // Check if we need a new page
  y = getFinalY(doc) + 8;
  if (y > 220) {
    doc.addPage();
    y = 20;
  }

  // Upfront costs
  doc.setFontSize(12);
  doc.setTextColor(...DARK);
  doc.text('One-Off Upfront Costs', margin, y);
  y += 6;

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    theme: 'striped',
    headStyles: { fillColor: SKY, textColor: WHITE, fontStyle: 'bold' },
    styles: { fontSize: 9, cellPadding: 3 },
    head: [['Input', 'Value', 'What this means']],
    body: [
      ['Legal / conveyancing', formatDollar(inputs.legalFees), 'Solicitor or conveyancer fees for settlement'],
      ['Building inspection', formatDollar(inputs.inspection), 'Building and pest inspection before purchase'],
      ['Loan application fee', formatDollar(inputs.loanApplication), 'Bank fee to process your loan'],
      ['Valuation', formatDollar(inputs.valuation), 'Bank-ordered property valuation'],
      ['Mortgage registration', formatDollar(inputs.mortgageReg), 'Government fee to register the mortgage'],
      ['Title fees', formatDollar(inputs.titleFees), 'Title search and transfer fees'],
      ['Moving costs', formatDollar(inputs.moving), 'Removalist and relocation expenses'],
      ['Initial repairs', formatDollar(inputs.repairs), 'Post-settlement fix-ups and improvements'],
    ],
    foot: [['Total upfront fees', formatDollar(
      inputs.legalFees + inputs.inspection + inputs.loanApplication + inputs.valuation +
      inputs.mortgageReg + inputs.titleFees + inputs.moving + inputs.repairs
    ), '']],
    footStyles: { fillColor: LIGHT_SKY, textColor: SKY, fontStyle: 'bold' },
  });

  y = getFinalY(doc) + 8;

  // Forecast assumptions
  doc.setFontSize(12);
  doc.setTextColor(...DARK);
  doc.text('Forecast Assumptions', margin, y);
  y += 6;

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    theme: 'striped',
    headStyles: { fillColor: SKY, textColor: WHITE, fontStyle: 'bold' },
    styles: { fontSize: 9, cellPadding: 3 },
    head: [['Input', 'Value', 'What this means']],
    body: [
      ['Property growth rate', `${inputs.propertyGrowthRate}% p.a.`, 'Assumed annual increase in property value (long-term AU avg ~5%)'],
      ['Rate increase from year 2', `+${inputs.rateIncreaseYear2}%`, 'Buffer for potential interest rate rises after year 1'],
    ],
  });

  y = getFinalY(doc) + 12;

  // Important note on annex
  doc.setFontSize(9);
  doc.setTextColor(...AMBER);
  const note = 'Important: These inputs are estimates and assumptions — not guarantees. ' +
    'Actual costs vary by lender, council, insurer, and market conditions. ' +
    'Use the calculator to adjust these numbers and see how they affect your results.';
  const noteLines = doc.splitTextToSize(note, pageWidth - margin * 2);
  doc.text(noteLines, margin, y);

  y += noteLines.length * 4 + 10;

  // --- Footer / Disclaimer ---
  doc.setFontSize(8);
  doc.setTextColor(...GRAY);
  const disclaimer = 'This report is for educational and planning purposes only. It is not financial advice. ' +
    'All figures are estimates based on the inputs provided. Actual costs, rates, and property values will vary. ' +
    'Always consult a qualified financial adviser before making property purchase decisions.';
  const disclaimerLines = doc.splitTextToSize(disclaimer, pageWidth - margin * 2);
  doc.text(disclaimerLines, margin, y);

  y += disclaimerLines.length * 4 + 8;
  doc.setFontSize(9);
  doc.setTextColor(...SKY);
  doc.text('Property Purchase Calculator', margin, y);
  doc.setTextColor(...GRAY);
  doc.text('Conceived and built by Claire Boulange', margin, y + 4);

  return doc;
}

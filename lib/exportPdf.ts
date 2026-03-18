import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Expense, Bill, BudgetCategory, UserProfile } from '@/lib/types';

export interface ExportOptions {
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  categories: string[]; // empty = all
  includeExpenses: boolean;
  includeBills: boolean;
  includeBudgetSummary: boolean;
  includeBreakdowns: boolean;
}

function formatCurrency(amount: number, currency: string): string {
  return `${currency}${amount.toFixed(2)}`;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function getWeekNumber(dateStr: string): number {
  const date = new Date(dateStr);
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  return Math.ceil((date.getDate() + firstDay.getDay()) / 7);
}

function generateExpenseRows(expenses: Expense[], currency: string): string {
  if (expenses.length === 0) return '<tr><td colspan="5" style="text-align:center;padding:20px;color:#7A6A52;">No expenses found</td></tr>';
  return expenses.map((e, i) => `
    <tr style="background-color:${i % 2 === 0 ? '#FDF6E8' : '#FFFFFF'}">
      <td style="padding:8px 12px;border-bottom:1px solid #E8D5B5;">${formatDate(e.date)}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #E8D5B5;">${e.category}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #E8D5B5;">${e.note}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #E8D5B5;text-align:right;font-family:monospace;">${formatCurrency(e.amount, currency)}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #E8D5B5;">${e.recurring ? '🔄' : ''}</td>
    </tr>
  `).join('');
}

function generateBillRows(bills: Bill[], currency: string): string {
  if (bills.length === 0) return '<tr><td colspan="5" style="text-align:center;padding:20px;color:#7A6A52;">No bills found</td></tr>';
  return bills.map((b, i) => `
    <tr style="background-color:${i % 2 === 0 ? '#FDF6E8' : '#FFFFFF'}">
      <td style="padding:8px 12px;border-bottom:1px solid #E8D5B5;">${b.name}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #E8D5B5;text-align:right;font-family:monospace;">${formatCurrency(b.amount, currency)}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #E8D5B5;">${formatDate(b.dueDate)}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #E8D5B5;">${b.recurrence}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #E8D5B5;">
        <span style="display:inline-block;padding:2px 8px;border-radius:4px;font-size:11px;background-color:${b.paid ? '#A8D5BA30' : '#E8A0BF30'};color:${b.paid ? '#2C7A4B' : '#C74F8C'};border:1px solid ${b.paid ? '#A8D5BA' : '#E8A0BF'}">
          ${b.paid ? '✓ Paid' : 'Unpaid'}
        </span>
      </td>
    </tr>
  `).join('');
}

function generateCategoryBreakdown(categories: BudgetCategory[], currency: string): string {
  if (categories.length === 0) return '<p style="color:#7A6A52;text-align:center;">No categories</p>';
  const totalBudget = categories.reduce((s, c) => s + c.limit, 0);
  const totalSpent = categories.reduce((s, c) => s + c.spent, 0);

  return `
    <table width="100%" style="border-collapse:collapse;margin-bottom:16px;">
      <thead>
        <tr style="background-color:#E8A87C;color:#FFFFFF;">
          <th style="padding:10px 12px;text-align:left;">Category</th>
          <th style="padding:10px 12px;text-align:right;">Budget</th>
          <th style="padding:10px 12px;text-align:right;">Spent</th>
          <th style="padding:10px 12px;text-align:right;">Remaining</th>
          <th style="padding:10px 12px;text-align:right;">Usage</th>
        </tr>
      </thead>
      <tbody>
        ${categories.map((c, i) => {
          const pct = c.limit > 0 ? (c.spent / c.limit) * 100 : 0;
          const remaining = c.limit - c.spent;
          const barColor = pct >= 90 ? '#E8A0BF' : pct >= 70 ? '#E8A87C' : '#A8D5BA';
          return `
            <tr style="background-color:${i % 2 === 0 ? '#FDF6E8' : '#FFFFFF'}">
              <td style="padding:8px 12px;border-bottom:1px solid #E8D5B5;font-weight:500;">${c.name}</td>
              <td style="padding:8px 12px;border-bottom:1px solid #E8D5B5;text-align:right;font-family:monospace;">${formatCurrency(c.limit, currency)}</td>
              <td style="padding:8px 12px;border-bottom:1px solid #E8D5B5;text-align:right;font-family:monospace;">${formatCurrency(c.spent, currency)}</td>
              <td style="padding:8px 12px;border-bottom:1px solid #E8D5B5;text-align:right;font-family:monospace;color:${remaining >= 0 ? '#2C7A4B' : '#C74F8C'}">${formatCurrency(Math.abs(remaining), currency)}${remaining < 0 ? ' over' : ''}</td>
              <td style="padding:8px 12px;border-bottom:1px solid #E8D5B5;text-align:right;">
                <div style="display:inline-block;width:60px;height:10px;border-radius:4px;background-color:#F5EFE0;border:1px solid #D4C9B0;overflow:hidden;">
                  <div style="width:${Math.min(100, pct)}%;height:100%;background-color:${barColor};border-radius:3px;"></div>
                </div>
                <span style="font-family:monospace;font-size:11px;margin-left:4px;">${pct.toFixed(0)}%</span>
              </td>
            </tr>
          `;
        }).join('')}
      </tbody>
      <tfoot>
        <tr style="background-color:#F5EFE0;font-weight:bold;">
          <td style="padding:10px 12px;border-top:2px solid #2C2416;">Total</td>
          <td style="padding:10px 12px;border-top:2px solid #2C2416;text-align:right;font-family:monospace;">${formatCurrency(totalBudget, currency)}</td>
          <td style="padding:10px 12px;border-top:2px solid #2C2416;text-align:right;font-family:monospace;">${formatCurrency(totalSpent, currency)}</td>
          <td style="padding:10px 12px;border-top:2px solid #2C2416;text-align:right;font-family:monospace;color:${totalBudget - totalSpent >= 0 ? '#2C7A4B' : '#C74F8C'}">${formatCurrency(Math.abs(totalBudget - totalSpent), currency)}</td>
          <td style="padding:10px 12px;border-top:2px solid #2C2416;text-align:right;font-family:monospace;">${(totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0).toFixed(0)}%</td>
        </tr>
      </tfoot>
    </table>
  `;
}

function generateWeeklyBreakdown(expenses: Expense[], currency: string): string {
  // Group expenses by week number of month
  const weekMap: Record<string, { total: number; count: number; categories: Record<string, number> }> = {};
  
  expenses.forEach(e => {
    const date = new Date(e.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const weekNum = getWeekNumber(e.date);
    const key = `${monthKey} W${weekNum}`;
    if (!weekMap[key]) weekMap[key] = { total: 0, count: 0, categories: {} };
    weekMap[key].total += e.amount;
    weekMap[key].count++;
    weekMap[key].categories[e.category] = (weekMap[key].categories[e.category] || 0) + e.amount;
  });

  const sortedWeeks = Object.entries(weekMap).sort(([a], [b]) => a.localeCompare(b));
  if (sortedWeeks.length === 0) return '<p style="color:#7A6A52;text-align:center;">No data for weekly breakdown</p>';

  return `
    <table width="100%" style="border-collapse:collapse;">
      <thead>
        <tr style="background-color:#C9B8E8;color:#FFFFFF;">
          <th style="padding:10px 12px;text-align:left;">Week</th>
          <th style="padding:10px 12px;text-align:right;">Total</th>
          <th style="padding:10px 12px;text-align:right;">Transactions</th>
          <th style="padding:10px 12px;text-align:left;">Top Category</th>
        </tr>
      </thead>
      <tbody>
        ${sortedWeeks.map(([week, data], i) => {
          const topCat = Object.entries(data.categories).sort(([, a], [, b]) => b - a)[0];
          return `
            <tr style="background-color:${i % 2 === 0 ? '#FDF6E8' : '#FFFFFF'}">
              <td style="padding:8px 12px;border-bottom:1px solid #E8D5B5;">${week}</td>
              <td style="padding:8px 12px;border-bottom:1px solid #E8D5B5;text-align:right;font-family:monospace;">${formatCurrency(data.total, currency)}</td>
              <td style="padding:8px 12px;border-bottom:1px solid #E8D5B5;text-align:right;">${data.count}</td>
              <td style="padding:8px 12px;border-bottom:1px solid #E8D5B5;">${topCat ? `${topCat[0]} (${formatCurrency(topCat[1], currency)})` : '-'}</td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
  `;
}

function generateMonthlyBreakdown(expenses: Expense[], currency: string): string {
  const monthMap: Record<string, { total: number; count: number; categories: Record<string, number> }> = {};
  
  expenses.forEach(e => {
    const date = new Date(e.date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!monthMap[key]) monthMap[key] = { total: 0, count: 0, categories: {} };
    monthMap[key].total += e.amount;
    monthMap[key].count++;
    monthMap[key].categories[e.category] = (monthMap[key].categories[e.category] || 0) + e.amount;
  });

  const sortedMonths = Object.entries(monthMap).sort(([a], [b]) => a.localeCompare(b));
  if (sortedMonths.length === 0) return '<p style="color:#7A6A52;text-align:center;">No data for monthly breakdown</p>';

  const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return `
    <table width="100%" style="border-collapse:collapse;">
      <thead>
        <tr style="background-color:#A8D5BA;color:#FFFFFF;">
          <th style="padding:10px 12px;text-align:left;">Month</th>
          <th style="padding:10px 12px;text-align:right;">Total Spent</th>
          <th style="padding:10px 12px;text-align:right;">Transactions</th>
          <th style="padding:10px 12px;text-align:left;">Top Category</th>
        </tr>
      </thead>
      <tbody>
        ${sortedMonths.map(([month, data], i) => {
          const [year, m] = month.split('-');
          const topCat = Object.entries(data.categories).sort(([, a], [, b]) => b - a)[0];
          return `
            <tr style="background-color:${i % 2 === 0 ? '#FDF6E8' : '#FFFFFF'}">
              <td style="padding:8px 12px;border-bottom:1px solid #E8D5B5;">${MONTH_NAMES[parseInt(m) - 1]} ${year}</td>
              <td style="padding:8px 12px;border-bottom:1px solid #E8D5B5;text-align:right;font-family:monospace;">${formatCurrency(data.total, currency)}</td>
              <td style="padding:8px 12px;border-bottom:1px solid #E8D5B5;text-align:right;">${data.count}</td>
              <td style="padding:8px 12px;border-bottom:1px solid #E8D5B5;">${topCat ? `${topCat[0]} (${formatCurrency(topCat[1], currency)})` : '-'}</td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
  `;
}

export async function generateAndSharePdf(
  options: ExportOptions,
  expenses: Expense[],
  bills: Bill[],
  categories: BudgetCategory[],
  profile: UserProfile,
): Promise<void> {
  const { startDate, endDate, categories: filterCats, includeExpenses, includeBills, includeBudgetSummary, includeBreakdowns } = options;
  const currency = profile.currency;

  // Filter expenses by date range & categories
  const filteredExpenses = expenses.filter(e => {
    const dateMatch = e.date >= startDate && e.date <= endDate;
    const catMatch = filterCats.length === 0 || filterCats.includes(e.category);
    return dateMatch && catMatch;
  }).sort((a, b) => b.date.localeCompare(a.date));

  // Filter bills by date range
  const filteredBills = bills.filter(b => {
    return b.dueDate >= startDate && b.dueDate <= endDate;
  }).sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  // Filter categories if specified
  const filteredCategories = filterCats.length === 0
    ? categories
    : categories.filter(c => filterCats.includes(c.name));

  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalBillsDue = filteredBills.filter(b => !b.paid).reduce((sum, b) => sum + b.amount, 0);

  let sections = '';

  // Summary card always shown
  sections += `
    <div style="background-color:#FDF6E8;border:2px solid #2C2416;border-radius:8px;padding:20px;margin-bottom:20px;">
      <div style="display:flex;justify-content:space-between;margin-bottom:12px;">
        <div>
          <div style="font-size:12px;color:#7A6A52;margin-bottom:4px;">Monthly Income</div>
          <div style="font-family:monospace;font-size:20px;color:#2C2416;font-weight:bold;">${formatCurrency(profile.monthlyIncome, currency)}</div>
        </div>
        <div>
          <div style="font-size:12px;color:#7A6A52;margin-bottom:4px;">Total Expenses</div>
          <div style="font-family:monospace;font-size:20px;color:#E8A0BF;font-weight:bold;">${formatCurrency(totalExpenses, currency)}</div>
        </div>
        <div>
          <div style="font-size:12px;color:#7A6A52;margin-bottom:4px;">Bills Due</div>
          <div style="font-family:monospace;font-size:20px;color:#E8A87C;font-weight:bold;">${formatCurrency(totalBillsDue, currency)}</div>
        </div>
      </div>
      <div style="font-size:11px;color:#7A6A52;">
        Period: ${formatDate(startDate)} — ${formatDate(endDate)}
        ${filterCats.length > 0 ? ` | Filtered by: ${filterCats.join(', ')}` : ''}
      </div>
    </div>
  `;

  if (includeBudgetSummary) {
    sections += `
      <div style="margin-bottom:24px;">
        <div style="background-color:#E8A87C;color:#FFFFFF;padding:10px 16px;border:2px solid #2C2416;border-bottom:0;border-radius:8px 8px 0 0;font-weight:bold;font-size:14px;">
          📊 Budget Summary
        </div>
        <div style="border:2px solid #2C2416;border-top:0;border-radius:0 0 8px 8px;padding:16px;background-color:#FFFFFF;">
          ${generateCategoryBreakdown(filteredCategories, currency)}
        </div>
      </div>
    `;
  }

  if (includeExpenses) {
    sections += `
      <div style="margin-bottom:24px;">
        <div style="background-color:#E8A0BF;color:#FFFFFF;padding:10px 16px;border:2px solid #2C2416;border-bottom:0;border-radius:8px 8px 0 0;font-weight:bold;font-size:14px;">
          📜 Expenses History (${filteredExpenses.length} entries)
        </div>
        <div style="border:2px solid #2C2416;border-top:0;border-radius:0 0 8px 8px;overflow:hidden;background-color:#FFFFFF;">
          <table width="100%" style="border-collapse:collapse;">
            <thead>
              <tr style="background-color:#E8A0BF;color:#FFFFFF;">
                <th style="padding:10px 12px;text-align:left;">Date</th>
                <th style="padding:10px 12px;text-align:left;">Category</th>
                <th style="padding:10px 12px;text-align:left;">Note</th>
                <th style="padding:10px 12px;text-align:right;">Amount</th>
                <th style="padding:10px 12px;text-align:center;">Recurring</th>
              </tr>
            </thead>
            <tbody>
              ${generateExpenseRows(filteredExpenses, currency)}
            </tbody>
            <tfoot>
              <tr style="background-color:#F5EFE0;font-weight:bold;">
                <td colspan="3" style="padding:10px 12px;border-top:2px solid #2C2416;">Total</td>
                <td style="padding:10px 12px;border-top:2px solid #2C2416;text-align:right;font-family:monospace;">${formatCurrency(totalExpenses, currency)}</td>
                <td style="padding:10px 12px;border-top:2px solid #2C2416;"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    `;
  }

  if (includeBills) {
    sections += `
      <div style="margin-bottom:24px;">
        <div style="background-color:#C9B8E8;color:#FFFFFF;padding:10px 16px;border:2px solid #2C2416;border-bottom:0;border-radius:8px 8px 0 0;font-weight:bold;font-size:14px;">
          📋 Bills (${filteredBills.length} entries)
        </div>
        <div style="border:2px solid #2C2416;border-top:0;border-radius:0 0 8px 8px;overflow:hidden;background-color:#FFFFFF;">
          <table width="100%" style="border-collapse:collapse;">
            <thead>
              <tr style="background-color:#C9B8E8;color:#FFFFFF;">
                <th style="padding:10px 12px;text-align:left;">Name</th>
                <th style="padding:10px 12px;text-align:right;">Amount</th>
                <th style="padding:10px 12px;text-align:left;">Due Date</th>
                <th style="padding:10px 12px;text-align:left;">Recurrence</th>
                <th style="padding:10px 12px;text-align:center;">Status</th>
              </tr>
            </thead>
            <tbody>
              ${generateBillRows(filteredBills, currency)}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  if (includeBreakdowns) {
    sections += `
      <div style="margin-bottom:24px;">
        <div style="background-color:#A8D5BA;color:#FFFFFF;padding:10px 16px;border:2px solid #2C2416;border-bottom:0;border-radius:8px 8px 0 0;font-weight:bold;font-size:14px;">
          📅 Monthly Breakdown
        </div>
        <div style="border:2px solid #2C2416;border-top:0;border-radius:0 0 8px 8px;padding:16px;background-color:#FFFFFF;">
          ${generateMonthlyBreakdown(filteredExpenses, currency)}
        </div>
      </div>
      <div style="margin-bottom:24px;">
        <div style="background-color:#C9B8E8;color:#FFFFFF;padding:10px 16px;border:2px solid #2C2416;border-bottom:0;border-radius:8px 8px 0 0;font-weight:bold;font-size:14px;">
          📆 Weekly Breakdown
        </div>
        <div style="border:2px solid #2C2416;border-top:0;border-radius:0 0 8px 8px;padding:16px;background-color:#FFFFFF;">
          ${generateWeeklyBreakdown(filteredExpenses, currency)}
        </div>
      </div>
    `;
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background-color: #F5EFE0;
          color: #2C2416;
          padding: 24px;
          font-size: 13px;
        }
        h1, h2 { margin: 0; }
      </style>
    </head>
    <body>
      <!-- Header -->
      <div style="text-align:center;margin-bottom:24px;padding-bottom:16px;border-bottom:3px solid #E8A87C;">
        <div style="font-size:28px;font-weight:800;color:#2C2416;margin-bottom:4px;">💰 RetroLedger</div>
        <div style="font-size:14px;color:#7A6A52;">Financial Report</div>
        <div style="font-size:11px;color:#7A6A52;margin-top:4px;">
          Generated on ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      ${sections}

      <!-- Footer -->
      <div style="text-align:center;margin-top:32px;padding-top:16px;border-top:2px solid #D4C9B0;font-size:11px;color:#7A6A52;">
        Generated by RetroLedger • Your nostalgic personal finance companion
      </div>
    </body>
    </html>
  `;

  const { uri } = await Print.printToFileAsync({ html, base64: false });

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri, {
      UTI: '.pdf',
      mimeType: 'application/pdf',
      dialogTitle: 'Export RetroLedger Report',
    });
  }
}

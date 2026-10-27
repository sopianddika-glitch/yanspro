import { Transaction, TransactionType } from '../types';

export const reportTypes = ['pnl', 'expenses', 'income', 'cash', 'annual', 'snapshot'] as const;
export type ReportType = typeof reportTypes[number];
export interface ReportPeriod { start: string; end: string; }
export const localDateKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
export const validDateKey = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(`${value}T00:00:00`).getTime()) && localDateKey(new Date(`${value}T00:00:00`)) === value;
export const transactionDateKey = (value: string) => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return validDateKey(value) ? value : '';
    if (/^\d{4}-\d{2}-\d{2}T/.test(value) && !validDateKey(value.slice(0, 10))) return '';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '' : localDateKey(date);
};
export const validPeriod = (period: ReportPeriod) => (!period.start || validDateKey(period.start)) && (!period.end || validDateKey(period.end)) && (!period.start || !period.end || period.start <= period.end);
export const recentPeriod = (days: number, today = new Date()): ReportPeriod => {
    const start = new Date(today); start.setDate(start.getDate() - days + 1);
    return { start: localDateKey(start), end: localDateKey(today) };
};

export function buildReportData(transactions: Transaction[], period: ReportPeriod) {
    const active = transactions.filter(item => !item.deletedAt);
    const valid = active.filter(item => transactionDateKey(item.date) && Number.isFinite(item.amount) && item.amount >= 0 && [TransactionType.INCOME, TransactionType.EXPENSE].includes(item.type));
    const entries = valid.filter(item => { const key = transactionDateKey(item.date); return (!period.start || key >= period.start) && (!period.end || key <= period.end); }).sort((a,b) => new Date(a.date.length === 10 ? `${a.date}T00:00:00` : a.date).getTime() - new Date(b.date.length === 10 ? `${b.date}T00:00:00` : b.date).getTime() || a.id.localeCompare(b.id));
    const revenue = entries.filter(item => item.type === TransactionType.INCOME).reduce((sum,item) => sum + item.amount, 0);
    const expenses = entries.filter(item => item.type === TransactionType.EXPENSE).reduce((sum,item) => sum + item.amount, 0);
    const opening = period.start ? valid.filter(item => transactionDateKey(item.date) < period.start).reduce((sum,item) => sum + (item.type === TransactionType.INCOME ? item.amount : -item.amount), 0) : 0;
    const groups = (type: TransactionType) => {
        const grouped = new Map<string, number>();
        entries.filter(item => item.type === type).forEach(item => grouped.set(item.category || '-', (grouped.get(item.category || '-') ?? 0) + item.amount));
        const total = type === TransactionType.INCOME ? revenue : expenses;
        return [...grouped].map(([category, amount]) => ({ category, amount, share: total ? amount / total * 100 : 0 })).sort((a,b) => b.amount - a.amount || a.category.localeCompare(b.category));
    };
    const dates = entries.map(item => transactionDateKey(item.date)).sort();
    return { entries, revenue, expenses, net: revenue - expenses, opening, closing: opening + revenue - expenses, incomeGroups: groups(TransactionType.INCOME), expenseGroups: groups(TransactionType.EXPENSE), invalidCount: active.length - valid.length, start: period.start || dates[0] || '', end: period.end || dates[dates.length - 1] || '' };
}
export type ReportData = ReturnType<typeof buildReportData>;

import React, { useMemo } from 'react';
import {
    Budget,
    Category,
    FinancialSummary,
    Invoice,
    InvoiceStatus,
    Page,
    Profile,
    RecurringTransaction,
    Theme,
    Transaction,
} from '../types';
import StatCard from '../components/StatCard';
import OverviewChart from '../components/OverviewChart';
import ExpenseBreakdownChart from '../components/ExpenseBreakdownChart';
import RecentTransactions from '../components/RecentTransactions';
import FinancialInsight from '../components/FinancialInsight';
import UpcomingInvoices from '../components/UpcomingInvoices';
import UpcomingRecurring from '../components/UpcomingRecurring';
import PlatformDownload from '../components/PlatformDownload';
import CashFlowForecastChart from '../components/CashFlowForecastChart';
import BudgetDashboardWidget from '../components/BudgetDashboardWidget';
import {
    AddIcon,
    AlertTriangleIcon,
    BalanceIcon,
    CameraIcon,
    ExpenseIcon,
    InvoiceIcon,
    ProfitIcon,
    RevenueIcon,
} from '../components/Icons';
import { useI18n } from '../hooks/useI18n';

interface DashboardProps {
    transactions: Transaction[];
    invoices: Invoice[];
    recurringTransactions: RecurringTransaction[];
    budgets: Budget[];
    categories: Category[];
    summary: FinancialSummary;
    activeProfile: Profile;
    onAddTransactionClick: () => void;
    onAddFromReceiptClick: () => void;
    onNavigateToInvoice: (invoiceId?: string | null) => void;
    onNavigateToSettings: () => void;
    onNavigate: (page: Page) => void;
    theme: Theme;
    onOpenInstallModal: (platform: 'windows' | 'macos' | 'android' | 'ios') => void;
}

const Dashboard: React.FC<DashboardProps> = ({
    transactions,
    invoices,
    recurringTransactions,
    budgets,
    categories,
    summary,
    activeProfile,
    onAddTransactionClick,
    onAddFromReceiptClick,
    onNavigateToInvoice,
    onNavigateToSettings,
    onNavigate,
    theme,
    onOpenInstallModal,
}) => {
    const { t } = useI18n();

    const invoiceSummary = useMemo(() => {
        const outstanding = invoices
            .filter(invoice => invoice.status === InvoiceStatus.SENT || invoice.status === InvoiceStatus.OVERDUE)
            .reduce((sum, invoice) => sum + invoice.items.reduce((itemSum, item) => itemSum + item.price * item.quantity, 0), 0);

        const overdue = invoices
            .filter(invoice => invoice.status === InvoiceStatus.OVERDUE)
            .reduce((sum, invoice) => sum + invoice.items.reduce((itemSum, item) => itemSum + item.price * item.quantity, 0), 0);

        return { outstanding, overdue };
    }, [invoices]);

    const statCards = [
        {
            title: t('dashboard.stats.totalRevenue'),
            description: t('dashboard.stats.totalRevenueHint'),
            value: summary.totalRevenue,
            icon: <RevenueIcon />,
            currency: activeProfile.currency,
            tone: 'positive' as const,
        },
        {
            title: t('dashboard.stats.totalExpenses'),
            description: t('dashboard.stats.totalExpensesHint'),
            value: summary.totalExpenses,
            icon: <ExpenseIcon />,
            currency: activeProfile.currency,
            isExpense: true,
            tone: 'negative' as const,
        },
        {
            title: t('dashboard.stats.netProfit'),
            description: t('dashboard.stats.netProfitHint'),
            value: summary.netProfit,
            icon: <ProfitIcon />,
            currency: activeProfile.currency,
            tone: summary.netProfit >= 0 ? 'accent' as const : 'negative' as const,
        },
        {
            title: t('dashboard.stats.outstanding'),
            description: t('dashboard.stats.outstandingHint'),
            value: invoiceSummary.outstanding,
            icon: <InvoiceIcon className="h-6 w-6 text-amber-500" />,
            currency: activeProfile.currency,
            tone: 'warning' as const,
        },
        {
            title: t('dashboard.stats.overdue'),
            description: t('dashboard.stats.overdueHint'),
            value: invoiceSummary.overdue,
            icon: <AlertTriangleIcon className="h-6 w-6 text-brand-red" />,
            currency: activeProfile.currency,
            isExpense: true,
            tone: 'negative' as const,
        },
        {
            title: t('dashboard.stats.balance'),
            description: t('dashboard.stats.balanceHint'),
            value: summary.balance,
            icon: <BalanceIcon />,
            currency: activeProfile.currency,
            tone: summary.balance >= 0 ? 'positive' as const : 'negative' as const,
        },
    ];

    return (
        <div className="min-h-full bg-gray-50 dark:bg-brand-primary">
            <div className="app-container responsive-stack">
                <header className="dashboard-hero-grid">
                    <section className="fluid-card overflow-hidden border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-brand-secondary">
                        <div className="bg-gradient-to-r from-brand-accent/10 via-white to-green-50/70 p-[clamp(1.25rem,2.1vw,2rem)] dark:from-brand-accent/10 dark:via-brand-secondary dark:to-brand-primary/70">
                            <p className="fluid-caption wrap-anywhere font-semibold uppercase tracking-[0.24em] text-brand-accent">{t('header.overview')}</p>
                            <h1 className="fluid-title mt-3 font-bold text-gray-900 dark:text-white">
                                {t('dashboard.title')}
                            </h1>
                            <p className="fluid-body wrap-anywhere mt-4 max-w-3xl text-gray-600 dark:text-brand-muted">
                                {t('dashboard.subtitle', { businessName: activeProfile.name })}
                            </p>
                        </div>
                    </section>

                    <aside className="fluid-card border border-gray-200 bg-white p-[clamp(1rem,1.5vw,1.5rem)] shadow-sm dark:border-gray-700 dark:bg-brand-secondary">
                        <p className="fluid-caption wrap-anywhere font-semibold uppercase tracking-[0.24em] text-gray-400 dark:text-brand-muted">
                            {t('dashboard.quickActions')}
                        </p>
                        <h2 className="fluid-section-title wrap-anywhere mt-2 font-semibold text-gray-900 dark:text-white">{activeProfile.name}</h2>
                        <div className="mt-3 flex flex-wrap gap-2">
                            <span className="inline-flex rounded-full bg-brand-accent/10 px-3 py-1 text-xs font-semibold text-brand-accent dark:bg-brand-accent/20">
                                {activeProfile.currency}
                            </span>
                            <span className="inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-500/15 dark:text-green-300">
                                {t('header.workspaceLabel')}
                            </span>
                        </div>
                        <div className="mt-5 flex flex-wrap gap-3">
                            <button
                                onClick={onAddFromReceiptClick}
                                className="inline-flex min-h-12 min-w-[min(100%,13rem)] flex-1 items-center justify-center gap-2 rounded-2xl bg-gray-200 px-4 py-3 text-sm font-semibold text-gray-800 transition hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                            >
                                <CameraIcon className="h-5 w-5 flex-shrink-0" />
                                <span className="wrap-anywhere">{t('dashboard.addFromReceipt')}</span>
                            </button>
                            <button
                                onClick={onAddTransactionClick}
                                className="inline-flex min-h-12 min-w-[min(100%,13rem)] flex-1 items-center justify-center gap-2 rounded-2xl bg-brand-accent px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
                            >
                                <AddIcon className="h-5 w-5 flex-shrink-0" />
                                <span className="wrap-anywhere">{t('dashboard.addTransaction')}</span>
                            </button>
                        </div>
                    </aside>
                </header>

                <section aria-label={t('dashboard.title')}>
                    <div className="financial-card-grid">
                        {statCards.map((card) => (
                            <div
                                key={card.title}
                                className="min-w-0"
                            >
                                <StatCard {...card} />
                            </div>
                        ))}
                    </div>
                </section>

                <section className="dashboard-chart-grid">
                    <OverviewChart transactions={transactions} theme={theme} currency={activeProfile.currency} />
                    <CashFlowForecastChart transactions={transactions} theme={theme} currency={activeProfile.currency} />
                </section>

                <section className="dashboard-three-grid">
                    <UpcomingInvoices
                        invoices={invoices}
                        currency={activeProfile.currency}
                        onNavigateToInvoice={invoiceId => onNavigateToInvoice(invoiceId)}
                        profileName={activeProfile.name}
                    />
                    <UpcomingRecurring
                        transactions={transactions}
                        recurringTransactions={recurringTransactions}
                        currency={activeProfile.currency}
                        onNavigateToSettings={onNavigateToSettings}
                    />
                    <BudgetDashboardWidget
                        budgets={budgets}
                        categories={categories}
                        transactions={transactions}
                        currency={activeProfile.currency}
                        onNavigate={onNavigate}
                    />
                </section>

                <section className="dashboard-split-grid">
                    <RecentTransactions transactions={transactions} currency={activeProfile.currency} />
                    <div className="grid gap-6">
                        <FinancialInsight transactions={transactions} summary={summary} />
                        <PlatformDownload onInstallClick={onOpenInstallModal} />
                    </div>
                </section>

                <section>
                    <ExpenseBreakdownChart transactions={transactions} theme={theme} />
                </section>
            </div>
        </div>
    );
};

export default Dashboard;

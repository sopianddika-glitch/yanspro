import { Page } from '../types';
import { BriefcaseIcon, BudgetIcon, DashboardIcon, FlagIcon, InvoiceIcon, ReportsIcon, SettingsIcon, StorefrontIcon, TagIcon, TransactionsIcon, UsersIcon } from './Icons';

export type NavigationItem = { page: Page; labelKey: string; Icon: typeof DashboardIcon };

export const navigationGroups: { labelKey: string; items: NavigationItem[] }[] = [
    { labelKey: 'nav.overviewGroup', items: [
        { page: 'dashboard', labelKey: 'nav.dashboard', Icon: DashboardIcon },
        { page: 'enterprise', labelKey: 'nav.enterprise', Icon: BriefcaseIcon },
        { page: 'reports', labelKey: 'nav.reports', Icon: ReportsIcon },
    ] },
    { labelKey: 'nav.businessGroup', items: [
        { page: 'pos', labelKey: 'nav.pos', Icon: StorefrontIcon },
        { page: 'transactions', labelKey: 'nav.transactions', Icon: TransactionsIcon },
        { page: 'invoices', labelKey: 'nav.invoices', Icon: InvoiceIcon },
        { page: 'products', labelKey: 'nav.products', Icon: TagIcon },
        { page: 'clients', labelKey: 'nav.clients', Icon: UsersIcon },
    ] },
    { labelKey: 'nav.planningGroup', items: [
        { page: 'budgets', labelKey: 'nav.budgets', Icon: BudgetIcon },
        { page: 'goals', labelKey: 'nav.goals', Icon: FlagIcon },
    ] },
];

export const settingsItem = { page: 'settings' as const, labelKey: 'nav.settings', Icon: SettingsIcon };
export const navigationItems = [...navigationGroups.flatMap(group => group.items), settingsItem];
export const activeNavigationPage = (page: Page): Page => page === 'invoice-editor' ? 'invoices' : page;

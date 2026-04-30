import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Page } from '../types';
import {
    BriefcaseIcon,
    BudgetIcon,
    ChevronDownIcon,
    DashboardIcon,
    FlagIcon,
    InvoiceIcon,
    SettingsIcon,
    StorefrontIcon,
    TagIcon,
    TransactionsIcon,
    XIcon,
} from './Icons';
import { useI18n } from '../hooks/useI18n';

interface HeaderNavProps {
    currentPage: Page;
    onNavigate: (page: Page) => void;
}

type HeaderNavItem = {
    page: Page;
    labelKey: string;
    Icon: React.FC<{ className?: string }>;
    match?: Page[];
};

const HeaderNav: React.FC<HeaderNavProps> = ({ currentPage, onNavigate }) => {
    const { t } = useI18n();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const navItems = useMemo<HeaderNavItem[]>(() => [
        { page: 'dashboard', labelKey: 'nav.dashboard', Icon: DashboardIcon },
        { page: 'pos', labelKey: 'nav.pos', Icon: StorefrontIcon },
        { page: 'transactions', labelKey: 'nav.transactions', Icon: TransactionsIcon },
        { page: 'invoices', labelKey: 'nav.invoices', Icon: InvoiceIcon, match: ['invoice-editor'] },
        { page: 'enterprise', labelKey: 'nav.enterprise', Icon: BriefcaseIcon },
        { page: 'products', labelKey: 'nav.products', Icon: TagIcon },
        { page: 'budgets', labelKey: 'nav.budgets', Icon: BudgetIcon },
        { page: 'goals', labelKey: 'nav.goals', Icon: FlagIcon },
        { page: 'settings', labelKey: 'nav.settings', Icon: SettingsIcon },
    ], []);

    const activeItem = navItems.find(item => item.page === currentPage || item.match?.includes(currentPage)) ?? navItems[0];

    useEffect(() => {
        const handlePointerDown = (event: PointerEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('pointerdown', handlePointerDown);
        return () => document.removeEventListener('pointerdown', handlePointerDown);
    }, []);

    const handleNavigate = (page: Page) => {
        onNavigate(page);
        setIsOpen(false);
    };

    const renderNavButton = (item: HeaderNavItem, variant: 'desktop' | 'mobile') => {
        const isActive = item.page === currentPage || item.match?.includes(currentPage);
        const Icon = item.Icon;
        const baseClass = variant === 'desktop'
            ? 'inline-flex h-10 min-w-0 items-center gap-1.5 rounded-xl px-2.5 text-[clamp(0.78rem,0.18vw+0.72rem,0.9rem)] font-semibold transition'
            : 'flex w-full min-w-0 items-center gap-3 rounded-xl px-3 py-3 text-left text-[clamp(0.875rem,0.3vw+0.78rem,0.98rem)] font-semibold transition';
        const toneClass = isActive
            ? 'bg-brand-accent text-white shadow-sm shadow-brand-accent/20'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white';

        return (
            <button
                key={item.page}
                type="button"
                onClick={() => handleNavigate(item.page)}
                className={`${baseClass} ${toneClass}`}
                aria-current={isActive ? 'page' : undefined}
            >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className={variant === 'desktop' ? 'whitespace-nowrap' : 'wrap-anywhere'}>{t(item.labelKey)}</span>
            </button>
        );
    };

    const ActiveIcon = activeItem.Icon;

    return (
        <nav ref={menuRef} className="relative max-w-full" aria-label={t('nav.navigation')}>
            <div className="header-desktop-nav max-w-full flex-wrap items-center justify-center gap-1">
                {navItems.map(item => renderNavButton(item, 'desktop'))}
            </div>

            <button
                type="button"
                onClick={() => setIsOpen(prev => !prev)}
                className="header-menu-button h-11 max-w-[min(16rem,55vw)] items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-gray-700 dark:bg-brand-primary dark:text-gray-100 dark:hover:bg-gray-800"
                aria-expanded={isOpen}
                aria-haspopup="menu"
            >
                <ActiveIcon className="h-5 w-5 text-brand-accent" />
                <span className="hidden min-w-0 truncate sm:inline">{t(activeItem.labelKey)}</span>
                <ChevronDownIcon className={`h-4 w-4 transition ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-14 z-30 max-h-[min(32rem,calc(100vh-6rem))] w-[min(22rem,calc(100vw-1rem))] overflow-y-auto rounded-2xl border border-gray-200 bg-white p-2 shadow-xl dark:border-gray-700 dark:bg-brand-secondary">
                    <div className="mb-1 flex items-center justify-between px-2 py-1">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 dark:text-brand-muted">
                            {t('nav.navigation')}
                        </p>
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                            aria-label={t('general.close')}
                        >
                            <XIcon className="h-4 w-4" />
                        </button>
                    </div>
                    <div className="grid gap-1 sm:grid-cols-2">
                        {navItems.map(item => renderNavButton(item, 'mobile'))}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default HeaderNav;

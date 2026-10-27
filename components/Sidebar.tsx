import React, { useEffect, useRef } from 'react';
import { Page } from '../types';
import { LogoIcon, XIcon, ChevronLeftIcon } from './Icons';
import { useI18n } from '../hooks/useI18n';
import { activeNavigationPage, navigationGroups, navigationItems, settingsItem } from './navigation';

interface SidebarProps {
    currentPage: Page;
    onNavigate: (page: Page) => void;
    collapsed: boolean;
    onToggle: () => void;
    mobileOpen: boolean;
    onClose: () => void;
    desktop: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate, collapsed, onToggle, mobileOpen, onClose, desktop }) => {
    const { t } = useI18n();
    const panelRef = useRef<HTMLElement>(null);
    const closeRef = useRef<HTMLButtonElement>(null);
    const compact = desktop && collapsed;

    useEffect(() => {
        if (desktop || !mobileOpen) return;
        const previousFocus = document.activeElement as HTMLElement | null;
        closeRef.current?.focus();
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') { event.preventDefault(); onClose(); }
            if (event.key !== 'Tab') return;
            const buttons = [...(panelRef.current?.querySelectorAll<HTMLButtonElement>('button') ?? [])].filter(button => button.getClientRects().length > 0);
            const first = buttons[0];
            const last = buttons[buttons.length - 1];
            if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
            if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            if (previousFocus?.isConnected && previousFocus.getClientRects().length) previousFocus.focus();
        };
    }, [desktop, mobileOpen, onClose]);

    const renderItem = (item: typeof navigationItems[number]) => {
        const active = activeNavigationPage(currentPage) === item.page;
        const Icon = item.Icon;
        return (
            <button key={item.page} type="button" data-page={item.page}
                className={`sidebar-item ${active ? 'is-active' : ''}`}
                aria-current={active ? 'page' : undefined} aria-label={t(item.labelKey)}
                onMouseEnter={event => { if (compact) event.currentTarget.style.setProperty('--tooltip-top', `${event.currentTarget.getBoundingClientRect().top}px`); }}
                onFocus={event => { if (compact) event.currentTarget.style.setProperty('--tooltip-top', `${event.currentTarget.getBoundingClientRect().top}px`); }}
                onClick={() => { onNavigate(item.page); if (!desktop) onClose(); }}>
                <span className="sidebar-item-icon" aria-hidden="true"><Icon className="h-5 w-5" /></span>
                <span className="sidebar-label">{t(item.labelKey)}</span>
                {active && <span className="sidebar-active-dot" aria-hidden="true" />}
                {compact && <span className="sidebar-tooltip" aria-hidden="true">{t(item.labelKey)}</span>}
            </button>
        );
    };

    return (
        <>
            {!desktop && mobileOpen && <div className="sidebar-backdrop" aria-hidden="true" onClick={onClose} />}
            <aside id="app-sidebar" ref={panelRef}
                className={`sidebar ${compact ? 'is-collapsed' : ''} ${mobileOpen ? 'is-open' : ''}`}
                role={!desktop && mobileOpen ? 'dialog' : undefined}
                aria-modal={!desktop && mobileOpen ? true : undefined}
                aria-label={t('nav.navigation')} inert={!desktop && !mobileOpen}>
                <div className="sidebar-brand">
                    <span className="sidebar-logo" aria-hidden="true"><LogoIcon /></span>
                    <div className="sidebar-label min-w-0">
                        <p className="text-base font-bold tracking-tight text-gray-900 dark:text-white">{t('appName')}</p>
                        <p className="mt-0.5 text-[11px] text-gray-500 dark:text-brand-muted">{t('nav.workspace')}</p>
                    </div>
                    {!desktop && <button ref={closeRef} type="button" onClick={onClose} className="sidebar-close" aria-label={t('nav.closeMenu')}><XIcon className="h-5 w-5" /></button>}
                </div>
                <nav className="sidebar-navigation custom-scrollbar" aria-label={t('nav.navigation')}>
                    {navigationGroups.map(group => (
                        <section key={group.labelKey} className="sidebar-group" aria-label={t(group.labelKey)}>
                            <p className="sidebar-group-title" aria-hidden="true">{compact ? <span className="sidebar-group-divider" /> : t(group.labelKey)}</p>
                            <div className="space-y-1">{group.items.map(renderItem)}</div>
                        </section>
                    ))}
                </nav>
                <div className="sidebar-footer">
                    {renderItem(settingsItem)}
                    {desktop && <button type="button" className="sidebar-item sidebar-collapse" onClick={onToggle}
                        aria-label={t(collapsed ? 'nav.expandMenu' : 'nav.collapseMenu')} aria-expanded={!collapsed} aria-controls="app-sidebar"
                        title={t(collapsed ? 'nav.expandMenu' : 'nav.collapseMenu')}>
                        <span className={`sidebar-item-icon ${compact ? 'rotate-180' : ''}`} aria-hidden="true"><ChevronLeftIcon className="h-5 w-5" /></span>
                        <span className="sidebar-label">{t('nav.collapseMenu')}</span>
                    </button>}
                </div>
            </aside>
        </>
    );
};

export default Sidebar;

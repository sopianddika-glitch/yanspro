import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Page, Profile, Theme } from '../types';
import Header from './Header';
import Sidebar from './Sidebar';
import { activeNavigationPage, navigationItems } from './navigation';
import { useI18n } from '../hooks/useI18n';

interface AppLayoutProps {
    currentPage: Page;
    onNavigate: (page: Page) => void;
    profiles: Profile[];
    activeProfile: Profile;
    onSwitchProfile: (profileId: string) => void;
    onManageProfiles: () => void;
    theme: Theme;
    onSetTheme: (theme: Theme) => void;
    children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, currentPage, onNavigate, ...headerProps }) => {
    const { t } = useI18n();
    const mainRef = useRef<HTMLElement>(null);
    const [desktop, setDesktop] = useState(() => window.matchMedia('(min-width: 1024px)').matches);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(() => {
        try { return localStorage.getItem('yans-pro-sidebar-collapsed') === 'true'; } catch { return false; }
    });
    const closeMobile = useCallback(() => setMobileOpen(false), []);

    useEffect(() => {
        const query = window.matchMedia('(min-width: 1024px)');
        const update = () => { setDesktop(query.matches); setMobileOpen(false); };
        query.addEventListener('change', update);
        return () => query.removeEventListener('change', update);
    }, []);

    useEffect(() => {
        try { localStorage.setItem('yans-pro-sidebar-collapsed', String(collapsed)); } catch { /* Navigation stays available if storage is blocked. */ }
    }, [collapsed]);

    useEffect(() => { mainRef.current?.scrollTo(0, 0); }, [currentPage]);

    const toggleCollapsed = () => setCollapsed(value => !value);
    const activeItem = navigationItems.find(item => item.page === activeNavigationPage(currentPage)) ?? navigationItems[0];

    return (
        <>
            <Sidebar currentPage={currentPage} onNavigate={onNavigate} collapsed={collapsed} onToggle={toggleCollapsed}
                desktop={desktop} mobileOpen={mobileOpen} onClose={closeMobile} />
            <div className="workspace-content flex min-w-0 flex-1 flex-col overflow-hidden" inert={!desktop && mobileOpen}>
                <Header {...headerProps} title={t(activeItem.labelKey)} desktop={desktop} menuExpanded={desktop ? !collapsed : mobileOpen}
                    onToggleMenu={desktop ? toggleCollapsed : () => setMobileOpen(true)} />
                <main ref={mainRef} className={`app-main min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto ${currentPage === 'pos' ? 'app-main-pos' : ''}`}>
                    {children}
                </main>
            </div>
        </>
    );
};

export default AppLayout;

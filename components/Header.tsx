import React from 'react';
import ProfileSwitcher from './ProfileSwitcher';
import ThemeSwitcher from './ThemeSwitcher';
import { Profile, Theme } from '../types';
import { useI18n } from '../hooks/useI18n';

interface HeaderProps {
    title: string;
    menuExpanded: boolean;
    onToggleMenu: () => void;
    desktop: boolean;
    profiles: Profile[];
    activeProfile: Profile;
    onSwitchProfile: (profileId: string) => void;
    onManageProfiles: () => void;
    theme: Theme;
    onSetTheme: (theme: Theme) => void;
}

const Header: React.FC<HeaderProps> = ({ title, menuExpanded, onToggleMenu, desktop, profiles, activeProfile, onSwitchProfile, onManageProfiles, theme, onSetTheme }) => {
    const { t } = useI18n();
    return (
        <header className="app-header">
            <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
                <button type="button" className="sidebar-toggle" onClick={onToggleMenu}
                    aria-label={t(desktop ? (menuExpanded ? 'nav.collapseMenu' : 'nav.expandMenu') : 'nav.openMenu')}
                    aria-expanded={menuExpanded} aria-controls="app-sidebar">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
                        <rect x="3" y="4" width="18" height="16" rx="3" /><path d="M9 4v16M5.5 8h1M5.5 12h1M5.5 16h1" />
                    </svg>
                </button>
                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100 sm:text-base">{title}</p>
                    <p className="hidden truncate text-xs text-gray-500 dark:text-brand-muted sm:block">{activeProfile.name}</p>
                </div>
            </div>
            <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
                <ThemeSwitcher theme={theme} onSetTheme={onSetTheme} />
                <ProfileSwitcher activeProfile={activeProfile} profiles={profiles} onSwitchProfile={onSwitchProfile} onManageProfiles={onManageProfiles} />
            </div>
        </header>
    );
};

export default Header;

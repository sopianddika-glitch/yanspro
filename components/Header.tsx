
import React from 'react';
import { LogoIcon } from './Icons';
import ProfileSwitcher from './ProfileSwitcher';
import ThemeSwitcher from './ThemeSwitcher';
import HeaderNav from './HeaderNav';
import { Page, Profile, Theme } from '../types';
import { useI18n } from '../hooks/useI18n';

interface HeaderProps {
    currentPage: Page;
    onNavigate: (page: Page) => void;
    profiles: Profile[];
    activeProfile: Profile;
    onSwitchProfile: (profileId: string) => void;
    onManageProfiles: () => void;
    theme: Theme;
    onSetTheme: (theme: Theme) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate, profiles, activeProfile, onSwitchProfile, onManageProfiles, theme, onSetTheme }) => {
    const { t } = useI18n();
    const ownerInitials = activeProfile.name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map(part => part[0]?.toUpperCase() ?? '')
        .join('');

    return (
        <header className="sticky top-0 z-20 flex-shrink-0 border-b border-gray-200 bg-white/90 backdrop-blur-xl dark:border-gray-700 dark:bg-brand-secondary/90">
            <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
                <div className="flex min-h-[4.75rem] items-center justify-between gap-3 py-3">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-brand-accent/10 dark:bg-brand-accent/20">
                            <LogoIcon />
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-lg font-bold text-gray-900 dark:text-white sm:text-xl">{t('appName')}</p>
                            <p className="truncate text-sm text-gray-500 dark:text-brand-muted">{t('header.overview')}</p>
                        </div>
                    </div>

                    <div className="flex min-w-0 flex-1 justify-center px-2">
                        <HeaderNav currentPage={currentPage} onNavigate={onNavigate} />
                    </div>

                    <div className="flex flex-shrink-0 items-center gap-2 sm:gap-3">
                        <div className="hidden items-center gap-3 rounded-2xl border border-gray-200 bg-white/90 px-3 py-2 shadow-sm dark:border-gray-700 dark:bg-brand-primary/80 md:flex">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-accent text-sm font-bold text-white">
                                {ownerInitials}
                            </div>
                            <div className="min-w-0">
                                <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-gray-400 dark:text-brand-muted">
                                    {t('header.ownerLabel')}
                                </p>
                                <p className="truncate text-sm font-semibold text-gray-800 dark:text-white">{activeProfile.name}</p>
                            </div>
                        </div>
                        <ThemeSwitcher theme={theme} onSetTheme={onSetTheme} />
                        <ProfileSwitcher
                            activeProfile={activeProfile}
                            profiles={profiles}
                            onSwitchProfile={onSwitchProfile}
                            onManageProfiles={onManageProfiles}
                        />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;

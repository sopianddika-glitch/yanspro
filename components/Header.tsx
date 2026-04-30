
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
        <header className="sticky top-0 z-20 flex-shrink-0 border-b border-gray-200 bg-white/92 backdrop-blur-xl dark:border-gray-700 dark:bg-brand-secondary/92">
            <div className="mx-auto w-full max-w-[1920px] px-[clamp(0.75rem,1.2vw,1.5rem)]">
                <div className="flex min-h-[clamp(4rem,4.5vw,4.75rem)] min-w-0 flex-wrap items-center justify-between gap-[clamp(0.5rem,0.8vw,1rem)] py-2.5">
                    <div className="flex min-w-0 flex-shrink items-center gap-2 sm:gap-3">
                        <div className="flex h-[clamp(2.25rem,2.8vw,2.75rem)] w-[clamp(2.25rem,2.8vw,2.75rem)] flex-shrink-0 items-center justify-center rounded-2xl bg-brand-accent/10 dark:bg-brand-accent/20">
                            <LogoIcon />
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-[clamp(1rem,0.55vw+0.85rem,1.25rem)] font-bold leading-tight text-gray-900 dark:text-white">{t('appName')}</p>
                            <p className="hidden truncate text-[clamp(0.75rem,0.28vw+0.68rem,0.9rem)] text-gray-500 dark:text-brand-muted sm:block">{t('header.overview')}</p>
                        </div>
                    </div>

                    <div className="order-3 flex min-w-0 flex-1 justify-end sm:order-none sm:justify-center sm:px-1">
                        <HeaderNav currentPage={currentPage} onNavigate={onNavigate} />
                    </div>

                    <div className="flex min-w-0 flex-shrink-0 items-center gap-1.5 sm:gap-2">
                        <div className="hidden max-w-[15rem] items-center gap-2 rounded-2xl border border-gray-200 bg-white/90 px-3 py-2 shadow-sm dark:border-gray-700 dark:bg-brand-primary/80 min-[1800px]:flex">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-accent text-sm font-bold text-white">
                                {ownerInitials}
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-gray-400 dark:text-brand-muted">
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

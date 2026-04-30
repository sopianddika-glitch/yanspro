import React, { useState, useRef, useEffect } from 'react';
import { Theme } from '../types';
import { SunIcon, MoonIcon, DesktopComputerIcon as SystemIcon, ChevronDownIcon } from './Icons';

interface ThemeSwitcherProps {
    theme: Theme;
    onSetTheme: (theme: Theme) => void;
}

const themeOptions = [
    { value: 'light' as Theme, label: 'Light', icon: SunIcon },
    { value: 'dark' as Theme, label: 'Dark', icon: MoonIcon },
    { value: 'system' as Theme, label: 'System', icon: SystemIcon },
];

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ theme, onSetTheme }) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [wrapperRef]);

    const handleSelectTheme = (newTheme: Theme) => {
        onSetTheme(newTheme);
        setIsOpen(false);
    };
    
    const CurrentThemeIcon = themeOptions.find(opt => opt.value === theme)?.icon || SystemIcon;

    return (
        <div className="relative" ref={wrapperRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gray-200 text-sm font-semibold text-gray-700 transition hover:bg-gray-300 dark:bg-brand-primary dark:text-white dark:hover:bg-gray-800"
                aria-label={`Current theme: ${theme}. Change theme.`}
            >
                <CurrentThemeIcon className="w-5 h-5" />
            </button>
            {isOpen && (
                <div className="absolute right-0 z-40 mt-2 w-40 rounded-lg border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-brand-secondary">
                    <div className="p-1">
                        {themeOptions.map(option => (
                             <button
                                key={option.value}
                                onClick={() => handleSelectTheme(option.value)}
                                className={`w-full text-left flex items-center gap-3 p-2 text-sm rounded-md ${
                                    theme === option.value 
                                    ? 'bg-brand-accent text-white' 
                                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                                }`}
                            >
                                <option.icon className="w-5 h-5" />
                                <span>{option.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ThemeSwitcher;

import React from 'react';
import { Profile, SupportedLocale } from '../types';
import { documentText } from '../utils/documentText';
import { formatDate } from '../utils/intl';

export interface BusinessDocumentProps {
    profile: Profile; locale: SupportedLocale; title: string; reference: string;
    badge?: string; paid?: boolean; metadata?: { label: string; value: string }[];
    generatedAt?: Date; children: React.ReactNode;
}
export const documentDate = (value: string, locale: SupportedLocale) => {
    const date = new Date(value.length === 10 ? `${value}T00:00:00` : value);
    return Number.isNaN(date.getTime()) ? '-' : formatDate(date, locale, { day: '2-digit', month: 'short', year: 'numeric' });
};
export default function BusinessDocument({ profile, locale, title, reference, badge, paid, metadata = [], generatedAt = new Date(), children }: BusinessDocumentProps) {
    const text = documentText(locale);
    return <article className="business-document">
        <header className="document-header">
            <div><h1 className="business-name">{profile.name}</h1><div className="business-contact">
                {profile.address && <p>{profile.address}</p>}
                {profile.email && <p>{profile.email}</p>}{profile.phone && <p>{profile.phone}</p>}
                {profile.website && <p>{profile.website}</p>}
                {profile.taxId && <p>{text.taxId}: {profile.taxId}</p>}
            </div></div>
            <div className="document-heading"><h2>{title}</h2>{badge && <span className={`document-badge ${paid ? 'paid' : ''}`}>{badge}</span>}
                <dl className="document-meta">
                    <div><dt>{text.reference}</dt><dd className="document-reference">{reference}</dd></div>
                    {metadata.map((item,index) => <div key={index}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}
                    <div><dt>{text.currency}</dt><dd>{profile.currency}</dd></div>
                </dl>
            </div>
        </header>
        {children}
        <footer className="document-footer"><strong>{profile.name}</strong><p>{text.generated}: {formatDate(generatedAt, locale, { dateStyle: 'medium', timeStyle: 'short' })} ({Intl.DateTimeFormat().resolvedOptions().timeZone})</p><p>{text.recordNote}</p></footer>
    </article>;
}

import React, { useMemo, useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Profile, Transaction } from '../types';
import { PrintIcon, XIcon, ReportsIcon } from '../components/Icons';
import ReportDocument from '../components/ReportDocument';
import { useI18n } from '../hooks/useI18n';
import { documentText } from '../utils/documentText';
import { buildReportData, localDateKey, recentPeriod, ReportPeriod, ReportType, reportTypes, transactionDateKey, validPeriod } from '../utils/reportData';
import { createPrintHtml, openPrintDocument } from '../utils/printDocument';

interface ReportsPageProps { transactions: Transaction[]; profile: Profile; }
export default function ReportsPage({ transactions, profile }: ReportsPageProps) {
    const { locale } = useI18n();
    const text = documentText(locale);
    const [kind, setKind] = useState<ReportType | null>(null);
    const [period, setPeriod] = useState<ReportPeriod>(() => recentPeriod(30));
    const [preset, setPreset] = useState('30');
    const [year, setYear] = useState(new Date().getFullYear());
    const [includeLedger, setIncludeLedger] = useState(false);
    const [error, setError] = useState('');
    const actualPeriod = kind === 'annual' ? {start:`${year}-01-01`,end:`${year}-12-31`} : period;
    const periodIsValid = validPeriod(actualPeriod);
    const data = useMemo(() => buildReportData(transactions,actualPeriod), [transactions,actualPeriod.start,actualPeriod.end]);
    const generatedAt = useMemo(() => new Date(), [data,kind,includeLedger,profile,locale]);
    const markup = useMemo(() => kind ? renderToStaticMarkup(<ReportDocument profile={profile} locale={locale} kind={kind} data={data} includeLedger={includeLedger} generatedAt={generatedAt}/>) : '', [kind,profile,locale,data,includeLedger,generatedAt]);
    const title = kind ? `${profile.name} - ${text.reportNames[kind]}` : text.reports;
    const reference = `RPT-${kind?.toUpperCase()}-${data.start||'ALL'}-${data.end||'ALL'}`;
    const html = useMemo(() => createPrintHtml({title,markup,locale,reference}), [title,markup,locale,reference]);
    const years = useMemo(() => [...new Set([new Date().getFullYear(),...transactions.filter(item=>!item.deletedAt).map(item=>Number(transactionDateKey(item.date).slice(0,4))).filter(value=>value>0)])].sort((a,b)=>b-a),[transactions]);
    const choosePreset = (value: string) => {
        setPreset(value);
        if(value==='all') setPeriod({start:'',end:''});
        else if(value==='ytd') setPeriod({start:`${new Date().getFullYear()}-01-01`,end:localDateKey(new Date())});
        else if(value!=='custom') setPeriod(recentPeriod(Number(value)));
    };
    const exportPdf = () => {
        setError('');
        if(!periodIsValid){setError(text.periodError);return;}
        if(!openPrintDocument({title,markup,locale,reference}))setError(text.popupError);
    };
    const inputClass = 'w-full rounded-xl border border-gray-300 bg-white p-2.5 text-sm text-gray-800 dark:border-gray-700 dark:bg-brand-primary dark:text-gray-100';
    return <div className="min-h-full bg-gray-50 p-4 dark:bg-brand-primary sm:p-6 lg:p-8">
        <div className="mb-6"><h1 className="text-2xl font-bold text-gray-900 dark:text-white">{text.reports}</h1><p className="mt-2 max-w-3xl text-sm text-gray-500 dark:text-brand-muted">{text.reportDescription}</p></div>
        {!kind ? <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">{reportTypes.map(type=><article key={type} className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-brand-secondary"><div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-brand-accent dark:bg-blue-500/10"><ReportsIcon className="h-5 w-5"/></div><h2 className="font-semibold text-gray-900 dark:text-white">{text.reportNames[type]}</h2><p className="mb-5 mt-2 flex-1 text-sm leading-relaxed text-gray-500 dark:text-brand-muted">{text.reportDescriptions[type]}</p><button type="button" data-report={type} onClick={()=>{setKind(type);setError('');}} className="rounded-xl bg-brand-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-600">{text.generate}</button></article>)}</div> : <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-semibold text-gray-900 dark:text-white">{text.reportNames[kind]}</h2><div className="flex items-center gap-2"><button type="button" onClick={exportPdf} disabled={!periodIsValid} className="inline-flex items-center gap-2 rounded-xl bg-brand-accent px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"><PrintIcon className="h-5 w-5"/>{text.export}</button><button type="button" aria-label={text.close} onClick={()=>setKind(null)} className="rounded-xl p-2.5 text-gray-500 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800"><XIcon className="h-5 w-5"/></button></div></div>
            <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-brand-secondary">
                {kind==='annual' ? <div className="max-w-xs"><label htmlFor="report-year" className="mb-1 block text-xs font-semibold text-gray-500">{text.year}</label><select id="report-year" className={inputClass} value={year} onChange={event=>setYear(Number(event.target.value))}>{years.map(value=><option key={value} value={value}>{value}</option>)}</select></div> : <div className="grid grid-cols-1 gap-3 sm:grid-cols-3"><div><label htmlFor="report-period" className="mb-1 block text-xs font-semibold text-gray-500">{text.period}</label><select id="report-period" className={inputClass} value={preset} onChange={event=>choosePreset(event.target.value)}>{[['30',text.last30],['90',text.last90],['ytd',text.ytd],['all',text.all],['custom',text.custom]].map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></div><div><label htmlFor="report-start" className="mb-1 block text-xs font-semibold text-gray-500">{text.from}</label><input id="report-start" type="date" className={inputClass} value={period.start} onChange={event=>{setPreset('custom');setPeriod(value=>({...value,start:event.target.value}));}}/></div><div><label htmlFor="report-end" className="mb-1 block text-xs font-semibold text-gray-500">{text.to}</label><input id="report-end" type="date" className={inputClass} value={period.end} onChange={event=>{setPreset('custom');setPeriod(value=>({...value,end:event.target.value}));}}/></div></div>}
                <label className="mt-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"><input type="checkbox" checked={includeLedger} onChange={event=>setIncludeLedger(event.target.checked)}/>{text.includeLedger}</label>
            </div>
            {(!periodIsValid||error) && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">{!periodIsValid?text.periodError:error}</p>}
            {periodIsValid && <iframe title={text.reportNames[kind]} srcDoc={html} sandbox="allow-same-origin" className="h-[70vh] min-h-96 w-full rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-700"/>}
        </section>}
    </div>;
}

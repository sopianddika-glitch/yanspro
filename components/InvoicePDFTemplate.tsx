import React from 'react';
import { Client, Invoice, InvoiceStatus, Profile, SupportedLocale } from '../types';
import BusinessDocument, { documentDate } from './BusinessDocument';
import { documentText } from '../utils/documentText';
import { formatCurrency, getLocaleCode } from '../utils/intl';

interface InvoicePDFTemplateProps { invoice: Invoice; profile: Profile; currency: string; locale?: SupportedLocale; client?: Client; draft?: boolean; generatedAt?: Date; }
export default function InvoicePDFTemplate({ invoice, profile, currency, locale = 'en', client, draft = false, generatedAt }: InvoicePDFTemplateProps) {
    const text = documentText(locale);
    const money = (value: number) => formatCurrency(value, currency, locale);
    const total = invoice.items.reduce((sum,item) => sum + item.quantity * item.price, 0);
    const isDraft = draft || invoice.status === InvoiceStatus.DRAFT;
    return <BusinessDocument profile={{...profile,currency}} locale={locale} title={text.invoice}
        reference={isDraft && invoice.id === 'DRAFT' ? 'DRAFT' : `INV-${invoice.id}`}
        badge={isDraft ? text.draft : text.status[invoice.status]} paid={!isDraft && invoice.status === InvoiceStatus.PAID}
        metadata={[{ label: text.issued, value: documentDate(invoice.issueDate,locale) },{ label: text.due, value: documentDate(invoice.dueDate,locale) }]} generatedAt={generatedAt}>
        <section className="document-recipient"><p className="document-kicker">{text.billTo}</p><strong>{invoice.clientName}</strong>
            {client?.address && <p className="business-contact">{client.address}</p>}{client?.email && <p>{client.email}</p>}{client?.phone && <p>{client.phone}</p>}
        </section>
        <table className="document-table"><colgroup><col style={{width:'42%'}}/><col style={{width:'10%'}}/><col style={{width:'23%'}}/><col style={{width:'25%'}}/></colgroup>
            <thead><tr><th>{text.description}</th><th className="numeric">{text.quantity}</th><th className="numeric">{text.unitPrice} ({currency})</th><th className="numeric">{text.amount} ({currency})</th></tr></thead>
            <tbody>{invoice.items.map((item,index)=><tr key={item.id || index}><td>{item.description}</td><td className="numeric">{new Intl.NumberFormat(getLocaleCode(locale),{maximumFractionDigits:20}).format(item.quantity)}</td><td className="numeric">{formatCurrency(item.price,currency,locale,{maximumFractionDigits:20})}</td><td className="numeric">{money(item.quantity*item.price)}</td></tr>)}</tbody>
        </table>
        <div className="document-totals"><div className="document-total-row"><span>{text.subtotal}</span><span>{money(total)}</span></div><div className="document-total-row grand"><span>{text.total}</span><strong>{money(total)}</strong></div></div>
        {invoice.notes && <section className="document-section"><h3>{text.notes}</h3><p className="document-notes">{invoice.notes}</p></section>}
        {isDraft && <p className="document-note">{text.draftNote}</p>}
        <p className="document-note">{text.thankYou}</p>
    </BusinessDocument>;
}

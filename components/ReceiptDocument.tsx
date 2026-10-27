import React from 'react';
import { Client, Profile, SupportedLocale, Transaction, TransactionType } from '../types';
import BusinessDocument, { documentDate } from './BusinessDocument';
import { documentText } from '../utils/documentText';
import { formatCurrency, getLocaleCode } from '../utils/intl';

export default function ReceiptDocument({ transaction, profile, locale, client, generatedAt }: { transaction: Transaction; profile: Profile; locale: SupportedLocale; client?: Client; generatedAt?: Date }) {
    const text = documentText(locale);
    const business: Profile = transaction.receipt ? { id: profile.id, ...transaction.receipt.business, currency: transaction.receipt.currency } : profile;
    const money = (value: number) => formatCurrency(value,business.currency,locale);
    const income = transaction.type === TransactionType.INCOME;
    const items = transaction.receipt?.items;
    const validItems = Boolean(items?.length && items.every(item => Number.isFinite(item.quantity) && item.quantity > 0 && Number.isFinite(item.unitPrice) && item.unitPrice >= 0) && Math.abs(items.reduce((sum,item)=>sum+item.quantity*item.unitPrice,0)-transaction.amount)<0.005);
    return <BusinessDocument profile={business} locale={locale} title={income ? text.receipt : text.expenseReceipt} reference={`${income?'RCT':'EXP'}-${transaction.id}`} badge={text.recorded} paid={income} metadata={[{label:text.date,value:documentDate(transaction.date,locale)},{label:text.category,value:transaction.category}]} generatedAt={generatedAt}>
        {client && <section className="document-recipient"><p className="document-kicker">{income?text.receivedFrom:text.businessRecord}</p><strong>{client.name}</strong>{client.address&&<p className="business-contact">{client.address}</p>}{client.email&&<p>{client.email}</p>}</section>}
        <table className="document-table">
            <colgroup>{validItems ? <><col style={{width:'42%'}}/><col style={{width:'10%'}}/><col style={{width:'23%'}}/><col style={{width:'25%'}}/></> : <><col style={{width:'68%'}}/><col style={{width:'32%'}}/></>}</colgroup>
            <thead><tr><th>{text.description}</th>{validItems&&<><th className="numeric">{text.quantity}</th><th className="numeric">{text.unitPrice} ({business.currency})</th></>}<th className="numeric">{text.amount} ({business.currency})</th></tr></thead>
            <tbody>{validItems ? items!.map((item,index)=><tr key={index}><td>{item.description}{item.sku&&<span className="secondary">SKU: {item.sku}</span>}</td><td className="numeric">{new Intl.NumberFormat(getLocaleCode(locale),{maximumFractionDigits:20}).format(item.quantity)}</td><td className="numeric">{formatCurrency(item.unitPrice,business.currency,locale,{maximumFractionDigits:20})}</td><td className="numeric">{money(item.quantity*item.unitPrice)}</td></tr>) : <tr><td>{transaction.description}</td><td className="numeric">{money(transaction.amount)}</td></tr>}</tbody>
        </table>
        <div className="document-totals"><div className="document-total-row grand"><span>{income?text.amountReceived:text.amountSpent}</span><strong>{money(transaction.amount)}</strong></div></div>
        {transaction.invoiceId && <p className="document-note">{text.invoice}: INV-{transaction.invoiceId}</p>}
        {income && <p className="document-note">{text.thankYou}</p>}
    </BusinessDocument>;
}

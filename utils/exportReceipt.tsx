import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Client, Profile, SupportedLocale, Transaction, TransactionType } from '../types';
import ReceiptDocument from '../components/ReceiptDocument';
import { openPrintDocument } from './printDocument';
import { documentText } from './documentText';

export function exportReceipt(transaction: Transaction, profile: Profile, locale: SupportedLocale, client?: Client): boolean {
    if (transaction.deletedAt || !Number.isFinite(transaction.amount) || transaction.amount < 0) return false;
    return openPrintDocument({ title: `${transaction.receipt?.business.name || profile.name} - ${transaction.type === TransactionType.EXPENSE ? documentText(locale).expenseReceipt : documentText(locale).receipt} - ${transaction.id}`, locale, reference: `${transaction.type === TransactionType.EXPENSE ? 'EXP' : 'RCT'}-${transaction.id}`, markup: renderToStaticMarkup(<ReceiptDocument transaction={transaction} profile={profile} locale={locale} client={client} />) });
}

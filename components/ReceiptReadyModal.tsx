import React, { useEffect, useRef, useState } from 'react';
import { Profile, Transaction } from '../types';
import { useI18n } from '../hooks/useI18n';
import { documentText } from '../utils/documentText';
import { exportReceipt } from '../utils/exportReceipt';
import { formatCurrency } from '../utils/intl';
import { CheckIcon, PrintIcon } from './Icons';

export default function ReceiptReadyModal({ receipt, onClose }: { receipt: {transaction: Transaction; profile: Profile}; onClose: () => void }) {
    const { locale } = useI18n();
    const text = documentText(locale);
    const [error,setError] = useState('');
    const panel = useRef<HTMLDivElement>(null);
    useEffect(()=>{
        const previous=document.activeElement as HTMLElement|null;
        panel.current?.querySelector('button')?.focus();
        const keydown=(event:KeyboardEvent)=>{
            if(event.key==='Escape')onClose();
            if(event.key!=='Tab')return;
            const buttons=panel.current?.querySelectorAll('button');
            if(!buttons?.length)return;
            if(event.shiftKey&&document.activeElement===buttons[0]){event.preventDefault();buttons[buttons.length-1].focus();}
            if(!event.shiftKey&&document.activeElement===buttons[buttons.length-1]){event.preventDefault();buttons[0].focus();}
        };
        document.addEventListener('keydown',keydown);
        return ()=>{document.removeEventListener('keydown',keydown);if(previous?.isConnected)previous.focus();};
    },[onClose]);
    return <div role="dialog" aria-modal="true" aria-labelledby="receipt-ready-title" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={event=>{if(event.target===event.currentTarget)onClose();}}>
        <div ref={panel} className="w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-xl dark:bg-brand-secondary">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-600 dark:bg-green-500/10"><CheckIcon className="h-6 w-6"/></div>
            <h2 id="receipt-ready-title" className="text-xl font-bold text-gray-900 dark:text-white">{text.saleComplete}</h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-brand-muted">{text.receiptReady}</p>
            <p className="wrap-anywhere mt-5 text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(receipt.transaction.amount,receipt.profile.currency,locale)}</p>
            {error&&<p role="alert" className="mt-4 text-sm text-red-600">{error}</p>}
            <div className="mt-6 flex flex-wrap gap-3"><button type="button" onClick={()=>setError(exportReceipt(receipt.transaction,receipt.profile,locale)?'':text.popupError)} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-accent px-4 py-3 text-sm font-semibold text-white"><PrintIcon className="h-5 w-5"/>{text.export}</button><button type="button" onClick={onClose} className="rounded-xl bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-200">{text.close}</button></div>
        </div>
    </div>;
}

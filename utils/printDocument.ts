import { SupportedLocale } from '../types';
import { documentText } from './documentText';
import { PRINT_DOCUMENT_STYLES } from './printStyles';

export interface PrintDocumentOptions { title: string; markup: string; locale: SupportedLocale; toolbar?: boolean; reference?: string; }
export const escapeHtml = (value: string) => value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]!));
export function createPrintHtml({ title, markup, locale, toolbar = false, reference }: PrintDocumentOptions) {
    const text = documentText(locale);
    const footer = JSON.stringify((reference || 'Yans Pro').replace(/[\r\n\f]/g, ' ')).replace(/</g, '\\3c ');
    const pageFooterStyle = `@page { @bottom-left { content: ${footer}; font: 7.5pt Consolas, monospace; color: #64748b; } }`;
    return `<!doctype html><html lang="${locale === 'id' ? 'id' : 'en'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title><style>${PRINT_DOCUMENT_STYLES}${pageFooterStyle}</style></head><body>${toolbar ? `<div class="print-toolbar"><p>${escapeHtml(text.printHelp)}</p><button id="print-document" type="button">${escapeHtml(text.print)}</button><button id="close-document" type="button">${escapeHtml(text.close)}</button></div>` : ''}<main class="print-shell">${markup}</main></body></html>`;
}

// Open synchronously from the user's click; never close the preview on a timer.
export function openPrintDocument(options: PrintDocumentOptions): boolean {
    const preview = window.open('', '_blank');
    if (!preview) return false;
    try {
        preview.document.open();
        preview.document.write(createPrintHtml({ ...options, toolbar: true }));
        preview.document.close();
        preview.opener = null;
        preview.document.getElementById('print-document')?.addEventListener('click', () => { preview.focus(); preview.print(); });
        preview.document.getElementById('close-document')?.addEventListener('click', () => preview.close());
        void preview.document.fonts.ready.then(() => {
            if (preview.closed) return;
            preview.requestAnimationFrame(() => preview.requestAnimationFrame(() => {
                if (!preview.closed) { preview.focus(); preview.print(); }
            }));
        }).catch(() => { /* Keep the ready preview available for a manual retry. */ });
        return true;
    } catch {
        preview.close();
        return false;
    }
}

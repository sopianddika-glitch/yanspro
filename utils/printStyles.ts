// Self-contained print styles: no network fonts or application theme required.
export const PRINT_DOCUMENT_STYLES = `
  @page { size: A4; margin: 16mm 14mm 18mm;
    @bottom-left { content: "Yans Pro"; font: 8pt Arial, sans-serif; color: #64748b; }
    @bottom-right { content: counter(page) " / " counter(pages); font: 8pt Arial, sans-serif; color: #64748b; }
  }
  :root { color-scheme: light; font-family: "Segoe UI", Arial, sans-serif; font-size: 10pt; color: #172b4d; }
  * { box-sizing: border-box; }
  body { margin: 0; background: #eef2f6; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  button { font: inherit; cursor: pointer; }
  .print-toolbar { position: sticky; top: 0; z-index: 5; display: flex; flex-wrap: wrap; align-items: center; gap: 10px; background: #10243a; color: white; padding: 14px 20px; }
  .print-toolbar p { flex: 1 1 280px; margin: 0; font-size: 9pt; line-height: 1.5; }
  .print-toolbar button { border: 1px solid #718096; border-radius: 7px; background: white; color: #10243a; padding: 10px 16px; font-weight: 600; }
  .print-shell { max-width: 210mm; margin: 20px auto; padding: 16mm 14mm; background: white; box-shadow: 0 3px 24px #10243a15; }
  .business-document { line-height: 1.5; overflow-wrap: anywhere; }
  .business-document h1, .business-document h2, .business-document h3, .business-document p { margin: 0; }
  .document-header { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 0.9fr); gap: 24px; border-top: 5px solid #163953; border-bottom: 1px solid #cbd5e1; padding: 20px 0 22px; margin-bottom: 22px; break-inside: avoid; }
  .business-name { font-size: 21pt; line-height: 1.15; font-weight: 700; letter-spacing: -0.5px; margin-bottom: 10px !important; }
  .business-contact { font-size: 9pt; color: #526175; white-space: pre-line; }
  .document-heading { text-align: right; }
  .document-heading h2 { font-size: 17pt; font-weight: 650; line-height: 1.2; color: #163953; margin-bottom: 10px; }
  .document-badge { display: inline-block; border: 1px solid #cbd5e1; border-radius: 4px; padding: 3px 8px; font-size: 8pt; font-weight: 700; letter-spacing: 0.5px; background: #f1f5f9; }
  .document-badge.paid { color: #116149; background: #ecfdf5; border-color: #a7dac8; }
  .document-meta { display: grid; gap: 4px; margin-top: 12px; font-size: 8.5pt; }
  .document-meta dt { color: #64748b; }
  .document-meta dd { margin: 0; font-weight: 600; }
  .document-meta > div { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.6fr); gap: 10px; }
  .document-reference { font-family: Consolas, monospace; font-size: 8pt; }
  .document-section { margin: 18px 0; }
  .document-section h3, .document-kicker { font-size: 8pt; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #64748b; margin-bottom: 7px !important; }
  .document-recipient { padding: 14px 16px; border-left: 3px solid #248a8a; background: #f6f9fb; margin: 20px 0; break-inside: avoid; }
  .document-recipient strong { display: block; font-size: 12pt; }
  .document-table { width: 100%; border-collapse: collapse; table-layout: fixed; margin: 18px 0; font-size: 9pt; }
  .document-table thead { display: table-header-group; }
  .document-table th { background: #163953; color: white; font-size: 8pt; font-weight: 600; text-align: left; padding: 10px 9px; vertical-align: bottom; }
  .document-table td { border-bottom: 1px solid #dce4ec; padding: 11px 9px; vertical-align: top; }
  .document-table tbody tr:nth-child(even) { background: #f8fafc; }
  .document-table tr { break-inside: avoid; }
  .document-table .numeric, .numeric { text-align: right; font-variant-numeric: tabular-nums; }
  .document-table .secondary { display: block; color: #64748b; font-size: 7.5pt; margin-top: 3px; }
  .document-totals { width: min(100%, 88mm); margin: 20px 0 20px auto; break-inside: avoid; }
  .document-total-row { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.7fr); gap: 15px; padding: 8px 0; border-bottom: 1px solid #dce4ec; }
  .document-total-row strong, .document-total-row span:last-child { text-align: right; font-variant-numeric: tabular-nums; }
  .document-total-row.grand { padding: 12px; background: #163953; color: white; font-size: 12pt; font-weight: 700; border-radius: 4px; }
  .document-notes { white-space: pre-wrap; color: #526175; font-size: 9pt; border-top: 1px solid #dce4ec; padding-top: 14px; }
  .document-note { font-size: 8.5pt; color: #64748b; margin-top: 10px !important; }
  .document-footer { border-top: 1px solid #cbd5e1; padding-top: 14px; margin-top: 26px; font-size: 8pt; color: #64748b; break-inside: avoid; }
  .document-footer strong { color: #163953; }
  .document-metrics { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 10px; margin: 20px 0; break-inside: avoid; }
  .document-metric { padding: 14px 12px; border: 1px solid #dce4ec; border-radius: 5px; background: #f8fafc; }
  .document-metric span { display: block; font-size: 8pt; color: #64748b; margin-bottom: 5px; }
  .document-metric strong { display: block; font-size: 13pt; line-height: 1.4; font-variant-numeric: tabular-nums; }
  .document-empty { padding: 25px; border: 1px dashed #cbd5e1; text-align: center; color: #64748b; }
  @media screen and (max-width: 600px) { .print-shell { margin: 0; padding: 20px 14px; } .document-header { gap: 14px; } .business-name { font-size: 17pt; } .document-heading h2 { font-size: 13pt; } .document-metrics { grid-template-columns: 1fr; } }
  @media print { body { background: white; } .print-toolbar { display: none !important; } .print-shell { margin: 0; padding: 0; max-width: none; box-shadow: none; } h3 { break-after: avoid; } }
`;

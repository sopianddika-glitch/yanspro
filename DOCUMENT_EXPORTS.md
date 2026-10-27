# Professional business documents

## Available exports

- **Invoices:** open an invoice in the editor and choose Export PDF. Business identity and optional contact/tax details come from the active business profile. A uniquely matched client record supplies address/email/phone. Item calculations, currency, issued/due dates, full reference, notes, and saved status are included. Unsaved or changed documents are explicitly drafts; exporting does not issue or save them. No zero-rate tax line is fabricated.
- **Sales receipts:** a completed POS sale offers Export PDF. Item descriptions, quantities, selling prices, SKU, business details, and currency are stored with the transaction for historical reprinting, independently of later catalogue/profile edits.
- **Transaction documents:** the receipt/PDF action is available for active transactions in desktop and mobile views. Income produces a payment receipt; expenses produce an expense voucher. Legacy records without item snapshots show their recorded description and amount, without inventing quantities or tender/change details.
- **Reports:** six profile-branded report types cover recorded income/expenses, expense categories, income sources, cash movements, annual activity, and an activity snapshot. Preset/custom date ranges and an optional transaction appendix are supported. Tax deductibility, tax payable, untracked assets, liabilities, and bank balances are not inferred.

## Save or print

The export opens an independent, light-theme A4 preview with a Print / Save PDF button. Choose **Save as PDF** in the browser print dialog; use A4 and disable the browser's own headers/footers to avoid extra URLs/dates. The preview remains open after printing or cancellation and can be printed again. A blocked pop-up produces feedback in the app. Printing does not require a remote document service, external font, or new runtime dependency.

Headers, table columns, totals, notes and footers use dedicated document styles rather than copied app DOM. Table headings repeat across pages; rows and totals avoid unnecessary splitting. Document references and page/total-page counters appear in print margins in supporting Chromium browsers. English/Indonesian labels, local date formatting, the browser timezone, and the business currency are included.

## Data boundaries

Dates are filtered inclusively by local calendar day. Soft-deleted entries are excluded. Invalid dates, amounts or types are excluded and counted explicitly. Opening/closing cash movement describes cumulative recorded movements and does not establish an independently verified cash/bank balance. Reports are operational records, not audited or accrual-basis statements. No payment method, tax rate, partial-payment balance or customer detail is invented when it is absent from the data.

Historical business/item snapshots are available for new POS sales. Older receipts cannot reconstruct information that was never saved. Changing invoice fields before exporting marks the result as a draft. Currency conversion, official tax-invoice issuance, digital signatures, thermal roll formats and direct binary PDF downloads are outside this change.

## Verification

- Run `node scripts/test-document-data.mjs`: 29 checks covering calendar boundaries, deleted/invalid data, chronology, opening/net/closing reconciliation, categories, draft status, currency/history snapshots, empty results and HTML/CSS escaping.
- TypeScript checking and Pages production build passed.
- Development Chromium: 288 geometry samples passed across all 11 pages, report panels/iframe previews and invoice editing, at 320/375/768/1024/1440/1920 px in English and Indonesian.
- Production Chromium: 59 layout, preview, export and feedback assertions passed at widths 320, 768 and 1440 across all six reports, invoice editing and transaction receipt actions.
- Actual PDFs were generated from UI export pop-ups, not screenshots. A 70-item invoice spans six A4 pages; a report appendix contains all 80 added test entries without duplicates or omissions across ten pages. Repeated headings, totals, page references/counters, paper size and text margins were checked, with first/middle/last pages visually inspected.
- POS confirmation, manual print retry, reload persistence, expense voucher identity, invalid date order, empty periods, blocked pop-ups, and reprinting after business/currency/catalogue changes were exercised.

PDF examples, browser command bodies and rendered inspection images use **fictional business data** and are saved locally under ignored `output/` and `tmp/pdfs/`. They are not deployed as customer data. Native Safari, physical printers, mobile OS print dialogs and Electron packaging were not exercised. The browser's print settings and margin-box support can affect the final pagination/header/footer behavior.

import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { createRequire } from 'node:module';
import ts from 'typescript';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

process.env.TZ = 'Asia/Makassar';
const nativeRequire = createRequire(import.meta.url);
const cache = new Map();
function load(sourcePath) {
    const file = [sourcePath, `${sourcePath}.ts`, `${sourcePath}.tsx`].find(existsSync);
    if (!file) throw new Error(`Missing module: ${sourcePath}`);
    if (cache.has(file)) return cache.get(file).exports;
    const module = { exports: {} }; cache.set(file, module);
    const code = ts.transpileModule(readFileSync(file, 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
    new Function('require', 'module', 'exports', code)(name => name.startsWith('.') ? load(resolve(dirname(file), name)) : nativeRequire(name), module, module.exports);
    return module.exports;
}
const { buildReportData, validPeriod, validDateKey, recentPeriod, transactionDateKey } = load(resolve('utils/reportData.ts'));
const { createPrintHtml } = load(resolve('utils/printDocument.ts'));
const Invoice = load(resolve('components/InvoicePDFTemplate.tsx')).default;
const Receipt = load(resolve('components/ReceiptDocument.tsx')).default;
const Report = load(resolve('components/ReportDocument.tsx')).default;
let checks = 0;
function test(name, fn) { fn(); checks++; process.stdout.write(`PASS ${name}\n`); }
const txn = (id, date, amount, type='Income', extra={}) => ({ id, date, amount, type, category:'Services', description:id, ...extra });
const transactions = [
    txn('opening','2026-09-01',100), txn('first','2026-10-01T00:00:00+08:00',1000),
    txn('expense','2026-10-15',250,'Expense'), txn('last','2026-10-27T23:59:59+08:00',500),
    txn('future','2026-10-28',999), txn('deleted','2026-10-12',9999,'Income',{deletedAt:'2026-10-13'}),
    txn('bad-date','invalid',10), txn('bad-amount','2026-10-15',NaN), txn('negative','2026-10-15',-1), txn('bad-type','2026-10-15',1,'Unknown'),
];
const period = {start:'2026-10-01',end:'2026-10-27'};
const data = buildReportData(transactions,period);
test('inclusive calendar dates and deleted record exclusion',()=>assert.deepEqual(data.entries.map(item=>item.id),['first','expense','last']));
test('income expense and net reconcile',()=>assert.deepEqual([data.revenue,data.expenses,data.net],[1500,250,1250]));
test('opening and closing movements reconcile',()=>assert.deepEqual([data.opening,data.closing],[100,1350]));
test('invalid records counted separately',()=>assert.equal(data.invalidCount,4));
test('category percentages',()=>assert.equal(data.incomeGroups[0].share,100));
test('empty period remains zero and empty',()=>assert.deepEqual([buildReportData(transactions,{start:'2025-01-01',end:'2025-12-31'}).entries.length,buildReportData([],period).net],[0,0]));
test('30-day preset includes exactly 30 calendar dates',()=>assert.deepEqual(recentPeriod(30,new Date('2026-10-27T12:00:00+08:00')),{start:'2026-09-28',end:'2026-10-27'}));
test('reversed period rejected',()=>assert.equal(validPeriod({start:'2026-10-28',end:'2026-10-01'}),false));
test('impossible and leap dates validated',()=>assert.deepEqual([validDateKey('2026-02-30'),validDateKey('2024-02-29')],[false,true]));
test('impossible ISO timestamp calendar date rejected',()=>assert.equal(transactionDateKey('2026-02-30T10:00:00+08:00'),''));
test('mixed timestamp offsets sorted chronologically',()=>assert.deepEqual(buildReportData([txn('later','2026-10-01T00:30:00Z',1),txn('earlier','2026-10-01T08:00:00+08:00',1)],period).entries.map(t=>t.id),['earlier','later']));
test('prototype-like categories aggregate safely',()=>assert.equal(buildReportData([txn('safe','2026-10-01',10,'Income',{category:'__proto__'})],period).incomeGroups[0].amount,10));
const profile = {id:'business',name:'Example & Partners',currency:'IDR',address:'Street 1',email:'office@example.com'};
const invoice = {id:'INV-001-full-reference',profileId:'business',clientName:'A <script>alert(1)</script>',issueDate:'2026-10-01',dueDate:'2026-10-31',status:'Sent',items:[{id:'one',description:'Consulting',quantity:2,price:1250000}],notes:'Line one\nLine two'};
const render = (Component, props) => renderToStaticMarkup(React.createElement(Component, props));
const invoiceMarkup = render(Invoice,{invoice,profile,currency:'IDR',locale:'en'});
test('business identity and full reference preserved',()=>{assert.ok(invoiceMarkup.includes('Example &amp; Partners'));assert.ok(invoiceMarkup.includes('INV-001-full-reference'));});
test('invoice data is HTML escaped',()=>{assert.ok(!invoiceMarkup.includes('<script>'));assert.ok(invoiceMarkup.includes('&lt;script&gt;'));});
test('unsupported tax zero line removed',()=>assert.ok(!invoiceMarkup.includes('Tax (0%)')));
test('invoice arithmetic formatted from items',()=>assert.match(invoiceMarkup,/2,500,000/));
test('unsaved paid draft is not marked paid',()=>{const m=render(Invoice,{invoice:{...invoice,status:'Paid'},profile,currency:'IDR',locale:'en',draft:true});assert.ok(m.includes('DRAFT - NOT ISSUED'));assert.ok(!m.includes('>PAID<'));});
const sale = txn('sale','2026-10-27',125000,'Income',{receipt:{currency:'IDR',business:{name:'Original Business'},items:[{description:'Original price item',quantity:1,unitPrice:125000}]}});
test('receipt snapshot preserves historical identity and currency',()=>{const m=render(Receipt,{transaction:sale,profile:{...profile,name:'Changed Business',currency:'USD',address:'Changed address'},locale:'en'});assert.ok(m.includes('Original Business'));assert.ok(m.includes('IDR'));assert.ok(!m.includes('Changed Business'));assert.ok(!m.includes('Changed address'));assert.ok(m.includes('125,000'));});
test('legacy receipt does not invent item quantities or payment method',()=>{const m=render(Receipt,{transaction:transactions[1],profile,locale:'en'});assert.ok(!m.includes('Unit price'));assert.ok(!m.includes('Cash'));});
test('expense uses expense voucher title',()=>assert.ok(render(Receipt,{transaction:transactions[2],profile,locale:'en'}).includes('EXPENSE VOUCHER')));
test('empty receipt snapshot has no stray table zero',()=>{const m=render(Receipt,{transaction:{...sale,receipt:{...sale.receipt,items:[]}},profile,locale:'en'});assert.ok(!m.includes('</th>0<th'));assert.ok(!m.includes('Unit price'));});
test('inconsistent snapshot falls back to recorded amount',()=>{const m=render(Receipt,{transaction:{...sale,amount:999},profile,locale:'en'});assert.ok(!m.includes('Original price item'));assert.ok(!m.includes('Unit price'));});
test('report metadata states period and excludes deleted detail',()=>{const m=render(Report,{profile,locale:'en',kind:'pnl',data,includeLedger:true});assert.ok(m.includes('2026-10-01'));assert.ok(m.includes('last'));assert.ok(!m.includes('deleted'));});
test('annual report does not classify all income as taxable',()=>{const m=render(Report,{profile,locale:'en',kind:'annual',data,includeLedger:false});assert.ok(m.includes('have not been determined'));assert.ok(!m.includes('Taxable Income'));});
test('snapshot does not fabricate liabilities',()=>{const m=render(Report,{profile,locale:'en',kind:'snapshot',data,includeLedger:false});assert.ok(m.includes('not independently verified bank balances'));assert.ok(!m.includes('>Liabilities<'));});
test('empty category report shows no-data message',()=>{const m=render(Report,{profile,locale:'en',kind:'expenses',data:buildReportData([transactions[1]],period),includeLedger:false});assert.ok(m.includes('No transactions recorded'));});
test('print title and locale cannot inject markup',()=>{const html=createPrintHtml({title:'<script>bad</script>',markup:invoiceMarkup,locale:'en" onload="bad'});assert.ok(html.includes('&lt;script&gt;bad&lt;/script&gt;'));assert.ok(html.includes('<html lang="en">'));});
test('page reference is escaped inside print CSS',()=>{const html=createPrintHtml({title:'Invoice',markup:invoiceMarkup,locale:'en',reference:'</style><script>bad</script>'});assert.ok(!html.includes('</style><script>'));assert.ok(html.includes('bottom-left'));});
test('print view is offline and has no close timer',()=>{const html=createPrintHtml({title:'Invoice',markup:invoiceMarkup,locale:'en',toolbar:true});assert.ok(html.includes('print-document'));assert.ok(!html.includes('<script'));assert.ok(!html.includes('fonts.googleapis'));});
console.log(`Document checks: ${checks} passed.`);

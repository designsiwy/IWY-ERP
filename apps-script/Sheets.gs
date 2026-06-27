/**
 * IWY Designs ERP - Google Apps Script Backend
 * Sheets.gs - Sheet setup and initialization
 */

const SHEET_SCHEMAS = {
  Customers: [
    'id', 'name', 'company', 'phone', 'email', 'gstNo',
    'address', 'city', 'state', 'pincode', 'notes',
    'createdAt', 'updatedAt'
  ],
  Quotations: [
    'id', 'quotationNo', 'date', 'validityDate',
    'customerId', 'customerName', 'customerPhone', 'customerEmail', 'customerAddress',
    'projectName', 'siteAddress',
    'subtotal', 'discountPct', 'discountAmt', 'gstPct', 'gstAmt',
    'roundOff', 'grandTotal', 'amountInWords',
    'status', 'remarks', 'terms', 'paymentTerms',
    'createdAt', 'updatedAt'
  ],
  Quotation_Items: [
    'id', 'quotationId', 'sno',
    'description', 'measurement', 'unit',
    'quantity', 'unitPrice', 'amount'
  ],
  Invoices: [
    'id', 'invoiceNo', 'date',
    'quotationId', 'quotationNo',
    'customerId', 'customerName', 'customerPhone', 'customerEmail', 'customerAddress',
    'projectName', 'siteAddress',
    'subtotal', 'discountPct', 'discountAmt', 'gstPct', 'gstAmt',
    'roundOff', 'grandTotal', 'amountInWords',
    'status', 'remarks', 'terms', 'paymentTerms',
    'createdAt', 'updatedAt'
  ],
  Invoice_Items: [
    'id', 'invoiceId', 'sno',
    'description', 'measurement', 'unit',
    'quantity', 'unitPrice', 'amount'
  ],
  Settings: ['key', 'value'],
  Activity_Log: ['timestamp', 'type', 'action', 'id', 'name', 'user']
};

const DEFAULT_SETTINGS = [
  ['companyName', 'IWY Designs'],
  ['tagline', 'Excellence in Interior Design'],
  ['address', 'Plot No:219/A, Road No:17 Jubilee Hills, Hyderabad, Telangana - 500033'],
  ['phone', '+91-7893247799'],
  ['email', 'info@iwydesigns.com'],
  ['website', 'www.iwydesigns.com'],
  ['quotationPrefix', 'IWY-Q-'],
  ['invoicePrefix', 'IWY-INV-'],
  ['quotationCounter', '0'],
  ['invoiceCounter', '0'],
  ['defaultGST', '18'],
  ['defaultValidity', '30'],
  ['bankName', 'UNION BANK OF INDIA'],
  ['accountNo', '244311010000186'],
  ['ifsc', 'UBIN0824437'],
  ['accountHolder', 'IWY DESIGNS'],
  ['authorizedSignatory', 'LAKSHMI PULAPARTHI'],
  ['currency', '₹']
];

function initSheets(ss) {
  // Remove default "Sheet1" if present
  const defaultSheet = ss.getSheetByName('Sheet1');
  if (defaultSheet && ss.getNumSheets() > 1) ss.deleteSheet(defaultSheet);

  Object.keys(SHEET_SCHEMAS).forEach(name => {
    let sheet = ss.getSheetByName(name);
    if (!sheet) sheet = ss.insertSheet(name);
    initSheet(sheet, name);
  });
}

function initSheet(sheet, name) {
  const schema = SHEET_SCHEMAS[name];
  if (!schema) return;

  // Only init if empty
  if (sheet.getLastRow() > 0) return;

  // Write headers
  sheet.getRange(1, 1, 1, schema.length).setValues([schema]);

  // Style header row
  const headerRange = sheet.getRange(1, 1, 1, schema.length);
  headerRange.setBackground('#1a2a4a');
  headerRange.setFontColor('#ffffff');
  headerRange.setFontWeight('bold');
  headerRange.setFontSize(10);

  // Freeze header row
  sheet.setFrozenRows(1);

  // Auto-resize columns
  for (let i = 1; i <= schema.length; i++) {
    sheet.setColumnWidth(i, 150);
  }

  // Seed settings sheet
  if (name === 'Settings') {
    DEFAULT_SETTINGS.forEach(row => sheet.appendRow(row));
  }
}

/**
 * One-time setup function — run this manually from the Apps Script editor
 * to create the spreadsheet and initialize all sheets.
 */
function setup() {
  const ss = getSpreadsheet();
  initSheets(ss);
  Logger.log('Setup complete. Spreadsheet ID: ' + ss.getId());
  Logger.log('Spreadsheet URL: ' + ss.getUrl());
}

/**
 * Test function — run from the Apps Script editor to verify everything works
 */
function testSetup() {
  const result = getDashboard();
  Logger.log(JSON.stringify(result));
}

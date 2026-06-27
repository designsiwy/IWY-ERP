/**
 * IWY Designs ERP - Google Apps Script Backend
 * Code.gs - Main entry point (Web App)
 *
 * Deploy as Web App:
 *   - Execute as: Me
 *   - Who has access: Anyone
 */

// ============================================================
//  CONFIGURATION — update SPREADSHEET_ID after first run
// ============================================================
const SPREADSHEET_ID = ''; // Auto-created on first run if blank

// ============================================================
//  WEB APP ENTRY POINTS
// ============================================================

function doGet(e) {
  const action = e.parameter.action || '';
  try {
    if (action === 'ping') return jsonResponse({ status: 'ok', message: 'IWY ERP backend is running' });
    if (action === 'getDashboard') return jsonResponse(getDashboard());
    if (action === 'getCustomers') return jsonResponse(getCustomers());
    if (action === 'getQuotations') return jsonResponse(getQuotations(e.parameter));
    if (action === 'getInvoices') return jsonResponse(getInvoices(e.parameter));
    if (action === 'generateQuotationNumber') return jsonResponse({ number: generateQuotationNumber() });
    if (action === 'generateInvoiceNumber') return jsonResponse({ number: generateInvoiceNumber() });
    return jsonResponse({ error: 'Unknown action: ' + action }, 400);
  } catch (err) {
    return jsonResponse({ error: err.message }, 500);
  }
}

function doPost(e) {
  const body = JSON.parse(e.postData.contents);
  const action = body.action || '';
  try {
    if (action === 'saveCustomer') return jsonResponse(saveCustomer(body.data));
    if (action === 'deleteCustomer') return jsonResponse(deleteCustomer(body.id));
    if (action === 'saveQuotation') return jsonResponse(saveQuotation(body.data));
    if (action === 'updateQuotation') return jsonResponse(updateQuotation(body.data));
    if (action === 'deleteQuotation') return jsonResponse(deleteQuotation(body.id));
    if (action === 'saveInvoice') return jsonResponse(saveInvoice(body.data));
    if (action === 'updateInvoice') return jsonResponse(updateInvoice(body.data));
    if (action === 'deleteInvoice') return jsonResponse(deleteInvoice(body.id));
    if (action === 'logActivity') return jsonResponse(logActivity(body.data));
    return jsonResponse({ error: 'Unknown action: ' + action }, 400);
  } catch (err) {
    return jsonResponse({ error: err.message }, 500);
  }
}

function jsonResponse(data, code) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================================
//  SPREADSHEET HELPER
// ============================================================

function getSpreadsheet() {
  const props = PropertiesService.getScriptProperties();
  let id = props.getProperty('SPREADSHEET_ID') || SPREADSHEET_ID;
  if (!id) {
    const ss = SpreadsheetApp.create('IWY Designs ERP Data');
    id = ss.getId();
    props.setProperty('SPREADSHEET_ID', id);
    initSheets(ss);
    return ss;
  }
  return SpreadsheetApp.openById(id);
}

function getSheet(name) {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    initSheet(sheet, name);
  }
  return sheet;
}

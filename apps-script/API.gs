/**
 * IWY Designs ERP - Google Apps Script Backend
 * API.gs - CRUD operations for all entities
 */

// ============================================================
//  CUSTOMERS
// ============================================================

function getCustomers() {
  const sheet = getSheet('Customers');
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  const headers = data[0];
  return data.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });
}

function saveCustomer(customer) {
  const sheet = getSheet('Customers');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];

  if (!customer.id) customer.id = generateId();
  customer.createdAt = customer.createdAt || new Date().toISOString();
  customer.updatedAt = new Date().toISOString();

  // Check if exists
  for (let i = 1; i < data.length; i++) {
    if (data[i][headers.indexOf('id')] === customer.id) {
      // Update existing row
      const row = headers.map(h => customer[h] || '');
      sheet.getRange(i + 1, 1, 1, row.length).setValues([row]);
      logActivity({ type: 'customer', action: 'update', id: customer.id, name: customer.name });
      return { success: true, id: customer.id };
    }
  }

  // Add new row
  const row = headers.map(h => customer[h] || '');
  sheet.appendRow(row);
  logActivity({ type: 'customer', action: 'create', id: customer.id, name: customer.name });
  return { success: true, id: customer.id };
}

function deleteCustomer(id) {
  return deleteRow('Customers', id);
}

// ============================================================
//  QUOTATIONS
// ============================================================

function getQuotations(params) {
  const sheet = getSheet('Quotations');
  const itemSheet = getSheet('Quotation_Items');
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  const headers = data[0];

  let quotations = data.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });

  // Apply search filter
  if (params && params.search) {
    const q = params.search.toLowerCase();
    quotations = quotations.filter(r =>
      (r.quotationNo || '').toLowerCase().includes(q) ||
      (r.customerName || '').toLowerCase().includes(q) ||
      (r.projectName || '').toLowerCase().includes(q)
    );
  }

  // Attach items
  const itemData = itemSheet.getDataRange().getValues();
  if (itemData.length > 1) {
    const itemHeaders = itemData[0];
    const items = itemData.slice(1).map(row => {
      const obj = {};
      itemHeaders.forEach((h, i) => obj[h] = row[i]);
      return obj;
    });
    quotations.forEach(q => {
      q.items = items.filter(item => item.quotationId === q.id);
    });
  }

  return quotations;
}

function saveQuotation(quotation) {
  const sheet = getSheet('Quotations');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];

  if (!quotation.id) quotation.id = generateId();
  quotation.createdAt = quotation.createdAt || new Date().toISOString();
  quotation.updatedAt = new Date().toISOString();

  const items = quotation.items || [];
  delete quotation.items;

  // Save master record
  const row = headers.map(h => quotation[h] !== undefined ? quotation[h] : '');
  sheet.appendRow(row);

  // Save items
  saveQuotationItems(quotation.id, items);

  logActivity({ type: 'quotation', action: 'create', id: quotation.id, name: quotation.quotationNo });
  return { success: true, id: quotation.id };
}

function updateQuotation(quotation) {
  const sheet = getSheet('Quotations');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idIdx = headers.indexOf('id');

  quotation.updatedAt = new Date().toISOString();
  const items = quotation.items || [];
  delete quotation.items;

  for (let i = 1; i < data.length; i++) {
    if (data[i][idIdx] === quotation.id) {
      const row = headers.map(h => quotation[h] !== undefined ? quotation[h] : '');
      sheet.getRange(i + 1, 1, 1, row.length).setValues([row]);
      saveQuotationItems(quotation.id, items, true);
      logActivity({ type: 'quotation', action: 'update', id: quotation.id, name: quotation.quotationNo });
      return { success: true };
    }
  }
  return { error: 'Quotation not found' };
}

function deleteQuotation(id) {
  deleteItemsByParent('Quotation_Items', 'quotationId', id);
  return deleteRow('Quotations', id);
}

function saveQuotationItems(quotationId, items, clear) {
  const sheet = getSheet('Quotation_Items');
  if (clear) {
    deleteItemsByParent('Quotation_Items', 'quotationId', quotationId);
  }
  items.forEach((item, idx) => {
    sheet.appendRow([
      generateId(), quotationId, idx + 1,
      item.description || '', item.measurement || '', item.unit || '',
      item.quantity || 0, item.unitPrice || 0, item.amount || 0
    ]);
  });
}

// ============================================================
//  INVOICES
// ============================================================

function getInvoices(params) {
  const sheet = getSheet('Invoices');
  const itemSheet = getSheet('Invoice_Items');
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  const headers = data[0];

  let invoices = data.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });

  if (params && params.search) {
    const q = params.search.toLowerCase();
    invoices = invoices.filter(r =>
      (r.invoiceNo || '').toLowerCase().includes(q) ||
      (r.customerName || '').toLowerCase().includes(q) ||
      (r.projectName || '').toLowerCase().includes(q)
    );
  }

  const itemData = itemSheet.getDataRange().getValues();
  if (itemData.length > 1) {
    const itemHeaders = itemData[0];
    const items = itemData.slice(1).map(row => {
      const obj = {};
      itemHeaders.forEach((h, i) => obj[h] = row[i]);
      return obj;
    });
    invoices.forEach(inv => {
      inv.items = items.filter(item => item.invoiceId === inv.id);
    });
  }

  return invoices;
}

function saveInvoice(invoice) {
  const sheet = getSheet('Invoices');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];

  if (!invoice.id) invoice.id = generateId();
  invoice.createdAt = invoice.createdAt || new Date().toISOString();
  invoice.updatedAt = new Date().toISOString();

  const items = invoice.items || [];
  delete invoice.items;

  const row = headers.map(h => invoice[h] !== undefined ? invoice[h] : '');
  sheet.appendRow(row);
  saveInvoiceItems(invoice.id, items);

  logActivity({ type: 'invoice', action: 'create', id: invoice.id, name: invoice.invoiceNo });
  return { success: true, id: invoice.id };
}

function updateInvoice(invoice) {
  const sheet = getSheet('Invoices');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idIdx = headers.indexOf('id');

  invoice.updatedAt = new Date().toISOString();
  const items = invoice.items || [];
  delete invoice.items;

  for (let i = 1; i < data.length; i++) {
    if (data[i][idIdx] === invoice.id) {
      const row = headers.map(h => invoice[h] !== undefined ? invoice[h] : '');
      sheet.getRange(i + 1, 1, 1, row.length).setValues([row]);
      saveInvoiceItems(invoice.id, items, true);
      logActivity({ type: 'invoice', action: 'update', id: invoice.id, name: invoice.invoiceNo });
      return { success: true };
    }
  }
  return { error: 'Invoice not found' };
}

function deleteInvoice(id) {
  deleteItemsByParent('Invoice_Items', 'invoiceId', id);
  return deleteRow('Invoices', id);
}

function saveInvoiceItems(invoiceId, items, clear) {
  const sheet = getSheet('Invoice_Items');
  if (clear) deleteItemsByParent('Invoice_Items', 'invoiceId', invoiceId);
  items.forEach((item, idx) => {
    sheet.appendRow([
      generateId(), invoiceId, idx + 1,
      item.description || '', item.measurement || '', item.unit || '',
      item.quantity || 0, item.unitPrice || 0, item.amount || 0
    ]);
  });
}

// ============================================================
//  DASHBOARD
// ============================================================

function getDashboard() {
  const customers = getCustomers();
  const quotations = getQuotations({});
  const invoices = getInvoices({});
  const totalRevenue = invoices.filter(i => i.status === 'Paid').reduce((a, b) => a + (parseFloat(b.grandTotal) || 0), 0);
  return {
    totalCustomers: customers.length,
    totalQuotations: quotations.length,
    totalInvoices: invoices.length,
    totalRevenue,
    pendingQuotations: quotations.filter(q => q.status === 'Pending').length,
    recentQuotations: quotations.sort((a, b) => b.createdAt > a.createdAt ? 1 : -1).slice(0, 5),
    recentInvoices: invoices.sort((a, b) => b.createdAt > a.createdAt ? 1 : -1).slice(0, 5)
  };
}

// ============================================================
//  NUMBER GENERATORS
// ============================================================

function generateQuotationNumber() {
  const sheet = getSheet('Settings');
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === 'quotationCounter') {
      const counter = parseInt(data[i][1]) + 1;
      sheet.getRange(i + 1, 2).setValue(counter);
      const prefix = getSettingValue(sheet, 'quotationPrefix') || 'IWY-Q-';
      return prefix + String(counter).padStart(6, '0');
    }
  }
  return 'IWY-Q-000001';
}

function generateInvoiceNumber() {
  const sheet = getSheet('Settings');
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === 'invoiceCounter') {
      const counter = parseInt(data[i][1]) + 1;
      sheet.getRange(i + 1, 2).setValue(counter);
      const prefix = getSettingValue(sheet, 'invoicePrefix') || 'IWY-INV-';
      return prefix + String(counter).padStart(6, '0');
    }
  }
  return 'IWY-INV-000001';
}

function getSettingValue(sheet, key) {
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === key) return data[i][1];
  }
  return null;
}

// ============================================================
//  ACTIVITY LOG
// ============================================================

function logActivity(data) {
  const sheet = getSheet('Activity_Log');
  sheet.appendRow([new Date().toISOString(), data.type || '', data.action || '', data.id || '', data.name || '', data.user || 'admin']);
  return { success: true };
}

// ============================================================
//  HELPERS
// ============================================================

function deleteRow(sheetName, id) {
  const sheet = getSheet(sheetName);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idIdx = headers.indexOf('id');
  for (let i = data.length - 1; i >= 1; i--) {
    if (data[i][idIdx] === id) {
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }
  return { error: 'Record not found' };
}

function deleteItemsByParent(sheetName, parentKey, parentId) {
  const sheet = getSheet(sheetName);
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return;
  const headers = data[0];
  const pidIdx = headers.indexOf(parentKey);
  for (let i = data.length - 1; i >= 1; i--) {
    if (data[i][pidIdx] === parentId) sheet.deleteRow(i + 1);
  }
}

function generateId() {
  return Utilities.getUuid();
}

/* ===== STORE.JS - Local Storage Data Layer ===== */

const STORE = {
  // Keys
  KEYS: {
    customers: 'iwy_customers',
    quotations: 'iwy_quotations',
    invoices: 'iwy_invoices',
    settings: 'iwy_settings',
    activityLog: 'iwy_activity'
  },

  // ===== GENERIC HELPERS =====
  _get(key) {
    try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; }
  },
  _getObj(key) {
    try { return JSON.parse(localStorage.getItem(key)) || {}; } catch { return {}; }
  },
  _set(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  },

  // ===== SETTINGS =====
  getSettings() {
    const defaults = {
      companyName: 'IWY Designs',
      tagline: 'Excellence in Interior Design',
      address: 'Plot No:219/A, Road No:17 Jubilee Hills, Hyderabad, Telangana - 500033',
      phone: '+91-7893247799',
      email: 'info@iwydesigns.com',
      website: 'www.iwydesigns.com',
      gst: '36ABCDE1234F1Z5',
      currency: '₹',
      quotationPrefix: 'IWY-Q-',
      invoicePrefix: 'IWY-INV-',
      defaultGST: 18,
      defaultValidity: 30,
      bankName: 'UNION BANK OF INDIA',
      accountNo: '244311010000186',
      ifsc: 'UBIN0824437',
      accountHolder: 'IWY DESIGNS',
      authorizedSignatory: 'LAKSHMI PULAPARTHI',
      adminUsername: 'admin',
      adminPassword: 'iwy@2024',
      adminName: 'Lakshmi Pulaparthi',
      defaultTerms: '1. Prices are valid for the mentioned project only.\n2. Payment as per agreed schedule.\n3. Work commences after receiving advance payment.\n4. Any additional scope will be charged extra.',
      defaultPaymentTerms: '50% Advance at Purchase Order\n40% at material delivery\n10% Balance on completion',
      footerNote: 'Thank you for choosing IWY Designs. We look forward to transforming your space.',
      googleScriptUrl: '',
      quotationCounter: 0,
      invoiceCounter: 0
    };
    const stored = this._getObj(this.KEYS.settings);
    return { ...defaults, ...stored };
  },

  saveSettings(data) {
    const current = this.getSettings();
    this._set(this.KEYS.settings, { ...current, ...data });
  },

  // ===== NUMBER GENERATORS =====
  generateQuotationNumber() {
    const s = this.getSettings();
    const counter = (s.quotationCounter || 0) + 1;
    this.saveSettings({ quotationCounter: counter });
    return s.quotationPrefix + String(counter).padStart(6, '0');
  },

  generateInvoiceNumber() {
    const s = this.getSettings();
    const counter = (s.invoiceCounter || 0) + 1;
    this.saveSettings({ invoiceCounter: counter });
    return s.invoicePrefix + String(counter).padStart(6, '0');
  },

  // ===== CUSTOMERS =====
  getCustomers() { return this._get(this.KEYS.customers); },
  getAllCustomers() { return this.getCustomers(); },

  getCustomer(id) {
    return this.getCustomers().find(c => c.id === id);
  },

  saveCustomer(data) {
    const customers = this.getCustomers();
    if (data.id) {
      const idx = customers.findIndex(c => c.id === data.id);
      if (idx >= 0) {
        customers[idx] = { ...customers[idx], ...data, updatedAt: new Date().toISOString() };
      }
    } else {
      const newCustomer = {
        ...data,
        id: 'CUST-' + Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      customers.push(newCustomer);
      data.id = newCustomer.id;
    }
    this._set(this.KEYS.customers, customers);
    this.log('customer', data.id, data.name || 'Customer', data.id ? 'updated' : 'created');
    return data.id;
  },

  deleteCustomer(id) {
    const customers = this.getCustomers().filter(c => c.id !== id);
    this._set(this.KEYS.customers, customers);
    this.log('customer', id, 'Customer', 'deleted');
  },

  searchCustomers(query) {
    if (!query) return this.getCustomers();
    const q = query.toLowerCase();
    return this.getCustomers().filter(c =>
      (c.name || '').toLowerCase().includes(q) ||
      (c.company || '').toLowerCase().includes(q) ||
      (c.phone || '').includes(q) ||
      (c.email || '').toLowerCase().includes(q) ||
      (c.city || '').toLowerCase().includes(q)
    );
  },

  // ===== QUOTATIONS =====
  getQuotations() { return this._get(this.KEYS.quotations); },
  getAllQuotations() { return this.getQuotations(); },

  getQuotation(id) {
    return this.getQuotations().find(q => q.id === id);
  },

  saveQuotation(data) {
    const quotations = this.getQuotations();
    const isNew = !data.id;
    if (isNew) {
      data.id = 'QT-' + Date.now();
      data.quotationNumber = data.quotationNumber || this.generateQuotationNumber();
      data.createdAt = new Date().toISOString();
      data.status = data.status || 'Draft';
    }
    data.updatedAt = new Date().toISOString();
    if (isNew) {
      quotations.push(data);
    } else {
      const idx = quotations.findIndex(q => q.id === data.id);
      if (idx >= 0) quotations[idx] = { ...quotations[idx], ...data };
      else quotations.push(data);
    }
    this._set(this.KEYS.quotations, quotations);
    this.log('quotation', data.id, data.quotationNumber, isNew ? 'created' : 'updated');
    return data.id;
  },

  deleteQuotation(id) {
    const q = this.getQuotation(id);
    const quotations = this.getQuotations().filter(qt => qt.id !== id);
    this._set(this.KEYS.quotations, quotations);
    this.log('quotation', id, q?.quotationNumber || id, 'deleted');
  },

  searchQuotations(query) {
    if (!query) return this.getQuotations();
    const q = query.toLowerCase();
    return this.getQuotations().filter(qt =>
      (qt.quotationNumber || '').toLowerCase().includes(q) ||
      (qt.customerName || '').toLowerCase().includes(q) ||
      (qt.projectName || '').toLowerCase().includes(q) ||
      (qt.customerPhone || '').includes(q) ||
      (qt.status || '').toLowerCase().includes(q)
    );
  },

  // ===== INVOICES =====
  getInvoices() { return this._get(this.KEYS.invoices); },
  getAllInvoices() { return this.getInvoices(); },

  getInvoice(id) {
    return this.getInvoices().find(i => i.id === id);
  },

  saveInvoice(data) {
    const invoices = this.getInvoices();
    const isNew = !data.id;
    if (isNew) {
      data.id = 'INV-' + Date.now();
      data.invoiceNumber = data.invoiceNumber || this.generateInvoiceNumber();
      data.createdAt = new Date().toISOString();
      data.status = data.status || 'Unpaid';
    }
    data.updatedAt = new Date().toISOString();
    if (isNew) {
      invoices.push(data);
    } else {
      const idx = invoices.findIndex(i => i.id === data.id);
      if (idx >= 0) invoices[idx] = { ...invoices[idx], ...data };
      else invoices.push(data);
    }
    this._set(this.KEYS.invoices, invoices);
    // Update linked quotation status
    if (data.quotationId) {
      const qt = this.getQuotation(data.quotationId);
      if (qt) this.saveQuotation({ ...qt, status: 'Invoiced' });
    }
    this.log('invoice', data.id, data.invoiceNumber, isNew ? 'created' : 'updated');
    return data.id;
  },

  deleteInvoice(id) {
    const inv = this.getInvoice(id);
    const invoices = this.getInvoices().filter(i => i.id !== id);
    this._set(this.KEYS.invoices, invoices);
    this.log('invoice', id, inv?.invoiceNumber || id, 'deleted');
  },

  searchInvoices(query) {
    if (!query) return this.getInvoices();
    const q = query.toLowerCase();
    return this.getInvoices().filter(inv =>
      (inv.invoiceNumber || '').toLowerCase().includes(q) ||
      (inv.customerName || '').toLowerCase().includes(q) ||
      (inv.projectName || '').toLowerCase().includes(q) ||
      (inv.customerPhone || '').includes(q) ||
      (inv.status || '').toLowerCase().includes(q)
    );
  },

  // ===== DASHBOARD STATS =====
  getDashboard() {
    const customers = this.getCustomers();
    const quotations = this.getQuotations();
    const invoices = this.getInvoices();

    const totalRevenue = invoices
      .filter(i => i.status === 'Paid')
      .reduce((sum, i) => sum + (parseFloat(i.grandTotal) || 0), 0);

    const pendingRevenue = invoices
      .filter(i => i.status === 'Unpaid')
      .reduce((sum, i) => sum + (parseFloat(i.grandTotal) || 0), 0);

    const thisMonth = new Date();
    const monthStart = new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 1).toISOString();

    return {
      totalCustomers: customers.length,
      totalQuotations: quotations.length,
      totalInvoices: invoices.length,
      totalRevenue,
      pendingRevenue,
      pendingQuotations: quotations.filter(q => q.status === 'Draft' || q.status === 'Sent').length,
      recentQuotations: [...quotations].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5),
      recentInvoices: [...invoices].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5),
      monthlyRevenue: invoices
        .filter(i => i.status === 'Paid' && i.createdAt >= monthStart)
        .reduce((sum, i) => sum + (parseFloat(i.grandTotal) || 0), 0)
    };
  },

  // ===== ACTIVITY LOG =====
  log(type, id, label, action) {
    const logs = this._get(this.KEYS.activityLog);
    logs.unshift({ type, id, label, action, time: new Date().toISOString() });
    if (logs.length > 200) logs.splice(200);
    this._set(this.KEYS.activityLog, logs);
  },

  getLogs() { return this._get(this.KEYS.activityLog); }
};

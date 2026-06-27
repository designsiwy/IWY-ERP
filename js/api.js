/* ===== API.JS - Google Apps Script Integration ===== */

const API = {
  get url() { return STORE.getSettings().googleScriptUrl; },

  async call(action, data = {}) {
    const url = this.url;
    if (!url) return null; // Fallback to local store

    try {
      const payload = { action, ...data };
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error('API error: ' + response.status);
      const result = await response.json();
      return result;
    } catch (err) {
      console.warn('Google API call failed, using local store:', err);
      return null;
    }
  },

  // ===== CUSTOMERS =====
  async getCustomers() {
    const r = await this.call('getCustomers');
    return r ? r.data : STORE.getCustomers();
  },

  async saveCustomer(data) {
    const r = await this.call('saveCustomer', { customer: data });
    if (!r) STORE.saveCustomer(data);
    return r ? r.id : data.id;
  },

  async deleteCustomer(id) {
    const r = await this.call('deleteCustomer', { id });
    if (!r) STORE.deleteCustomer(id);
  },

  // ===== QUOTATIONS =====
  async getQuotations() {
    const r = await this.call('getQuotations');
    return r ? r.data : STORE.getQuotations();
  },

  async saveQuotation(data) {
    const r = await this.call('saveQuotation', { quotation: data });
    if (!r) STORE.saveQuotation(data);
    return r ? r.id : data.id;
  },

  async deleteQuotation(id) {
    const r = await this.call('deleteQuotation', { id });
    if (!r) STORE.deleteQuotation(id);
  },

  // ===== INVOICES =====
  async getInvoices() {
    const r = await this.call('getInvoices');
    return r ? r.data : STORE.getInvoices();
  },

  async saveInvoice(data) {
    const r = await this.call('saveInvoice', { invoice: data });
    if (!r) STORE.saveInvoice(data);
    return r ? r.id : data.id;
  },

  async deleteInvoice(id) {
    const r = await this.call('deleteInvoice', { id });
    if (!r) STORE.deleteInvoice(id);
  },

  // ===== DASHBOARD =====
  async getDashboard() {
    const r = await this.call('getDashboard');
    return r ? r.data : STORE.getDashboard();
  }
};

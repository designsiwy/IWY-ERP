/* ===== UTILS.JS ===== */

const UTILS = {
  // ===== FORMAT CURRENCY =====
  formatCurrency(amount, currency) {
    const s = STORE.getSettings();
    const sym = currency || s.currency || '₹';
    const num = parseFloat(amount) || 0;
    return sym + ' ' + num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  },

  formatNum(n) {
    return (parseFloat(n) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  },

  // ===== AMOUNT IN WORDS =====
  amountInWords(amount) {
    const num = Math.round(parseFloat(amount) || 0);
    const paise = Math.round(((parseFloat(amount) || 0) - num) * 100);

    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
      'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    function convert(n) {
      if (n === 0) return '';
      if (n < 20) return ones[n];
      if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
      if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + convert(n % 100) : '');
      if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + convert(n % 1000) : '');
      if (n < 10000000) return convert(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + convert(n % 100000) : '');
      return convert(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + convert(n % 10000000) : '');
    }

    if (num === 0) return 'Zero Rupees Only';
    let words = convert(num) + ' Rupee' + (num !== 1 ? 's' : '');
    if (paise > 0) words += ' and ' + convert(paise) + ' Paise';
    words += ' Only';
    return words;
  },

  // ===== DATE FORMATTING =====
  formatDate(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  },

  formatDateTime(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })
      + ' ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  },

  toDateInput(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return d.toISOString().split('T')[0];
  },

  todayISO() {
    return new Date().toISOString().split('T')[0];
  },

  validityDate(days) {
    const d = new Date();
    d.setDate(d.getDate() + (parseInt(days) || 30));
    return d.toISOString().split('T')[0];
  },

  // ===== TOAST NOTIFICATIONS =====
  toast(msg, type = 'default', duration = 3500) {
    const container = document.getElementById('toast-container') || (() => {
      const c = document.createElement('div');
      c.id = 'toast-container';
      document.body.appendChild(c);
      return c;
    })();

    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerHTML = `
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        ${type === 'success' ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>' :
          type === 'error' ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>' :
          '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>'}
      </svg>
      <span>${msg}</span>`;
    container.appendChild(t);
    setTimeout(() => {
      t.style.opacity = '0';
      t.style.transform = 'translateX(20px)';
      t.style.transition = 'all 0.3s';
      setTimeout(() => t.remove(), 300);
    }, duration);
  },

  // ===== MODAL HELPERS =====
  openModal(id) {
    const m = document.getElementById(id);
    if (m) { m.classList.add('open'); document.body.style.overflow = 'hidden'; }
  },

  closeModal(id) {
    const m = document.getElementById(id);
    if (m) { m.classList.remove('open'); document.body.style.overflow = ''; }
  },

  closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => {
      m.classList.remove('open');
    });
    document.body.style.overflow = '';
  },

  // ===== STATUS BADGE =====
  statusBadge(status) {
    const map = {
      'Draft': 'badge-gray',
      'Sent': 'badge-blue',
      'Approved': 'badge-green',
      'Rejected': 'badge-red',
      'Invoiced': 'badge-navy',
      'Expired': 'badge-orange',
      'Paid': 'badge-green',
      'Unpaid': 'badge-red',
      'Partial': 'badge-orange',
      'Cancelled': 'badge-gray'
    };
    return `<span class="badge ${map[status] || 'badge-gray'}">${status || '-'}</span>`;
  },

  // ===== CONFIRM DIALOG =====
  confirm(msg, title = 'Confirm') {
    return new Promise(resolve => {
      const el = document.getElementById('confirm-modal');
      if (!el) {
        resolve(window.confirm(msg));
        return;
      }
      document.getElementById('confirm-title').textContent = title;
      document.getElementById('confirm-msg').textContent = msg;
      this.openModal('confirm-modal');
      const yes = document.getElementById('confirm-yes');
      const no = document.getElementById('confirm-no');
      const handler = (result) => {
        this.closeModal('confirm-modal');
        yes.replaceWith(yes.cloneNode(true));
        no.replaceWith(no.cloneNode(true));
        resolve(result);
      };
      document.getElementById('confirm-yes').onclick = () => handler(true);
      document.getElementById('confirm-no').onclick = () => handler(false);
    });
  },

  // ===== CALCULATE ITEM AMOUNT =====
  calcItem(qty, unitPrice) {
    return (parseFloat(qty) || 0) * (parseFloat(unitPrice) || 0);
  },

  // ===== CALCULATE TOTALS =====
  calcTotals(items, discountPct, gstPct) {
    const subtotal = items.reduce((s, i) => s + (parseFloat(i.amount) || 0), 0);
    const discountAmt = subtotal * ((parseFloat(discountPct) || 0) / 100);
    const taxable = subtotal - discountAmt;
    const gstAmt = taxable * ((parseFloat(gstPct) || 0) / 100);
    const preRound = taxable + gstAmt;
    const roundOff = Math.round(preRound) - preRound;
    const grandTotal = Math.round(preRound);
    return { subtotal, discountAmt, taxable, gstAmt, roundOff, grandTotal };
  },

  // ===== ESCAPE HTML =====
  esc(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  },

  // ===== GENERATE UNIQUE ID =====
  uid() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },

  // ===== HIGHLIGHT SEARCH TERM =====
  highlight(text, query) {
    if (!query) return this.esc(text);
    const escaped = this.esc(text);
    const q = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return escaped.replace(new RegExp(q, 'gi'), m => `<mark>${m}</mark>`);
  },

  // ===== DEBOUNCE =====
  debounce(fn, delay) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
  },

  // ===== FORMAT NUMBER (compact, no currency symbol) =====
  formatNumber(n) {
    return (parseFloat(n) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  },

  // ===== DOWNLOAD CSV STRING =====
  downloadCSV(csvString, filename) {
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  },

  // ===== SHOW TOAST (alias for toast) =====
  showToast(msg, type) {
    this.toast(msg, type || 'default');
  },

  // ===== EXPORT CSV =====
  exportCSV(data, filename) {
    if (!data.length) return;
    const headers = Object.keys(data[0]);
    const csv = [headers.join(','),
      ...data.map(row => headers.map(h => `"${(row[h] || '').toString().replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename + '.csv';
    a.click();
    URL.revokeObjectURL(url);
  },

  // ===== PRINT ELEMENT =====
  printElement(el) {
    const w = window.open('', '_blank');
    w.document.write(`
      <html><head><title>IWY Designs</title>
      <link rel="stylesheet" href="css/print.css">
      <style>body{margin:0;font-family:'Segoe UI',Arial,sans-serif;}</style>
      </head><body>${el.outerHTML}</body></html>`);
    w.document.close();
    w.focus();
    setTimeout(() => { w.print(); w.close(); }, 500);
  }
};

// Close modals on overlay click
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) {
    UTILS.closeAllModals();
  }
});

// ESC key closes modals
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') UTILS.closeAllModals();
});

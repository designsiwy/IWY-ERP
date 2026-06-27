/* ===== PDF.JS - PDF Generation ===== */

const PDF = {
  // Build document HTML (used for both preview and print)
  buildDocHTML(data, type = 'quotation') {
    const s = STORE.getSettings();
    const isInvoice = type === 'invoice';
    const docLabel = isInvoice ? 'INVOICE' : 'QUOTATION';
    const docNum = isInvoice ? data.invoiceNumber : data.quotationNumber;

    const items = data.items || [];
    const totals = UTILS.calcTotals(items, data.discountPct, data.gstPct);

    const itemRows = items.map((item, i) => `
      <tr>
        <td class="sno-cell center">${i + 1}</td>
        <td>${UTILS.esc(item.description || '')}</td>
        <td class="center">${UTILS.esc(item.measurement || '')}</td>
        <td class="center">${UTILS.esc(item.unit || '')}</td>
        <td class="center">${UTILS.esc(item.qty || '')}</td>
        <td class="right">${UTILS.formatNum(item.unitPrice)}</td>
        <td class="right">${UTILS.formatNum(item.amount)}</td>
      </tr>`).join('');

    const termsHTML = (data.terms || s.defaultTerms || '').split('\n')
      .filter(t => t.trim())
      .map((t, i) => `<li>${UTILS.esc(t.replace(/^\d+\.\s*/, ''))}</li>`).join('');

    const paymentText = data.paymentTerms || s.defaultPaymentTerms || '';

    return `
<div class="pdf-doc" id="pdf-document" style="position:relative;overflow:hidden;">
  
  <div class="pdf-watermark">IWY DESIGNS</div>

  <!-- HEADER -->
  <div class="pdf-header">
    <div class="pdf-logo">
      <img src="${LOGO_WHITE}" alt="IWY Designs" />
    </div>
    <div class="pdf-company-info">
      <h1>${UTILS.esc(s.companyName)}</h1>
      <p>${UTILS.esc(s.address)}<br>
      Phone: ${UTILS.esc(s.phone)} | Email: ${UTILS.esc(s.email)}<br>
      Website: ${UTILS.esc(s.website)} | GST: ${UTILS.esc(s.gst)}</p>
    </div>
  </div>

  <!-- DOC TYPE BANNER -->
  <div class="pdf-doc-type-banner">
    <div class="pdf-doc-type">${docLabel}</div>
    <div class="pdf-doc-meta">
      <strong>${UTILS.esc(docNum || '-')}</strong>
      Date: ${UTILS.formatDate(data.date || data.quotationDate || data.invoiceDate)}
      ${!isInvoice && data.validUntil ? `<br>Valid Until: ${UTILS.formatDate(data.validUntil)}` : ''}
      ${isInvoice && data.quotationNumber ? `<br>Ref: ${UTILS.esc(data.quotationNumber)}` : ''}
    </div>
  </div>

  <!-- BODY -->
  <div class="pdf-body">

    <!-- CLIENT + PROJECT INFO -->
    <div class="pdf-info-grid">
      <div class="pdf-info-box">
        <div class="pdf-info-box-header">Bill To</div>
        <div class="pdf-info-box-body">
          <strong>${UTILS.esc(data.customerName || '-')}</strong>
          ${data.customerCompany ? `<span>${UTILS.esc(data.customerCompany)}</span><br>` : ''}
          ${data.siteAddress ? UTILS.esc(data.siteAddress) + '<br>' : (data.customerAddress ? UTILS.esc(data.customerAddress) + '<br>' : '')}
          ${data.customerPhone ? `📞 ${UTILS.esc(data.customerPhone)}<br>` : ''}
          ${data.customerEmail ? `✉ ${UTILS.esc(data.customerEmail)}<br>` : ''}
          ${data.customerGst ? `GST: ${UTILS.esc(data.customerGst)}` : ''}
        </div>
      </div>
      <div class="pdf-info-box">
        <div class="pdf-info-box-header">Project Details</div>
        <div class="pdf-info-box-body">
          <strong>${UTILS.esc(data.projectName || '-')}</strong>
          ${data.siteAddress ? `Site: ${UTILS.esc(data.siteAddress)}<br>` : ''}
          ${!isInvoice && data.validUntil ? `<span style="color:#c9a84c;font-weight:600;">Valid until: ${UTILS.formatDate(data.validUntil)}</span><br>` : ''}
          ${data.remarks ? `<em>${UTILS.esc(data.remarks)}</em>` : ''}
        </div>
      </div>
    </div>

    <!-- ITEMS TABLE -->
    <table class="pdf-items-table">
      <thead>
        <tr>
          <th class="center" style="width:32px">S.No</th>
          <th>Description</th>
          <th class="center" style="width:70px">Size</th>
          <th class="center" style="width:46px">Unit</th>
          <th class="center" style="width:40px">Qty</th>
          <th class="right" style="width:80px">Rate (₹)</th>
          <th class="right" style="width:90px">Amount (₹)</th>
        </tr>
      </thead>
      <tbody>
        ${itemRows || '<tr><td colspan="7" style="text-align:center;color:#aaa;padding:20px;">No items</td></tr>'}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="6" class="right" style="background:#f8f6f0;font-weight:600;padding:7px 10px;">Sub Total</td>
          <td class="right" style="background:#f8f6f0;font-weight:600;">${UTILS.formatNum(totals.subtotal)}</td>
        </tr>
        ${totals.discountAmt > 0 ? `<tr>
          <td colspan="6" class="right" style="color:#c53030;padding:5px 10px;">Discount (${data.discountPct}%)</td>
          <td class="right" style="color:#c53030;">- ${UTILS.formatNum(totals.discountAmt)}</td>
        </tr>` : ''}
        ${totals.gstAmt > 0 ? `<tr>
          <td colspan="6" class="right" style="padding:5px 10px;">GST (${data.gstPct}%)</td>
          <td class="right">${UTILS.formatNum(totals.gstAmt)}</td>
        </tr>` : ''}
        ${totals.roundOff !== 0 ? `<tr>
          <td colspan="6" class="right" style="padding:5px 10px;">Round Off</td>
          <td class="right">${totals.roundOff >= 0 ? '+' : ''}${UTILS.formatNum(totals.roundOff)}</td>
        </tr>` : ''}
      </tfoot>
    </table>

    <!-- TOTALS -->
    <div class="pdf-totals-section">
      <div class="pdf-totals-box">
        <table>
          <tr><td>Sub Total</td><td>${s.currency || '₹'} ${UTILS.formatNum(totals.subtotal)}</td></tr>
          ${totals.discountAmt > 0 ? `<tr><td style="color:#c53030">Discount</td><td style="color:#c53030">- ${s.currency || '₹'} ${UTILS.formatNum(totals.discountAmt)}</td></tr>` : ''}
          ${totals.gstAmt > 0 ? `<tr><td>GST (${data.gstPct}%)</td><td>${s.currency || '₹'} ${UTILS.formatNum(totals.gstAmt)}</td></tr>` : ''}
          ${totals.roundOff !== 0 ? `<tr><td>Round Off</td><td>${totals.roundOff >= 0 ? '+' : ''}${UTILS.formatNum(totals.roundOff)}</td></tr>` : ''}
          <tr class="grand-total-row">
            <td style="color:white;">GRAND TOTAL</td>
            <td style="color:#c9a84c;">${s.currency || '₹'} ${UTILS.formatNum(totals.grandTotal)}</td>
          </tr>
        </table>
      </div>
    </div>

    <!-- AMOUNT IN WORDS -->
    <div class="pdf-amount-words">
      Amount in Words: <span>${UTILS.amountInWords(totals.grandTotal)}</span>
    </div>

    <!-- PAYMENT DETAILS -->
    <div class="pdf-payment">
      <strong>PAYMENT DETAILS</strong>
      All payments to be made in favour of ${UTILS.esc(s.accountHolder || s.companyName)}<br>
      A/C No: <strong>${UTILS.esc(s.accountNo)}</strong> &nbsp;|&nbsp; 
      Bank: <strong>${UTILS.esc(s.bankName)}</strong> &nbsp;|&nbsp; 
      IFSC: <strong>${UTILS.esc(s.ifsc)}</strong>
      ${paymentText ? '<br><br>' + UTILS.esc(paymentText).replace(/\n/g, '<br>') : ''}
    </div>

    <!-- TERMS -->
    ${termsHTML ? `<div class="pdf-terms">
      <div class="pdf-terms-title">Terms & Conditions</div>
      <ol>${termsHTML}</ol>
    </div>` : ''}

    <!-- SIGNATURE -->
    <div class="pdf-signature">
      <div>
        <p style="font-size:8pt;color:#718096;">${UTILS.esc(s.footerNote || '')}</p>
      </div>
      <div class="pdf-sig-box">
        <div class="pdf-sig-line"></div>
        <strong>For ${UTILS.esc(s.companyName)}</strong>
        <p>${UTILS.esc(s.authorizedSignatory)}</p>
        <p>Authorized Signatory</p>
      </div>
    </div>

  </div>

  <!-- FOOTER -->
  <div class="pdf-footer">
    <p class="gold-text">${UTILS.esc(s.companyName)} | ${UTILS.esc(s.website)}</p>
    <p>${UTILS.esc(s.phone)} | ${UTILS.esc(s.email)}</p>
    <p>Page 1 of 1</p>
  </div>

</div>`;
  },

  // Preview in modal
  preview(data, type = 'quotation') {
    const html = this.buildDocHTML(data, type);
    const previewEl = document.getElementById('pdf-preview-content');
    if (previewEl) {
      previewEl.innerHTML = html;
      UTILS.openModal('pdf-preview-modal');
    }
  },

  // Print document
  print(data, type = 'quotation') {
    const html = this.buildDocHTML(data, type);
    const w = window.open('', '_blank', 'width=900,height=700');
    w.document.write(`<!DOCTYPE html>
<html><head>
  <meta charset="UTF-8">
  <title>${type === 'invoice' ? 'Invoice' : 'Quotation'} - IWY Designs</title>
  <style>
    @page { size: A4; margin: 0; }
    body { margin: 0; background: white; }
  </style>
  <link rel="stylesheet" href="${window.location.origin}${window.location.pathname.replace(/[^/]*$/, '')}css/print.css">
</head>
<body>
  <script>
    const LOGO_WHITE = "${LOGO_WHITE}";
    const LOGO_MAIN = "${LOGO_MAIN}";
    const LOGO_MONO = "${LOGO_MONO}";
  <\/script>
  ${html}
  <script>window.onload = function(){ window.print(); }<\/script>
</body></html>`);
    w.document.close();
  },

  // Download as PDF using browser print-to-PDF
  download(data, type = 'quotation') {
    this.print(data, type);
    UTILS.toast('Print dialog opened. Choose "Save as PDF" to download.', 'info');
  }
};

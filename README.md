# IWY Designs ERP System

A complete Quotation & Invoice Management System for IWY Designs, built as a pure frontend application hosted on GitHub Pages with optional Google Sheets backend.

---

## 🏗️ Architecture

```
Frontend (GitHub Pages)          Backend (Optional)
─────────────────────────        ──────────────────────
HTML + CSS + JavaScript    ←→    Google Apps Script Web API
localStorage (primary DB)        Google Sheets (cloud backup)
```

---

## 📁 Project Structure

```
IWY-ERP/
├── index.html           → Redirects to login
├── login.html           → Admin login
├── dashboard.html       → Business overview & quick actions
├── customers.html       → Customer management
├── quotations.html      → Quotation builder & management
├── invoices.html        → Invoice management
├── reports.html         → Analytics & CSV export
├── settings.html        → System configuration
│
├── css/
│   ├── style.css        → Main stylesheet (Navy/Gold theme)
│   └── print.css        → PDF/print styles
│
├── js/
│   ├── logos.js         → Base64 encoded logos
│   ├── auth.js          → Session management
│   ├── store.js         → localStorage data layer
│   ├── utils.js         → Utility functions
│   ├── api.js           → Google Apps Script integration
│   ├── nav.js           → Navigation builder
│   └── pdf.js           → PDF/print document builder
│
└── apps-script/
    ├── Code.gs          → Web App entry points
    ├── API.gs           → CRUD operations
    ├── Sheets.gs        → Sheet initialization
    └── README.md        → Backend setup guide
```

---

## 🚀 Deployment (GitHub Pages)

### Option 1: GitHub Pages (Recommended)

1. Create a new GitHub repository
2. Upload all files maintaining the folder structure
3. Go to **Settings** → **Pages**
4. Set Source to **Deploy from a branch** → `main` → `/ (root)`
5. Your ERP will be live at `https://yourusername.github.io/IWY-ERP/`

### Option 2: Local / Any Web Server

Simply serve the folder from any static web server or open `index.html` in a browser.

---

## 🔐 Default Login

| Field | Value |
|-------|-------|
| Username | `admin` |
| Password | `iwy@2024` |

Change these in **Settings → Admin Login** after first access.

---

## ✨ Features

### Customer Module
- Add, edit, delete customers
- Search by name, phone, company
- Filter by city
- View quotation/invoice history per customer
- CSV export

### Quotation Module
- Auto-generated numbering (IWY-Q-000001...)
- Dynamic item table — add/delete/duplicate rows
- Custom units (SFT, SQFT, RFT, MTR, NOS, KG, or any)
- Auto-calculated: subtotal, discount, GST 18%, round-off, grand total
- Amount in words (Indian numbering: Lakh/Crore)
- Status: Draft → Sent → Approved → Invoiced
- **Convert to Invoice** (one-click, retains reference)
- PDF preview & print

### Invoice Module
- Always linked to a source quotation
- Auto-populated from quotation data
- Status tracking: Unpaid / Paid / Partial / Cancelled
- Quick status update
- PDF preview & print

### Reports
- Quotation Report with filters
- Invoice Report with revenue analysis
- Customer Report (activity + revenue)
- Monthly Revenue trend chart
- CSV export for each report

### Settings
- Company info & branding
- Document numbering prefixes & counters
- Bank details (for PDF payment section)
- Terms & conditions, payment terms, footer
- GST % and currency
- Admin credentials
- Google Sheets integration URL
- Data export/import (JSON backup)
- Full data reset

### PDF Documents
- A4 format with company letterhead
- IWY Designs logo (Navy/Gold branding)
- "IWY DESIGNS" watermark
- Professional line-item table
- Totals section with GST breakdown
- Amount in words (Indian numbering)
- Payment details (bank account)
- Authorized signature block
- Terms & conditions

---

## 🔗 Google Sheets Integration (Optional)

Data is stored locally in `localStorage` by default. To also sync to Google Sheets:

1. Follow the guide in `apps-script/README.md`
2. Paste the Web App URL in **Settings → Integration**
3. Test the connection

---

## 🎨 Brand Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Navy Blue | `#1a2a4a` | Headers, sidebar, primary |
| Gold | `#c9a84c` | Accents, highlights |
| White | `#ffffff` | Backgrounds, text on navy |

---

## 📋 Business Details Pre-configured

- **Company**: IWY Designs
- **Address**: Plot No:219/A Road No:17 Jubilee Hills, Hyderabad, Telangana-500033
- **Phone**: +91-7893247799
- **Website**: www.iwydesigns.com
- **Bank**: Union Bank of India, A/C: 244311010000186, IFSC: UBIN0824437
- **Signatory**: Lakshmi Pulaparthi
- **Default GST**: 18%
- **Payment Terms**: 50% advance / 40% material delivery / 10% on completion

All configurable in Settings.

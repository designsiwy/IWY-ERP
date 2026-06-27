# IWY Designs ERP — Google Apps Script Backend

## Overview

The backend consists of three `.gs` files that power a REST API via Google Apps Script Web App, with Google Sheets as the database.

---

## Files

| File | Purpose |
|------|---------|
| `Code.gs` | Web App entry points (`doGet`, `doPost`) |
| `API.gs` | CRUD operations for Customers, Quotations, Invoices |
| `Sheets.gs` | Sheet initialization and schema definitions |

---

## Setup Instructions

### Step 1 — Create the Apps Script Project

1. Go to [script.google.com](https://script.google.com)
2. Click **New project**
3. Rename the project to `IWY Designs ERP`

### Step 2 — Add the Files

1. In the editor, rename `Code.gs` to `Code`
2. Paste the contents of `Code.gs` into it
3. Click **+** next to Files → Script
4. Name it `API`, paste `API.gs` contents
5. Create another file named `Sheets`, paste `Sheets.gs` contents

### Step 3 — Run Initial Setup

1. In the editor, select the `setup` function from the dropdown
2. Click **▷ Run**
3. Grant permissions when prompted
4. Check the **Logs** (Ctrl+Enter) — you'll see the Spreadsheet URL

### Step 4 — Deploy as Web App

1. Click **Deploy** → **New deployment**
2. Click the gear icon next to "Type" → select **Web app**
3. Set:
   - **Description**: IWY ERP v1.0
   - **Execute as**: Me
   - **Who has access**: Anyone
4. Click **Deploy**
5. **Copy the Web App URL**

### Step 5 — Connect to the Frontend

1. In the ERP app, go to **Settings** → **Integration**
2. Paste the Web App URL
3. Click **Test Connection** to verify
4. Click **Save All Settings**

---

## API Endpoints

### GET Requests

| Action | Description |
|--------|-------------|
| `?action=ping` | Health check |
| `?action=getDashboard` | Dashboard statistics |
| `?action=getCustomers` | All customers |
| `?action=getQuotations` | All quotations (with items) |
| `?action=getQuotations&search=term` | Search quotations |
| `?action=getInvoices` | All invoices (with items) |
| `?action=getInvoices&search=term` | Search invoices |
| `?action=generateQuotationNumber` | Next quotation number |
| `?action=generateInvoiceNumber` | Next invoice number |

### POST Requests

Send JSON body with `action` field:

```json
{ "action": "saveCustomer", "data": { ... } }
{ "action": "saveQuotation", "data": { ... } }
{ "action": "updateQuotation", "data": { ... } }
{ "action": "deleteQuotation", "id": "..." }
{ "action": "saveInvoice", "data": { ... } }
{ "action": "updateInvoice", "data": { ... } }
{ "action": "deleteInvoice", "id": "..." }
{ "action": "deleteCustomer", "id": "..." }
{ "action": "logActivity", "data": { ... } }
```

---

## Google Sheets Structure

| Sheet Name | Purpose |
|------------|---------|
| `Customers` | Customer master records |
| `Quotations` | Quotation headers |
| `Quotation_Items` | Line items per quotation |
| `Invoices` | Invoice headers |
| `Invoice_Items` | Line items per invoice |
| `Settings` | Configuration key-value pairs |
| `Activity_Log` | Audit trail |

---

## Notes

- The frontend works fully offline using **localStorage** — Google Sheets is optional backup
- All data from localStorage can be exported as JSON (Settings → Data Management)
- The Apps Script URL is stored in Settings and survives browser sessions

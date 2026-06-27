/* ===== NAV.JS - Shared Navigation Builder ===== */

function buildNav(activePage) {
  const navItems = [
    { page: 'dashboard', label: 'Dashboard', href: 'dashboard.html', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>' },
    { page: 'customers', label: 'Customers', href: 'customers.html', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>' },
    { page: 'quotations', label: 'Quotations', href: 'quotations.html', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>' },
    { page: 'invoices', label: 'Invoices', href: 'invoices.html', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>' },
    { page: 'reports', label: 'Reports', href: 'reports.html', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>' },
    { page: 'settings', label: 'Settings', href: 'settings.html', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>' }
  ];

  const s = STORE.getSettings();
  const session = AUTH.getSession();

  return `
<div class="sidebar" id="sidebar">
  <div class="sidebar-logo">
    <img src="${LOGO_WHITE}" alt="IWY Designs">
    <div class="logo-text">
      ERP SYSTEM
      <span>IWY Designs</span>
    </div>
  </div>
  <nav class="sidebar-nav">
    <div class="nav-section">
      <div class="nav-label">Main Menu</div>
      ${navItems.slice(0, 4).map(item => `
        <a href="${item.href}" class="nav-item ${activePage === item.page ? 'active' : ''}">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">${item.icon}</svg>
          ${item.label}
        </a>`).join('')}
    </div>
    <div class="nav-section">
      <div class="nav-label">Management</div>
      ${navItems.slice(4).map(item => `
        <a href="${item.href}" class="nav-item ${activePage === item.page ? 'active' : ''}">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">${item.icon}</svg>
          ${item.label}
        </a>`).join('')}
    </div>
  </nav>
  <div class="sidebar-footer">
    <div class="user-info">
      <div class="user-avatar" id="user-avatar">${(session?.name || 'A')[0].toUpperCase()}</div>
      <div class="user-details">
        <div class="name" id="user-name">${session?.name || session?.username || 'Admin'}</div>
        <div class="role">Administrator</div>
      </div>
    </div>
    <button class="btn-logout" onclick="AUTH.logout()">
      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
      </svg>
      Logout
    </button>
  </div>
</div>`;
}

function buildTopBar(title, subtitle = '') {
  return `
<div class="topbar">
  <button class="menu-toggle" onclick="document.getElementById('sidebar').classList.toggle('open')" aria-label="Menu">
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
    </svg>
  </button>
  <div>
    <div class="topbar-title">${title}</div>
    ${subtitle ? `<div class="topbar-subtitle">${subtitle}</div>` : ''}
  </div>
  <div class="topbar-actions">
    <div class="sync-status">
      <span class="sync-dot" id="sync-dot"></span>
      <span id="sync-text">Local Storage</span>
    </div>
  </div>
</div>`;
}

// Confirm modal HTML
function buildConfirmModal() {
  return `
<div class="modal-overlay" id="confirm-modal">
  <div class="modal modal-sm">
    <div class="modal-header">
      <h2 id="confirm-title">Confirm</h2>
      <button class="modal-close" onclick="UTILS.closeModal('confirm-modal')">
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    </div>
    <div class="modal-body">
      <p id="confirm-msg" style="color:#4a5568;font-size:14px;"></p>
    </div>
    <div class="modal-footer">
      <button class="btn btn-outline" id="confirm-no">Cancel</button>
      <button class="btn btn-danger" id="confirm-yes">Confirm</button>
    </div>
  </div>
</div>`;
}

// Toast container
function buildToastContainer() {
  return '<div id="toast-container"></div>';
}

// Update sync indicator
function updateSyncStatus(state) {
  const dot = document.getElementById('sync-dot');
  const text = document.getElementById('sync-text');
  if (!dot || !text) return;
  const s = STORE.getSettings();
  if (!s.googleScriptUrl) {
    dot.className = 'sync-dot';
    text.textContent = 'Local Mode';
    return;
  }
  if (state === 'syncing') { dot.className = 'sync-dot syncing'; text.textContent = 'Syncing...'; }
  else if (state === 'error') { dot.className = 'sync-dot error'; text.textContent = 'Sync Error'; }
  else { dot.className = 'sync-dot'; text.textContent = 'Synced'; }
}

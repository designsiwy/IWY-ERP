/* ===== AUTH.JS - Session Management ===== */

const AUTH = {
  KEY: 'iwy_erp_auth',
  SESSION_KEY: 'iwy_erp_session',

  login(username, password, remember) {
    const settings = STORE.getSettings();
    const validUser = settings.adminUsername || 'admin';
    const validPass = settings.adminPassword || 'iwy@2024';

    if (username === validUser && password === validPass) {
      const session = {
        username,
        name: settings.adminName || 'Admin',
        role: 'Administrator',
        loginTime: new Date().toISOString(),
        remember
      };
      if (remember) {
        localStorage.setItem(this.KEY, JSON.stringify(session));
      }
      sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
      return { success: true, session };
    }
    return { success: false, error: 'Invalid username or password' };
  },

  logout() {
    localStorage.removeItem(this.KEY);
    sessionStorage.removeItem(this.SESSION_KEY);
    window.location.href = 'login.html';
  },

  getSession() {
    const ss = sessionStorage.getItem(this.SESSION_KEY);
    if (ss) return JSON.parse(ss);
    const ls = localStorage.getItem(this.KEY);
    if (ls) {
      const s = JSON.parse(ls);
      sessionStorage.setItem(this.SESSION_KEY, ls);
      return s;
    }
    return null;
  },

  isLoggedIn() {
    return !!this.getSession();
  },

  requireAuth() {
    if (!this.isLoggedIn()) {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  },

  renderUserInfo() {
    const s = this.getSession();
    if (!s) return;
    const nameEl = document.getElementById('user-name');
    const roleEl = document.getElementById('user-role');
    const avatarEl = document.getElementById('user-avatar');
    if (nameEl) nameEl.textContent = s.name || s.username;
    if (roleEl) roleEl.textContent = s.role || 'Administrator';
    if (avatarEl) avatarEl.textContent = (s.name || s.username)[0].toUpperCase();
  }
};

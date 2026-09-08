// app.js - Batterij Leenkaart logica
(function() {
  'use strict';

  const STORAGE_KEY = 'proto_batterij_leenkaarten_v1';
  const THEME_KEY = 'proto_batterij_theme';

  // State
  let loans = [];
  let currentFilter = 'all';
  let searchQuery = '';

  // DOM elementen
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const cardGrid = document.getElementById('cardGrid');
  const emptyState = document.getElementById('emptyState');
  const loanModal = document.getElementById('loanModal');
  const loanForm = document.getElementById('loanForm');
  const addLoanBtn = document.getElementById('addLoanBtn');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const cancelModalBtn = document.getElementById('cancelModalBtn');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const searchInput = document.getElementById('searchInput');
  const exportCsvBtn = document.getElementById('exportCsvBtn');
  const exportJsonBtn = document.getElementById('exportJsonBtn');

  // Stats DOM
  const statTotal = document.getElementById('statTotal');
  const statActive = document.getElementById('statActive');
  const statOverdue = document.getElementById('statOverdue');
  const statReturned = document.getElementById('statReturned');

  // Initialisatie
  function init() {
    initTheme();
    loadData();
    setupEventListeners();
    render();
  }

  // Thema beheer
  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? 'dark' : 'light');
    applyTheme(theme);
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    localStorage.setItem(THEME_KEY, theme);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  }

  // Data persistence
  function loadData() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        loans = JSON.parse(data);
      } else {
        // Demodata voor een fijne eerste indruk
        loans = [
          {
            id: 'loan-1',
            itemType: 'Anker PowerCore 20K',
            category: 'Powerbank',
            capacity: '20.000 mAh / 65W PD',
            borrowerName: 'Mark',
            borrowerContact: '06-12345678',
            loanDate: getRelativeDate(-3),
            dueDate: getRelativeDate(1),
            notes: 'Meegegeven met zwarte USB-C kabel. 100% vol.',
            status: 'active', // active | returned
            returnedDate: null
          },
          {
            id: 'loan-2',
            itemType: 'Makita BL1850B 18V',
            category: 'Gereedschapsaccu',
            capacity: '5.0 Ah',
            borrowerName: 'Dennis (Klusproject)',
            borrowerContact: 'dennis@werk.local',
            loanDate: getRelativeDate(-8),
            dueDate: getRelativeDate(-2), // overdue!
            notes: 'Samen met snellader DC18RC uitgeleend.',
            status: 'active',
            returnedDate: null
          }
        ];
        saveData();
      }
    } catch (e) {
      console.error('Fout bij laden van data:', e);
      loans = [];
    }
  }

  function saveData() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(loans));
    } catch (e) {
      console.error('Fout bij opslaan:', e);
    }
  }

  function getRelativeDate(offsetDays) {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return d.toISOString().split('T')[0];
  }

  // Event listeners
  function setupEventListeners() {
    themeToggle.addEventListener('click', toggleTheme);

    addLoanBtn.addEventListener('click', () => openModal());
    closeModalBtn.addEventListener('click', closeModal);
    cancelModalBtn.addEventListener('click', closeModal);

    loanModal.addEventListener('click', (e) => {
      if (e.target === loanModal) closeModal();
    });

    loanForm.addEventListener('submit', handleFormSubmit);

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        render();
      });
    });

    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      render();
    });

    exportCsvBtn.addEventListener('click', exportToCsv);
    exportJsonBtn.addEventListener('click', exportToJson);
  }

  // Modal handlers
  function openModal(editId = null) {
    loanForm.reset();
    document.getElementById('loanId').value = '';
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('loanDate').value = today;

    if (editId) {
      const item = loans.find(l => l.id === editId);
      if (item) {
        document.getElementById('modalTitle').textContent = 'Leenkaart Bewerken';
        document.getElementById('loanId').value = item.id;
        document.getElementById('itemType').value = item.itemType;
        document.getElementById('category').value = item.category;
        document.getElementById('capacity').value = item.capacity || '';
        document.getElementById('borrowerName').value = item.borrowerName;
        document.getElementById('borrowerContact').value = item.borrowerContact || '';
        document.getElementById('loanDate').value = item.loanDate;
        document.getElementById('dueDate').value = item.dueDate || '';
        document.getElementById('notes').value = item.notes || '';
      }
    } else {
      document.getElementById('modalTitle').textContent = 'Nieuwe Leenkaart';
    }

    loanModal.classList.remove('hidden');
    document.getElementById('itemType').focus();
  }

  function closeModal() {
    loanModal.classList.add('hidden');
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    const id = document.getElementById('loanId').value;
    const itemData = {
      itemType: document.getElementById('itemType').value.trim(),
      category: document.getElementById('category').value,
      capacity: document.getElementById('capacity').value.trim(),
      borrowerName: document.getElementById('borrowerName').value.trim(),
      borrowerContact: document.getElementById('borrowerContact').value.trim(),
      loanDate: document.getElementById('loanDate').value,
      dueDate: document.getElementById('dueDate').value || null,
      notes: document.getElementById('notes').value.trim()
    };

    if (id) {
      const index = loans.findIndex(l => l.id === id);
      if (index !== -1) {
        loans[index] = { ...loans[index], ...itemData };
      }
    } else {
      const newEntry = {
        id: 'loan-' + Date.now(),
        ...itemData,
        status: 'active',
        returnedDate: null
      };
      loans.unshift(newEntry);
    }

    saveData();
    closeModal();
    render();
  }

  // Acties
  window.toggleReturnStatus = function(id) {
    const item = loans.find(l => l.id === id);
    if (!item) return;

    if (item.status === 'active') {
      item.status = 'returned';
      item.returnedDate = new Date().toISOString().split('T')[0];
    } else {
      item.status = 'active';
      item.returnedDate = null;
    }

    saveData();
    render();
  };

  window.editLoan = function(id) {
    openModal(id);
  };

  window.deleteLoan = function(id) {
    if (confirm('Weet je zeker dat je deze leenkaart wilt verwijderen?')) {
      loans = loans.filter(l => l.id !== id);
      saveData();
      render();
    }
  };

  // Helper datum status
  function isOverdue(dueDate, status) {
    if (status !== 'active' || !dueDate) return false;
    const today = new Date().toISOString().split('T')[0];
    return dueDate < today;
  }

  // Render method
  function render() {
    const today = new Date().toISOString().split('T')[0];

    // Stats tellen
    let total = loans.length;
    let active = 0;
    let overdue = 0;
    let returned = 0;

    loans.forEach(l => {
      if (l.status === 'returned') {
        returned++;
      } else {
        active++;
        if (l.dueDate && l.dueDate < today) {
          overdue++;
        }
      }
    });

    statTotal.textContent = total;
    statActive.textContent = active;
    statOverdue.textContent = overdue;
    statReturned.textContent = returned;

    // Filter & Zoek
    const filtered = loans.filter(item => {
      const matchesSearch = !searchQuery || 
        item.itemType.toLowerCase().includes(searchQuery) ||
        item.borrowerName.toLowerCase().includes(searchQuery) ||
        (item.capacity && item.capacity.toLowerCase().includes(searchQuery)) ||
        (item.notes && item.notes.toLowerCase().includes(searchQuery));

      if (!matchesSearch) return false;

      const overdueFlag = isOverdue(item.dueDate, item.status);

      if (currentFilter === 'active') {
        return item.status === 'active';
      } else if (currentFilter === 'overdue') {
        return overdueFlag;
      } else if (currentFilter === 'returned') {
        return item.status === 'returned';
      }

      return true;
    });

    // Render cards
    cardGrid.innerHTML = '';

    if (filtered.length === 0) {
      emptyState.classList.remove('hidden');
    } else {
      emptyState.classList.add('hidden');
      filtered.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';

        const overdueFlag = isOverdue(item.dueDate, item.status);
        let badgeHtml = '';
        if (item.status === 'returned') {
          badgeHtml = `<span class="badge returned">Geretourneerd (${item.returnedDate || 'klaar'})</span>`;
        } else if (overdueFlag) {
          badgeHtml = `<span class="badge overdue">Te laat</span>`;
        } else {
          badgeHtml = `<span class="badge active">Uitgeleend</span>`;
        }

        const returnBtnText = item.status === 'active' ? '✓ Markeer als retour' : '↺ Heropenen';

        card.innerHTML = `
          <div class="card-header">
            <div class="item-info">
              <h3>${escapeHtml(item.itemType)}</h3>
              <div class="item-meta">${escapeHtml(item.category)}${item.capacity ? ' • ' + escapeHtml(item.capacity) : ''}</div>
            </div>
            ${badgeHtml}
          </div>

          <div class="card-body">
            <div class="detail-item">
              <div class="d-label">Uitgeleend aan</div>
              <div class="d-val">${escapeHtml(item.borrowerName)}${item.borrowerContact ? ' (' + escapeHtml(item.borrowerContact) + ')' : ''}</div>
            </div>
            <div class="detail-item">
              <div class="d-label">Datum uitgifte</div>
              <div class="d-val">${escapeHtml(item.loanDate)}</div>
            </div>
            <div class="detail-item">
              <div class="d-label">Verwachte retourdatum</div>
              <div class="d-val" style="${overdueFlag ? 'color: var(--danger); font-weight:600;' : ''}">${item.dueDate ? escapeHtml(item.dueDate) : 'Niet vastgelegd'}</div>
            </div>
          </div>

          ${item.notes ? `<div class="card-note">“${escapeHtml(item.notes)}”</div>` : ''}

          <div class="card-footer">
            <div class="footer-actions">
              <button class="primary" onclick="window.toggleReturnStatus('${item.id}')">${returnBtnText}</button>
              <button onclick="window.editLoan('${item.id}')">Bewerken</button>
            </div>
            <button class="icon-btn" onclick="window.deleteLoan('${item.id}')" title="Verwijderen" style="border:none; color:var(--text-muted);">🗑️</button>
          </div>
        `;

        cardGrid.appendChild(card);
      });
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Exports
  function exportToJson() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(loans, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `batterij-leenkaarten-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  function exportToCsv() {
    if (loans.length === 0) {
      alert('Geen gegevens om te exporteren.');
      return;
    }

    const headers = ['ID', 'Apparaat/Accu', 'Categorie', 'Capaciteit', 'Lener', 'Contact', 'Uitgeleend Op', 'Retour Verwacht', 'Status', 'Retour Datum', 'Notities'];
    const rows = loans.map(l => [
      l.id,
      `"${(l.itemType || '').replace(/"/g, '""')}"`,
      `"${(l.category || '').replace(/"/g, '""')}"`,
      `"${(l.capacity || '').replace(/"/g, '""')}"`,
      `"${(l.borrowerName || '').replace(/"/g, '""')}"`,
      `"${(l.borrowerContact || '').replace(/"/g, '""')}"`,
      l.loanDate || '',
      l.dueDate || '',
      l.status || '',
      l.returnedDate || '',
      `"${(l.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(';'), ...rows.map(e => e.join(';'))].join('\n');
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", encodeURI(csvContent));
    downloadAnchor.setAttribute("download", `batterij-leenkaarten-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  // Start app
  init();
})();

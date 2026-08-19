// CONFIGURATION
const SHEET_ID = '1ICfKQc2t11A7A8qa-0SIZuFaqX0XGYx_-yVysO0iP6w';
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby6RjkkQaGa7XkUN7f0AMMZcd6JGUwBgF-aM4LSU7Nnef9K5ZnvPh2URjUl6Vr2Rya-/exec';
const GOOGLE_FORM_URL = 'TUTAJ_WKLEJ_LINK_DO_FORMULARZA_GOOGLE';

// INIT
document.addEventListener('DOMContentLoaded', () => {
  // Set up Google Photos link
  const photosLinkElement = document.getElementById('google-photos-link');
  if (photosLinkElement) photosLinkElement.href = GOOGLE_FORM_URL;

  // Navigation listener
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabName = btn.getAttribute('data-tab');
      switchTab(tabName);
    });
  });

  // Refresh buttons listener
  document.getElementById('refresh-schedule-btn')?.addEventListener('click', fetchSchedule);
  document.getElementById('refresh-news-btn')?.addEventListener('click', fetchNews);
  document.getElementById('refresh-forum-btn')?.addEventListener('click', fetchForum);

  // Form submit listener
  document.getElementById('forum-form')?.addEventListener('submit', sendForumMessage);
});

// TAB SWITCHING LOGIC
function switchTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('.nav-btn').forEach(el => {
    el.classList.remove('text-amber-400');
    el.classList.add('text-slate-500');
  });

  const activeTabSection = document.getElementById('tab-' + tabName);
  const activeNavBtn = document.querySelector(`[data-tab="${tabName}"]`);

  if (activeTabSection) activeTabSection.classList.remove('hidden');
  if (activeNavBtn) {
    activeNavBtn.classList.add('text-amber-400');
    activeNavBtn.classList.remove('text-slate-500');
  }

  if (tabName === 'schedule') fetchSchedule();
  if (tabName === 'news') fetchNews();
  if (tabName === 'forum') fetchForum();
}

// FETCH SCHEDULE
async function fetchSchedule() {
  const container = document.getElementById('schedule-container');
  container.innerHTML = `<div class="text-center text-xs text-amber-200/50 py-4 font-cinzel">Ładowanie programu...</div>`;
  
  const sheetUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=Harmonogram`;

  try {
    const res = await fetch(sheetUrl);
    const text = await res.text();
    const json = JSON.parse(text.substring(47, text.length - 2));
    const rows = json.table.rows;

    if (!rows || rows.length === 0) {
      container.innerHTML = `<div class="text-center text-xs text-amber-200/50 py-4">Brak wpisów w harmonogramie.</div>`;
      return;
    }

    container.innerHTML = '';
    rows.forEach(row => {
      const time = row.c && row.c[0] ? (row.c[0].v || '') : '--:--';
      const title = row.c && row.c[1] ? (row.c[1].v || '') : '';
      const desc = row.c && row.c[2] ? (row.c[2].v || '') : '';

      if (title) {
        container.innerHTML += `
          <div class="bg-slate-900/80 border border-amber-900/30 rounded-xl p-4 flex gap-3.5 backdrop-blur-sm">
            <div class="bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold font-cinzel px-2.5 py-1 rounded-lg h-fit shrink-0">${time}</div>
            <div>
              <h4 class="text-xs font-bold text-amber-100 font-cinzel">${title}</h4>
              ${desc ? `<p class="text-[11px] text-amber-200/60 mt-0.5">${desc}</p>` : ''}
            </div>
          </div>`;
      }
    });
  } catch (e) {
    container.innerHTML = `<div class="text-center text-xs text-amber-500/70 py-4">Nie znaleziono zakładki "Harmonogram" w arkuszu.</div>`;
  }
}

// FETCH NEWS
async function fetchNews() {
  const container = document.getElementById('news-container');
  container.innerHTML = `<div class="text-center text-xs text-amber-200/50 py-4 font-cinzel">Odczytywanie wieści...</div>`;
  
  const sheetUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=Ogłoszenia`;

  try {
    const res = await fetch(sheetUrl);
    const text = await res.text();
    const json = JSON.parse(text.substring(47, text.length - 2));
    const rows = json.table.rows;

    if (!rows || rows.length === 0) {
      container.innerHTML = `<div class="text-center text-xs text-amber-200/50 py-4">Brak nowych obwieszczeń.</div>`;
      return;
    }

    container.innerHTML = '';
    [...rows].reverse().forEach(row => {
      const time = row.c && row.c[0] ? (row.c[0].v || '') : 'Herold';
      const msg = row.c && row.c[1] ? (row.c[1].v || '') : '';

      if (msg) {
        container.innerHTML += `
          <div class="bg-slate-900/80 border border-amber-900/40 rounded-xl p-4 space-y-1.5 backdrop-blur-sm">
            <span class="inline-block text-[9px] font-bold font-cinzel text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
              ⏱️ ${time}
            </span>
            <p class="text-xs text-amber-100/90 leading-relaxed font-light">${msg}</p>
          </div>`;
      }
    });
  } catch (e) {
    container.innerHTML = `<div class="text-center text-xs text-amber-500/70 py-4">Nie znaleziono zakładki "Ogłoszenia" w arkuszu.</div>`;
  }
}

// FETCH FORUM
async function fetchForum() {
  const container = document.getElementById('forum-container');
  container.innerHTML = `<div class="text-center text-xs text-slate-500 py-4 font-cinzel">Pobieranie wpisów...</div>`;
  
  const sheetUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=Forum`;

  try {
    const res = await fetch(sheetUrl);
    const text = await res.text();
    const json = JSON.parse(text.substring(47, text.length - 2));
    const rows = json.table.rows;

    if (!rows || rows.length === 0) {
      container.innerHTML = `<div class="text-center text-xs text-slate-500 py-4">Brak wpisów. Bądź pierwszy!</div>`;
      return;
    }

    container.innerHTML = '';
    [...rows].reverse().forEach(row => {
      const author = row.c && row.c[0] ? (row.c[0].v || 'Anonim') : 'Anonim';
      const msg = row.c && row.c[1] ? (row.c[1].v || '') : '';

      if (msg) {
        container.innerHTML += `
          <div class="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3.5 space-y-1 backdrop-blur-sm">
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-bold text-amber-300/90 flex items-center gap-1">👤 ${author}</span>
              <span class="text-[9px] text-slate-500">Gość Balu</span>
            </div>
            <p class="text-xs text-slate-300 font-light leading-relaxed">${msg}</p>
          </div>`;
      }
    });
  } catch (e) {
    container.innerHTML = `<div class="text-center text-xs text-slate-500 py-4">Nie znaleziono zakładki "Forum" w arkuszu.</div>`;
  }
}

// SEND FORUM MESSAGE
async function sendForumMessage(e) {
  e.preventDefault();
  const btn = document.getElementById('forum-btn');
  const author = document.getElementById('forum-author').value;
  const message = document.getElementById('forum-message').value;

  btn.disabled = true;
  btn.innerText = 'Publikowanie...';

  try {
    await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author: author, message: message })
    });

    document.getElementById('forum-form').reset();
    setTimeout(() => {
      fetchForum();
      btn.disabled = false;
      btn.innerText = '💬 Opublikuj wiadomość';
    }, 1000);

  } catch (error) {
    alert('Błąd podczas wysyłania.');
    btn.disabled = false;
    btn.innerText = '💬 Opublikuj wiadomość';
  }
}

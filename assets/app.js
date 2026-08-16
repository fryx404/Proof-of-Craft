/* =========================================================
   Tool Archive — app
   tools.json を読み込んでカード一覧 / モーダルを生成する
   ========================================================= */
(() => {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const grid      = $('#grid');
  const emptyBox  = $('#empty');
  const modal      = $('#modal');
  const modalBody  = $('#modal-body');
  const modalPanel = $('.modal__panel', modal);

  let TOOLS = [];
  let lastFocused = null;

  /* ---------- tag color ----------
     既知のタグは固定色。未知のタグは名前から自動で色を割り当てるので、
     新しいタグを増やしても何も設定しなくて構いません。            */
  const TAG_COLORS = {
    maya:    'teal',
    blender: 'amber',
    python:  'blue',
    mel:     'blue',
    rigging: 'purple',
    modeling:'purple',
    animation:'purple',
    gui:     'coral',
    ui:      'coral',
    tool:    'green',
    utility: 'green'
  };
  const PALETTE = ['teal', 'blue', 'purple', 'coral', 'amber', 'green'];

  const tagColor = (tag) => {
    const key = String(tag).toLowerCase().trim();
    if (TAG_COLORS[key]) return TAG_COLORS[key];
    let h = 0;
    for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
    return PALETTE[h % PALETTE.length];
  };

  /* ---------- utils ---------- */
  const esc = (s = '') => String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  const tags = (arr) => (arr || [])
    .map(g => `<span class="tag tag--${tagColor(g)}">${esc(g)}</span>`).join('');

  const list = (arr, ordered = false) => {
    if (!arr || !arr.length) return '';
    const t = ordered ? 'ol' : 'ul';
    return `<${t}>${arr.map(i => `<li>${esc(i)}</li>`).join('')}</${t}>`;
  };

  /* ---------- render: cards ---------- */
  function renderCards() {
    emptyBox.hidden = TOOLS.length > 0;
    grid.innerHTML = TOOLS.map((t, i) => {
      const media = t.image
        ? `<img src="${esc(t.image)}" alt="${esc(t.name)} の動作サンプル" loading="lazy" decoding="async"
                onerror="this.parentElement.classList.add('card__media--empty');this.remove();">`
        : '';
      return `
      <button class="card" type="button" data-id="${esc(t.id)}" style="animation-delay:${i * 55}ms">
        <div class="card__media${t.image ? '' : ' card__media--empty'}">${media}</div>
        <div class="card__body">
          <div class="tags">${tags(t.tags)}</div>
          <h2 class="card__name">${esc(t.name)}</h2>
          ${t.nameJa ? `<p class="card__name-ja">${esc(t.nameJa)}</p>` : ''}
          <p class="card__summary">${esc(t.summary || '')}</p>
          <span class="card__more">View Detail <span>→</span></span>
        </div>
      </button>`;
    }).join('');
  }

  /* ---------- render: modal ---------- */
  function openModal(id) {
    const t = TOOLS.find(x => x.id === id);
    if (!t) return;
    lastFocused = document.activeElement;

    modalBody.innerHTML = `
      <article class="detail">
        ${t.image ? `<div class="detail__media"><img src="${esc(t.image)}" alt="${esc(t.name)} の動作サンプル"></div>` : ''}
        <div class="detail__inner">
          <div class="tags">${tags(t.tags)}</div>
          <h2 class="detail__name" id="modal-title">${esc(t.name)}</h2>
          ${t.nameJa ? `<p class="detail__name-ja">${esc(t.nameJa)}</p>` : ''}

          <div class="detail__meta">
            ${t.version ? `<span>VERSION <b>${esc(t.version)}</b></span>` : ''}
            ${t.date    ? `<span>RELEASE <b>${esc(t.date)}</b></span>` : ''}
          </div>

          ${t.description ? `<p class="detail__desc">${esc(t.description)}</p>` : ''}

          ${t.requirements?.length ? `<h3>Requirements</h3>${list(t.requirements)}` : ''}
          ${t.install?.length      ? `<h3>Install</h3>${list(t.install)}` : ''}
          ${t.code                 ? `<h3>Launch</h3><pre><code>${esc(t.code)}</code></pre>` : ''}
          ${t.usage?.length        ? `<h3>Usage</h3>${list(t.usage, true)}` : ''}
          ${t.notes?.length        ? `<h3>Notes</h3>${list(t.notes)}` : ''}

          <div class="detail__actions">
            ${t.repo     ? `<a class="btn btn--primary" href="${esc(t.repo)}" target="_blank" rel="noopener">GitHub で見る ↗</a>` : ''}
            ${t.download ? `<a class="btn" href="${esc(t.download)}" target="_blank" rel="noopener">ZIP をダウンロード</a>` : ''}
          </div>
        </div>
      </article>`;

    modal.hidden = false;
    modalPanel.scrollTop = 0; // 常に先頭から表示する
    document.body.classList.add('is-locked');
    $('.modal__close', modal).focus({ preventScroll: true });
  }

  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove('is-locked');
    modalBody.innerHTML = '';
    modalPanel.scrollTop = 0;
    if (lastFocused) lastFocused.focus({ preventScroll: true });
  }

  /* ---------- events ---------- */
  grid.addEventListener('click', (e) => {
    const card = e.target.closest('.card');
    if (card) openModal(card.dataset.id);
  });

  modal.addEventListener('click', (e) => {
    if (e.target.closest('[data-close]')) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });

  /* ---------- boot ---------- */
  fetch('./tools.json', { cache: 'no-cache' })
    .then(r => {
      if (!r.ok) throw new Error(`tools.json: HTTP ${r.status}`);
      return r.json();
    })
    .then(data => {
      TOOLS = (data.tools || []).slice()
        .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));

      const s = data.site || {};
      if (s.title) document.title = `${s.title} — Furuya Takumi`;
      if (s.lead)  $('#site-lead').innerHTML = s.lead; // 意図的に HTML 許可（自分で書くデータのため）
      $('#year').textContent = new Date().getFullYear();

      renderCards();
    })
    .catch(err => {
      console.error(err);
      grid.innerHTML = `<p style="color:#8f8d8a;font-size:14px">
        tools.json の読み込みに失敗しました。ローカルで確認する場合は
        <code style="color:#c9a227">npx serve</code> などの簡易サーバー経由で開いてください。</p>`;
      $('#year').textContent = new Date().getFullYear();
    });
})();

import {
  hotelInfo,
  spaList,
  spaWarning,
  michelinList,
  michelinWarning,
  cannabisList,
  cannabisWarning,
  extendedSections
} from './data/bangkokData.js';

const STORAGE_KEY = 'bangkok_sukhumvit11_saved_ids_v1';

const state = {
  activeTab: 'tab-hotel',
  hotelPhotoIndex: 0,
  filters: {
    spa: 'all',
    michelin: 'all',
    cannabis: 'all',
    extended: 'all'
  },
  searchQuery: '',
  savedIds: loadSavedIds()
};

function loadSavedIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : ['spa-1', 'food-1', 'food-8', 'can-1'];
  } catch {
    return ['spa-1', 'food-1', 'food-8', 'can-1'];
  }
}

function persistSavedIds() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.savedIds));
  } catch {
    // ignore storage quota errors
  }
  updateSavedCountBadge();
}

function updateSavedCountBadge() {
  const badge = document.getElementById('saved-count-badge');
  if (badge) {
    badge.textContent = String(state.savedIds.length);
  }
}

function getAllPrimaryVenues() {
  return [...spaList, ...michelinList, ...cannabisList];
}

// =========================================
// 1. 渲染 TAB 1: Travelodge Sukhumvit 11 住宿與房型專區
// =========================================
function renderHotelSection() {
  const mount = document.getElementById('hotel-section-mount');
  if (!mount) return;

  const currentPhoto = hotelInfo.gallery[state.hotelPhotoIndex] || hotelInfo.gallery[0];

  mount.innerHTML = `
    <div class="section-intro-bar">
      <div>
        <span class="section-eyebrow">ACCOMMODATION DETAILS・12/18 – 12/20</span>
        <h2 class="section-heading">🏨 住宿資訊：Travelodge Sukhumvit 11</h2>
        <p class="section-desc">本次曼谷行下榻飯店、入住房型（Superior Premium Room 雙人房）與入住/退房時間總覽。</p>
      </div>
    </div>

    <!-- 專屬住宿憑證卡 (僅顯示於住宿資訊 Tab) -->
    <div class="stay-pass-banner" style="margin-bottom: 26px;">
      <div class="stay-pass-left">
        <div class="stay-pass-thumb">
          <img src="${currentPhoto.url}" alt="Travelodge Sukhumvit 11 Superior Premium Room" />
          <span class="thumb-badge">入住房型</span>
        </div>
        <div class="stay-pass-info">
          <div class="stay-pass-label">BOOKING CONFIRMATION・住宿憑證</div>
          <h3 class="stay-pass-hotel">${hotelInfo.name}</h3>
          <div class="stay-pass-room">
            <span class="room-highlight">${hotelInfo.roomType}</span>
            <span class="room-divider">｜</span>
            <span>${hotelInfo.roomTypeZh}</span>
          </div>
        </div>
      </div>

      <div class="stay-pass-dates">
        <div class="date-box">
          <span class="date-label">CHECK-IN 入住</span>
          <strong class="date-value">${hotelInfo.checkInDate} <small>(五)</small></strong>
          <span class="date-sub">${hotelInfo.checkInTime}</span>
        </div>
        <div class="date-arrow">
          <span class="nights-pill">2 NIGHTS・雙人房</span>
          <div class="arrow-line"></div>
        </div>
        <div class="date-box">
          <span class="date-label">CHECK-OUT 退房</span>
          <strong class="date-value">${hotelInfo.checkOutDate} <small>(日)</small></strong>
          <span class="date-sub">${hotelInfo.checkOutTime}</span>
        </div>
      </div>

      <div class="stay-pass-actions">
        <a href="${hotelInfo.officialWebsite}" target="_blank" rel="noopener noreferrer" class="btn btn-gold btn-sm">
          🌐 飯店官網
        </a>
        <a href="${hotelInfo.googleMapsUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-glass btn-sm">
          📍 Google Maps
        </a>
      </div>
    </div>

    <div class="hotel-showcase-card">
      <div class="hotel-hero-grid">
        <!-- 左側：Superior Premium Room 與飯店實景互動畫廊 -->
        <div class="hotel-gallery-stage">
          <div class="hotel-main-photo-wrap">
            <img id="hotel-main-img" src="${currentPhoto.url}" alt="${currentPhoto.caption}" />
            <span class="hotel-photo-tag" id="hotel-main-tag">📸 ${currentPhoto.tag} (${state.hotelPhotoIndex + 1}/${hotelInfo.gallery.length})</span>
            <div class="hotel-photo-caption" id="hotel-main-caption">${currentPhoto.caption}</div>
          </div>
          <div class="hotel-thumb-strip">
            ${hotelInfo.gallery
              .map(
                (item, idx) => `
              <div class="hotel-thumb-item ${idx === state.hotelPhotoIndex ? 'active' : ''}" data-photo-idx="${idx}" title="${item.caption}">
                <img src="${item.url}" alt="${item.tag}" loading="lazy" />
              </div>
            `
              )
              .join('')}
          </div>
        </div>

        <!-- 右側：住宿資訊與房型重點 -->
        <div class="hotel-details-pane">
          <div>
            <span class="hotel-pane-eyebrow">🏨 ACCOMMODATION CENTER・住宿中心點</span>
            <h2 class="hotel-pane-title">${hotelInfo.name}</h2>
            <p class="hotel-pane-thai">${hotelInfo.thaiName}｜BTS Nana 站步行約 7–8 分鐘（附免費嘟嘟車接駁）</p>

            <div class="room-spotlight-box">
              <div class="room-spotlight-header">
                <span class="room-spotlight-name">🛏️ ${hotelInfo.roomType}</span>
                <span class="room-spotlight-badge">雙人房・${hotelInfo.duration}</span>
              </div>
              <div class="room-spotlight-meta">
                <span>📅 入住：<strong>${hotelInfo.checkInDate} (${hotelInfo.checkInTime})</strong></span>
                <span>📅 退房：<strong>${hotelInfo.checkOutDate} (${hotelInfo.checkOutTime})</strong></span>
                <span>👥 房型：<strong>${hotelInfo.roomTypeZh}</strong></span>
              </div>
            </div>

            <p class="hotel-desc-text">${hotelInfo.description}</p>

            <div class="hotel-address-box">
              <strong>📍 飯店地址：</strong>${hotelInfo.address}<br/>
              <strong>🚕 攻略交通設定：</strong>步行（15～20 分鐘內）或搭乘 Grab / 計程車 / 嘟嘟車（車程 20 分鐘內）
            </div>
          </div>

          <div class="hotel-action-row">
            <a href="${hotelInfo.officialWebsite}" target="_blank" rel="noopener noreferrer" class="btn btn-emerald">
              🌐 Travelodge 官方網站
            </a>
            <a href="${hotelInfo.googleMapsUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-gold">
              📍 Google Maps 導航
            </a>
            <a href="${hotelInfo.agodaUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline">
              🏨 Agoda 房型頁
            </a>
            <a href="${hotelInfo.bookingUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline">
              📘 Booking.com
            </a>
            <button class="btn btn-outline" data-copy-text="${hotelInfo.name}">
              📋 複製飯店名稱叫 Grab
            </button>
          </div>
        </div>
      </div>

      <!-- 下方：Superior Premium Room 房型規格與飯店公共設施 -->
      <div class="hotel-specs-section">
        <h3 class="specs-section-title">✨ Superior Premium Room 雙人房專屬配置</h3>
        <div class="room-specs-grid">
          ${hotelInfo.roomSpecs
            .map(
              (spec) => `
            <div class="spec-item-card">
              <div class="spec-icon">${spec.icon}</div>
              <div>
                <div class="spec-label">${spec.label}</div>
                <div class="spec-value">${spec.value}</div>
              </div>
            </div>
          `
            )
            .join('')}
        </div>

        <h3 class="specs-section-title">🏊 飯店設施與周邊生活機能</h3>
        <div class="facilities-grid">
          ${hotelInfo.hotelFacilities
            .map(
              (fac) => `
            <div class="facility-card">
              <h4>${fac.title}</h4>
              <p>${fac.desc}</p>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    </div>

    <!-- 四大主題攻略快速傳送門 -->
    <div class="section-intro-bar" style="margin-top: 12px;">
      <div>
        <span class="section-eyebrow">EXPLORE SUKHUMVIT 11 & BEYOND</span>
        <h2 class="section-heading">從飯店出發：四大主題全攻略導覽</h2>
        <p class="section-desc">點擊下方主題卡片或頂部 Tab 分頁，立即查看各店家的實景照片、官方網站與 Google Maps 導航。</p>
      </div>
    </div>

    <div class="quick-category-cards">
      <div class="quick-cat-card" data-jump-tab="tab-spa">
        <div>
          <div class="quick-cat-top">
            <span class="quick-cat-icon">💆‍♀️</span>
            <span class="quick-cat-badge">9 間名店 + 1 避雷</span>
          </div>
          <h3>一、大型連鎖按摩與頂級 SPA</h3>
          <p>下樓步行 3 分鐘即達 divana nurture spa，另有 Let's Relax 四大分店、Health Land、Oasis Spa 與日式湯森溫泉。</p>
        </div>
        <span class="quick-cat-link">前往 SPA 攻略分頁 →</span>
      </div>

      <div class="quick-cat-card" data-jump-tab="tab-michelin">
        <div>
          <div class="quick-cat-top">
            <span class="quick-cat-icon">🍽️</span>
            <span class="quick-cat-badge">8 間星級/必比登</span>
          </div>
          <h3>二、米其林星級與必比登美食</h3>
          <p>精選米其林一星 KHAO、榮泰豬肉米粉湯、Here Hai 瘋狂蟹肉炒飯、紅大哥水門雞飯、波羅炸雞與泰東餐酒館。</p>
        </div>
        <span class="quick-cat-link">前往米其林美食分頁 →</span>
      </div>

      <div class="quick-cat-card" data-jump-tab="tab-cannabis">
        <div>
          <div class="quick-cat-top">
            <span class="quick-cat-icon">🌿</span>
            <span class="quick-cat-badge">步行 2～15 分鐘</span>
          </div>
          <h3>三、台灣人經營與中文友善大麻店</h3>
          <p>鎖定正宗台灣老闆主理「餐麻館」GOLDEN HOUR BKK（鹽酥雞+飛行甜點），以及飯店旁步行 2 分鐘 KANA PURE。</p>
        </div>
        <span class="quick-cat-link">前往中文友善大麻店分頁 →</span>
      </div>

      <div class="quick-cat-card" data-jump-tab="tab-extended">
        <div>
          <div class="quick-cat-top">
            <span class="quick-cat-icon">🧭</span>
            <span class="quick-cat-badge">12 間延伸口袋名單</span>
          </div>
          <h3>四、周邊其他補充選項（延伸備案）</h3>
          <p>收錄 Phed Mark 打拋豬、Taling Pling 溫室泰菜、凌晨 4 點宵夜泰菜、4.8 星 URI 按摩與 24H 烘焙飛行甜點店。</p>
        </div>
        <span class="quick-cat-link">前往延伸備案分頁 →</span>
      </div>
    </div>
  `;

  // 綁定飯店縮圖點擊切換
  mount.querySelectorAll('[data-photo-idx]').forEach((thumb) => {
    thumb.addEventListener('click', () => {
      state.hotelPhotoIndex = Number(thumb.getAttribute('data-photo-idx'));
      renderHotelSection();
    });
  });

  // 綁定快速分類跳轉
  mount.querySelectorAll('[data-jump-tab]').forEach((card) => {
    card.addEventListener('click', () => {
      switchTab(card.getAttribute('data-jump-tab'));
      window.scrollTo({ top: document.getElementById('sticky-nav').offsetTop - 10, behavior: 'smooth' });
    });
  });
}

// =========================================
// 2. 渲染警告橫幅 (歇業與避雷提醒)
// =========================================
function renderWarnings() {
  const spaWarnMount = document.getElementById('spa-warning-mount');
  if (spaWarnMount) {
    spaWarnMount.innerHTML = `
      <div class="warning-callout">
        <div class="warning-icon">⚠️</div>
        <div class="warning-body">
          <h4>${spaWarning.title}</h4>
          <p>${spaWarning.content}</p>
        </div>
      </div>
    `;
  }

  const michelinWarnMount = document.getElementById('michelin-warning-mount');
  if (michelinWarnMount) {
    michelinWarnMount.innerHTML = `
      <div class="warning-callout">
        <div class="warning-icon">⚠️</div>
        <div class="warning-body">
          <h4>${michelinWarning.title}</h4>
          <ul>
            ${michelinWarning.items.map((item) => `<li>${item}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
  }

  const cannabisWarnMount = document.getElementById('cannabis-warning-mount');
  if (cannabisWarnMount) {
    cannabisWarnMount.innerHTML = `
      <div class="warning-callout">
        <div class="warning-icon">⚠️</div>
        <div class="warning-body">
          <h4>${cannabisWarning.title}</h4>
          <p>${cannabisWarning.content}</p>
        </div>
      </div>
    `;
  }
}

// =========================================
// 3. 通用店家卡片 HTML 生成器
// =========================================
function createVenueCardHTML(item) {
  const isSaved = state.savedIds.includes(item.id);

  let awardBadgeHTML = '';
  if (item.category === 'michelin') {
    const awardClass =
      item.awardType === 'star' ? 'award-star' : item.awardType === 'bib' ? 'award-bib' : 'award-selected';
    awardBadgeHTML = `<div class="venue-award-banner ${awardClass}">🏆 ${item.award}</div>`;
  } else if (item.category === 'cannabis' && item.badge) {
    awardBadgeHTML = `<div class="venue-award-banner award-cannabis">${item.badge}</div>`;
  }

  const subTitleHTML = item.subName ? `<div class="venue-subtitle">${item.subName}</div>` : '';

  const firstRowLabel =
    item.category === 'michelin' ? '🍴 必點招牌 / 料理特色' : item.category === 'cannabis' ? '🌿 經營背景與特色優勢' : '✨ 主打特色';

  return `
    <article class="venue-card" data-venue-id="${item.id}">
      <div>
        <div class="venue-media" data-open-modal="${item.id}" title="點擊查看大圖與完整資訊">
          <img
            src="${item.image}"
            alt="${item.name}"
            loading="lazy"
            onerror="this.onerror=null;this.src='${item.fallbackImage}';"
          />
          <div class="venue-media-overlay"></div>
          <span class="venue-num-badge">#${String(item.number).padStart(2, '0')}</span>
          <button
            type="button"
            class="venue-save-btn ${isSaved ? 'saved' : ''}"
            data-toggle-save="${item.id}"
            title="${isSaved ? '從收藏移除' : '加入我的行程收藏'}"
          >
            ${isSaved ? '♥ 已收藏' : '♡ 收藏'}
          </button>
          <span class="venue-distance-pill">${item.distanceBadge}</span>
          <span class="venue-area-pill">📍 ${item.area}</span>
        </div>

        <div class="venue-content">
          ${awardBadgeHTML}
          <h3 class="venue-title">${item.name}</h3>
          ${subTitleHTML}

          <div class="venue-tags">
            ${(item.tags || []).map((t) => `<span class="venue-tag">${t}</span>`).join('')}
          </div>

          <div class="venue-info-list">
            <div class="info-row">
              <strong>🚕 距離與交通</strong>
              <span>${item.distanceDetail}</span>
            </div>
            <div class="info-row">
              <strong>${firstRowLabel}</strong>
              <span>${item.highlight}</span>
            </div>
            ${
              item.noteText
                ? `
            <div class="info-row">
              <strong>💡 ${item.noteLabel || '重點提示'}</strong>
              <span>${item.noteText}</span>
            </div>
            `
                : ''
            }
          </div>
        </div>
      </div>

      <div class="venue-footer">
        <div class="venue-links">
          <a href="${item.websiteUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-emerald btn-sm btn-flex">
            🌐 ${item.websiteLabel || '官方網站'}
          </a>
          <a href="${item.mapsUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-gold btn-sm btn-flex">
            📍 Google Maps
          </a>
        </div>
        <div class="venue-links">
          <button type="button" class="btn btn-outline btn-sm btn-flex" data-open-modal="${item.id}">
            🖼️ 查看圖輯與詳情
          </button>
          <button type="button" class="btn btn-outline btn-sm btn-flex" data-copy-text="${item.grabSearch || item.name}">
            🚕 複製店名叫 Grab
          </button>
        </div>
      </div>
    </article>
  `;
}

// =========================================
// 4. 篩選與渲染各分類網格
// =========================================
function matchesQuery(item, q) {
  if (!q) return true;
  const hay = [
    item.name,
    item.subName,
    item.area,
    item.award,
    item.badge,
    item.distanceDetail,
    item.highlight,
    item.noteText,
    ...(item.tags || [])
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return hay.includes(q.toLowerCase());
}

function renderSpaGrid() {
  const mount = document.getElementById('spa-grid-mount');
  if (!mount) return;

  const filter = state.filters.spa;
  const q = state.searchQuery.trim();

  const filtered = spaList.filter((item) => {
    if (!matchesQuery(item, q)) return false;
    if (filter === 'walk') return item.transportMode === 'walk' || item.transportMode === 'both';
    if (filter === 'ride') return item.transportMode === 'ride';
    return true;
  });

  mount.innerHTML = filtered.length
    ? filtered.map(createVenueCardHTML).join('')
    : `<div class="empty-state-box"><h3>找不到符合條件的 SPA 按摩館</h3><p>請嘗試切換篩選條件或清除搜尋關鍵字。</p></div>`;
}

function renderMichelinGrid() {
  const mount = document.getElementById('michelin-grid-mount');
  if (!mount) return;

  const filter = state.filters.michelin;
  const q = state.searchQuery.trim();

  const filtered = michelinList.filter((item) => {
    if (!matchesQuery(item, q)) return false;
    if (filter !== 'all') return item.awardType === filter;
    return true;
  });

  mount.innerHTML = filtered.length
    ? filtered.map(createVenueCardHTML).join('')
    : `<div class="empty-state-box"><h3>找不到符合條件的米其林餐廳</h3><p>請嘗試切換評鑑等級或清除搜尋關鍵字。</p></div>`;
}

function renderCannabisGrid() {
  const mount = document.getElementById('cannabis-grid-mount');
  if (!mount) return;

  const filter = state.filters.cannabis;
  const q = state.searchQuery.trim();

  const filtered = cannabisList.filter((item) => {
    if (!matchesQuery(item, q)) return false;
    if (filter === 'soi11') return item.area.includes('Sukhumvit 11');
    if (filter === 'lounge') return ['can-1', 'can-4', 'can-5'].includes(item.id);
    return true;
  });

  mount.innerHTML = filtered.length
    ? filtered.map(createVenueCardHTML).join('')
    : `<div class="empty-state-box"><h3>找不到符合條件的大麻店</h3><p>請嘗試切換篩選條件或清除搜尋關鍵字。</p></div>`;
}

function renderExtendedSections() {
  const mount = document.getElementById('extended-sections-mount');
  if (!mount) return;

  const filter = state.filters.extended;
  const q = state.searchQuery.trim().toLowerCase();

  const blocksHTML = extendedSections
    .filter((group) => filter === 'all' || group.groupId === filter)
    .map((group) => {
      const items = group.items.filter((it) => {
        if (!q) return true;
        return [it.name, it.area, it.desc, it.distanceBadge].join(' ').toLowerCase().includes(q);
      });

      if (!items.length) return '';

      return `
        <div class="extended-group-block">
          <div class="extended-group-header">
            <h3>${group.groupTitle}</h3>
            <p>${group.groupSubtitle}</p>
          </div>
          <div class="extended-grid">
            ${items
              .map(
                (it) => `
              <div class="ext-card">
                <div class="ext-card-top">
                  <div class="ext-thumb">
                    <img src="${it.image}" alt="${it.name}" loading="lazy" />
                  </div>
                  <div class="ext-info">
                    <div class="ext-meta">${it.distanceBadge}｜${it.area}</div>
                    <h4>${it.name}</h4>
                    <p class="ext-desc">${it.desc}</p>
                  </div>
                </div>
                <div class="ext-actions">
                  <a href="${it.websiteUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-emerald btn-sm btn-flex">
                    🌐 網站 / 資訊
                  </a>
                  <a href="${it.mapsUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-gold btn-sm btn-flex">
                    📍 Google Maps
                  </a>
                  <button type="button" class="btn btn-outline btn-sm" data-copy-text="${it.name}" title="複製店名">
                    📋
                  </button>
                </div>
              </div>
            `
              )
              .join('')}
          </div>
        </div>
      `;
    })
    .filter(Boolean)
    .join('');

  mount.innerHTML =
    blocksHTML ||
    `<div class="empty-state-box"><h3>找不到符合條件的延伸備案</h3><p>請嘗試切換篩選條件或清除搜尋關鍵字。</p></div>`;
}

function renderSavedGrid() {
  const mount = document.getElementById('saved-grid-mount');
  if (!mount) return;

  const allVenues = getAllPrimaryVenues();
  const savedItems = allVenues.filter((v) => state.savedIds.includes(v.id));

  if (!savedItems.length) {
    mount.innerHTML = `
      <div class="empty-state-box">
        <h3>尚未收藏任何店家</h3>
        <p>瀏覽「頂級 SPA 按摩」、「米其林必比登」或「中文友善大麻店」分頁時，點擊照片右上角的「♡ 收藏」即可建立你的 12/18–12/20 專屬清單！</p>
      </div>
    `;
    return;
  }

  mount.innerHTML = savedItems.map(createVenueCardHTML).join('');
}

function renderAllGrids() {
  renderSpaGrid();
  renderMichelinGrid();
  renderCannabisGrid();
  renderExtendedSections();
  renderSavedGrid();
  updateSavedCountBadge();
}

// =========================================
// 5. Tab 切換與跨分頁搜尋處理
// =========================================
function switchTab(tabId) {
  state.activeTab = tabId;

  document.querySelectorAll('.tab-btn').forEach((btn) => {
    const isMatch = btn.getAttribute('data-tab') === tabId;
    btn.classList.toggle('active', isMatch);
    btn.setAttribute('aria-selected', isMatch ? 'true' : 'false');
  });

  document.querySelectorAll('.tab-panel').forEach((panel) => {
    panel.classList.toggle('active', panel.id === tabId);
  });
}

function handleGlobalSearch(query) {
  state.searchQuery = query;
  const clearBtn = document.getElementById('clear-search-btn');
  const statusBar = document.getElementById('search-status-bar');
  const keywordDisplay = document.getElementById('search-keyword-display');
  const countDisplay = document.getElementById('search-count-display');

  const trimmed = query.trim();
  clearBtn?.classList.toggle('hidden', !trimmed);

  renderAllGrids();

  if (trimmed) {
    // 計算總命中筆數並顯示所有命中的分頁區塊
    const primaryMatches = getAllPrimaryVenues().filter((v) => matchesQuery(v, trimmed)).length;
    const extMatches = extendedSections.reduce(
      (acc, g) =>
        acc +
        g.items.filter((it) =>
          [it.name, it.area, it.desc, it.distanceBadge].join(' ').toLowerCase().includes(trimmed.toLowerCase())
        ).length,
      0
    );
    const total = primaryMatches + extMatches;

    statusBar?.classList.remove('hidden');
    if (keywordDisplay) keywordDisplay.textContent = trimmed;
    if (countDisplay) countDisplay.textContent = String(total);

    // 搜尋時展開所有含有結果的攻略分頁方便一次瀏覽
    document.getElementById('tab-hotel')?.classList.remove('active');
    document.getElementById('tab-spa')?.classList.add('active');
    document.getElementById('tab-michelin')?.classList.add('active');
    document.getElementById('tab-cannabis')?.classList.add('active');
    document.getElementById('tab-extended')?.classList.add('active');
    document.getElementById('tab-saved')?.classList.remove('active');
  } else {
    statusBar?.classList.add('hidden');
    switchTab(state.activeTab);
  }
}

// =========================================
// 6. 店家圖輯與詳情 Modal
// =========================================
function openVenueModal(venueId) {
  const venue = getAllPrimaryVenues().find((v) => v.id === venueId);
  if (!venue) return;

  const modal = document.getElementById('detail-modal');
  const mount = document.getElementById('modal-body-mount');
  if (!modal || !mount) return;

  const photos = venue.gallery && venue.gallery.length ? venue.gallery : [venue.image];

  mount.innerHTML = `
    <div class="modal-gallery-main">
      <img id="modal-active-img" src="${photos[0]}" alt="${venue.name}" onerror="this.onerror=null;this.src='${venue.fallbackImage}';" />
    </div>
    ${
      photos.length > 1
        ? `
      <div class="modal-thumbs">
        ${photos
          .map(
            (url, idx) => `
          <div class="modal-thumb ${idx === 0 ? 'active' : ''}" data-modal-photo="${url}">
            <img src="${url}" alt="${venue.name} 圖輯 ${idx + 1}" onerror="this.onerror=null;this.src='${venue.fallbackImage}';" />
          </div>
        `
          )
          .join('')}
      </div>
    `
        : ''
    }
    <div class="modal-content-pad">
      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px;">
        <span class="venue-tag">📍 ${venue.area}</span>
        <span class="venue-tag">${venue.distanceBadge}</span>
        ${venue.award ? `<span class="venue-tag">🏆 ${venue.award}</span>` : ''}
      </div>
      <h2 id="modal-title" class="venue-title" style="font-size:1.5rem;margin-bottom:6px;">${venue.name}</h2>
      ${venue.subName ? `<p class="venue-subtitle">${venue.subName}</p>` : ''}

      <div class="venue-info-list" style="margin: 18px 0;">
        <div class="info-row">
          <strong>🚕 距離與交通（從 Travelodge Sukhumvit 11 出發）</strong>
          <span>${venue.distanceDetail}</span>
        </div>
        <div class="info-row">
          <strong>✨ 主打特色與必點推薦</strong>
          <span>${venue.highlight}</span>
        </div>
        ${
          venue.noteText
            ? `
          <div class="info-row">
            <strong>💡 ${venue.noteLabel || '行前須知'}</strong>
            <span>${venue.noteText}</span>
          </div>
        `
            : ''
        }
      </div>

      <div style="display:flex;flex-wrap:wrap;gap:10px;">
        <a href="${venue.websiteUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-emerald">
          🌐 前往${venue.websiteLabel || '官方網站'}
        </a>
        <a href="${venue.mapsUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-gold">
          📍 開啟 Google Maps 導航
        </a>
        <button type="button" class="btn btn-outline" data-copy-text="${venue.grabSearch || venue.name}">
          🚕 複製店名叫 Grab (${venue.grabSearch || venue.name})
        </button>
      </div>
    </div>
  `;

  mount.querySelectorAll('[data-modal-photo]').forEach((thumb) => {
    thumb.addEventListener('click', () => {
      const url = thumb.getAttribute('data-modal-photo');
      const mainImg = document.getElementById('modal-active-img');
      if (mainImg && url) mainImg.src = url;
      mount.querySelectorAll('.modal-thumb').forEach((t) => t.classList.remove('active'));
      thumb.classList.add('active');
    });
  });

  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
}

function closeVenueModal() {
  const modal = document.getElementById('detail-modal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
}

// =========================================
// 7. Toast 提示與剪貼簿複製
// =========================================
let toastTimer = null;
function showToast(message) {
  const toast = document.getElementById('toast-notification');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.remove('hidden');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.add('hidden');
  }, 2600);
}

async function copyTextToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(`✅ 已複製「${text}」，可直接貼上 Grab 或 Google Maps！`);
  } catch {
    showToast(`📋 店名：${text}`);
  }
}

// =========================================
// 8. 初始化與事件委派
// =========================================
function initApp() {
  renderHotelSection();
  renderWarnings();
  renderAllGrids();

  // 頂部 Tab 點擊事件
  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      if (state.searchQuery) {
        const input = document.getElementById('global-search-input');
        if (input) input.value = '';
        state.searchQuery = '';
        document.getElementById('clear-search-btn')?.classList.add('hidden');
        document.getElementById('search-status-bar')?.classList.add('hidden');
        renderAllGrids();
      }
      if (targetTab) switchTab(targetTab);
    });
  });

  // Hero 房型縮圖點擊跳轉住宿分頁
  document.getElementById('hero-room-thumb')?.addEventListener('click', () => {
    switchTab('tab-hotel');
    window.scrollTo({ top: document.getElementById('sticky-nav').offsetTop - 10, behavior: 'smooth' });
  });

  // 子分類 Filter Pills 點擊事件
  document.querySelectorAll('[data-filter-group]').forEach((groupEl) => {
    const groupName = groupEl.getAttribute('data-filter-group');
    groupEl.querySelectorAll('.filter-pill').forEach((pill) => {
      pill.addEventListener('click', () => {
        const filterVal = pill.getAttribute('data-filter') || 'all';
        state.filters[groupName] = filterVal;
        groupEl.querySelectorAll('.filter-pill').forEach((p) => p.classList.remove('active'));
        pill.classList.add('active');
        renderAllGrids();
      });
    });
  });

  // 全站搜尋框事件
  const searchInput = document.getElementById('global-search-input');
  searchInput?.addEventListener('input', (e) => {
    handleGlobalSearch(e.target.value);
  });

  const clearSearch = () => {
    if (searchInput) searchInput.value = '';
    handleGlobalSearch('');
  };
  document.getElementById('clear-search-btn')?.addEventListener('click', clearSearch);
  document.getElementById('reset-search-btn')?.addEventListener('click', clearSearch);

  // 清空收藏按鈕
  document.getElementById('clear-saved-btn')?.addEventListener('click', () => {
    state.savedIds = [];
    persistSavedIds();
    renderAllGrids();
    showToast('🗑️ 已清空收藏清單');
  });

  // 全域事件委派：收藏切換、開啟圖輯 Modal、複製店名
  document.addEventListener('click', (e) => {
    const saveBtn = e.target.closest('[data-toggle-save]');
    if (saveBtn) {
      e.stopPropagation();
      const id = saveBtn.getAttribute('data-toggle-save');
      if (state.savedIds.includes(id)) {
        state.savedIds = state.savedIds.filter((item) => item !== id);
        showToast('已從收藏清單移除');
      } else {
        state.savedIds.push(id);
        showToast('❤️ 已加入「我的收藏」清單！');
      }
      persistSavedIds();
      renderAllGrids();
      return;
    }

    const copyBtn = e.target.closest('[data-copy-text]');
    if (copyBtn) {
      e.stopPropagation();
      const text = copyBtn.getAttribute('data-copy-text');
      if (text) copyTextToClipboard(text);
      return;
    }

    const modalTrigger = e.target.closest('[data-open-modal]');
    if (modalTrigger) {
      const id = modalTrigger.getAttribute('data-open-modal');
      if (id) openVenueModal(id);
      return;
    }
  });

  // 關閉 Modal 事件
  document.getElementById('modal-close-btn')?.addEventListener('click', closeVenueModal);
  document.getElementById('detail-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'detail-modal') closeVenueModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeVenueModal();
  });
}

document.addEventListener('DOMContentLoaded', initApp);

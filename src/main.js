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
  hotelGalleryFilter: 'all',
  filters: {
    spa: 'all',
    michelin: 'all',
    cannabis: 'all',
    extended: 'all'
  },
  spotlightIndex: {
    spa: 0,
    michelin: 0,
    cannabis: 0,
    extended: 0
  },
  spotlightPhotoIdx: {
    spa: 0,
    michelin: 0,
    cannabis: 0,
    extended: 0
  },
  showFullGrid: {
    spa: false,
    michelin: false,
    cannabis: false,
    extended: false
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

function getAllExtendedVenues() {
  const result = [];
  let counter = 1;
  for (const group of extendedSections) {
    for (const it of group.items) {
      result.push({
        ...it,
        number: counter++,
        category: 'extended',
        badge: group.groupTitle,
        subName: group.groupSubtitle,
        distanceDetail: `${it.distanceBadge}（位於 ${it.area}）`,
        highlight: it.desc,
        fallbackImage: it.image,
        gallery: [it.image],
        websiteLabel: '官方網站 / 店家資訊',
        grabSearch: it.name
      });
    }
  }
  return result;
}

function getAllPrimaryVenues() {
  return [...spaList, ...michelinList, ...cannabisList, ...getAllExtendedVenues()];
}

// =========================================
// 1. 渲染 TAB 1: Travelodge Sukhumvit 11 住宿與房型專區
// =========================================
function renderHotelSection() {
  const mount = document.getElementById('hotel-section-mount');
  if (!mount) return;

  const totalPhotos = hotelInfo.gallery.length;
  const currentPhoto = hotelInfo.gallery[state.hotelPhotoIndex] || hotelInfo.gallery[0];

  const filteredGallery = hotelInfo.gallery
    .map((item, index) => ({ ...item, originalIndex: index }))
    .filter((item) => state.hotelGalleryFilter === 'all' || item.group === state.hotelGalleryFilter);

  mount.innerHTML = `
    <div class="section-intro-bar">
      <div>
        <span class="section-eyebrow">ACCOMMODATION DETAILS・12/18 – 12/20</span>
        <h2 class="section-heading">🏨 住宿資訊：Travelodge Sukhumvit 11</h2>
        <p class="section-desc">本次曼谷行下榻飯店、入住房型（Superior Premium Room 雙人房）與 25 張官方實景照片總覽。</p>
      </div>
    </div>

    <!-- 專屬住宿憑證卡 (僅顯示於住宿資訊 Tab) -->
    <div class="stay-pass-banner" style="margin-bottom: 26px;">
      <div class="stay-pass-left">
        <div class="stay-pass-thumb" data-open-hotel-lightbox="${state.hotelPhotoIndex}">
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
        <!-- 左側：Superior Premium Room 與飯店實景互動畫廊 (25 張) -->
        <div class="hotel-gallery-stage">
          <div class="hotel-main-photo-wrap">
            <img
              id="hotel-main-img"
              src="${currentPhoto.url}"
              alt="${currentPhoto.caption}"
              data-open-hotel-lightbox="${state.hotelPhotoIndex}"
              style="cursor: zoom-in;"
              title="點擊放大檢視高畫質原圖"
            />
            <span class="hotel-photo-tag" id="hotel-main-tag">📸 ${currentPhoto.tag} (${state.hotelPhotoIndex + 1} / ${totalPhotos})</span>
            <button type="button" class="hotel-nav-arrow prev" id="hotel-prev-btn" aria-label="上一張照片">‹</button>
            <button type="button" class="hotel-nav-arrow next" id="hotel-next-btn" aria-label="下一張照片">›</button>
            <div class="hotel-photo-caption" id="hotel-main-caption">${currentPhoto.caption}</div>
          </div>
          <div class="hotel-thumb-strip" id="hotel-thumb-strip">
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

    <!-- 25 張完整房型與飯店實景圖輯專區 -->
    <div class="section-intro-bar" style="margin-top: 36px;">
      <div>
        <span class="section-eyebrow">OFFICIAL PHOTO GALLERY・25 PHOTOS</span>
        <h2 class="section-heading">📸 Superior Premium Room ＆ 飯店實景圖輯（共 ${totalPhotos} 張）</h2>
        <p class="section-desc">完整收錄 Travelodge Sukhumvit 11 的 Superior Premium Room 房內實景、乾濕分離花灑衛浴、頂樓泳池、健身房、大廳與 The Lodge 餐廳（點擊任一照片可放大檢視）。</p>
      </div>
      <div class="filter-pills" id="hotel-gallery-filter-pills">
        <button class="filter-pill ${state.hotelGalleryFilter === 'all' ? 'active' : ''}" data-hfilter="all">全部照片 (${totalPhotos})</button>
        <button class="filter-pill ${state.hotelGalleryFilter === 'room' ? 'active' : ''}" data-hfilter="room">🛏️ Superior Premium 房型 (12)</button>
        <button class="filter-pill ${state.hotelGalleryFilter === 'bathroom' ? 'active' : ''}" data-hfilter="bathroom">🚿 乾濕分離衛浴 (3)</button>
        <button class="filter-pill ${state.hotelGalleryFilter === 'pool' ? 'active' : ''}" data-hfilter="pool">🏊 頂樓泳池與健身房 (4)</button>
        <button class="filter-pill ${state.hotelGalleryFilter === 'hotel' ? 'active' : ''}" data-hfilter="hotel">🏨 外觀・大廳・餐廳 (6)</button>
      </div>
    </div>

    <div class="hotel-full-gallery-grid">
      ${filteredGallery
        .map(
          (item) => `
        <div class="hotel-gallery-card" data-open-hotel-lightbox="${item.originalIndex}">
          <div class="hotel-gallery-img-wrap">
            <img src="${item.url}" alt="${item.caption}" loading="lazy" />
            <span class="hotel-gallery-num">#${String(item.originalIndex + 1).padStart(2, '0')}</span>
            <span class="hotel-gallery-tag">${item.tag}</span>
          </div>
          <div class="hotel-gallery-card-caption">${item.caption}</div>
        </div>
      `
        )
        .join('')}
    </div>

    <!-- 四大主題攻略快速傳送門 -->
    <div class="section-intro-bar" style="margin-top: 42px;">
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

  // 綁定飯店主圖左右切換按鈕
  document.getElementById('hotel-prev-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    state.hotelPhotoIndex = (state.hotelPhotoIndex - 1 + totalPhotos) % totalPhotos;
    renderHotelSection();
  });

  document.getElementById('hotel-next-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    state.hotelPhotoIndex = (state.hotelPhotoIndex + 1) % totalPhotos;
    renderHotelSection();
  });

  // 綁定飯店縮圖點擊切換
  mount.querySelectorAll('[data-photo-idx]').forEach((thumb) => {
    thumb.addEventListener('click', () => {
      state.hotelPhotoIndex = Number(thumb.getAttribute('data-photo-idx'));
      renderHotelSection();
    });
  });

  // 確保選中的縮圖滾動至可視範圍
  const activeThumb = mount.querySelector('.hotel-thumb-item.active');
  activeThumb?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });

  // 綁定 25 張圖輯分類篩選按鈕
  mount.querySelectorAll('[data-hfilter]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.hotelGalleryFilter = btn.getAttribute('data-hfilter') || 'all';
      renderHotelSection();
    });
  });

  // 綁定點擊飯店照片開啟全螢幕燈箱 Modal
  mount.querySelectorAll('[data-open-hotel-lightbox]').forEach((el) => {
    el.addEventListener('click', () => {
      const idx = Number(el.getAttribute('data-open-hotel-lightbox'));
      openHotelLightboxModal(idx);
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

function openHotelLightboxModal(startIndex = 0) {
  let currentIdx = startIndex;
  const total = hotelInfo.gallery.length;
  const modal = document.getElementById('detail-modal');
  const mount = document.getElementById('modal-body-mount');
  if (!modal || !mount) return;

  const renderModalContent = () => {
    const photo = hotelInfo.gallery[currentIdx] || hotelInfo.gallery[0];
    mount.innerHTML = `
      <div class="modal-gallery-main">
        <img src="${photo.url}" alt="${photo.caption}" />
        <button type="button" class="hotel-nav-arrow prev" id="modal-hotel-prev" aria-label="上一張">‹</button>
        <button type="button" class="hotel-nav-arrow next" id="modal-hotel-next" aria-label="下一張">›</button>
        <span class="hotel-photo-tag">📸 ${photo.tag} (${currentIdx + 1} / ${total})</span>
      </div>
      <div class="modal-thumbs">
        ${hotelInfo.gallery
          .map(
            (item, idx) => `
          <div class="modal-thumb ${idx === currentIdx ? 'active' : ''}" data-modal-hidx="${idx}" style="flex-shrink:0;">
            <img src="${item.url}" alt="${item.tag}" loading="lazy" />
          </div>
        `
          )
          .join('')}
      </div>
      <div class="modal-content-pad">
        <h3 id="modal-title" class="venue-title" style="font-size:1.25rem;margin-bottom:6px;">${photo.caption}</h3>
        <p class="venue-subtitle" style="margin-bottom:0;">Travelodge Sukhumvit 11 — Superior Premium Room（12/18 - 12/20 雙人房）</p>
      </div>
    `;

    mount.querySelector('#modal-hotel-prev')?.addEventListener('click', () => {
      currentIdx = (currentIdx - 1 + total) % total;
      state.hotelPhotoIndex = currentIdx;
      renderModalContent();
      renderHotelSection();
    });

    mount.querySelector('#modal-hotel-next')?.addEventListener('click', () => {
      currentIdx = (currentIdx + 1) % total;
      state.hotelPhotoIndex = currentIdx;
      renderModalContent();
      renderHotelSection();
    });

    mount.querySelectorAll('[data-modal-hidx]').forEach((t) => {
      t.addEventListener('click', () => {
        currentIdx = Number(t.getAttribute('data-modal-hidx'));
        state.hotelPhotoIndex = currentIdx;
        renderModalContent();
        renderHotelSection();
      });
    });

    const activeModalThumb = mount.querySelector('.modal-thumb.active');
    activeModalThumb?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  };

  renderModalContent();
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
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
// 4. 互動式分類主視窗舞台 (左右滑動選店瀏覽) & 網格渲染
// =========================================
function getShortVenueName(name) {
  return name.split(' – ')[0].split(' - ')[0].split('（')[0].trim();
}

function renderCategorySpotlight(categoryKey, items, spotlightMountId, gridMountId) {
  const spotMount = document.getElementById(spotlightMountId);
  const gridMount = document.getElementById(gridMountId);
  if (!spotMount) return;

  if (!items.length) {
    spotMount.innerHTML = `<div class="empty-state-box" style="margin-bottom:24px;"><h3>找不到符合條件的店家</h3><p>請嘗試切換右上角篩選條件或清除搜尋關鍵字。</p></div>`;
    if (gridMount) gridMount.classList.add('hidden');
    return;
  }

  let currentIdx = state.spotlightIndex[categoryKey] || 0;
  if (currentIdx >= items.length || currentIdx < 0) {
    currentIdx = 0;
    state.spotlightIndex[categoryKey] = 0;
  }

  const item = items[currentIdx];
  const photos = item.gallery && item.gallery.length ? item.gallery : [item.image];
  let photoIdx = state.spotlightPhotoIdx[categoryKey] || 0;
  if (photoIdx >= photos.length || photoIdx < 0) {
    photoIdx = 0;
    state.spotlightPhotoIdx[categoryKey] = 0;
  }
  const activePhoto = photos[photoIdx] || item.image;
  const isSaved = state.savedIds.includes(item.id);
  const isGridOpen = Boolean(state.showFullGrid[categoryKey]) || Boolean(state.searchQuery.trim());

  const prevIdx = (currentIdx - 1 + items.length) % items.length;
  const nextIdx = (currentIdx + 1) % items.length;
  const prevItem = items[prevIdx];
  const nextItem = items[nextIdx];

  let badgeBannerHTML = '';
  if (item.category === 'michelin') {
    const awardClass =
      item.awardType === 'star' ? 'award-star' : item.awardType === 'bib' ? 'award-bib' : 'award-selected';
    badgeBannerHTML = `<span class="venue-award-banner ${awardClass}">🏆 ${item.award}</span>`;
  } else if (item.badge) {
    badgeBannerHTML = `<span class="venue-award-banner award-cannabis">${item.badge}</span>`;
  } else {
    badgeBannerHTML = `<span class="venue-award-banner award-cannabis">💆‍♀️ 精選頂級 SPA 名店 #${String(item.number).padStart(2, '0')}</span>`;
  }

  const firstRowLabel =
    item.category === 'michelin'
      ? '🍴 必點招牌與料理特色'
      : item.category === 'cannabis'
      ? '🌿 經營背景與特色優勢'
      : '✨ 主打特色與必去亮點';

  spotMount.innerHTML = `
    <div class="venue-spotlight-card" data-spot-category="${categoryKey}">
      <!-- 頂部：可左右滑動選店導覽列 -->
      <div class="spotlight-rail-header">
        <div class="spotlight-rail-title">
          <span class="rail-pulse-dot"></span>
          <span>👆 左右滑動或點擊下方卡片切換店家</span>
          <strong class="rail-counter-pill">第 ${currentIdx + 1} / ${items.length} 間</strong>
        </div>
        <div class="spotlight-rail-controls">
          <button type="button" class="rail-step-btn" data-spot-prev="${categoryKey}" title="上一間：${prevItem.name}">
            ‹ 上一間店
          </button>
          <button type="button" class="rail-step-btn" data-spot-next="${categoryKey}" title="下一間：${nextItem.name}">
            下一間店 ›
          </button>
          <button type="button" class="rail-toggle-grid-btn ${isGridOpen ? 'active' : ''}" data-toggle-grid="${categoryKey}">
            ${isGridOpen ? '🔼 收合下方全店列表' : `📋 展開全店卡片總覽 (${items.length})`}
          </button>
        </div>
      </div>

      <!-- 店家水平滑動快選膠囊軌道 -->
      <div class="spotlight-rail-track" id="spot-rail-${categoryKey}">
        ${items
          .map(
            (v, idx) => `
          <button
            type="button"
            class="spotlight-shop-pill ${idx === currentIdx ? 'active' : ''}"
            data-spot-select="${categoryKey}"
            data-spot-idx="${idx}"
          >
            <div class="shop-pill-thumb">
              <img src="${v.image}" alt="${v.name}" loading="lazy" onerror="this.onerror=null;this.src='${v.fallbackImage || v.image}';" />
            </div>
            <div class="shop-pill-meta">
              <div class="shop-pill-top">
                <span class="shop-pill-num">#${String(idx + 1).padStart(2, '0')}</span>
                <span class="shop-pill-dist">${v.distanceBadge}</span>
              </div>
              <div class="shop-pill-name">${getShortVenueName(v.name)}</div>
            </div>
          </button>
        `
          )
          .join('')}
      </div>

      <!-- 主視窗雙欄舞台 (左：3:2 零出血互動畫框 / 右：完整店家攻略) -->
      <div class="hotel-hero-grid spotlight-stage-grid" id="spot-touch-zone-${categoryKey}">
        <div class="hotel-gallery-stage">
          <div class="hotel-main-photo-wrap">
            <img
              src="${activePhoto}"
              alt="${item.name}"
              data-open-modal="${item.id}"
              style="cursor: zoom-in;"
              title="點擊放大檢視高畫質大圖"
              onerror="this.onerror=null;this.src='${item.fallbackImage || item.image}';"
            />
            <span class="hotel-photo-tag">
              #${String(currentIdx + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}｜📍 ${item.area}
            </span>
            <button
              type="button"
              class="venue-save-btn ${isSaved ? 'saved' : ''}"
              data-toggle-save="${item.id}"
              style="top: 14px; right: 14px; z-index: 6;"
            >
              ${isSaved ? '♥ 已收藏' : '♡ 收藏'}
            </button>
            <button
              type="button"
              class="hotel-nav-arrow prev"
              data-spot-prev="${categoryKey}"
              title="上一間店：${prevItem.name}"
              aria-label="上一間店"
            >‹</button>
            <button
              type="button"
              class="hotel-nav-arrow next"
              data-spot-next="${categoryKey}"
              title="下一間店：${nextItem.name}"
              aria-label="下一間店"
            >›</button>
            <div class="hotel-photo-caption">
              <span>${item.distanceBadge} — ${getShortVenueName(item.name)}</span>
            </div>
          </div>

          <!-- 底部：同店照片切換 & 快速跳店列 -->
          <div class="spotlight-subbar">
            <div class="spotlight-subphotos">
              ${photos
                .map(
                  (pUrl, pIdx) => `
                <div
                  class="hotel-thumb-item ${pIdx === photoIdx ? 'active' : ''}"
                  data-spot-photo-cat="${categoryKey}"
                  data-spot-photo-idx="${pIdx}"
                  title="切換店內實景圖 ${pIdx + 1}"
                >
                  <img src="${pUrl}" alt="${item.name} 照片 ${pIdx + 1}" onerror="this.onerror=null;this.src='${item.fallbackImage || item.image}';" />
                </div>
              `
                )
                .join('')}
            </div>
            <button type="button" class="spotlight-zoom-btn" data-open-modal="${item.id}">
              🔍 放大檢視大圖 (${photos.length} 張)
            </button>
          </div>
        </div>

        <!-- 右側：選中店家的完整攻略資訊 -->
        <div class="hotel-details-pane spotlight-details-pane">
          <div>
            <div class="spotlight-badge-row">
              ${badgeBannerHTML}
              <span class="spotlight-distance-chip">${item.distanceBadge}</span>
            </div>

            <h2 class="hotel-pane-title" style="font-size: 1.65rem; margin-bottom: 4px;">${item.name}</h2>
            <p class="hotel-pane-thai">${item.subName ? `${item.subName}｜📍 ${item.area}` : `📍 所在區域：${item.area}`}</p>

            ${
              item.tags && item.tags.length
                ? `
              <div class="venue-tags" style="margin-bottom: 16px;">
                ${item.tags.map((t) => `<span class="venue-tag">${t}</span>`).join('')}
              </div>
            `
                : ''
            }

            <div class="venue-info-list" style="margin-bottom: 18px;">
              <div class="info-row">
                <strong>🚕 距離與交通（從 Travelodge Sukhumvit 11 出發）</strong>
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

          <div>
            <div class="hotel-action-row" style="margin-bottom: 16px;">
              <a href="${item.websiteUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-emerald">
                🌐 ${item.websiteLabel || '官方網站'}
              </a>
              <a href="${item.mapsUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-gold">
                📍 Google Maps 導航
              </a>
              <button type="button" class="btn btn-outline" data-copy-text="${item.grabSearch || item.name}">
                🚕 複製店名叫 Grab
              </button>
            </div>

            <!-- 底部快速前後切換店家導覽列 -->
            <div class="spotlight-bottom-pager">
              <button type="button" class="pager-nav-btn" data-spot-prev="${categoryKey}">
                <span class="pager-dir">← 上一間</span>
                <strong class="pager-venue-name">${getShortVenueName(prevItem.name)}</strong>
              </button>
              <div class="pager-indicator">
                ${currentIdx + 1} / ${items.length}
              </div>
              <button type="button" class="pager-nav-btn align-right" data-spot-next="${categoryKey}">
                <span class="pager-dir">下一間 →</span>
                <strong class="pager-venue-name">${getShortVenueName(nextItem.name)}</strong>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  if (gridMount) {
    gridMount.classList.toggle('hidden', !isGridOpen);
  }

  // 讓目前選中的店家膠囊平滑滾動置中於水平軌道內
  const railEl = document.getElementById(`spot-rail-${categoryKey}`);
  const activePill = railEl?.querySelector('.spotlight-shop-pill.active');
  if (railEl && activePill) {
    const targetLeft = activePill.offsetLeft - railEl.clientWidth / 2 + activePill.clientWidth / 2;
    railEl.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
  }

  // 綁定觸控左右滑動手勢 (手機/平板直接左右滑動主視窗即可切換店家)
  const touchZone = document.getElementById(`spot-touch-zone-${categoryKey}`);
  if (touchZone) {
    let startX = 0;
    let startY = 0;
    touchZone.addEventListener(
      'touchstart',
      (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      },
      { passive: true }
    );
    touchZone.addEventListener(
      'touchend',
      (e) => {
        const dx = e.changedTouches[0].clientX - startX;
        const dy = e.changedTouches[0].clientY - startY;
        if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.4) {
          if (dx < 0) {
            state.spotlightIndex[categoryKey] = nextIdx;
          } else {
            state.spotlightIndex[categoryKey] = prevIdx;
          }
          state.spotlightPhotoIdx[categoryKey] = 0;
          renderAllGrids();
        }
      },
      { passive: true }
    );
  }
}

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

  renderCategorySpotlight('spa', filtered, 'spa-spotlight-mount', 'spa-grid-mount');

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

  renderCategorySpotlight('michelin', filtered, 'michelin-spotlight-mount', 'michelin-grid-mount');

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

  renderCategorySpotlight('cannabis', filtered, 'cannabis-spotlight-mount', 'cannabis-grid-mount');

  mount.innerHTML = filtered.length
    ? filtered.map(createVenueCardHTML).join('')
    : `<div class="empty-state-box"><h3>找不到符合條件的大麻店</h3><p>請嘗試切換篩選條件或清除搜尋關鍵字。</p></div>`;
}

function renderExtendedSections() {
  const mount = document.getElementById('extended-sections-mount');
  if (!mount) return;

  const filter = state.filters.extended;
  const q = state.searchQuery.trim().toLowerCase();

  const flatFiltered = [];
  let num = 1;
  extendedSections
    .filter((group) => filter === 'all' || group.groupId === filter)
    .forEach((group) => {
      group.items.forEach((it) => {
        if (q && ![it.name, it.area, it.desc, it.distanceBadge].join(' ').toLowerCase().includes(q)) {
          return;
        }
        flatFiltered.push({
          ...it,
          number: num++,
          category: 'extended',
          badge: group.groupTitle,
          subName: group.groupSubtitle,
          distanceDetail: `${it.distanceBadge}（位於 ${it.area}）`,
          highlight: it.desc,
          fallbackImage: it.image,
          gallery: [it.image],
          websiteLabel: '官方網站 / 店家資訊',
          grabSearch: it.name
        });
      });
    });

  renderCategorySpotlight('extended', flatFiltered, 'extended-spotlight-mount', 'extended-sections-mount');

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

  const initialHash = window.location.hash.replace('#', '');
  if (['tab-hotel', 'tab-spa', 'tab-michelin', 'tab-cannabis', 'tab-extended', 'tab-saved'].includes(initialHash)) {
    switchTab(initialHash);
  }

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
        state.spotlightIndex[groupName] = 0;
        state.spotlightPhotoIdx[groupName] = 0;
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

    const spotSelect = e.target.closest('[data-spot-select]');
    if (spotSelect) {
      e.stopPropagation();
      const cat = spotSelect.getAttribute('data-spot-select');
      const idx = Number(spotSelect.getAttribute('data-spot-idx'));
      if (cat && !Number.isNaN(idx)) {
        state.spotlightIndex[cat] = idx;
        state.spotlightPhotoIdx[cat] = 0;
        renderAllGrids();
      }
      return;
    }

    const spotPrev = e.target.closest('[data-spot-prev]');
    if (spotPrev) {
      e.stopPropagation();
      const cat = spotPrev.getAttribute('data-spot-prev');
      if (cat) {
        const rail = document.getElementById(`spot-rail-${cat}`);
        const count = rail ? rail.querySelectorAll('.spotlight-shop-pill').length : 1;
        state.spotlightIndex[cat] = ((state.spotlightIndex[cat] || 0) - 1 + count) % Math.max(1, count);
        state.spotlightPhotoIdx[cat] = 0;
        renderAllGrids();
      }
      return;
    }

    const spotNext = e.target.closest('[data-spot-next]');
    if (spotNext) {
      e.stopPropagation();
      const cat = spotNext.getAttribute('data-spot-next');
      if (cat) {
        const rail = document.getElementById(`spot-rail-${cat}`);
        const count = rail ? rail.querySelectorAll('.spotlight-shop-pill').length : 1;
        state.spotlightIndex[cat] = ((state.spotlightIndex[cat] || 0) + 1) % Math.max(1, count);
        state.spotlightPhotoIdx[cat] = 0;
        renderAllGrids();
      }
      return;
    }

    const spotPhotoThumb = e.target.closest('[data-spot-photo-cat]');
    if (spotPhotoThumb) {
      e.stopPropagation();
      const cat = spotPhotoThumb.getAttribute('data-spot-photo-cat');
      const pIdx = Number(spotPhotoThumb.getAttribute('data-spot-photo-idx'));
      if (cat && !Number.isNaN(pIdx)) {
        state.spotlightPhotoIdx[cat] = pIdx;
        renderAllGrids();
      }
      return;
    }

    const toggleGridBtn = e.target.closest('[data-toggle-grid]');
    if (toggleGridBtn) {
      e.stopPropagation();
      const cat = toggleGridBtn.getAttribute('data-toggle-grid');
      if (cat) {
        state.showFullGrid[cat] = !state.showFullGrid[cat];
        renderAllGrids();
      }
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

  // 關閉 Modal 與鍵盤左右鍵快速切換店家事件
  document.getElementById('modal-close-btn')?.addEventListener('click', closeVenueModal);
  document.getElementById('detail-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'detail-modal') closeVenueModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeVenueModal();
      return;
    }
    const modalOpen = !document.getElementById('detail-modal')?.classList.contains('hidden');
    const activeInput = document.activeElement?.tagName === 'INPUT';
    if (modalOpen || activeInput) return;

    const tabToCat = {
      'tab-spa': 'spa',
      'tab-michelin': 'michelin',
      'tab-cannabis': 'cannabis',
      'tab-extended': 'extended'
    };
    const cat = tabToCat[state.activeTab];
    if (!cat) return;

    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      const rail = document.getElementById(`spot-rail-${cat}`);
      const count = rail ? rail.querySelectorAll('.spotlight-shop-pill').length : 0;
      if (count > 1) {
        const delta = e.key === 'ArrowRight' ? 1 : -1;
        state.spotlightIndex[cat] = ((state.spotlightIndex[cat] || 0) + delta + count) % count;
        state.spotlightPhotoIdx[cat] = 0;
        renderAllGrids();
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', initApp);

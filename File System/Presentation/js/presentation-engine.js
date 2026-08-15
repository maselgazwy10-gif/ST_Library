// UserFS Undertale Presentation Engine (Enhanced VFX & Interactive Audio)

class PresentationEngine {
  constructor() {
    this.currentIndex = 0;
    this.slides = [];
    this.maxSlides = window.PRESENTATION_MAX_SLIDES || 86;
    this.soundEnabled = true;
    this.crtEnabled = true;
    this.cursorEnabled = true;

    this.init();
  }

  init() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('max')) {
      this.maxSlides = parseInt(urlParams.get('max'), 10) || this.maxSlides;
    }

    this.slidesData = SLIDES_DATA.slice(0, this.maxSlides);
    this.totalSlides = this.slidesData.length;

    this.renderSlides();
    this.renderOverviewModal();
    this.setupEventListeners();
    this.setupBackgroundCanvas();
    this.setupPixelCursor();

    let startSlide = 0;
    if (window.location.hash) {
      const hashNum = parseInt(window.location.hash.replace('#slide-', ''), 10);
      if (!isNaN(hashNum) && hashNum >= 1 && hashNum <= this.totalSlides) {
        startSlide = hashNum - 1;
      }
    }

    this.goToSlide(startSlide, false);
  }

  setupBackgroundCanvas() {
    this.bgCanvas = new PixelBackgroundCanvas('pixel-bg-canvas');
  }

  setupPixelCursor() {
    let cursor = document.getElementById('pixel-soul-cursor');
    if (!cursor) {
      cursor = document.createElement('div');
      cursor.id = 'pixel-soul-cursor';
      document.body.appendChild(cursor);
    }

    let lastTrailTime = 0;
    window.addEventListener('mousemove', (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;

      const now = Date.now();
      if (now - lastTrailTime > 45) {
        lastTrailTime = now;
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.left = `${e.clientX}px`;
        trail.style.top = `${e.clientY}px`;
        document.body.appendChild(trail);
        setTimeout(() => trail.remove(), 350);
      }
    });

    window.addEventListener('mousedown', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1.35)';
      if (window.undertaleAudio) window.undertaleAudio.playClickPop();
    });

    window.addEventListener('mouseup', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    });
  }

  renderSlides() {
    const stage = document.getElementById('slide-stage');
    if (!stage) return;

    stage.innerHTML = '';

    this.slidesData.forEach((slide, index) => {
      const slideEl = document.createElement('div');
      slideEl.className = 'slide';
      slideEl.id = `slide-${slide.id}`;
      slideEl.dataset.index = index;
      slideEl.dataset.zone = slide.zone;
      if (slide.type) slideEl.dataset.type = slide.type;

      slideEl.innerHTML = `
        <div class="slide-header">
          <div class="slide-meta-row">
            <span class="slide-zone-badge">${slide.zoneName || 'Zone'}</span>
            <span class="slide-chapter">${slide.chapter || ''}</span>
          </div>
          <div class="slide-title-wrapper">
            <h1 class="slide-title">
              <span class="pixel-heart"></span> Slide ${slide.id} — ${slide.title}
            </h1>
            ${slide.subtitle ? `<div class="slide-subtitle">${slide.subtitle}</div>` : ''}
          </div>
        </div>

        <div class="slide-body">
          ${slide.quote ? `<div class="quote-box mb-3">"${slide.quote}"</div>` : ''}
          ${slide.content}
        </div>
      `;

      stage.appendChild(slideEl);
      this.slides.push(slideEl);
    });
  }

  renderOverviewModal() {
    const grid = document.getElementById('overview-grid');
    if (!grid) return;

    grid.innerHTML = '';
    this.slidesData.forEach((slide, idx) => {
      const card = document.createElement('div');
      card.className = 'overview-card';
      card.dataset.index = idx;
      card.innerHTML = `
        <div class="overview-card-num">SLIDE ${slide.id} [${slide.zone.toUpperCase()}]</div>
        <div class="overview-card-title">${slide.title}</div>
      `;
      card.addEventListener('click', () => {
        this.goToSlide(idx);
        this.toggleOverview(false);
      });
      grid.appendChild(card);
    });
  }

  triggerScreenShake() {
    document.body.classList.remove('screen-shake');
    void document.body.offsetWidth; // Reflow trigger
    document.body.classList.add('screen-shake');
    setTimeout(() => document.body.classList.remove('screen-shake'), 320);
  }

  goToSlide(index, playSound = true) {
    if (index < 0 || index >= this.totalSlides) return;

    const oldZone = this.slidesData[this.currentIndex]?.zone;
    const newZone = this.slidesData[index].zone;

    // Trigger encounter flash & screen shake if zone changes or boss encounter
    if (newZone !== oldZone && oldZone !== undefined) {
      this.triggerScreenShake();
      if (newZone === 'encounter') {
        const flash = document.querySelector('.encounter-flash');
        if (flash) {
          flash.classList.add('active');
          setTimeout(() => flash.classList.remove('active'), 200);
        }
        if (window.undertaleAudio && playSound) {
          window.undertaleAudio.playBattleEncounter();
        }
      }
    }

    if (playSound && window.undertaleAudio) {
      if (index === this.totalSlides - 1) {
        window.undertaleAudio.playSavePoint();
      } else if (newZone !== 'encounter') {
        window.undertaleAudio.playSlideChange();
      }
    }

    if (this.slides[this.currentIndex]) {
      this.slides[this.currentIndex].classList.remove('active');
    }

    this.currentIndex = index;
    const currentSlide = this.slides[this.currentIndex];
    currentSlide.classList.add('active');

    const currentData = this.slidesData[this.currentIndex];
    document.body.className = `theme-${currentData.zone} ${this.crtEnabled ? '' : 'no-crt'}`;

    if (this.bgCanvas) {
      this.bgCanvas.setZone(currentData.zone);
    }

    this.updateHUD();
    window.location.hash = `slide-${currentData.id}`;

    document.querySelectorAll('.overview-card').forEach((c, i) => {
      c.classList.toggle('current', i === index);
    });
  }

  nextSlide() {
    if (this.currentIndex < this.totalSlides - 1) {
      this.goToSlide(this.currentIndex + 1);
    }
  }

  prevSlide() {
    if (this.currentIndex > 0) {
      this.goToSlide(this.currentIndex - 1);
    }
  }

  updateHUD() {
    const currentData = this.slidesData[this.currentIndex];
    
    const lvEl = document.getElementById('hud-lv-val');
    if (lvEl) {
      lvEl.textContent = `LV ${currentData.id}`;
      lvEl.classList.remove('level-up');
      void lvEl.offsetWidth;
      lvEl.classList.add('level-up');
    }

    const hpTextEl = document.getElementById('hud-hp-text');
    if (hpTextEl) hpTextEl.textContent = `${currentData.id}/${this.totalSlides}`;

    const hpFillEl = document.getElementById('hud-hp-fill');
    if (hpFillEl) {
      const pct = Math.max(8, (currentData.id / this.totalSlides) * 100);
      hpFillEl.style.width = `${pct}%`;
    }

    const slideNumEl = document.getElementById('hud-slide-num');
    if (slideNumEl) slideNumEl.textContent = `SLIDE ${currentData.id} / ${this.totalSlides}`;
  }

  toggleOverview(forceState) {
    const modal = document.getElementById('slide-overview-modal');
    if (!modal) return;
    const isOpen = forceState !== undefined ? forceState : !modal.classList.contains('open');
    modal.classList.toggle('open', isOpen);
    if (isOpen && window.undertaleAudio) {
      window.undertaleAudio.playMenuSelect();
    }
  }

  toggleCRT() {
    this.crtEnabled = !this.crtEnabled;
    document.body.classList.toggle('no-crt', !this.crtEnabled);
    if (window.undertaleAudio) window.undertaleAudio.playMenuSelect();
  }

  toggleAudio() {
    if (window.undertaleAudio) {
      const isMuted = window.undertaleAudio.toggleMute();
      const btn = document.getElementById('btn-sound-toggle');
      if (btn) {
        btn.innerHTML = `<span class="pixel-heart"></span> ${isMuted ? 'UNMUTE' : 'MUTE'}`;
      }
    }
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }

  setupEventListeners() {
    window.addEventListener('keydown', (e) => {
      if (window.undertaleAudio) window.undertaleAudio.init();

      switch (e.key) {
        case 'ArrowRight':
        case ' ':
        case 'PageDown':
        case 'j':
        case 'J':
          this.nextSlide();
          break;
        case 'ArrowLeft':
        case 'Backspace':
        case 'PageUp':
        case 'k':
        case 'K':
          this.prevSlide();
          break;
        case 'Home':
          this.goToSlide(0);
          break;
        case 'End':
          this.goToSlide(this.totalSlides - 1);
          break;
        case 'o':
        case 'O':
        case 'm':
        case 'M':
          this.toggleOverview();
          break;
        case 'f':
        case 'F':
          this.toggleFullscreen();
          break;
        case 'c':
        case 'C':
          this.toggleCRT();
          break;
        case 's':
        case 'S':
          this.toggleAudio();
          break;
        case 'p':
        case 'P':
          window.print();
          break;
        case 'Escape':
          this.toggleOverview(false);
          break;
      }
    });

    let touchStartX = 0;
    window.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      if (window.undertaleAudio) window.undertaleAudio.init();
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      if (touchEndX < touchStartX - 60) {
        this.nextSlide();
      } else if (touchEndX > touchStartX + 60) {
        this.prevSlide();
      }
    }, { passive: true });

    document.getElementById('btn-next')?.addEventListener('click', () => this.nextSlide());
    document.getElementById('btn-prev')?.addEventListener('click', () => this.prevSlide());
    document.getElementById('btn-map')?.addEventListener('click', () => this.toggleOverview());
    document.getElementById('btn-crt')?.addEventListener('click', () => this.toggleCRT());
    document.getElementById('btn-sound-toggle')?.addEventListener('click', () => this.toggleAudio());
    document.getElementById('btn-close-modal')?.addEventListener('click', () => this.toggleOverview(false));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.presentation = new PresentationEngine();
});

// Advanced Dynamic Animated Pixel Background Canvas with Undertale VFX & Interactive Particle Physics

class PixelBackgroundCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.burstParticles = [];
    this.currentZone = 'ruins';
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.mouse = { x: this.width / 2, y: this.height / 2, down: false };
    this.tick = 0;

    this.resize();
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
    window.addEventListener('click', (e) => {
      this.spawnClickBurst(e.clientX, e.clientY);
    });

    this.initZone();
    this.animate(0);
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  setZone(zone) {
    if (this.currentZone !== zone) {
      this.currentZone = zone;
      this.initZone();
    }
  }

  spawnClickBurst(x, y) {
    const colors = this.getZoneColors();
    const count = 18;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5);
      const speed = Math.random() * 5 + 3;
      this.burstParticles.push({
        x,
        y,
        size: Math.floor(Math.random() * 5) + 3,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1.0,
        decay: Math.random() * 0.03 + 0.02
      });
    }
  }

  initZone() {
    this.particles = [];
    const count = this.currentZone === 'blizzard' ? 140 : (this.currentZone === 'snowdin' || this.currentZone === 'hotland' ? 90 : 65);

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.floor(Math.random() * 4) + 2,
        speedX: this.currentZone === 'blizzard' ? (Math.random() * 8 + 6) : (Math.random() - 0.5) * 1.5,
        speedY: this.currentZone === 'blizzard' ? (Math.random() * 4 + 2) : (Math.random() - 0.5) * 1.5,
        alpha: Math.random() * 0.7 + 0.3,
        pulse: Math.random() * Math.PI * 2,
        layer: Math.random() > 0.5 ? 1 : 2,
        color: this.getZoneColor()
      });
    }
  }

  getZoneColors() {
    switch (this.currentZone) {
      case 'treasuremap':
        return ['#f59e0b', '#fbbf24', '#d97706', '#fde68a', '#ffffff', '#b45309'];
      case 'blizzard':
        return ['#ffffff', '#e0f2fe', '#bae6fd', '#7dd3fc', '#38bdf8', '#ffedd5', '#fed7aa', '#f97316'];
      case 'ruins':
        return ['#d8b4fe', '#c084fc', '#a855f7', '#7e22ce', '#ffffff'];
      case 'snowdin':
        return ['#ffffff', '#e0f2fe', '#bae6fd', '#7dd3fc', '#38bdf8'];
      case 'waterfall':
        return ['#22d3ee', '#06b6d4', '#0891b2', '#67e8f9', '#ffffff'];
      case 'hotland':
        return ['#f97316', '#fb923c', '#ef4444', '#facc15', '#ff2200'];
      case 'core':
        return ['#60a5fa', '#3b82f6', '#2563eb', '#93c5fd', '#00ffff'];
      case 'judgement':
        return ['#fde047', '#eab308', '#ca8a04', '#fef08a', '#ffffff'];
      case 'truelab':
        return ['#4ade80', '#22c55e', '#16a34a', '#86efac', '#a3e635'];
      case 'barrier':
        return ['#ff2a44', '#22d3ee', '#f97316', '#3b82f6', '#a855f7', '#00ff66', '#ffff00'];
      case 'surface':
        return ['#fde047', '#4ade80', '#fb923c', '#38bdf8', '#ffffff'];
      default:
        return ['#ffffff', '#ffff00', '#ff0000'];
    }
  }

  getZoneColor() {
    const colors = this.getZoneColors();
    return colors[Math.floor(Math.random() * colors.length)];
  }

  animate(time) {
    this.tick++;
    this.ctx.clearRect(0, 0, this.width, this.height);

    // -------------------------------------------------------------
    // ZONE-SPECIFIC BACKGROUND SHADERS & EFFECTS
    // -------------------------------------------------------------

    if (this.currentZone === 'treasuremap') {
      // Treasure Map: Ancient Parchment Grid, Rotating Compass Rose & Dashed Expedition Route
      this.ctx.save();
      this.ctx.strokeStyle = 'rgba(245, 158, 11, 0.12)';
      this.ctx.lineWidth = 1;
      this.ctx.setLineDash([4, 8]);
      const mapGrid = 64;
      for (let x = 0; x < this.width; x += mapGrid) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, 0);
        this.ctx.lineTo(x, this.height);
        this.ctx.stroke();
      }
      for (let y = 0; y < this.height; y += mapGrid) {
        this.ctx.beginPath();
        this.ctx.moveTo(0, y);
        this.ctx.lineTo(this.width, y);
        this.ctx.stroke();
      }

      // Compass Rose in Top-Right
      const crX = this.width - 120;
      const crY = 120;
      const crR = 55;
      this.ctx.setLineDash([]);
      this.ctx.strokeStyle = 'rgba(251, 191, 36, 0.25)';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.arc(crX, crY, crR, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.arc(crX, crY, crR * 0.4, 0, Math.PI * 2);
      this.ctx.stroke();

      // Rotating Compass Needles
      this.ctx.save();
      this.ctx.translate(crX, crY);
      this.ctx.rotate(time * 0.0003);
      this.ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(0, -crR * 1.2);
      this.ctx.lineTo(0, crR * 1.2);
      this.ctx.moveTo(-crR * 1.2, 0);
      this.ctx.lineTo(crR * 1.2, 0);
      this.ctx.stroke();
      this.ctx.restore();

      // Expedition Trail Waypoints connecting Zones across screen
      const waypoints = [
        { x: this.width * 0.10, y: this.height * 0.28 },
        { x: this.width * 0.28, y: this.height * 0.65 },
        { x: this.width * 0.48, y: this.height * 0.35 },
        { x: this.width * 0.68, y: this.height * 0.72 },
        { x: this.width * 0.86, y: this.height * 0.42 }
      ];

      this.ctx.strokeStyle = 'rgba(234, 179, 8, 0.28)';
      this.ctx.lineWidth = 2;
      this.ctx.setLineDash([6, 6]);
      this.ctx.beginPath();
      waypoints.forEach((wp, i) => {
        if (i === 0) this.ctx.moveTo(wp.x, wp.y);
        else this.ctx.lineTo(wp.x, wp.y);
      });
      this.ctx.stroke();
      this.ctx.setLineDash([]);

      // Draw 'X' marks at each island waypoint
      waypoints.forEach((wp) => {
        this.ctx.strokeStyle = 'rgba(249, 115, 22, 0.5)';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(wp.x - 7, wp.y - 7);
        this.ctx.lineTo(wp.x + 7, wp.y + 7);
        this.ctx.moveTo(wp.x + 7, wp.y - 7);
        this.ctx.lineTo(wp.x - 7, wp.y + 7);
        this.ctx.stroke();
      });

      this.ctx.restore();

      // Drifting Amber Dust Motes
      this.particles.forEach((p) => {
        p.y -= 0.5;
        p.x += Math.sin(time * 0.002 + p.pulse) * 0.5;
        if (p.y < -10) p.y = this.height + 10;
        if (p.x > this.width) p.x = 0;
        if (p.x < 0) p.x = this.width;

        this.ctx.fillStyle = p.color;
        this.ctx.globalAlpha = p.alpha * 0.8;
        this.ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
      });
      this.ctx.globalAlpha = 1.0;

    } else if (this.currentZone === 'blizzard') {
      // Blizzard: Raging Snowstorm & Diagonal Howling Wind Streaks
      this.ctx.save();
      this.ctx.strokeStyle = 'rgba(186, 230, 253, 0.18)';
      this.ctx.lineWidth = 1.5;
      const windOffset = (this.tick * 16) % 320;
      for (let x = -this.height * 2; x < this.width + this.height; x += 140) {
        this.ctx.beginPath();
        this.ctx.moveTo(x + windOffset, 0);
        this.ctx.lineTo(x + windOffset + 240, this.height);
        this.ctx.stroke();
      }
      this.ctx.restore();

      // Rapidly swirling snowflakes & ice shards
      this.particles.forEach((p) => {
        const speedMultiplier = p.layer === 2 ? 1.6 : 1.0;
        p.x += (p.speedX || 8) * speedMultiplier;
        p.y += (p.speedY || 3) * speedMultiplier;
        if (p.x > this.width + 10) {
          p.x = -20;
          p.y = Math.random() * this.height;
        }
        if (p.y > this.height + 10) {
          p.y = -10;
          p.x = Math.random() * this.width;
        }

        this.ctx.fillStyle = p.color;
        this.ctx.globalAlpha = p.layer === 2 ? 0.95 : 0.6;
        const pSize = p.size * (p.layer === 2 ? 1.6 : 1);
        this.ctx.fillRect(Math.floor(p.x), Math.floor(p.y), pSize, pSize);
      });
      this.ctx.globalAlpha = 1.0;

    } else if (this.currentZone === 'ruins') {
      // Ruins: Glowing Mystic Rune Circle in center
      const centerX = this.width / 2;
      const centerY = this.height / 2;
      const radius = 220 + Math.sin(time * 0.002) * 15;

      this.ctx.save();
      this.ctx.translate(centerX, centerY);
      this.ctx.rotate(time * 0.0004);
      this.ctx.strokeStyle = 'rgba(168, 85, 247, 0.08)';
      this.ctx.lineWidth = 3;
      this.ctx.strokeRect(-radius / 2, -radius / 2, radius, radius);
      this.ctx.beginPath();
      this.ctx.arc(0, 0, radius * 0.7, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.restore();

      // Floating purple essence motes
      this.particles.forEach((p) => {
        p.y -= 0.6;
        p.x += Math.sin(time * 0.002 + p.pulse) * 0.6;
        if (p.y < -10) p.y = this.height + 10;
        if (p.x > this.width) p.x = 0;
        if (p.x < 0) p.x = this.width;

        const a = p.alpha + Math.sin(time * 0.003 + p.pulse) * 0.2;
        this.ctx.fillStyle = p.color;
        this.ctx.globalAlpha = Math.max(0.1, Math.min(1, a));
        this.ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
      });
      this.ctx.globalAlpha = 1.0;

    } else if (this.currentZone === 'snowdin') {
      // Snowdin: Parallax 2-Layer Blizzard Snow
      this.particles.forEach((p) => {
        const speedMultiplier = p.layer === 2 ? 2.2 : 1.2;
        p.y += 1.4 * speedMultiplier;
        p.x += Math.sin(time * 0.002 + p.pulse) * (0.8 * speedMultiplier) + 0.4;
        if (p.y > this.height) p.y = -10;
        if (p.x > this.width) p.x = 0;
        if (p.x < 0) p.x = this.width;

        this.ctx.fillStyle = p.color;
        this.ctx.globalAlpha = p.layer === 2 ? 0.9 : 0.45;
        this.ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size * (p.layer === 2 ? 1.4 : 1), p.size * (p.layer === 2 ? 1.4 : 1));
      });
      this.ctx.globalAlpha = 1.0;

    } else if (this.currentZone === 'waterfall') {
      // Waterfall: Bioluminescent Cascades & Dripping Echo Droplets
      this.particles.forEach((p) => {
        p.y += 3.2;
        p.x += Math.sin(time * 0.004 + p.pulse) * 0.5;
        if (p.y > this.height) {
          p.y = -10;
          p.x = Math.random() * this.width;
        }

        this.ctx.fillStyle = p.color;
        this.ctx.globalAlpha = Math.sin(time * 0.003 + p.pulse) * 0.3 + 0.7;
        // Tail effect for falling droplet
        this.ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size * 2.5);
      });
      this.ctx.globalAlpha = 1.0;

    } else if (this.currentZone === 'hotland') {
      // Hotland: Volcanic Heat Wave & Rising Magma Sparks
      const waveOffset = Math.sin(time * 0.003) * 6;
      this.particles.forEach((p) => {
        p.y -= 2.4;
        p.x += Math.sin(time * 0.005 + p.pulse) * 1.5 + (waveOffset * 0.1);
        if (p.y < -10) {
          p.y = this.height + 10;
          p.x = Math.random() * this.width;
        }

        this.ctx.fillStyle = p.color;
        this.ctx.globalAlpha = Math.sin(time * 0.004 + p.pulse) * 0.3 + 0.7;
        this.ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size * 1.3, p.size * 1.3);
      });
      this.ctx.globalAlpha = 1.0;

    } else if (this.currentZone === 'core') {
      // Core: High-Tech Cyber Laser Grid & Circuit Beams
      this.ctx.strokeStyle = 'rgba(59, 130, 246, 0.12)';
      this.ctx.lineWidth = 1;
      const gridSize = 48;
      for (let x = 0; x < this.width; x += gridSize) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, 0);
        this.ctx.lineTo(x, this.height);
        this.ctx.stroke();
      }
      for (let y = 0; y < this.height; y += gridSize) {
        this.ctx.beginPath();
        this.ctx.moveTo(0, y);
        this.ctx.lineTo(this.width, y);
        this.ctx.stroke();
      }

      // Laser pulses sweeping across grid
      const laserY = (this.tick * 3) % this.height;
      this.ctx.fillStyle = 'rgba(0, 255, 255, 0.06)';
      this.ctx.fillRect(0, laserY, this.width, 4);

      this.particles.forEach((p) => {
        p.x += p.speedX * 2.5;
        p.y += p.speedY * 2.5;
        if (p.x > this.width || p.x < 0) p.speedX *= -1;
        if (p.y > this.height || p.y < 0) p.speedY *= -1;

        this.ctx.fillStyle = p.color;
        this.ctx.globalAlpha = 0.85;
        this.ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size * 1.4, p.size * 1.4);
      });
      this.ctx.globalAlpha = 1.0;

    } else if (this.currentZone === 'judgement') {
      // Judgment Hall: Volumetric Golden God-Rays
      const rayGradient = this.ctx.createLinearGradient(0, 0, this.width, this.height);
      rayGradient.addColorStop(0, 'rgba(253, 224, 71, 0.08)');
      rayGradient.addColorStop(0.5, 'rgba(234, 179, 8, 0.04)');
      rayGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      this.ctx.fillStyle = rayGradient;
      this.ctx.fillRect(0, 0, this.width, this.height);

      // Diagonal Cathedral Light Beams
      this.ctx.save();
      this.ctx.strokeStyle = 'rgba(254, 240, 138, 0.06)';
      this.ctx.lineWidth = 60;
      for (let i = -this.width; i < this.width * 2; i += 280) {
        this.ctx.beginPath();
        this.ctx.moveTo(i + Math.sin(time * 0.001) * 20, 0);
        this.ctx.lineTo(i + 400 + Math.sin(time * 0.001) * 20, this.height);
        this.ctx.stroke();
      }
      this.ctx.restore();

      // Golden sparkling dust motes
      this.particles.forEach((p) => {
        p.x += p.speedX * 0.6;
        p.y -= 0.5;
        if (p.y < 0) p.y = this.height;
        if (p.x > this.width) p.x = 0;
        if (p.x < 0) p.x = this.width;

        const a = Math.sin(time * 0.003 + p.pulse) * 0.4 + 0.6;
        this.ctx.fillStyle = p.color;
        this.ctx.globalAlpha = a;
        this.ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
      });
      this.ctx.globalAlpha = 1.0;

    } else if (this.currentZone === 'truelab') {
      // True Lab: CRT Green Oscilloscope Wave + Phosphor scan
      this.ctx.strokeStyle = 'rgba(74, 222, 128, 0.25)';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      const waveY = this.height - 80;
      for (let x = 0; x < this.width; x += 10) {
        const y = waveY + Math.sin(x * 0.02 + time * 0.005) * 25 * Math.sin(time * 0.002);
        if (x === 0) this.ctx.moveTo(x, y);
        else this.ctx.lineTo(x, y);
      }
      this.ctx.stroke();

      this.particles.forEach((p) => {
        p.y += p.speedY * 1.5;
        p.x += (Math.random() - 0.5) * 2; // Glitch jitter
        if (p.y > this.height) p.y = 0;
        if (p.y < 0) p.y = this.height;

        this.ctx.fillStyle = p.color;
        this.ctx.globalAlpha = 0.8;
        this.ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size * 1.5, p.size);
      });
      this.ctx.globalAlpha = 1.0;

    } else if (this.currentZone === 'barrier') {
      // The Barrier: 7 Floating Undertale Soul Essence Orbs
      const soulColors = ['#ff2a44', '#22d3ee', '#f97316', '#3b82f6', '#a855f7', '#00ff66', '#ffff00'];
      const orbRadius = 160;
      const centerX = this.width / 2;
      const centerY = this.height / 2;

      soulColors.forEach((color, idx) => {
        const angle = (Math.PI * 2 * idx) / 7 + time * 0.001;
        const ox = centerX + Math.cos(angle) * orbRadius;
        const oy = centerY + Math.sin(angle) * orbRadius;

        this.ctx.fillStyle = color;
        this.ctx.globalAlpha = 0.6 + Math.sin(time * 0.004 + idx) * 0.3;
        this.ctx.fillRect(Math.floor(ox - 6), Math.floor(oy - 6), 12, 12);
      });

      this.particles.forEach((p) => {
        p.x += p.speedX * 1.5;
        p.y += p.speedY * 1.5;
        if (p.x > this.width || p.x < 0) p.speedX *= -1;
        if (p.y > this.height || p.y < 0) p.speedY *= -1;

        this.ctx.fillStyle = p.color;
        this.ctx.globalAlpha = p.alpha;
        this.ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
      });
      this.ctx.globalAlpha = 1.0;

    } else {
      // Default / Surface Ambient Floating Particles
      this.particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x > this.width || p.x < 0) p.speedX *= -1;
        if (p.y > this.height || p.y < 0) p.speedY *= -1;

        const currentAlpha = p.alpha + Math.sin(time * 0.003 + p.pulse) * 0.2;
        this.ctx.globalAlpha = Math.max(0.1, Math.min(1, currentAlpha));
        this.ctx.fillStyle = p.color;
        this.ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
      });
      this.ctx.globalAlpha = 1.0;
    }

    // -------------------------------------------------------------
    // INTERACTIVE CLICK BURST SHARDS
    // -------------------------------------------------------------
    for (let i = this.burstParticles.length - 1; i >= 0; i--) {
      const bp = this.burstParticles[i];
      bp.x += bp.vx;
      bp.y += bp.vy;
      bp.vx *= 0.94;
      bp.vy *= 0.94;
      bp.life -= bp.decay;

      if (bp.life <= 0) {
        this.burstParticles.splice(i, 1);
        continue;
      }

      this.ctx.fillStyle = bp.color;
      this.ctx.globalAlpha = bp.life;
      this.ctx.fillRect(Math.floor(bp.x), Math.floor(bp.y), Math.floor(bp.size * bp.life), Math.floor(bp.size * bp.life));
    }
    this.ctx.globalAlpha = 1.0;

    requestAnimationFrame((t) => this.animate(t));
  }
}

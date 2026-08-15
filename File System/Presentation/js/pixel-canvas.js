// Dynamic Animated Pixel Background Canvas (Zone Particle FX)

class PixelBackgroundCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.currentZone = 'ruins';
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.lastTime = 0;

    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.initParticles();
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
      this.initParticles();
    }
  }

  initParticles() {
    this.particles = [];
    const count = 55;

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.floor(Math.random() * 4) + 2, // Pixelated block sizes
        speedX: (Math.random() - 0.5) * 1.2,
        speedY: (Math.random() - 0.5) * 1.2,
        alpha: Math.random() * 0.7 + 0.3,
        pulse: Math.random() * Math.PI,
        color: this.getZoneColor()
      });
    }
  }

  getZoneColor() {
    switch (this.currentZone) {
      case 'ruins':
        return ['#d8b4fe', '#c084fc', '#a855f7', '#7e22ce'][Math.floor(Math.random() * 4)];
      case 'snowdin':
        return ['#ffffff', '#e0f2fe', '#bae6fd', '#7dd3fc'][Math.floor(Math.random() * 4)];
      case 'waterfall':
        return ['#22d3ee', '#06b6d4', '#0891b2', '#67e8f9'][Math.floor(Math.random() * 4)];
      case 'hotland':
        return ['#f97316', '#fb923c', '#ef4444', '#facc15'][Math.floor(Math.random() * 4)];
      case 'core':
        return ['#60a5fa', '#3b82f6', '#2563eb', '#93c5fd'][Math.floor(Math.random() * 4)];
      case 'judgement':
        return ['#fde047', '#eab308', '#ca8a04', '#fef08a'][Math.floor(Math.random() * 4)];
      case 'truelab':
        return ['#4ade80', '#22c55e', '#16a34a', '#86efac'][Math.floor(Math.random() * 4)];
      case 'barrier':
        return ['#f472b6', '#ec4899', '#38bdf8', '#a855f7'][Math.floor(Math.random() * 4)];
      case 'surface':
        return ['#fde047', '#4ade80', '#fb923c', '#ffffff'][Math.floor(Math.random() * 4)];
      default:
        return '#ffffff';
    }
  }

  animate(time) {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Draw Zone-specific atmospheric layers
    if (this.currentZone === 'snowdin') {
      // Falling Snowdin Snowflakes
      this.particles.forEach(p => {
        p.y += 1.5;
        p.x += Math.sin(time * 0.002 + p.pulse) * 0.8;
        if (p.y > this.height) p.y = -10;
        if (p.x > this.width) p.x = 0;
        if (p.x < 0) p.x = this.width;

        this.ctx.fillStyle = p.color;
        this.ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
      });
    } else if (this.currentZone === 'hotland') {
      // Rising Hotland Magma Embers
      this.particles.forEach(p => {
        p.y -= 1.8;
        p.x += Math.cos(time * 0.003 + p.pulse) * 1.0;
        if (p.y < -10) p.y = this.height + 10;
        if (p.x > this.width) p.x = 0;
        if (p.x < 0) p.x = this.width;

        this.ctx.fillStyle = p.color;
        this.ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
      });
    } else if (this.currentZone === 'core') {
      // Cyber Grid / Circuit pulses
      this.ctx.strokeStyle = 'rgba(59, 130, 246, 0.08)';
      this.ctx.lineWidth = 1;
      const gridSize = 40;
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

      this.particles.forEach(p => {
        p.x += p.speedX * 2;
        p.y += p.speedY * 2;
        if (p.x > this.width || p.x < 0) p.speedX *= -1;
        if (p.y > this.height || p.y < 0) p.speedY *= -1;

        this.ctx.fillStyle = p.color;
        this.ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size * 1.2, p.size * 1.2);
      });
    } else {
      // Default floating ambient pixel motes
      this.particles.forEach(p => {
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

    requestAnimationFrame(t => this.animate(t));
  }
}

const canvas = document.getElementById('starCanvas');
const ctx = canvas.getContext('2d');

let width, height;
let animationId;
let particles = [];
let stars = []; // Background stars

// State
let currentStageIndex = 0;

const stages = [
    {
        id: 'nebula',
        title: '1. 성운 (Nebula)',
        description: '우주 공간의 가스와 먼지가 모여 있는 거대한 구름입니다. 차갑고 어두운 이곳에서 별의 씨앗이 자라납니다.',
        init: initNebula,
        draw: drawNebula
    },
    {
        id: 'protostar',
        title: '2. 원시별 (Protostar)',
        description: '중력에 의해 가스가 중심부로 회전하며 모여듭니다. 중심부의 밀도가 높아지며 붉은 빛을 내기 시작합니다.',
        init: initProtostar,
        draw: drawProtostar
    },
    {
        id: 'pre-main',
        title: '3. 전주계열성 (Pre-Main Sequence)',
        description: '별이 더욱 수축하여 크기가 작아지고 표면 온도가 올라갑니다. 아직 핵융합은 시작되지 않았습니다.',
        init: initPreMain,
        draw: drawPreMain
    },
    {
        id: 'main-sequence',
        title: '4. 주계열성 (Main Sequence)',
        description: '중심부 온도가 1,000만 도에 도달하여 수소 핵융합이 시작됩니다. 태양처럼 안정적으로 빛나는 단계입니다.',
        init: initMainSequence,
        draw: drawMainSequence
    },
    {
        id: 'red-giant',
        title: '5. 적색거성 (Red Giant)',
        description: '수소가 고갈되어 별이 급격히 팽창합니다. 크기는 커지지만 표면 온도는 낮아져 붉게 보입니다.',
        init: initRedGiant,
        draw: drawRedGiant
    },
    {
        id: 'planetary-nebula',
        title: '6. 행성상 성운 (Planetary Nebula)',
        description: '별의 바깥 가스층이 우주 공간으로 방출되어 아름다운 고리 모양을 만듭니다.',
        init: initPlanetaryNebula,
        draw: drawPlanetaryNebula
    },
    {
        id: 'white-dwarf',
        title: '7. 백색왜성 (White Dwarf)',
        description: '가스는 모두 흩어지고 중심에 남은 작고 뜨거운 핵이 서서히 식어갑니다.',
        init: initWhiteDwarf,
        draw: drawWhiteDwarf
    }
];

// UI Elements
const stageTitle = document.getElementById('stageTitle');
const stageDescription = document.getElementById('stageDescription');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressIndicators = document.getElementById('progressIndicators');

// Resize handling
function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initBackgroundStars();
    stages[currentStageIndex].init();
}

window.addEventListener('resize', resize);

// Background Stars
function initBackgroundStars() {
    stars = [];
    for (let i = 0; i < 200; i++) {
        stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 2,
            opacity: Math.random()
        });
    }
}

function drawBackgroundStars() {
    ctx.fillStyle = '#050510';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = 'white';
    stars.forEach(star => {
        ctx.globalAlpha = star.opacity;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.globalAlpha = 1;
}

// Stage 1: Nebula
function initNebula() {
    particles = [];
    for (let i = 0; i < 300; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 60 + 20,
            color: `hsla(${Math.random() * 60 + 200}, 70%, 20%, 0.1)` // Blue-ish purple clouds
        });
    }
}

function drawNebula() {
    drawBackgroundStars();
    
    // Draw cloud particles
    particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        
        // Wrap around screen
        if (p.x < -100) p.x = width + 100;
        if (p.x > width + 100) p.x = -100;
        if (p.y < -100) p.y = height + 100;
        if (p.y > height + 100) p.y = -100;

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        gradient.addColorStop(0, p.color);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // Add some "clumping" hint
    ctx.globalCompositeOperation = 'lighter';
    const centerX = width / 2;
    const centerY = height / 2;
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 300);
    gradient.addColorStop(0, 'rgba(100, 100, 255, 0.1)');
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'source-over';
}

// Stage 2: Protostar
function initProtostar() {
    particles = [];
    for (let i = 0; i < 500; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * 400 + 50;
        particles.push({
            x: width/2 + Math.cos(angle) * dist,
            y: height/2 + Math.sin(angle) * dist,
            angle: angle,
            dist: dist,
            speed: (500 - dist) * 0.0005 + 0.01,
            size: Math.random() * 2 + 1,
            color: `rgba(255, ${Math.random() * 100 + 100}, 100, 0.8)`
        });
    }
}

function drawProtostar() {
    drawBackgroundStars();
    
    const centerX = width / 2;
    const centerY = height / 2;

    // Draw spiraling particles
    particles.forEach(p => {
        p.angle += p.speed;
        p.dist -= 0.5; // Move inwards
        
        if (p.dist < 10) {
            p.dist = 400;
            p.angle = Math.random() * Math.PI * 2;
        }

        p.x = centerX + Math.cos(p.angle) * p.dist;
        p.y = centerY + Math.sin(p.angle) * p.dist;

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    });

    // Central glow (getting hotter)
    const glow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 60);
    glow.addColorStop(0, 'rgba(255, 100, 50, 0.8)');
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 60, 0, Math.PI * 2);
    ctx.fill();
}

// Stage 3: Pre-Main Sequence
let pulse = 0;
function initPreMain() {
    pulse = 0;
}

function drawPreMain() {
    drawBackgroundStars();
    const centerX = width / 2;
    const centerY = height / 2;
    
    pulse += 0.05;
    const currentSize = 40 + Math.sin(pulse) * 2; // Slight pulsation

    // Outer glow
    const outerGlow = ctx.createRadialGradient(centerX, centerY, currentSize, centerX, centerY, currentSize * 4);
    outerGlow.addColorStop(0, 'rgba(255, 150, 50, 0.4)');
    outerGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = outerGlow;
    ctx.beginPath();
    ctx.arc(centerX, centerY, currentSize * 4, 0, Math.PI * 2);
    ctx.fill();

    // Star body
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, currentSize);
    gradient.addColorStop(0, '#ffcc00');
    gradient.addColorStop(0.6, '#ff8800');
    gradient.addColorStop(1, '#cc4400');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, currentSize, 0, Math.PI * 2);
    ctx.fill();
}

// Stage 4: Main Sequence
function initMainSequence() {
    pulse = 0;
    particles = []; // For solar flares/rays
    for(let i=0; i<20; i++) {
        particles.push({
            angle: Math.random() * Math.PI * 2,
            length: Math.random() * 20 + 50,
            speed: Math.random() * 0.02 + 0.01
        });
    }
}

function drawMainSequence() {
    drawBackgroundStars();
    const centerX = width / 2;
    const centerY = height / 2;
    
    pulse += 0.02;
    const baseSize = 50;
    
    // Corona/Rays
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(pulse * 0.2);
    particles.forEach(p => {
        ctx.rotate(p.speed);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, baseSize + p.length + Math.sin(pulse * 2) * 10);
        ctx.strokeStyle = `rgba(255, 255, 200, ${Math.random() * 0.3})`;
        ctx.lineWidth = 2;
        ctx.stroke();
    });
    ctx.restore();

    // Stable Star
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, baseSize + 20);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(0.2, '#fffebb');
    gradient.addColorStop(0.5, '#ffcc00');
    gradient.addColorStop(1, 'rgba(255, 200, 0, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, baseSize + 20, 0, Math.PI * 2);
    ctx.fill();
}

// Stage 5: Red Giant
function initRedGiant() {
    pulse = 0;
}

function drawRedGiant() {
    drawBackgroundStars();
    const centerX = width / 2;
    const centerY = height / 2;
    
    pulse += 0.01;
    // Massive size
    const size = 150 + Math.sin(pulse) * 5;

    // Turbulent surface effect
    const gradient = ctx.createRadialGradient(centerX, centerY, size * 0.5, centerX, centerY, size);
    gradient.addColorStop(0, '#ff4400');
    gradient.addColorStop(0.8, '#cc2200');
    gradient.addColorStop(1, 'rgba(100, 0, 0, 0.5)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, size, 0, Math.PI * 2);
    ctx.fill();
    
    // Instability aura
    ctx.strokeStyle = 'rgba(255, 50, 0, 0.2)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, size + Math.random() * 10, 0, Math.PI * 2);
    ctx.stroke();
}

// Stage 6: Planetary Nebula
function initPlanetaryNebula() {
    particles = [];
    for (let i = 0; i < 300; i++) {
        const angle = Math.random() * Math.PI * 2;
        particles.push({
            x: width/2,
            y: height/2,
            vx: Math.cos(angle) * (Math.random() * 2 + 1),
            vy: Math.sin(angle) * (Math.random() * 2 + 1),
            size: Math.random() * 3,
            color: `hsla(${Math.random() * 60 + 180}, 80%, 60%, 0.6)`, // Cyan/Blue gas
            life: Math.random() * 100 + 100
        });
    }
}

function drawPlanetaryNebula() {
    drawBackgroundStars();
    const centerX = width / 2;
    const centerY = height / 2;

    // Expanding gas
    particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        
        // Reset if too far or dead, to keep the effect going
        const dist = Math.hypot(p.x - centerX, p.y - centerY);
        if (dist > 300 || p.life < 0) {
            p.x = centerX;
            p.y = centerY;
            p.life = Math.random() * 100 + 100;
        }

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    });

    // White Dwarf core visible
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#ffffff';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
}

// Stage 7: White Dwarf
function initWhiteDwarf() {
    // Just the core
}

function drawWhiteDwarf() {
    drawBackgroundStars();
    const centerX = width / 2;
    const centerY = height / 2;

    // Tiny, dense, bright star
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 15);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(0.4, '#eef');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 15, 0, Math.PI * 2);
    ctx.fill();
    
    // Subtle glow
    ctx.shadowBlur = 15;
    ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
}


// Animation Loop
function animate() {
    animationId = requestAnimationFrame(animate);
    stages[currentStageIndex].draw();
}

// Controls
function updateUI() {
    const stage = stages[currentStageIndex];
    stageTitle.textContent = stage.title;
    stageDescription.textContent = stage.description;
    
    prevBtn.disabled = currentStageIndex === 0;
    nextBtn.disabled = currentStageIndex === stages.length - 1;
    
    // Update indicators
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((ind, idx) => {
        if (idx === currentStageIndex) ind.classList.add('active');
        else ind.classList.remove('active');
    });
}

function setStage(index) {
    if (index < 0 || index >= stages.length) return;
    currentStageIndex = index;
    stages[currentStageIndex].init();
    updateUI();
}

prevBtn.addEventListener('click', () => setStage(currentStageIndex - 1));
nextBtn.addEventListener('click', () => setStage(currentStageIndex + 1));

// Init
function init() {
    resize();
    
    // Create indicators
    stages.forEach((_, idx) => {
        const div = document.createElement('div');
        div.className = 'indicator';
        if (idx === 0) div.classList.add('active');
        progressIndicators.appendChild(div);
    });
    
    updateUI();
    animate();
}

init();

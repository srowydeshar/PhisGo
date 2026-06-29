// Data metrics registry setup for all 21 countries mapped across 3D coordinates
const gameCountries = [
    "Phishland", "Hackoria", "Infovia", "Scamora", "Hexland", "Ironia", "Netoria", 
    "Guardia", "Securea", "Cyberia", "Authoria", "Malwarea", "Defensia", "Encryptia", 
    "Trustland", "Exposia", "Clickonia", "Trojania", "Overwatch", "Reportia", "Safenet"
];

let playerProfile = { birthCountry: "", name: "", gender: "Male", career: "Student" };
const countryTargets = []; // Array to hold pre-calculated target center UVs

// Page Routing Logic Handles
document.getElementById('mission-1-btn').addEventListener('click', () => {
    document.getElementById('mission-portal').classList.add('hidden');
    document.getElementById('intro-overlay').classList.remove('hidden');
});

document.getElementById('choose-country-btn').addEventListener('click', () => {
    document.getElementById('intro-overlay').classList.add('hidden');
    document.getElementById('game-interface').classList.remove('hidden');
    // Force a resize calculation to center Three.js view
    setTimeout(() => {
        onWindowResize();
    }, 50);
});

// Setup Engine Elements
const container = document.getElementById('planet-3d-viewport');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
camera.position.set(0, 0, 2.2);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
container.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);
const dirLight = new THREE.DirectionalLight(0x00e5ff, 1.2);
dirLight.position.set(5, 3, 5);
scene.add(dirLight);

// Dynamic World Map Surface Generation
function generatePlanetSkin() {
    const canvas = document.createElement('canvas');
    canvas.width = 2048; // Higher res for clear text
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Fill dark digital ocean
    ctx.fillStyle = '#020514';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = 'bold 30px "Orbitron", sans-serif'; // Bigger font
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Setup visual line styles
    const colors = {
        cyan: '#00e5ff',
        purple: '#7a1ee6',
        red: '#ff1133'
    };

    // Pre-calculated target center UVs (Approximate coordinates matching image layout)
    // We store X/Y pixel coords, then map them to UV 0.0-1.0
    const rawTargets = [
        { name:"Phishland", x:1350, y:130, color:colors.purple },

        { name:"Hackoria", x:300, y:180, color:colors.purple },

        { name:"Infovia", x:620, y:320, color:colors.cyan },

        { name:"Scamora", x:900, y:320, color:colors.cyan },

        { name:"Hexland", x:150, y:350, color:colors.cyan },

        { name:"Ironia", x:250, y:520, color:colors.purple },

        { name:"Netoria", x:500, y:160, color:colors.purple },

        { name:"Guardia", x:900, y:650, color:colors.cyan },

        { name:"Securea", x:1200, y:320, color:colors.purple },

        { name:"Cyberia", x:1700, y:420, color:colors.purple },

        { name:"Authoria", x:700, y:600, color:colors.cyan },

        { name:"Malwarea", x:1100, y:560, color:colors.cyan },

        { name:"Defensia", x:1780, y:650, color:colors.purple },

        { name:"Encryptia", x:300, y:780, color:colors.purple },

        { name:"Trustland", x:990, y:820, color:colors.purple },

        { name:"Exposia", x:700, y:850, color:colors.purple },

        { name:"Clickonia", x:1850, y:900, color:colors.cyan },

        { name:"Trojania", x:1400, y:780, color:colors.cyan },

        { name:"Overwatch", x:460, y:550, color:colors.purple },

        { name:"Reportia", x:1600, y:930, color:colors.purple },

        { name:"Safenet", x:1150, y:940, color:colors.red }
];

    // Clear previous targets and recalculate UVs
    countryTargets.length = 0;

    // Draw lines and populate UV matrix targets
    rawTargets.forEach((target) => {
        // --- Store the target data for click logic ---
        // Convert pixel X/Y to normalized UV coordinates (0.0 to 1.0)
        countryTargets.push({
            name: target.name,
            u: target.x / canvas.width,
            v: 1.0 - (target.y / canvas.height) // Texture V is often inverted
        });

        // --- Draw the visual text label ---
        ctx.strokeStyle = target.color;
        ctx.lineWidth = 1;
        ctx.fillStyle = target.color; // Text matches line color for glow

        // Define a complex 'cyber region' shape around the target point
        // Using semi-random geometry that flows 'like digital rivers' seen in the image
        const points = 8;
        const radiusMin = 70;
        const radiusMax = 120;
        ctx.beginPath();
        for (let i = 0; i < points; i++) {
            const angle = (i / points) * Math.PI * 2;
            const r = radiusMin + Math.random() * (radiusMax - radiusMin);
            const px = target.x + Math.cos(angle) * r;
            const py = target.y + Math.sin(angle) * r;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();

        // Apply visual glow
        ctx.shadowBlur = 20;
        ctx.shadowColor = target.color;
        ctx.stroke();

        // Finalize text (drawn over the glow lines)
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ffffff';
        ctx.fillText(target.name.toUpperCase(), target.x, target.y);
    });

    return new THREE.CanvasTexture(canvas);
}

// Instantiate Geometry
const texture = generatePlanetSkin();
// Minor adjustment to geometry (using SphereBufferGeometry is deprecated, SphereGeometry is correct)
const geometry = new THREE.SphereGeometry(0.8, 64, 64);
// Use MeshStandardMaterial for basic lighting interaction
const material = new THREE.MeshStandardMaterial({ map: texture, roughness: 0.4 });
const planetBody = new THREE.Mesh(geometry, material);
scene.add(planetBody);

// Atmospheric visual glow layer 
const glowMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.83, 32, 32),
    new THREE.ShaderMaterial({
        vertexShader: `varying vec3 vNormal; void main() { vNormal = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
        fragmentShader: `varying vec3 vNormal; void main() { float intensity = pow(0.7 - dot(vNormal, vec3(0, 0, 1.0)), 2.5); gl_FragColor = vec4(0.0, 0.9, 1.0, 1.0) * intensity; }`,
        blending: THREE.AdditiveBlending, side: THREE.BackSide, transparent: true
    })
);

planetBody.add(glowMesh);


// Rotation / Drag Interaction Tracker Engine
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

container.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMousePosition = { x: e.clientX, y: e.clientY };
});

window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const deltaMove = { x: e.clientX - previousMousePosition.x, y: e.clientY - previousMousePosition.y };
    planetBody.rotation.y += deltaMove.x * 0.005;
    planetBody.rotation.x += deltaMove.y * 0.005;
    previousMousePosition = { x: e.clientX, y: e.clientY };
});

window.addEventListener('mouseup', () => { isDragging = false; });

// Target Vector Selection Click Detector
container.addEventListener('click', (e) => {
    const rect = renderer.domElement.getBoundingClientRect();
    // Normalize mouse input
    const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / container.clientWidth) * 2 - 1,
        -((e.clientY - rect.top) / container.clientHeight) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(planetBody);

    if (intersects.length > 0) {
        const uv = intersects[0].uv;
        
        // --- NEW CLICK LOGIC ---
        // Find the single countryTarget that is closest to the clicked UV coordinates
        let bestMatch = null;
        let minDistanceSq = Infinity;

        countryTargets.forEach((target) => {
            // Distance calculation: dx^2 + dy^2 (for simple Euclidean distance)
            // (Note: UV coords are 0.0-1.0, so this handles aspect well)
            const distSq = Math.pow(uv.x - target.u, 2) + Math.pow(uv.y - target.v, 2);
            if (distSq < minDistanceSq) {
                minDistanceSq = distSq;
                bestMatch = target;
            }
        });

        // Set a small threshold so you don't click "empty space" and select far away regions.
        if (minDistanceSq < 0.005) { // Adjusted threshold
            const selectedCountry = bestMatch.name.toUpperCase();
            
            // Update values inside form input modules
            playerProfile.birthCountry = selectedCountry;
            document.getElementById('origin-country-input').value = selectedCountry;
            document.getElementById('preview-origin-lbl').innerText = selectedCountry;
        }
    }
});

const careerSelect = document.getElementById("char-career");
careerSelect.addEventListener("change", function () {
    playerProfile.career = this.value;
    document.getElementById("preview-career-lbl").innerText = this.value;
});

// Manifest Button handler (updated to include career)
document.getElementById('manifest-btn').addEventListener('click', () => {
    // Collect final state
    playerProfile.name = document.getElementById('char-name').value;
    playerProfile.career = document.getElementById('char-career').value;
    
    if (playerProfile.name && playerProfile.birthCountry) {
        alert(`SUCCESS\nProfile Manifested:\nName: ${playerProfile.name}\nCountry: ${playerProfile.birthCountry}\nCareer: ${playerProfile.career}\nGender: ${playerProfile.gender}`);
        console.log("Character Manifested:", playerProfile);
    } else {
        alert("CRITICAL ERROR: Provide Handle and select Birth Country.");
    }
});

// Gender selector logic (already fine, keeping)
document.querySelectorAll('.gender-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelector('.gender-btn.active').classList.remove('active');
        this.classList.add('active');
        playerProfile.gender = this.dataset.gender;
    });
});


// Render Loop Execution 
function animate() {
    requestAnimationFrame(animate);
    if (!isDragging) planetBody.rotation.y += 0.001; // Auto-rotation when not dragging
    renderer.render(scene, camera);
}
animate();

// Resizer logic (keeps the canvas centered and sharp)
function onWindowResize() {
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 600;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
}
window.addEventListener('resize', onWindowResize);
onWindowResize();
// --- STATE MANAGEMENT ENGINE ---
let playerProfile = {
    birthCountry: "",
    name: "",
    gender: "",
    homeStyle: "",
    career: "",
    hobbies: ""
};

// List of all 21 custom countries
const countries = [
    "Phishland", "Hackoria", "Infovia", "Scamora", "Hexland", 
    "Ironia", "Netoria", "Guardia", "Securea", "Cyberia", 
    "Authoria", "Malwarea", "Defensia", "Encryptia", "Trustland", 
    "Exposia", "Clickonia", "Trojania", "Overwatch", "Reportia", "Safenet"
];

// Document Interfaces
const startBtn = document.getElementById('start-btn');
const gameContainer = document.getElementById('game-container');
const introScreen = document.getElementById('intro-screen');
const confirmCountryBtn = document.getElementById('confirm-country-btn');
const displayCountryPreview = document.getElementById('display-country-preview');

// Entry Gate Sequence
startBtn.addEventListener('click', () => {
    introScreen.classList.add('hide');
    gameContainer.classList.remove('blurred');
});

// --- THREE.JS 3D PLANET CONFIGURATION ---
const container = document.getElementById('planet-3d-viewport');
const scene = new THREE.Scene();

// Camera setup
const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.z = 2.5;

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// Lighting setup
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0x00e5ff, 1);
directionalLight.position.set(5, 3, 5);
scene.add(directionalLight);

// Create Planet Mesh (Holographic Cyber Wireframe Body)
const planetGeometry = new THREE.SphereGeometry(0.8, 32, 32);
const planetMaterial = new THREE.MeshPhongMaterial({
    color: 0x111125,
    emissive: 0x050815,
    wireframe: false,
    flatShading: true
});
const planetBody = new THREE.Mesh(planetGeometry, planetMaterial);
scene.add(planetBody);

// Overlay Grid Overlay Wireframe
const wireframeGeometry = new THREE.SphereGeometry(0.805, 24, 24);
const wireframeMaterial = new THREE.MeshBasicMaterial({
    color: 0x9a4bfa,
    wireframe: true,
    transparent: true,
    opacity: 0.15
});
const planetGrid = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
planetBody.add(planetGrid);

// Interactive Country Pins Group Container
const pinsGroup = new THREE.Group();
planetBody.add(pinsGroup);

// --- MAP COUNTRIES ONTO SPHERICAL GRID ---
// Converts Lat/Lon coordinates into 3D Vector coordinates
function convertLatLonToVector3(lat, lon, radius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);

    return new THREE.Vector3(
        -(radius * Math.sin(phi) * Math.sin(theta)),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.cos(theta)
    );
}

// Systematically scatter all 21 countries around the planet globe surface
countries.forEach((country, index) => {
    // Generate distinct coordinates based on index spacing
    const lat = ((index * 37) % 140) - 70; 
    const lon = ((index * 53) % 360) - 180;
    
    const position = convertLatLonToVector3(lat, lon, 0.81);

    // Create localized node pin mesh
    const pinGeo = new THREE.SphereGeometry(0.025, 8, 8);
    // Assign varied colors to represent different country matrices
    const colorHex = index % 3 === 0 ? 0xff007f : (index % 3 === 1 ? 0x00e5ff : 0x9a4bfa);
    const pinMat = new THREE.MeshBasicMaterial({ color: colorHex });
    const pinMesh = new THREE.Mesh(pinGeo, pinMat);
    
    pinMesh.position.copy(position);
    pinMesh.userData = { countryName: country }; // Store meta identity inside 3D object
    
    pinsGroup.add(pinMesh);
});

// --- DRAG TO ROTATE & CLICK SELECTION CONTROLS ---
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

container.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMousePosition = { x: e.clientX, y: e.clientY };
});

window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const deltaMove = {
        x: e.clientX - previousMousePosition.x,
        y: e.clientY - previousMousePosition.y
    };

    // Spin planet according to mouse drag changes
    planetBody.rotation.y += deltaMove.x * 0.005;
    planetBody.rotation.x += deltaMove.y * 0.005;

    previousMousePosition = { x: e.clientX, y: e.clientY };
});

window.addEventListener('mouseup', () => { isDragging = false; });

// Raycasting click logic (Detecting which 3D country pin is clicked)
container.addEventListener('click', (e) => {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(pinsGroup.children);

    if (intersects.length > 0) {
        const clickedPin = intersects[0].object;
        playerProfile.birthCountry = clickedPin.userData.countryName;
        
        // Visual Selection response
        pinsGroup.children.forEach(pin => pin.material.color.setHex(0x9a4bfa)); // reset others
        clickedPin.material.color.setHex(0xffffff); // Highlight selected pin to white
        
        displayCountryPreview.innerText = playerProfile.birthCountry;
        confirmCountryBtn.disabled = false;
    }
});

// Stage Route Handling Animations
confirmCountryBtn.addEventListener('click', () => {
    document.getElementById("display-country").innerText = playerProfile.birthCountry;
    document.getElementById("map-section").classList.remove("active");
    document.getElementById("customizer-section").classList.add("active");
});

// Profile Manifest Assembly Form Event
document.getElementById('manifest-btn').addEventListener('click', () => {
    playerProfile.name = document.getElementById('char-name').value.trim();
    playerProfile.gender = document.querySelector('input[name="gender"]:checked').value;
    playerProfile.homeStyle = document.getElementById('home-style').value;
    playerProfile.career = document.getElementById('career').value;
    playerProfile.hobbies = document.getElementById('hobbies').value.trim();

    if (!playerProfile.name) {
        alert("Please authorize your identity tag (Name).");
        return;
    }

    // Render configuration manifest summary page output
    document.getElementById('manifest-data-summary').innerHTML = `
        <p><strong>NAME IDENTITY:</strong> ${playerProfile.name}</p>
        <p><strong>BIRTH NODE:</strong> ${playerProfile.birthCountry}</p>
        <p><strong>AVATAR LOGIC:</strong> ${playerProfile.gender}</p>
        <p><strong>CONSTRUCT BASE:</strong> ${playerProfile.homeStyle}</p>
        <p><strong>MATRIX NODE CAREER:</strong> ${playerProfile.career}</p>
        <p><strong>REGISTRY HOBBIES:</strong> ${playerProfile.hobbies || "None Entered"}</p>
    `;

    document.getElementById("customizer-section").classList.remove("active");
    document.getElementById("success-section").classList.add("active");
});

// Frame Tick Render loop
function animate() {
    requestAnimationFrame(animate);
    
    // Slow planetary ambient drift when user is not manually rotating it
    if (!isDragging) {
        planetBody.rotation.y += 0.001;
    }
    
    renderer.render(scene, camera);
}
animate();

// Monitor browser layout resizes automatically
window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});
// Initialize scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Basic Lighting
const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(1, 1, 0.5).normalize();
scene.add(directionalLight);

camera.position.z = 5;

// Create Main Character
const geometry = new THREE.BoxGeometry(1, 1.5, 1);
const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
const mainCharacter = new THREE.Mesh(geometry, material);
scene.add(mainCharacter);

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

// Movement Implementation
document.addEventListener('keydown', function(event) {
    switch (event.key) {
        case 'w':
            mainCharacter.position.z -= 0.1;
            break;
        case 's':
            mainCharacter.position.z += 0.1;
            break;
        case 'a':
            mainCharacter.position.x -= 0.1;
            break;
        case 'd':
            mainCharacter.position.x += 0.1;
            break;
    }
});

// Create Anthropomorphic Syringes
function createSyringe() {
    const bodyGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1, 32);
    const bodyMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);

    const headGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const headMaterial = new THREE.MeshBasicMaterial({color: 0xffd700});
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 0.8;

    const syringe = new THREE.Group();
    syringe.add(body);
    syringe.add(head);

    return syringe;
}

const syringe1 = createSyringe();
syringe1.position.set(2, 0, -5);
scene.add(syringe1);

const syringe2 = createSyringe();
syringe2.position.set(-2, 0, -5);
scene.add(syringe2);

// Create Cap
function createCap() {
    const capGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 32);
    const capMaterial = new THREE.MeshBasicMaterial({color: 0x00ffff});
    const cap = new THREE.Mesh(capGeometry, capMaterial);
    return cap;
}

const cap1 = createCap();
cap1.position.set(1, 0, -3);
scene.add(cap1);

const cap2 = createCap();
cap2.position.set(-1, 0, -3);
scene.add(cap2);

// Interaction Logic
let capsCollected = 0;
document.addEventListener('keydown', function(event) {
    if (event.key === 'e') { // Press 'e' to interact
        const distance1 = mainCharacter.position.distanceTo(cap1.position);
        const distance2 = mainCharacter.position.distanceTo(cap2.position);

        if (distance1 < 1) {
            scene.remove(cap1);
            capsCollected++;
        }
        if (distance2 < 1) {
            scene.remove(cap2);
            capsCollected++;
        }

        const syringeDistance1 = mainCharacter.position.distanceTo(syringe1.position);
        const syringeDistance2 = mainCharacter.position.distanceTo(syringe2.position);

        if (syringeDistance1 < 1 && capsCollected > 0) {
            syringe1.children[1].material.color.set(0x00ff00); // Change head color to green (capped)
            capsCollected--;
        }
        if (syringeDistance2 < 1 && capsCollected > 0) {
            syringe2.children[1].material.color.set(0x00ff00); // Change head color to green (capped)
            capsCollected--;
        }
    }
});

// Shooting Mechanics
function createProjectile() {
    const geometry = new THREE.SphereGeometry(0.1, 8, 8);
    const material = new THREE.MeshBasicMaterial({color: 0x0000ff});
    const projectile = new THREE.Mesh(geometry, material);
    return projectile;
}

document.addEventListener('click', function() {
    const projectile = createProjectile();
    projectile.position.set(mainCharacter.position.x, mainCharacter.position.y, mainCharacter.position.z);
    scene.add(projectile);

    function moveProjectile() {
        projectile.position.z -= 0.2;
        requestAnimationFrame(moveProjectile);

        if (projectile.position.distanceTo(syringe1.position) < 1) {
            syringe1.children[1].material.color.set(0x0000ff); // Change head color to blue (disabled)
            scene.remove(projectile);
        }

        if (projectile.position.distanceTo(syringe2.position) < 1) {
            syringe2.children[1].material.color.set(0x0000ff); // Change head color to blue (disabled)
            scene.remove(projectile);
        }
    }

    moveProjectile();
});
